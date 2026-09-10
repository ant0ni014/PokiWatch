"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

interface EmbeddedPlayerProps {
  episodeId: number;
  titleDe: string;
  titleEn: string;
  youtubeId?: string;
  onAutoWatched: () => void;
  isAlreadyWatched: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({
  episodeId,
  titleDe,
  titleEn,
  youtubeId,
  onAutoWatched,
  isAlreadyWatched
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const checkIntervalRef = useRef<any>(null);
  const [autoWatchedTriggered, setAutoWatchedTriggered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchProgressPercent, setWatchProgressPercent] = useState(0);

  // Search query link for YouTube app or external viewing
  const searchUrl = `https://www.youtube.com/results?search_query=Pokemon+Folge+${episodeId}+Staffel+1+${encodeURIComponent(titleDe)}`;

  // Default embed ID if not provided: Official Pokemon Indigo League sample or search embed
  // E.g. Pokemon episode 1 official video on Pokemon channel: D0zYJ1RQ-fs
  const targetVideoId = youtubeId || "D0zYJ1RQ-fs";

  useEffect(() => {
    setAutoWatchedTriggered(false);
    setWatchProgressPercent(0);

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let isSubscribed = true;

    const initPlayer = () => {
      if (!containerRef.current || !window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(containerRef.current, {
          height: "100%",
          width: "100%",
          videoId: targetVideoId,
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onStateChange: (event: any) => {
              if (!isSubscribed) return;

              // YT.PlayerState.PLAYING = 1
              if (event.data === 1) {
                setIsPlaying(true);
                startProgressChecking();
              } else {
                setIsPlaying(false);
                stopProgressChecking();
              }

              // YT.PlayerState.ENDED = 0
              if (event.data === 0) {
                markAsWatched();
              }
            }
          }
        });
      } catch (err) {
        console.warn("YouTube player init error:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        if (isSubscribed) initPlayer();
      };
    }

    return () => {
      isSubscribed = false;
      stopProgressChecking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
      }
    };
  }, [targetVideoId, episodeId]);

  const startProgressChecking = () => {
    stopProgressChecking();
    checkIntervalRef.current = setInterval(() => {
      if (!playerRef.current || !playerRef.current.getCurrentTime || !playerRef.current.getDuration) return;
      try {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          const percent = Math.min(100, Math.round((currentTime / duration) * 100));
          setWatchProgressPercent(percent);

          // Auto-mark at 90% watched!
          if (percent >= 90 && !autoWatchedTriggered) {
            markAsWatched();
          }
        }
      } catch {}
    }, 1500);
  };

  const stopProgressChecking = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  };

  const markAsWatched = () => {
    if (!autoWatchedTriggered) {
      setAutoWatchedTriggered(true);
      onAutoWatched();
    }
  };

  return (
    <div className="space-y-3">
      {/* Video Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Auto-Watch Status Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {autoWatchedTriggered || isAlreadyWatched ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automatisch als gesehen erfasst!</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                Auto-Tracking aktiv ({watchProgressPercent}% gesehen – markiert automatisch bei 90% oder Videoende)
              </span>
            </span>
          )}
        </div>

        {/* External YouTube Link */}
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition font-semibold"
          title="In YouTube-App oder Browser öffnen"
        >
          <span>Auf YouTube suchen</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
