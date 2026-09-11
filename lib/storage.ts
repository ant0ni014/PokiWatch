import { PokiWatchData, TrainerId, TrainerProfile, WatchStateMap, CardsState } from '@/types';
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

export const DEFAULT_CARDS_STATE: CardsState = {
  openedPacksCount: {
    trainer_1: 0,
    trainer_2: 0
  },
  cards: {
    trainer_1: [],
    trainer_2: []
  },
  tradeOffers: []
};

/**
 * Return initial data from localStorage if present (for instant UI & fallback).
 */
export function getInitialData(): PokiWatchData & { cardsState?: CardsState } {
  let watchState: WatchStateMap = {};
  let profiles = DEFAULT_PROFILES;
  let activeTrainerId: TrainerId = "trainer_1";
  let cardsState = DEFAULT_CARDS_STATE;

  if (typeof window !== "undefined") {
    try {
      // 1. Read legacy pokiwatch_data_v1 or pokiwatch_data
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
        if (parsed.cardsState) {
          cardsState = parsed.cardsState;
        }
      }

      // 2. Read cards if stored separately
      const savedCards = localStorage.getItem("pokiwatch_cards");
      if (savedCards) {
        cardsState = JSON.parse(savedCards);
      }
    } catch (e) {
      console.warn("Fehler beim Lesen von localStorage:", e);
    }
  }

  return {
    profiles,
    activeTrainerId,
    watchState,
    cardsState,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Save data locally to fallback storage (used for initial load before Supabase sync).
 */
export function saveLocalData(data: PokiWatchData & { cardsState?: CardsState }): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('pokiwatch_data', JSON.stringify(data));
      if (data.cardsState) {
        localStorage.setItem('pokiwatch_cards', JSON.stringify(data.cardsState));
      }
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
  cardsState?: CardsState;
} | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Attempt to select watch_state, profiles, and cards_state
    const { data, error } = await supabase
      .from('pokiwatch_state')
      .select('watch_state, profiles, cards_state')
      .eq('id', 'global_state')
      .maybeSingle();

    if (error) {
      // If error is due to missing 'cards_state' column, fall back to selecting without it
      console.warn('Supabase fetch with cards_state warning:', error.message);
      const fallback = await supabase
        .from('pokiwatch_state')
        .select('watch_state, profiles')
        .eq('id', 'global_state')
        .maybeSingle();

      if (fallback.data) {
        return {
          watchState: fallback.data.watch_state || {},
          profiles: fallback.data.profiles || undefined,
          cardsState: DEFAULT_CARDS_STATE
        };
      }
      return null;
    }

    if (!data) return null;

    return {
      watchState: data.watch_state || {},
      profiles: data.profiles || undefined,
      cardsState: data.cards_state || DEFAULT_CARDS_STATE
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
  profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile },
  cardsState?: CardsState
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
    if (cardsState) payload.cards_state = cardsState;

    let { error } = await supabase
      .from('pokiwatch_state')
      .upsert(payload, { onConflict: 'id' });

    if (error && payload.cards_state) {
      // If table doesn't have cards_state column yet, retry pushing watch_state & profiles safely!
      console.warn('Supabase push with cards_state failed, retrying without cards_state column:', error.message);
      delete payload.cards_state;
      const retry = await supabase
        .from('pokiwatch_state')
        .upsert(payload, { onConflict: 'id' });
      error = retry.error;
    }

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


