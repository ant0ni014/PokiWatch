"use client";

import React, { useState } from "react";
import { TrainerProfile, TrainerId, WatchStateMap } from "@/types";
import { Search, Flame, Zap, ArrowRight, CheckCheck, Sparkles } from "lucide-react";

export type FilterMode = "all" | "both" | "only_active" | "only_partner" | "unwatched";

interface ComparisonBarProps {
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  watchState: WatchStateMap;
  totalEpisodes: number;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onJumpToNextEpisode: () => void;
  onMarkUpToHere: (episodeId: number, trainerId: TrainerId) => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  profiles,
  activeTrainerId,
  watchState,
  totalEpisodes,
  filterMode,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onJumpToNextEpisode,
  onMarkUpToHere
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

  // Quick mark input state
  const [quickEpInput, setQuickEpInput] = useState("");

  // Calculate statistics
  let activeWatchedCount = 0;
  let partnerWatchedCount = 0;
  let bothWatchedCount = 0;
  let onlyActiveCount = 0;
  let onlyPartnerCount = 0;
  let maxActiveEp = 0;
  let maxPartnerEp = 0;

  for (let ep = 1; ep <= totalEpisodes; ep++) {
    const record = watchState[ep];
    const aWatched = !!(record && record[activeTrainerId]);
    const pWatched = !!(record && record[partnerTrainerId]);

    if (aWatched) {
      activeWatchedCount++;
      if (ep > maxActiveEp) maxActiveEp = ep;
    }
    if (pWatched) {
      partnerWatchedCount++;
      if (ep > maxPartnerEp) maxPartnerEp = ep;
    }

    if (aWatched && pWatched) bothWatchedCount++;
    else if (aWatched && !pWatched) onlyActiveCount++;
    else if (!aWatched && pWatched) onlyPartnerCount++;
  }

  const unwatchedCount = totalEpisodes - (activeWatchedCount + partnerWatchedCount - bothWatchedCount);

  // Status commentary
  let comparisonText = "";
  let statusBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";

