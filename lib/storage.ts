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
 * Return initial data from localStorage if present (for instant UI & fallback).
 */
export function getInitialData(): PokiWatchData {
  let watchState: WatchStateMap = {};
  let profiles = DEFAULT_PROFILES;
  let activeTrainerId: TrainerId = "trainer_1";

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("pokiwatch_data") || localStorage.getItem("pokiwatch_data_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.watchState && Object.keys(parsed.watchState).length > 0) {
          watchState = parsed.watchState;
        }
        if (parsed.profiles) {
          profiles = parsed.profiles;
        }
        if (parsed.activeTrainerId) {
          activeTrainerId = parsed.activeTrainerId;
        }
      }
    } catch (e) {
      console.warn("Fehler beim Lesen von localStorage:", e);
    }
  }

  return {
    profiles,
    activeTrainerId,
    watchState,
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
 * Fetch remote state from Supabase from the shared pokiwatch_state table.
 */
export async function fetchRemoteState(): Promise<{
  watchState: WatchStateMap;
  profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile };
} | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('pokiwatch_state')
      .select('watch_state, profiles')
      .eq('id', 'global_state')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch warning:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      watchState: data.watch_state || {},
      profiles: data.profiles || undefined
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

/**
 * Push local state to Supabase in the shared pokiwatch_state table.
 */
export async function pushRemoteState(
  watchState: WatchStateMap,
  profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }
) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload: any = {
      id: 'global_state',
      watch_state: watchState,
      updated_at: new Date().toISOString()
    };
    if (profiles) payload.profiles = profiles;

    const { error } = await supabase
      .from('pokiwatch_state')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase push error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase push error:', err);
    return false;
  }
}


