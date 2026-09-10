"use client";

import React, { useState } from "react";
import { Episode, TrainerProfile, TrainerId, WatchStateMap } from "@/types";
import { PokeballIcon } from "./PokeballIcon";
import { POKEMON_SEASONS } from "@/lib/data/seasons";
import { buildPlaylistWatchUrl } from "@/lib/playlist";
import { isNextEpisode, isFutureEpisode } from "@/lib/data/progress";
import { Info, Play, Check, Eye, Lock } from "lucide-react";

interface EasyModeMobileProps {
  episodes: Episode[];
  watchState: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  onSetCurrentEpisode: (episodeId: number, trainerId: TrainerId) => void;
  onToggleWatch: (episodeId: number, trainerId: TrainerId) => void;
  onOpenDetail: (episode: Episode) => void;
  playlistId?: string | null;
  onOpenPlaylistModal?: () => void;
}

export const EasyModeMobile: React.FC<EasyModeMobileProps> = ({
  episodes,
  watchState,
  profiles,
  activeTrainerId,
  onSetCurrentEpisode,
  onToggleWatch,
  onOpenDetail,
  playlistId,
  onOpenPlaylistModal
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [partnerFilter, setPartnerFilter] = useState<"all" | "partner_watched" | "partner_unwatched">("all");

  // Filter episodes for current season and partner filter
  const seasonEpisodes = episodes.filter((ep) => {
    if (ep.season !== selectedSeason) return false;
    const rec = watchState[ep.id];
    const pWatched = !!(rec && rec[partnerTrainerId]);

    if (partnerFilter === "partner_watched" && !pWatched) return false;
    if (partnerFilter === "partner_unwatched" && pWatched) return false;

    return true;
  });

  return (
    <div className="space-y-3 sm:hidden">
      
      {/* Mobile Easy Mode Banner & Instructions */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0 shadow-sm">
            {activeProfile.image ? (
              <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-amber-200 flex items-center justify-center font-bold">
                {activeProfile.avatar}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <span>Easy Mode für {activeProfile.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-[9px] font-black text-slate-950">
                1-Tap
              </span>
            </div>
            <p className="text-[10px] text-amber-800 font-semibold">
              Pokemon Alle Staffel Und Folgen • 423 Videos
            </p>
          </div>
        </div>
      </div>

      {/* Season Chips (Horizontal Swiper on Phone) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {POKEMON_SEASONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSeason(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition shadow-sm ${
              selectedSeason === s.id
                ? "bg-red-600 text-white border-red-700"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            {s.shortName}
          </button>
        ))}
      </div>

      {/* Partner Quick Filter Pills on Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
        <span className="text-slate-500 text-[10px] uppercase font-black mr-0.5">Filter:</span>
        <button
          onClick={() => setPartnerFilter("all")}
          className={`px-2.5 py-1 rounded-lg border transition ${
            partnerFilter === "all"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => setPartnerFilter("partner_watched")}
          className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
            partnerFilter === "partner_watched"
              ? "bg-orange-500 text-white border-orange-600"
              : "bg-white text-orange-700 border-orange-200"
          }`}
        >
          <span>Von {partnerProfile.name} gesehen ✓</span>
        </button>
        <button
          onClick={() => setPartnerFilter("partner_unwatched")}
          className={`px-2.5 py-1 rounded-lg border transition ${
            partnerFilter === "partner_unwatched"
              ? "bg-slate-600 text-white border-slate-700"
              : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          Von {partnerProfile.name} offen
        </button>
      </div>

      {/* Episode Rows: Ultra-Clear Partner Status & 1-Tap Target */}
      <div className="space-y-2.5">
        {seasonEpisodes.map((ep) => {
          const rec = watchState[ep.id];
          const activeWatched = !!(rec && rec[activeTrainerId]);
          const partnerWatched = !!(rec && rec[partnerTrainerId]);
          const bothWatched = activeWatched && partnerWatched;

          const isNext = isNextEpisode(watchState, activeTrainerId, ep.id);
          const isFuture = isFutureEpisode(watchState, activeTrainerId, ep.id);

          const ytUrl = ep.youtubeUrl || buildPlaylistWatchUrl(ep.id, playlistId);

          // Distinct background color styling
          let rowBg = "bg-white border-slate-200";
          if (bothWatched) rowBg = "bg-emerald-50 border-emerald-300";
          else if (activeWatched) rowBg = "bg-amber-50/70 border-amber-300";
          else if (isNext) rowBg = "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/40 shadow-sm";
          else if (partnerWatched) rowBg = "bg-orange-50/50 border-orange-200";

          return (
            <div
              key={ep.id}
              className={`rounded-2xl border-2 ${rowBg} shadow-sm transition p-2.5 space-y-2`}
            >
              
              {/* Top Row: Episode Number + Title + Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                
                {/* 1-Tap Target: Marks 1..ep.id in 1 tap */}
                <button
                  onClick={() => onToggleWatch(ep.id, activeTrainerId)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-75"
                  title={
                    activeWatched
                      ? "Gesehen (Klicken zum Zurücksetzen)"
                      : `Bis Folge #${ep.id} alles als gesehen abhaken`
                  }
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 border-2 ${
                      activeWatched
                        ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                        : "bg-slate-900 text-white border-slate-800"
                    }`}
                  >
                    #{ep.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                      {ep.titleDe}
                    </h4>
                    <p className="text-[10px] text-slate-500 italic truncate">
                      {ep.titleEn}
                    </p>
                  </div>
                </button>

                {/* Direct Action Icons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* YouTube App Direct Button */}
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!playlistId && onOpenPlaylistModal) {
                        e.preventDefault();
                        onOpenPlaylistModal();
                      }
                    }}
                    className="w-8 h-8 rounded-xl bg-red-600 active:bg-red-700 text-white flex items-center justify-center shadow-sm"
                    title={playlistId ? "In YouTube öffnen (Playlist)" : "Playlist verknüpfen"}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </a>

                  {/* Detail Recap Modal */}
                  <button
                    onClick={() => onOpenDetail(ep)}
                    className="w-8 h-8 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200"
                    title="Zusammenfassung & Pokémon-Bilder anzeigen"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Bottom Row: ULTRA-CLEAR Partner & Active Status Badges */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                
                {/* Active Trainer Status Badge */}
                <button
                  onClick={() => onToggleWatch(ep.id, activeTrainerId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border-2 transition ${
                    activeWatched
                      ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 border border-slate-800">
                    {activeProfile.image ? (
                      <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{activeProfile.avatar}</span>
                    )}
                  </div>
                  <span>
                    {activeProfile.name}: {activeWatched ? "Gesehen ✓" : "Abhaken"}
                  </span>
                </button>

                {/* Partner Trainer Status Badge (HIGH CONTRAST & CLEAR!) */}
                <button
                  onClick={() => onToggleWatch(ep.id, partnerTrainerId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border-2 transition ${
                    partnerWatched
                      ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                  title={`Status für ${partnerProfile.name} umschalten`}
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 border border-slate-300">
                    {partnerProfile.image ? (
                      <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{partnerProfile.avatar}</span>
                    )}
                  </div>
                  <span>
                    {partnerProfile.name}: {partnerWatched ? "Gesehen ✓" : "Noch nicht"}
                  </span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