  if (activeWatchedCount === partnerWatchedCount) {
    if (activeWatchedCount === 0) {
      comparisonText = "Bereit für euer Pokémon-Abenteuer? Wählt eure erste Folge!";
      statusBadgeClass = "bg-slate-100 text-slate-800 border-slate-300";
    } else {
      comparisonText = `Perfekt gleichauf bei Folge ${maxActiveEp}! 🤝`;
      statusBadgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
  } else if (activeWatchedCount > partnerWatchedCount) {
    const diff = activeWatchedCount - partnerWatchedCount;
    comparisonText = `Du bist ${diff} ${diff === 1 ? "Folge" : "Folgen"} vor ${partnerProfile.name}! ⚡`;
    statusBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";
  } else {
    const diff = partnerWatchedCount - activeWatchedCount;
    comparisonText = `${partnerProfile.name} ist dir um ${diff} ${diff === 1 ? "Folge" : "Folgen"} voraus! 🔥`;
    statusBadgeClass = "bg-rose-100 text-rose-900 border-rose-300";
  }

  const activePercent = Math.round((activeWatchedCount / totalEpisodes) * 100);
  const partnerPercent = Math.round((partnerWatchedCount / totalEpisodes) * 100);

  const handleQuickMark = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(quickEpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalEpisodes) {
      onMarkUpToHere(num, activeTrainerId);
      setQuickEpInput("");
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Top Card: Pokédex Light Comparison Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 p-5 sm:p-7 shadow-lg">
        
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 to-blue-500" />

        {/* YouTube Playlist Source Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-red-600 flex-shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Playlist
            </span>
            <span className="font-extrabold text-slate-800 text-xs truncate">
              Pokemon Alle Staffel Und Folgen
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500 text-[11px]">von Bouazzaoui Mohamed</span>
          </div>
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-sm">
            {totalEpisodes} Videos
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Active Trainer Card */}
          <div className="flex items-center gap-4 w-full md:w-auto bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-md flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                {activeProfile.image ? (
                  <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{activeProfile.avatar}</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-black tracking-wider text-amber-700">
                  Du ({activeProfile.name})
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-800">
                  {activePercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {maxActiveEp > 0 ? `Folge ${maxActiveEp}` : "Noch keine"}
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                {activeWatchedCount} von {totalEpisodes} Folgen gesehen
              </div>
            </div>
          </div>

          {/* Center Status & Quick Actions */}
          <div className="flex flex-col items-center text-center px-2">
            <div className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black tracking-wide flex items-center gap-1.5 shadow-sm ${statusBadgeClass}`}>
              <Sparkles className="w-4 h-4" />
              <span>{comparisonText}</span>
            </div>
            
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={onJumpToNextEpisode}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 transition active:scale-95"
              >
                <span>Nächste Folge weiterschauen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Partner Trainer Card */}
          <div className="flex items-center gap-4 w-full md:w-auto bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 p-0.5 shadow-md flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                {partnerProfile.image ? (
                  <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{partnerProfile.avatar}</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-black tracking-wider text-orange-700">
                  Partner ({partnerProfile.name})
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-200 text-orange-800">
                  {partnerPercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {maxPartnerEp > 0 ? `Folge ${maxPartnerEp}` : "Noch keine"}
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                {partnerWatchedCount} von {totalEpisodes} Folgen gesehen
              </div>
            </div>
          </div>

        </div>

        {/* Dual Visual Progress Bars */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          
          {/* Active Trainer Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2 text-amber-900 font-black">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-500 shadow-sm flex-shrink-0 bg-white">
                  {activeProfile.image ? (
                    <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">🔴</span>
                  )}
                </div>
                <span>🔴 {activeProfile.name}</span>
              </span>
              <span>{activeWatchedCount} / {totalEpisodes} Folgen</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${activePercent}%` }}
              />
            </div>
          </div>

          {/* Partner Trainer Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2 text-orange-900 font-black">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-500 shadow-sm flex-shrink-0 bg-white">
                  {partnerProfile.image ? (
                    <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">💧</span>
                  )}
                </div>
                <span>💧 {partnerProfile.name}</span>
              </span>
              <span>{partnerWatchedCount} / {totalEpisodes} Folgen</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${partnerPercent}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Quick-Input (Clean & Modern) */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-amber-900">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>QUICK JUMP</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-200 text-amber-900">1-Klick</span>
            </div>
            <div className="text-xs text-amber-950 font-semibold">
              Stand auf YouTube erreicht? Bis zu dieser Folge alles abhaken:
            </div>
          </div>
        </div>

        <form onSubmit={handleQuickMark} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-white rounded-xl border-2 border-amber-300 px-3 py-1.5 shadow-inner">
            <span className="text-xs font-bold text-slate-500 mr-1.5">Folge:</span>
            <input
              type="number"
              min="1"
              max={totalEpisodes}
              value={quickEpInput}
              onChange={(e) => setQuickEpInput(e.target.value)}
              placeholder="z. B. 7"
              className="w-16 font-black text-slate-900 text-sm focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 whitespace-nowrap"
          >
            <CheckCheck className="w-4 h-4" />
            <span>✓ Als gesehen abhaken</span>
          </button>
        </form>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Alle ({totalEpisodes})
          </button>

          <button
            onClick={() => onFilterChange("both")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "both"
                ? "bg-emerald-600 text-white border-emerald-600 shadow"
                : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Gemeinsam ({bothWatchedCount})
          </button>

          <button
            onClick={() => onFilterChange("only_active")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "only_active"
                ? "bg-amber-500 text-slate-950 border-amber-500 shadow"
                : "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            Nur {activeProfile.name} ({onlyActiveCount})
          </button>

          <button
            onClick={() => onFilterChange("only_partner")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "only_partner"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-blue-800 border-blue-200 hover:bg-blue-50"
            }`}
          >
            Nur {partnerProfile.name} ({onlyPartnerCount})
          </button>

          <button
            onClick={() => onFilterChange("unwatched")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "unwatched"
                ? "bg-slate-300 text-slate-900 border-slate-400 shadow"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Ungesehen ({unwatchedCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Folge, Titel, Pokémon (z.B. Glurak)..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
