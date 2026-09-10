"use client";

import React, { useMemo, useState } from "react";
import { Episode, TrainerProfile, TrainerId, WatchStateMap } from "@/types";
import { EpisodeListRow } from "./EpisodeListRow";
import { FilterMode } from "./ComparisonBar";
import { POKEMON_SEASONS } from "@/lib/data/seasons";
import { Layers } from "lucide-react";

interface EpisodeListProps {
  episodes: Episode[];
  watchState: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  playlistId?: string | null;
  onOpenPlaylistModal?: () => void;
  filterMode: FilterMode;
  searchQuery: string;
  viewMode?: "grid" | "list";
  onToggleWatch: (episodeId: number, trainerId: TrainerId) => void;
  onMarkUpToHere: (episodeId: number, trainerId: TrainerId) => void;
  onOpenDetail: (episode: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  watchState,
  profiles,
  activeTrainerId,
  playlistId,
  onOpenPlaylistModal,
  filterMode,
  searchQuery,
  viewMode,
  onToggleWatch,
  onMarkUpToHere,
  onOpenDetail
}) => {
  const partnerTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const [selectedSeason, setSelectedSeason] = useState<number | "all">(1); // Default to Season 1

  // Filter episodes based on Season, FilterMode, and SearchQuery
  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      // Season filter
      if (selectedSeason !== "all" && ep.season !== selectedSeason) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle =
          ep.titleDe.toLowerCase().includes(q) ||
          ep.titleEn.toLowerCase().includes(q) ||
          ep.id.toString() === q ||
          `folge ${ep.id}`.includes(q);
        const matchesPokemon = ep.pokemonFeatured.some((p) => p.toLowerCase().includes(q));
        const matchesBadge = ep.badgeEarned?.toLowerCase().includes(q);

        if (!matchesTitle && !matchesPokemon && !matchesBadge) {
          return false;
        }
      }

      // Watch state filter
      const record = watchState[ep.id];
      const activeWatched = !!(record && record[activeTrainerId]);
      const partnerWatched = !!(record && record[partnerTrainerId]);

      if (filterMode === "both") return activeWatched && partnerWatched;
      if (filterMode === "only_active") return activeWatched && !partnerWatched;
      if (filterMode === "only_partner") return !activeWatched && partnerWatched;
      if (filterMode === "unwatched") return !activeWatched && !partnerWatched;

      return true;
    });
  }, [episodes, selectedSeason, searchQuery, filterMode, watchState, activeTrainerId, partnerTrainerId]);

  return (
    <div className="space-y-4">
      
      {/* Season Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
        <button
          onClick={() => setSelectedSeason("all")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition border-2 whitespace-nowrap shadow-sm ${
            selectedSeason === "all"
              ? "bg-red-600 text-white border-red-700 shadow"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Alle Staffeln ({episodes.length})</span>
        </button>

        {POKEMON_SEASONS.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition border-2 whitespace-nowrap shadow-sm ${
              selectedSeason === season.id
                ? "bg-red-600 text-white border-red-700 shadow"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {season.shortName} ({season.totalEpisodes})
          </button>
        ))}
      </div>

      {/* Episodes Display: Fast, Clean Mobile/Desktop List */}
      {filteredEpisodes.length > 0 ? (
        <div className="space-y-2.5">
          {filteredEpisodes.map((ep) => (
            <EpisodeListRow
              key={ep.id}
              episode={ep}
              watchRecord={watchState[ep.id]}
              watchState={watchState}
              profiles={profiles}
              activeTrainerId={activeTrainerId}
              playlistId={playlistId}
              onOpenPlaylistModal={onOpenPlaylistModal}
              onToggleWatch={onToggleWatch}
              onMarkUpToHere={onMarkUpToHere}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white border-2 border-slate-200 space-y-3 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl">
            🔍
          </div>
          <h4 className="text-base font-black text-slate-800">Keine Episoden gefunden</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Zu deinen aktuellen Filtern oder der Suche wurden keine passenden Pokémon-Folgen gefunden.
          </p>
        </div>
      )}

    </div>
  );
};
