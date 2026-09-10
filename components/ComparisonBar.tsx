"use client";

import React from "react";
import { TrainerProfile, TrainerId, WatchStateMap } from "@/types";
import { Search, ArrowRight, Sparkles } from "lucide-react";

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
  onJumpToNextEpisode
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const activeProfile = profiles[activeTrainerId];
  const partnerProfile = profiles[partnerTrainerId];

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
      comparisonText = "Bereit für die 1. Folge!";
      statusBadgeClass = "bg-slate-100 text-slate-800 border-slate-300";
    } else {
      comparisonText = `Gleichauf bei Folge ${maxActiveEp} 🤝`;
      statusBadgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
  } else if (activeWatchedCount > partnerWatchedCount) {
    const diff = activeWatchedCount - partnerWatchedCount;
    comparisonText = `+${diff} ${diff === 1 ? "Folge" : "Folgen"} vor ${partnerProfile.name} ⚡`;
    statusBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";
  } else {
    const diff = partnerWatchedCount - activeWatchedCount;
    comparisonText = `${partnerProfile.name} +${diff} ${diff === 1 ? "Folge" : "Folgen"} voraus 🔥`;
    statusBadgeClass = "bg-rose-100 text-rose-900 border-rose-300";
  }

  const activePercent = Math.round((activeWatchedCount / totalEpisodes) * 100);
  const partnerPercent = Math.round((partnerWatchedCount / totalEpisodes) * 100);

  return (
    <div className="w-full space-y-3">
      
      {/* Top Card: Streamlined Trainer Comparison */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 p-4 sm:p-6 shadow-md">
        
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 to-blue-500" />

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-1">
          
          {/* Left: Active Trainer Card (Du) */}
          <div className="flex items-center gap-3.5 bg-amber-50/80 border-2 border-amber-200 p-3.5 rounded-2xl shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl overflow-hidden">
                {activeProfile.image ? (
                  <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{activeProfile.avatar}</span>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs uppercase font-black tracking-wider text-amber-800 truncate">
                  Du ({activeProfile.name})
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-200 text-amber-900">
                  {activePercent}%
                </span>
              </div>
              <div className="text-sm font-black text-slate-900">
                {maxActiveEp > 0 ? `Folge #${maxActiveEp}` : "Noch keine"}
                <span className="text-[11px] font-normal text-slate-500 ml-1.5">
                  ({activeWatchedCount}/{totalEpisodes})
                </span>
              </div>
              {/* Direct Integrated Progress Bar */}
              <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${activePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Live Status & Next Episode Button */}
          <div className="flex flex-col items-center justify-center text-center space-y-2 py-1">
            <div className={`px-3.5 py-1 rounded-full border text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm ${statusBadgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{comparisonText}</span>
            </div>
            
            <button
              onClick={onJumpToNextEpisode}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-red-500/20 transition active:scale-95"
            >
              <span>Nächste Folge weiterschauen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Partner Trainer Card */}
          <div className="flex items-center gap-3.5 bg-orange-50/80 border-2 border-orange-200 p-3.5 rounded-2xl shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 p-0.5 shadow flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl overflow-hidden">
                {partnerProfile.image ? (
                  <img src={partnerProfile.image} alt={partnerProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{partnerProfile.avatar}</span>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs uppercase font-black tracking-wider text-orange-800 truncate">
                  Partner ({partnerProfile.name})
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-orange-200 text-orange-900">
                  {partnerPercent}%
                </span>
              </div>
              <div className="text-sm font-black text-slate-900">
                {maxPartnerEp > 0 ? `Folge #${maxPartnerEp}` : "Noch keine"}
                <span className="text-[11px] font-normal text-slate-500 ml-1.5">
                  ({partnerWatchedCount}/{totalEpisodes})
                </span>
              </div>
              {/* Direct Integrated Progress Bar */}
              <div className="w-full h-2 bg-orange-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${partnerPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-1">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Alle ({totalEpisodes})
          </button>

          <button
            onClick={() => onFilterChange("both")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "both"
                ? "bg-emerald-600 text-white border-emerald-600 shadow"
                : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Gemeinsam ({bothWatchedCount})
          </button>

          <button
            onClick={() => onFilterChange("only_active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "only_active"
                ? "bg-amber-500 text-slate-950 border-amber-500 shadow"
                : "bg-white text-amber-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            Nur {activeProfile.name} ({onlyActiveCount})
          </button>

          <button
            onClick={() => onFilterChange("only_partner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
              filterMode === "only_partner"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-blue-800 border-blue-200 hover:bg-blue-50"
            }`}
          >
            Nur {partnerProfile.name} ({onlyPartnerCount})
          </button>

          <button
            onClick={() => onFilterChange("unwatched")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border-2 ${
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
            placeholder="Folge suchen (z.B. Glurak, 27)..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-sm"
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
