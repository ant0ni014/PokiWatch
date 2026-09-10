"use client";

import React from "react";
import { Episode, TrainerProfile, TrainerId, EpisodeWatchRecord } from "@/types";
import { PokeballIcon } from "./PokeballIcon";
import { buildPlaylistWatchUrl } from "@/lib/playlist";
import { Play, Info, Award, Check, ExternalLink, Lock, BookOpen, CheckCheck } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  watchRecord?: EpisodeWatchRecord;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  onToggleWatch: (episodeId: number, trainerId: TrainerId) => void;
  onMarkUpToHere?: (episodeId: number, trainerId: TrainerId) => void;
  onOpenDetail: (episode: Episode) => void;
  playlistId?: string | null;
  onOpenPlaylistModal?: () => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  watchRecord,
  profiles,
  activeTrainerId,
  onToggleWatch,
  onMarkUpToHere,
  onOpenDetail,
  playlistId,
  onOpenPlaylistModal
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

  const activeWatched = !!(watchRecord && watchRecord[activeTrainerId]);
  const partnerWatched = !!(watchRecord && watchRecord[partnerTrainerId]);
  const bothWatched = activeWatched && partnerWatched;

  // Direct YouTube playlist link
  const youtubeWatchUrl = buildPlaylistWatchUrl(
    episode.id,
    playlistId,
    episode.youtubeUrl,
    episode.titleDe,
    episode.season
  );

  // Styling based on watch status
  let cardBorderClass = "border-slate-200 bg-white hover:border-slate-300";
  if (bothWatched) {
    cardBorderClass = "border-emerald-300 bg-emerald-50/40 shadow-sm";
  } else if (activeWatched) {
    cardBorderClass = "border-amber-300 bg-amber-50/30 shadow-sm";
  } else if (partnerWatched) {
    cardBorderClass = "border-blue-200 bg-blue-50/30";
  }

  return (
    <div
      className={`group relative rounded-2xl border-2 ${cardBorderClass} p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md`}
    >
      
      {/* Card Header: Ep Number, Season & Both Trainers Status Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-black tracking-wider">
              #{episode.id < 10 ? `0${episode.id}` : episode.id}
            </span>
            <span className="text-[11px] font-bold text-slate-500 truncate max-w-[130px] sm:max-w-[180px]">
              {episode.seasonName.split(":")[0]}
            </span>
          </div>

          {/* Both Trainers Status Badges */}
          <div className="flex items-center gap-1.5">
            {/* Active Trainer status */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatch(episode.id, activeTrainerId);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border-2 transition shadow-sm ${
                activeWatched
                  ? "bg-amber-400 text-slate-950 border-amber-500"
                  : "bg-white text-slate-500 border-slate-300 hover:border-slate-400"
              }`}
              title={`Status für ${activeProfile.name} umschalten`}
            >
              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 border border-slate-800">
                {activeProfile.image ? (
                  <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{activeProfile.avatar}</span>
                )}
              </div>
              <span>{activeWatched ? "✓" : "○"}</span>
            </button>

            {/* Partner status (HIGH CONTRAST!) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatch(episode.id, partnerTrainerId);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border-2 transition shadow-sm ${
                partnerWatched
                  ? "bg-orange-500 text-white border-orange-600"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              }`}
              title={`Status für ${partnerProfile.name} umschalten (${partnerWatched ? "Gesehen" : "Offen"})`}
            >
              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 border border-slate-300">
                {partnerProfile.image ? (
                  <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{partnerProfile.avatar}</span>
                )}
              </div>
              <span>{partnerWatched ? "✓" : "○"}</span>
            </button>
          </div>

        </div>

        {/* Title */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
            {episode.titleDe}
          </h3>
          <p className="text-xs text-slate-500 italic">
            {episode.titleEn}
          </p>
        </div>

        {/* Summary Snippet with Spoiler Shield */}
        {activeWatched ? (
          <>
            <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
              {episode.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {episode.badgeEarned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Award className="w-3 h-3 text-amber-600" />
                  {episode.badgeEarned}
                </span>
              )}
              {episode.pokemonFeatured.slice(0, 3).map((poke) => (
                <span
                  key={poke}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {poke}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="p-2.5 mb-3 rounded-xl bg-slate-100/80 border border-slate-200 text-center space-y-0.5">
            <div className="text-xs font-black text-slate-700 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Spoiler-Schutz aktiv</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Folge abhaken, um Zusammenfassung & Pokémon zu sehen.
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Primary Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        
        {/* Row 1: Direct YouTube App Button & Recap Modal Trigger */}
        <div className="flex items-center justify-between gap-2">
          {/* Direct YouTube App Opener */}
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
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm transition active:scale-95"
            title={playlistId ? "Öffnet die Folge direkt in der YouTube App an deiner Playlist-Position" : "Playlist verknüpfen"}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>In YouTube öffnen</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* Recap / Summary Modal */}
          <button
            onClick={() => onOpenDetail(episode)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Handlung & Recap nachlesen"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: 1-Tap Watch Toggle with Pokéball & Batch Mark */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Quick Mark all up to here */}
          {!activeWatched && episode.id > 1 && onMarkUpToHere && (
            <button
              onClick={() => onMarkUpToHere(episode.id, activeTrainerId)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-amber-700 transition"
              title="Alle vorherigen Folgen bis hierhin als gesehen markieren"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Bis hierhin abhaken</span>
            </button>
          )}

          {/* Big Interactive Pokéball Catch Button (Zack!) */}
          <button
            onClick={() => onToggleWatch(episode.id, activeTrainerId)}
            className={`ml-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition border-2 shadow-sm active:scale-95 ${
              activeWatched
                ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
            }`}
          >
            <PokeballIcon isCaught={activeWatched} size="sm" />
            <span>{activeWatched ? "Gesehen!" : "Gesehen?"}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
