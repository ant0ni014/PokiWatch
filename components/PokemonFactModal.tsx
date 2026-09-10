"use client";

import React, { useEffect } from "react";
import { DiscoveredPokemon, Episode } from "@/types";
import { getPokemonFactInfo } from "@/lib/data/pokemonFacts";
import { PokedexIcon } from "./PokedexIcon";
import { X, Sparkles, Tv, CheckCircle2, Award, Info, Film } from "lucide-react";

interface PokemonFactModalProps {
  pokemon: DiscoveredPokemon | null;
  onClose: () => void;
  onSelectEpisode: (episode: Episode) => void;
  episodes: Episode[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Elektro": { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-300" },
  "Feuer": { bg: "bg-orange-100", text: "text-orange-900", border: "border-orange-300" },
  "Wasser": { bg: "bg-blue-100", text: "text-blue-900", border: "border-blue-300" },
  "Pflanze": { bg: "bg-emerald-100", text: "text-emerald-900", border: "border-emerald-300" },
  "Gift": { bg: "bg-purple-100", text: "text-purple-900", border: "border-purple-300" },
  "Flug": { bg: "bg-sky-100", text: "text-sky-900", border: "border-sky-300" },
  "Käfer": { bg: "bg-lime-100", text: "text-lime-900", border: "border-lime-300" },
  "Normal": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-300" },
  "Fee": { bg: "bg-pink-100", text: "text-pink-900", border: "border-pink-300" },
  "Geist": { bg: "bg-indigo-100", text: "text-indigo-900", border: "border-indigo-300" },
  "Psycho": { bg: "bg-fuchsia-100", text: "text-fuchsia-900", border: "border-fuchsia-300" }
};

export const PokemonFactModal: React.FC<PokemonFactModalProps> = ({
  pokemon,
  onClose,
  onSelectEpisode,
  episodes
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  const factInfo = getPokemonFactInfo(pokemon.name);
  const firstEpisode = episodes.find((e) => e.id === pokemon.firstAppearanceEpisodeId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Pokédex Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-black text-xs border border-white/30">
              #{pokemon.dexId < 9999 ? String(pokemon.dexId).padStart(3, "0") : "???"}
            </span>
            <div>
              <h2 className="text-xl font-black tracking-tight">{pokemon.name}</h2>
              <p className="text-[11px] text-red-100 font-bold">{factInfo.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Top: Artwork & Types */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/50 border-2 border-slate-200">
            <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0 bg-white rounded-2xl shadow-inner p-2 border border-slate-200">
              <img
                src={pokemon.artworkUrl}
                alt={pokemon.name}
                className="max-w-full max-h-full object-contain filter drop-shadow-lg"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {factInfo.types.map((t) => {
                  const style = TYPE_COLORS[t] || { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" };
                  return (
                    <span
                      key={t}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {t}
                    </span>
                  );
                })}
                <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Gemeinsam entdeckt
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Gesehen in insgesamt <strong className="text-slate-900 font-black">{pokemon.allAppearanceEpisodeIds.length}</strong> {pokemon.allAppearanceEpisodeIds.length === 1 ? "Folge" : "Folgen"} der Serie!
              </div>

              {firstEpisode && (
                <button
                  onClick={() => {
                    onClose();
                    onSelectEpisode(firstEpisode);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition shadow-sm"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Erstauftritt: Folge #{firstEpisode.id} ansehen →</span>
                </button>
              )}
            </div>
          </div>

          {/* Pokédex-Biografie (Digital Screen Look) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/50 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-emerald-400">
                <PokedexIcon size="sm" />
                <span>POKÉDEX-BIOGRAFIE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-400">VOICE LOG #{pokemon.dexId < 9999 ? String(pokemon.dexId).padStart(3, "0") : "???"}</span>
              </div>
            </div>
            <p className="text-xs sm:text-[13px] font-mono text-emerald-200 leading-relaxed italic bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
              „{factInfo.description}“
            </p>
          </div>

          {/* Coole Fakten & Anime-Trivia */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Coole Fakten & Anime-Trivia</span>
            </div>

            <div className="space-y-2">
              {factInfo.facts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-2.5 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alle Episoden, in denen dieses Pokémon vorkommt */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
              <Tv className="w-4 h-4 text-slate-500" />
              <span>Alle Folgen mit {pokemon.name} ({pokemon.allAppearanceEpisodeIds.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pokemon.allAppearanceEpisodeIds.map((epId: number) => {
                const ep = episodes.find((e) => e.id === epId);
                return (
                  <button
                    key={epId}
                    onClick={() => {
                      if (ep) {
                        onClose();
                        onSelectEpisode(ep);
                      }
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-bold text-slate-800 transition"
                    title={ep ? ep.titleDe : `Folge ${epId}`}
                  >
                    #{epId} {ep ? ep.titleDe.split("|")[0].trim() : ""}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
