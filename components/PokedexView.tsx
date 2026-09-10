"use client";

import React, { useState, useMemo } from "react";
import { Episode, WatchStateMap, TrainerProfile } from "@/types";
import { calculateSharedPokedex } from "@/lib/data/pokedex";
import { Sparkles, Lock, CheckCircle2, Search, HelpCircle, Eye, ArrowRight, Info } from "lucide-react";
import { PokeballLogo } from "./PokeballLogo";
import { PokedexIcon } from "./PokedexIcon";
import { PokemonFactModal } from "./PokemonFactModal";
import { DiscoveredPokemon } from "@/types";

interface PokedexViewProps {
  episodes: Episode[];
  watchState: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  onSelectEpisode: (episode: Episode) => void;
  onSwitchToEpisodesTab: () => void;
}

export const PokedexView: React.FC<PokedexViewProps> = ({
  episodes,
  watchState,
  profiles,
  onSelectEpisode,
  onSwitchToEpisodesTab
}) => {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [search, setSearch] = useState("");
  const [selectedPokemonForFact, setSelectedPokemonForFact] = useState<DiscoveredPokemon | null>(null);

  const pokedex = useMemo(
    () => calculateSharedPokedex(episodes, watchState),
    [episodes, watchState]
  );

  const filteredPokemon = useMemo(() => {
    return pokedex.pokemonList.filter((p) => {
      if (filter === "unlocked" && !p.isUnlocked) return false;
      if (filter === "locked" && p.isUnlocked) return false;
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDex = p.dexId.toString().includes(query);
        if (!matchesName && !matchesDex) return false;
      }
      return true;
    });
  }, [pokedex.pokemonList, filter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Pokédex Header & Progress Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-7 shadow-xl border-4 border-red-800">
        
        {/* Background Decorative Pokéball */}
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <PokeballLogo size="lg" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Visual Authentic Pokédex Device Badge */}
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border-2 border-white/30 shadow-lg flex-shrink-0 flex items-center justify-center">
              <PokedexIcon size="lg" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-300 border-2 border-white shadow-md animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-700 shadow-inner" />
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/30 ml-1">
                  Gemeinsamer 2-Trainer Pokédex
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                <span>{profiles.trainer_1.name} & {profiles.trainer_2.name}s Pokédex</span>
                <Sparkles className="w-6 h-6 text-amber-300" />
              </h2>

              <p className="text-xs sm:text-sm text-red-100 font-medium max-w-xl mt-1">
                Ein Pokémon wird <strong className="text-amber-200 underline decoration-amber-300">nur dann freigeschaltet</strong>, wenn <strong>beide Partner</strong> eine Folge gesehen haben, in der es vorkommt!
              </p>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 flex-shrink-0 shadow-inner">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-sm">
                {pokedex.unlockedCount}
              </div>
              <div className="text-[10px] uppercase font-black text-white/80 tracking-wider">
                Entdeckt
              </div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {pokedex.totalUniqueCount}
              </div>
              <div className="text-[10px] uppercase font-black text-white/80 tracking-wider">
                Insgesamt
              </div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                {pokedex.percentage}%
              </div>
              <div className="text-[10px] uppercase font-black text-white/80 tracking-wider">
                Gefüllt
              </div>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/20">
          <div className="flex justify-between text-xs font-bold mb-1.5 text-white/90">
            <span>Gemeinsamer Forschungsfortschritt</span>
            <span>{pokedex.unlockedCount} von {pokedex.totalUniqueCount} Pokémon ({pokedex.percentage}%)</span>
          </div>
          <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(pokedex.percentage, 2)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Pokédex Wissens-Box: Warum 189 Pokémon? */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3.5 text-xs text-slate-800 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm">
          💡
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-black text-amber-950 flex items-center gap-2 text-xs sm:text-sm">
            <span>Wissenswertes zum Pokédex: Warum aktuell {pokedex.totalUniqueCount} von 1.025 Pokémon?</span>
          </h4>
          <p className="text-slate-700 leading-relaxed font-medium">
            Im gesamten Pokémon-Universum existieren heute <strong>1.025 offizielle Pokémon</strong> (Stand Gen 9: Karmesin & Purpur).
            In eurer Playlist mit den <strong>423 Folgen</strong> (von Staffel 1 Kanto bis Staffel 10 Sinnoh) wurden exakt diese <strong>{pokedex.totalUniqueCount} Haupt- und Premieren-Pokémon</strong> von Ash und seinen Begleitern entdeckt!
            Klicke auf ein gemeinsam entdecktes Pokémon, um <strong>coole Fakten, Typen und Anime-Trivia</strong> nachzulesen!
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pokémon suchen (Name oder Nr.)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition border flex-shrink-0 ${
              filter === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
            }`}
          >
            Alle ({pokedex.totalUniqueCount})
          </button>
          <button
            onClick={() => setFilter("unlocked")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition border flex-shrink-0 flex items-center gap-1 ${
              filter === "unlocked"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Entdeckt ({pokedex.unlockedCount})</span>
          </button>
          <button
            onClick={() => setFilter("locked")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition border flex-shrink-0 flex items-center gap-1 ${
              filter === "locked"
                ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-200"
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Gesperrt ({pokedex.totalUniqueCount - pokedex.unlockedCount})</span>
          </button>
        </div>
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredPokemon.map((p) => {
          const firstEp = episodes.find((e) => e.id === p.firstAppearanceEpisodeId);

          if (p.isUnlocked) {
            // Unlocked Card (Both trainers have watched it!)
            return (
              <div
                key={p.name}
                onClick={() => setSelectedPokemonForFact(p)}
                className="group relative rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-500 p-3 flex flex-col items-center text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                title="Klicke für coole Fakten, Typen & Episoden-Auftritte!"
              >
                {/* Shiny Header Tag */}
                <div className="w-full flex items-center justify-between text-[10px] font-black text-emerald-800 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                    #{p.dexId < 9999 ? String(p.dexId).padStart(3, "0") : "???"}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-500" title="Gemeinsam entdeckt">
                    <Sparkles className="w-3 h-3 fill-amber-400" />
                  </span>
                </div>

                {/* Artwork */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 my-1 flex items-center justify-center p-1 bg-gradient-to-b from-emerald-50 to-transparent rounded-2xl">
                  <img
                    src={p.artworkUrl}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight line-clamp-1">
                  {p.name}
                </h3>

                {/* Unlocked Badge & Fact Trigger */}
                <div className="mt-1 w-full pt-1.5 border-t border-emerald-100 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-amber-900 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition shadow-xs">
                    <span>💡 Coole Fakten</span>
                  </span>
                  {firstEp && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEpisode(firstEp);
                      }}
                      className="text-[9px] text-slate-500 hover:text-red-600 hover:underline truncate max-w-full"
                      title={`Folge ${firstEp.id}: ${firstEp.titleDe}`}
                    >
                      Folge #{firstEp.id} ansehen →
                    </button>
                  )}
                </div>
              </div>
            );
          } else {
            // Locked / Mystery Card (Not watched by both yet!)
            return (
              <div
                key={p.name}
                className="relative rounded-2xl bg-slate-900 text-white border-2 border-slate-800 p-3 flex flex-col items-center text-center shadow-md overflow-hidden group"
              >
                {/* Header with Lock */}
                <div className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                    #{p.dexId < 9999 ? String(p.dexId).padStart(3, "0") : "???"}
                  </span>
                  <span className="flex items-center gap-0.5 text-rose-400" title="Noch nicht gemeinsam entdeckt">
                    <Lock className="w-3 h-3 text-rose-400" />
                  </span>
                </div>

                {/* Silhouette / Lock Mystery Graphic */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 my-1 flex items-center justify-center p-2 relative">
                  {/* Darkened Silhouette Image */}
                  <img
                    src={p.artworkUrl}
                    alt="Unbekanntes Pokémon"
                    className="max-w-full max-h-full object-contain filter brightness-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-inner">
                      <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Obfuscated / Mystery Name */}
                <h3 className="text-xs sm:text-sm font-black text-slate-400 tracking-tight line-clamp-1">
                  ???
                </h3>

                {/* Unlock Requirement Hint */}
                <div className="mt-1 w-full pt-1.5 border-t border-slate-800 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-amber-400/90 leading-tight">
                    Schaut gemeinsam:
                  </span>
                  {firstEp && (
                    <button
                      onClick={() => onSelectEpisode(firstEp)}
                      className="text-[9px] font-black text-red-400 hover:text-red-300 underline mt-0.5 truncate max-w-full"
                      title={`Folge #${firstEp.id} zusammen schauen`}
                    >
                      Folge #{firstEp.id} öffnen ➜
                    </button>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>

      {filteredPokemon.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-slate-200 p-8">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800">Keine Pokémon gefunden</h3>
          <p className="text-xs text-slate-500 mt-1">
            Probiere einen anderen Suchbegriff oder ändere deinen Filter.
          </p>
        </div>
      )}

      {/* Pokemon Fact Modal with Cool Facts, Types & Trivia */}
      <PokemonFactModal
        pokemon={selectedPokemonForFact}
        onClose={() => setSelectedPokemonForFact(null)}
        onSelectEpisode={onSelectEpisode}
        episodes={episodes}
      />

    </div>
  );
};
