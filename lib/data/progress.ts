import { TrainerId, WatchStateMap } from "@/types";

/**
 * Calculates the highest sequentially watched episode number for a trainer.
 * E.g., if episodes 1, 2, 3 are watched, progress is 3.
 */
export function getTrainerProgress(
  watchState: WatchStateMap,
  trainerId: TrainerId,
  totalEpisodes = 423
): number {
  let progress = 0;
  for (let i = 1; i <= totalEpisodes; i++) {
    if (watchState[i]?.[trainerId]) {
      progress = i;
    } else {
      break;
    }
  }
  return progress;
}

/**
 * Returns the next episode ID that needs to be watched in sequence.
 */
export function getNextEpisodeId(
  watchState: WatchStateMap,
  trainerId: TrainerId,
  totalEpisodes = 423
): number {
  const current = getTrainerProgress(watchState, trainerId, totalEpisodes);
  return Math.min(current + 1, totalEpisodes);
}

/**
 * Helper to check if an episode is the exact NEXT episode in sequence.
 */
export function isNextEpisode(
  watchState: WatchStateMap,
  trainerId: TrainerId,
  episodeId: number
): boolean {
  const current = getTrainerProgress(watchState, trainerId);
  return episodeId === current + 1;
}

/**
 * Helper to check if an episode is in the future (more than 1 ahead of current progress).
 */
export function isFutureEpisode(
  watchState: WatchStateMap,
  trainerId: TrainerId,
  episodeId: number
): boolean {
  const current = getTrainerProgress(watchState, trainerId);
  return episodeId > current + 1;
}
