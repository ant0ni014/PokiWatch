import { PokiWatchData, TrainerId, TrainerProfile, WatchStateMap } from "@/types";
import { getSupabaseClient } from "./supabaseClient";

const STORAGE_KEY = "pokiwatch_data_v1";
const ACTIVE_TRAINER_COOKIE = "pokiwatch_active_trainer";

export const DEFAULT_PROFILES: { trainer_1: TrainerProfile; trainer_2: TrainerProfile } = {
  trainer_1: {
    id: "trainer_1",
    name: "Ash",
    avatar: "🔴", // Authentic Pokéball
    image: "/trainers/ash.jpg",
    accentColor: "#ef4444" // Crimson
  },
  trainer_2: {
    id: "trainer_2",
    name: "Misty",
    avatar: "💧", // Water droplet (Gym Leader of Cerulean City)
    image: "/trainers/misty.jpg",
    accentColor: "#f97316" // Orange
  }
};

export function getInitialData(): PokiWatchData {
  if (typeof window === "undefined") {
    return {
      profiles: DEFAULT_PROFILES,
      activeTrainerId: "trainer_1",
      watchState: {},
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const savedActive = localStorage.getItem(ACTIVE_TRAINER_COOKIE) as TrainerId | null;
    if (raw) {
      const parsed = JSON.parse(raw) as PokiWatchData;
      if (savedActive && (savedActive === "trainer_1" || savedActive === "trainer_2")) {
        parsed.activeTrainerId = savedActive;
      }
      // Upgrade Gary to Misty if older state existed
      if (parsed.profiles?.trainer_2?.name === "Gary") {
        parsed.profiles.trainer_2.name = "Misty";
        parsed.profiles.trainer_2.avatar = "🎀";
        parsed.profiles.trainer_2.image = "/trainers/misty.jpg";
      }
      if (!parsed.profiles?.trainer_1?.image) {
        parsed.profiles.trainer_1.image = "/trainers/ash.jpg";
      }
      if (!parsed.profiles?.trainer_2?.image) {
        parsed.profiles.trainer_2.image = "/trainers/misty.jpg";
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed reading local storage:", e);
  }

  return {
    profiles: DEFAULT_PROFILES,
    activeTrainerId: "trainer_1",
    watchState: {},
    lastUpdated: new Date().toISOString()
  };
}

export function saveLocalData(data: PokiWatchData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(ACTIVE_TRAINER_COOKIE, data.activeTrainerId);
  } catch (e) {
    console.error("Failed saving local storage:", e);
  }
}

/**
 * Sync state with Supabase if client is available
 */
export async function fetchRemoteState(): Promise<{ watchState: WatchStateMap; profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile } } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("pokiwatch_state")
      .select("watch_state, profiles, updated_at")
      .eq("id", "global_state")
      .single();

    if (error) {
      console.warn("Supabase fetch warning:", error.message);
      return null;
    }

    return {
      watchState: data.watch_state || {},
      profiles: data.profiles || undefined
    };
  } catch (err) {
    console.warn("Error fetching remote state:", err);
    return null;
  }
}

export async function pushRemoteState(watchState: WatchStateMap, profiles?: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload: Record<string, unknown> = {
      id: "global_state",
      watch_state: watchState,
      updated_at: new Date().toISOString()
    };
    if (profiles) {
      payload.profiles = profiles;
    }

    const { error } = await supabase
      .from("pokiwatch_state")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.warn("Supabase push error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Error pushing remote state:", err);
    return false;
  }
}
