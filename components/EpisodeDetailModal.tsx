"use client";

import React, { useEffect, useState } from "react";
import { Episode, TrainerProfile, TrainerId, EpisodeWatchRecord, WatchStateMap } from "@/types";
import { EmbeddedPlayer } from "./EmbeddedPlayer";
import { PokeballIcon } from "./PokeballIcon";
import { getPokemonArtworkUrl } from "@/lib/data/pokemonMap";
import { buildPlaylistWatchUrl } from "@/lib/playlist";
import { isNextEpisode } from "@/lib/data/progress";
import { X, Award, Check, Sparkles, BookOpen, Film, ExternalLink, Lock } from "lucide-react";

interface EpisodeDetailModalProps {
  episode: Episode | null;
  onClose: () => void;
  watchRecord?: EpisodeWatchRecord;
  watchState?: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  onToggleWatch: (episodeId: number, trainerId: TrainerId) => void;
  playlistId?: string | null;
  onOpenPlaylistModal?: () => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  watchRecord,
  watchState,
  profiles,
  activeTrainerId,
  onToggleWatch,
  playlistId,
  onOpenPlaylistModal
}) => {
  const [showSpoilerAnyway, setShowSpoilerAnyway] = useState(false);

  useEffect(() => {
    setShowSpoilerAnyway(false);
  }, [episode?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!episode) return null;

  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

  const activeWatched = !!(watchRecord && watchRecord[activeTrainerId]);
  const partnerWatched = !!(watchRecord && watchRecord[partnerTrainerId]);

  const isNext = watchState && episode ? isNextEpisode(watchState, activeTrainerId, episode.id) : false;

  const youtubeWatchUrl = episode.youtubeUrl || buildPlaylistWatchUrl(episode.id, playlistId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container: On Mobile bottom sheet / on Desktop centered */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white border-t-4 sm:border-2 border-slate-200 shadow-2xl flex flex-col text-slate-800 scrollbar-thin scrollbar-thumb-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Pokédex Modal Header */}
        <div className="sticky top-0 z-20 bg-red-600 border-b-2 border-red-700 text-white px-4 sm:px-7 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-white text-red-700 text-xs font-black shadow-sm">
              Folge #{episode.id}
            </span>
            <span className="text-xs font-bold text-red-100 truncate max-w-[200px] sm:max-w-none">
              {episode.seasonName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-7 space-y-5">
          
          {/* Titles & Watch Bar */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {episode.titleDe}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 italic mb-3">
              Englisch: {episode.titleEn}
            </p>

            {/* Quick Watch Toggle Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 mr-1">
                Gesehen:
              </span>

              {/* Active Trainer Button */}
              <button
                onClick={() => onToggleWatch(episode.id, activeTrainerId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition shadow-sm ${
                  activeWatched
                    ? "bg-amber-400 text-slate-950 border-amber-500"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                <span>{activeProfile.avatar}</span>
                <span>{activeProfile.name}</span>
                <PokeballIcon isCaught={activeWatched} size="sm" />
              </button>

              {/* Partner Trainer Button */}
              <button
                onClick={() => onToggleWatch(episode.id, partnerTrainerId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition shadow-sm ${
                  partnerWatched
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                }`}
              >
                <span>{partnerProfile.avatar}</span>
                <span>{partnerProfile.name}</span>
                <PokeballIcon isCaught={partnerWatched} size="sm" />
              </button>
            </div>
          </div>

          {/* Primary Action: Direct YouTube App Button */}
          <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="text-sm font-black text-red-950 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-red-600" />
                <span>Auf YouTube anschauen</span>
              </div>
              <p className="text-xs text-red-800">
                {playlistId
                  ? `Startet direkt in deiner Playlist an Folge #${episode.id} mit Autoplay.`
                  : "Startet direkt in deiner Playlist (Klicke zum 1-maligen Verknüpfen)."}
              </p>
            </div>
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>In YouTube App starten</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* SPOILER-SCHUTZ: If not watched yet, hide summary & Pokémon until checked off */}
          {!activeWatched && !showSpoilerAnyway ? (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border-2 border-slate-800 text-center space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center justify-center gap-2">
                  <span>🔒 Spoiler-Schutz aktiv</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Du hast diese Folge noch nicht als gesehen abgehakt! Schau dir zuerst die Folge an, um die Zusammenfassung und die aufgetretenen Pokémon freizuschalten.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onToggleWatch(episode.id, activeTrainerId)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Als gesehen abhaken & Info freischalten</span>
                </button>

                <button
                  onClick={() => setShowSpoilerAnyway(true)}
                  className="text-xs font-semibold text-slate-400 hover:text-white underline transition py-1"
                >
                  Trotzdem anzeigen (Spoiler riskieren)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Neu aufgetretene Pokémon mit Bildern und Namen */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Aufgetretene Pokémon in dieser Folge</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {episode.pokemonFeatured.map((poke) => {
                    const artworkUrl = getPokemonArtworkUrl(poke);
                    return (
                      <div
                        key={poke}
                        className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center text-center shadow-sm hover:border-amber-300 transition"
                      >
                        {artworkUrl ? (
                          <img
                            src={artworkUrl}
                            alt={poke}
                            className="w-16 h-16 object-contain drop-shadow-md mb-1.5 hover:scale-110 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-2xl mb-1.5">
                            ⚡
                          </div>
                        )}
                        <span className="text-xs font-black text-slate-800 leading-tight">
                          {poke}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {episode.badgeEarned && (
                  <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center gap-2.5 shadow-sm">
                    <Award className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                        Orden in dieser Folge errungen!
                      </div>
                      <div className="text-sm font-black text-amber-950">
                        {episode.badgeEarned}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Summary (Recap) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
                  <BookOpen className="w-4 h-4" />
                  <span>Handlung & Zusammenfassung</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {episode.summary}
                </p>
              </div>

              {/* Key Events */}
              {episode.keyEvents && episode.keyEvents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Schlüsselmomente</span>
                  </div>
                  <ul className="space-y-1">
                    {episode.keyEvents.map((evt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <span>{evt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
};
