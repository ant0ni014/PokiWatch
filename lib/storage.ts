import { PokiWatchData, TrainerId, TrainerProfile, WatchStateMap } from '@/types';
import { getSupabaseClient } from '@/lib/supabaseClient';

export const DEFAULT_PROFILES: { trainer_1: TrainerProfile; trainer_2: TrainerProfile } = {
  trainer_1: {
    id: 'trainer_1',
    name: 'Ash',
    avatar: '🔴',
    image: '/trainers/ash.jpg',
    accentColor: '#ef4444'
  },
  trainer_2: {
    id: 'trainer_2',
    name: 'Misty',
    avatar: '💧',
    image: '/trainers/misty.jpg',
    accentColor: '#f97316'
  }
};

/**
 * Return initial empty data – actual state is loaded from Supabase after login.
 */
export function getInitialData(): PokiWatchData {
  return {
    profiles: DEFAULT_PROFILES,
    activeTrainerId: 'trainer_1',
    watchState: {},
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Save data locally to fallback storage (used for initial load before Supabase sync).
 */
export function saveLocalData(data: PokiWatchData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('pokiwatch_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data locally:', e);
    }
  }
}

/**
 * Fetch remote state from Supabase for the currently authenticated user.
 */
export async function fetchRemoteState(): Promise<{ watchState: WatchStateMap; profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile } } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('pokiwatch_user_state')
    .select('watch_state, profiles')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.warn('Supabase fetch warning:', error.message);
    return null;
  }

  return {
    watchState: data?.watch_state || {},
    profiles: data?.profiles || undefined
  };
}

/**
 * Push local state to Supabase for the current user.
 */
export async function pushRemoteState(watchState: WatchStateMap, profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const payload: any = {
    user_id: user.id,
    watch_state: watchState,
    updated_at: new Date().toISOString()
  };
  if (profiles) payload.profiles = profiles;

  const { error } = await supabase
    .from('pokiwatch_user_state')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.warn('Supabase push error:', error.message);
    return false;
  }
  return true;
}
