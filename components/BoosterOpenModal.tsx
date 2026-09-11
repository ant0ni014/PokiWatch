"use client";

import React, { useState } from "react";
import { TrainerCard } from "@/types";
import { getTypeStyle } from "@/lib/data/tcgData";
import { getPokemonArtworkUrl } from "@/lib/data/pokemonMap";
import { PokeballLogo } from "./PokeballLogo";
import confetti from "canvas-confetti";
import { Sparkles, X, Check, Zap } from "lucide-react";

interface BoosterOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: TrainerCard[];
  onCardsAccepted: (cards: TrainerCard[]) => void;
  trainerName: string;
}

export const BoosterOpenModal: React.FC<BoosterOpenModalProps> = ({
  isOpen,
  onClose,
  cards,
  onCardsAccepted,
  trainerName
}) => {
  // packState: 'unopened' | 'opened'
  const [packState, setPackState] = useState<"unopened" | "opened">("unopened");
  // Revealed cards array (indices 0, 1, 2)
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  if (!isOpen || cards.length === 0) return null;

  const handleOpenPack = () => {
    setPackState("opened");
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleRevealCard = (index: number) => {
    if (revealed[index]) return;
    const next = [...revealed];
    next[index] = true;
    setRevealed(next);

    const c = cards[index];
    if (c.rarity === "crown" || c.rarity === "holo") {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {}
    }
  };

  const allRevealed = revealed.every(Boolean);

  const handleDone = () => {
    onCardsAccepted(cards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Pokémon TCG Booster Pack
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {packState === "unopened" ? `Booster für ${trainerName}` : "3 Karten gezogen!"}
          </h2>
          <p className="text-xs text-slate-400">
            {packState === "unopened"
              ? "Tippe auf das Booster-Pack, um es zu öffnen"
              : "Tippe auf jede Karte, um sie umzudrehen!"}
          </p>
        </div>

        {/* Phase 1: Unopened Pack */}
        {packState === "unopened" && (
          <div className="py-6 flex flex-col items-center">
            <button
              onClick={handleOpenPack}
              className="group relative w-56 sm:w-64 aspect-[2/3] rounded-3xl p-5 bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 shadow-2xl border-4 border-amber-300 flex flex-col items-center justify-between text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-red-500/30"
            >
              {/* Foil Shimmer Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-60 group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* Pack Top Seal */}
              <div className="w-full flex items-center justify-between border-b-2 border-dashed border-red-300/40 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">PokiWatch TCG</span>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">3 KARTEN</span>
              </div>

              {/* Center Logo */}
              <div className="my-auto flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/40 shadow-inner group-hover:rotate-12 transition-transform duration-300">
                  <PokeballLogo size="lg" />
                </div>
                <h3 className="text-lg font-black tracking-tight drop-shadow-md">KANTO EXPANSION</h3>
                <span className="text-[11px] font-bold text-amber-100">Pocket Edition</span>
              </div>

              {/* Pack Bottom Seal */}
              <div className="w-full border-t-2 border-dashed border-red-300/40 pt-2 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  ÖFFNEN ➔
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Phase 2: 3 Cards Opening Grid */}
        {packState === "opened" && (
          <div className="w-full py-4 space-y-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
              {cards.map((card, idx) => {
                const isFlipped = revealed[idx];
                const typeStyle = getTypeStyle(card.type);
                const artworkUrl = getPokemonArtworkUrl(card.pokemonName) ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.dexId}.png`;

                const isCrown = card.rarity === "crown";
                const isHolo = card.rarity === "holo";

                return (
                  <div
                    key={card.id}
                    onClick={() => handleRevealCard(idx)}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div
                      className={`relative w-full aspect-[2.5/3.5] rounded-xl sm:rounded-2xl transition-all duration-500 shadow-xl border-2 sm:border-3 ${
                        !isFlipped
                          ? "bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 border-amber-400 hover:scale-105 active:scale-95 flex items-center justify-center p-2"
                          : isCrown
                          ? "bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-400 border-amber-400 animate-in zoom-in-90 duration-300 p-1.5 sm:p-2.5 flex flex-col justify-between text-slate-900 shadow-amber-500/50"
                          : isHolo
                          ? "bg-gradient-to-br from-indigo-100 via-sky-50 to-pink-100 border-indigo-400 animate-in zoom-in-90 duration-300 p-1.5 sm:p-2.5 flex flex-col justify-between text-slate-900 shadow-indigo-500/40"
                          : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/90 animate-in zoom-in-90 duration-300 p-1.5 sm:p-2.5 flex flex-col justify-between text-slate-900"
                      }`}
                    >
                      {!isFlipped ? (
                        /* Card Back */
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <PokeballLogo size="sm" className="opacity-90 group-hover:rotate-45 transition-transform duration-300" />
                          <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-widest">
                            UMDREHEN
                          </span>
                        </div>
                      ) : (
                        /* Card Front */
                        <>
                          {/* Top */}
                          <div className="flex items-center justify-between border-b border-slate-300/60 pb-1">
                            <span className="font-black text-[10px] sm:text-xs truncate max-w-[65px] sm:max-w-[85px]">
                              {card.pokemonName}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-black text-red-600">
                              {card.hp} <span className="text-[7px] text-slate-500">KP</span>
                            </span>
                          </div>

                          {/* Image */}
                          <div className="my-1 rounded-lg overflow-hidden bg-slate-100 border border-slate-300/80 aspect-[4/3] flex items-center justify-center p-1 relative">
                            <img
                              src={artworkUrl}
                              alt={card.pokemonName}
                              className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                            />
                            {isCrown && (
                              <span className="absolute top-0.5 right-0.5 text-xs">👑</span>
                            )}
                          </div>

                          {/* Attack & Rarity */}
                          <div className="flex items-center justify-between pt-0.5 border-t border-slate-300/60 text-[8px] sm:text-[9px] font-bold">
                            <span className="truncate max-w-[60px] sm:max-w-[80px] text-slate-700">
                              {card.attackName}
                            </span>
                            <span className={`px-1 py-0.2 rounded font-black text-[7px] sm:text-[8px] ${
                              card.rarity === 'crown' ? 'bg-amber-400 text-slate-950' :
                              card.rarity === 'holo' ? 'bg-indigo-500 text-white' :
                              card.rarity === 'rare' ? 'bg-slate-700 text-white' : 'bg-slate-300 text-slate-800'
                            }`}>
                              {card.rarity.toUpperCase()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Accept / Finish Button */}
            <div className="flex items-center justify-center gap-3">
              {!allRevealed && (
                <button
                  onClick={() => setRevealed([true, true, true])}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Alle aufdecken
                </button>
              )}

              <button
                onClick={handleDone}
                disabled={!allRevealed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition shadow-lg ${
                  allRevealed
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-500/25"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>In Sammlung aufnehmen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
