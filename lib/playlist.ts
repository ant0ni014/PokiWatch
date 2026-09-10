import { getPlaylistVideoId } from "./data/playlistVideoMap";

// Helper functions to manage the user's YouTube playlist URL / ID

export const DEFAULT_PLAYLIST_ID = "PL-dKu1CLnqyr94wAdWayszETQwI0sh8lv";
export const DEFAULT_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PL-dKu1CLnqyr94wAdWayszETQwI0sh8lv";

const STORAGE_PLAYLIST_KEY = "pokiwatch_playlist_url";
const STORAGE_PLAYLIST_ID_KEY = "pokiwatch_playlist_id";

/**
 * Extract YouTube playlist ID from various URL formats or raw ID:
 * - https://www.youtube.com/playlist?list=PLxyz...
 * - https://www.youtube.com/watch?v=abc&list=PLxyz...
 * - PLxyz...
 */
export function extractPlaylistId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // URL matching
  if (trimmed.includes("list=")) {
    const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
  }

  // Raw playlist ID format (e.g. PL... or RD...)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Get saved Playlist ID from localStorage (or default to user's 423-video playlist)
 */
export function getSavedPlaylistId(): string {
  if (typeof window === "undefined") return DEFAULT_PLAYLIST_ID;
  return localStorage.getItem(STORAGE_PLAYLIST_ID_KEY) || DEFAULT_PLAYLIST_ID;
}

/**
 * Get saved Playlist raw URL from localStorage
 */
export function getSavedPlaylistUrl(): string {
  if (typeof window === "undefined") return DEFAULT_PLAYLIST_URL;
  return localStorage.getItem(STORAGE_PLAYLIST_KEY) || DEFAULT_PLAYLIST_URL;
}

/**
 * Save Playlist URL & extracted ID into localStorage
 */
export function savePlaylistSetting(urlOrId: string): string | null {
  if (typeof window === "undefined") return null;
  const extracted = extractPlaylistId(urlOrId);
  if (extracted) {
    localStorage.setItem(STORAGE_PLAYLIST_KEY, urlOrId.trim());
    localStorage.setItem(STORAGE_PLAYLIST_ID_KEY, extracted);
    return extracted;
  }
  return null;
}

/**
 * Build direct YouTube video playback URL inside the playlist at the exact episode index:
 * https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID&index=EPISODE_INDEX
 * This guarantees direct video playback inside the playlist with automatic autoplay of the next video,
 * and eliminates the "YouTube is not currently available on this device" error by providing the video ID.
 */
export function buildPlaylistWatchUrl(
  episodeId: number,
  customPlaylistId?: string | null,
  fallbackDirectUrl?: string,
  titleDe?: string,
  season?: number
): string {
  const playlistId = customPlaylistId || getSavedPlaylistId() || DEFAULT_PLAYLIST_ID;
  const videoId = getPlaylistVideoId(episodeId);

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}&list=${encodeURIComponent(playlistId)}&index=${episodeId}`;
  }

  return `https://www.youtube.com/watch?list=${encodeURIComponent(playlistId)}&index=${episodeId}`;
}
