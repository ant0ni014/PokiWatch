"use client";

import React from "react";
import { Episode, TrainerProfile, TrainerId, EpisodeWatchRecord, WatchStateMap } from "@/types";
import { PokeballIcon } from "./PokeballIcon";
import { ExternalLink, BookOpen, CheckCheck, Lock } from "lucide-react";
import { buildPlaylistWatchUrl } from "@/lib/playlist";
import { isNextEpisode, isFutureEpisode } from "@/lib/data/progress";

interface EpisodeListRowProps {
  episode: Episode;
  watchRecord?: EpisodeWatchRecord;
  watchState?: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  playlistId?: string | null;
  onOpenPlaylistModal?: () => void;
  onToggleWatch: (episodeId: number, trainerId: TrainerId) => void;
  onMarkUpToHere: (episodeId: number, trainerId: TrainerId) => void;
  onOpenDetail: (episode: Episode) => void;
}

export const EpisodeListRow: React.FC<EpisodeListRowProps> = ({
  episode,
  watchRecord,
  watchState,
  profiles,
  activeTrainerId,
  playlistId,
  onOpenPlaylistModal,
  onToggleWatch,
  onMarkUpToHere,
  onOpenDetail
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

  const activeWatched = !!(watchRecord && watchRecord[activeTrainerId]);
  const partnerWatched = !!(watchRecord && watchRecord[partnerTrainerId]);
  const bothWatched = activeWatched && partnerWatched;

  const isNext = watchState ? isNextEpisode(watchState, activeTrainerId, episode.id) : false;
  const isFuture = watchState ? isFutureEpisode(watchState, activeTrainerId, episode.id) : false;

  const youtubeWatchUrl = buildPlaylistWatchUrl(
    episode.id,
    playlistId,
    episode.youtubeUrl,
    episode.titleDe,
    episode.season
  );

  let rowBg = "bg-white hover:bg-slate-50 border-slate-200";
  if (bothWatched) {
    rowBg = "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-300";
  } else if (activeWatched) {
    rowBg = "bg-amber-50/40 hover:bg-amber-50 border-amber-300";
  } else if (isNext) {
    rowBg = "bg-amber-50/70 hover:bg-amber-50 border-amber-400 ring-2 ring-amber-300/40 shadow-sm";
  }

  return (
    <div className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border-2 ${rowBg} shadow-sm transition`}>
      
      {/* Left: Ep number & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="w-10 sm:w-12 text-center py-1 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-black flex-shrink-0">
          #{episode.id < 10 ? `0${episode.id}` : episode.id}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
              {episode.titleDe}
            </h4>
            {bothWatched ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex-shrink-0">
                Beide gesehen
              </span>
            ) : isNext ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-slate-950 border border-amber-500 shadow-sm flex-shrink-0 animate-pulse">
                👉 Nächste Folge
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-slate-500 truncate italic">
            {episode.seasonName.split(":")[0]} • {episode.titleEn}
          </p>
        </div>
      </div>

      {/* Center/Right: Action Buttons (YouTube, Partner Status, 1-Tap Watch) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        
        {/* Direct YouTube App Button */}
        <a
          href={youtubeWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!playlistId && onOpenPlaylistModal) {
              e.preventDefault();
              onOpenPlaylistModal();
            }
          }}
          className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
          title={playlistId ? "In YouTube öffnen (Playlist)" : "Playlist verknüpfen"}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>

        {/* Recap modal */}
        <button
          onClick={() => onOpenDetail(episode)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          title="Zusammenfassung nachlesen"
        >
          <BookOpen className="w-3.5 h-3.5" />
        </button>

        {/* Partner status badge (HIGH CONTRAST!) */}
        <button
          onClick={() => onToggleWatch(episode.id, partnerTrainerId)}
          className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 flex items-center gap-1.5 transition ${
            partnerWatched
              ? "bg-orange-500 text-white border-orange-600 shadow-sm"
              : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
          }`}
          title={`${partnerProfile.name}: ${partnerWatched ? "Gesehen" : "Noch ungesehen"}`}
        >
          <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 border border-slate-300">
            {partnerProfile.image ? (
              <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{partnerProfile.avatar}</span>
            )}
          </div>
          <span>{partnerProfile.name}: {partnerWatched ? "✓" : "○"}</span>
        </button>

        {/* Mark up to here button */}
        {!activeWatched && episode.id > 1 && (
          <button
            onClick={() => onMarkUpToHere(episode.id, activeTrainerId)}
            className="p-1.5 text-slate-400 hover:text-amber-700 transition hidden sm:block"
            title="Alle bis hierhin als gesehen markieren"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        )}

        {/* Catch Button: 1-Tap Cumulative Abhaken */}
        <button
          onClick={() => onToggleWatch(episode.id, activeTrainerId)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition active:scale-95 shadow-sm ${
            activeWatched
              ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
              : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-500"
          }`}
          title={
            activeWatched
              ? "Gesehen (Klicken zum Zurücksetzen)"
              : `Bis Folge #${episode.id} alles als gesehen abhaken`
          }
        >
          <PokeballIcon isCaught={activeWatched} size="sm" />
          <span className="hidden sm:inline">
            {activeWatched ? "Gesehen ✓" : "Abhaken"}
          </span>
        </button>

      </div>

    </div>
  );
};
