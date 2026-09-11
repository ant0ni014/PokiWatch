"use client";

import React, { useState } from "react";
import { TrainerCard } from "@/types";
import { getTypeStyle } from "@/lib/data/tcgData";
import { getPokemonArtworkUrl } from "@/lib/data/pokemonMap";
import { X, Sparkles, Shield, Zap, Award } from "lucide-react";

interface CardDetailModalProps {
  card: TrainerCard | null;
  onClose: () => void;
  trainerName?: string;
  count?: number;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  trainerName,
  count = 1
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!card) return null;

  const typeStyle = getTypeStyle(card.type);
  const artworkUrl = getPokemonArtworkUrl(card.pokemonName) ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.dexId}.png`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to 10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isCrown = card.rarity === "crown";
  const isHolo = card.rarity === "holo";
  const isRare = card.rarity === "rare";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition shadow-lg"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D TCG Card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out"
          }}
          className={`relative w-[280px] sm:w-[320px] aspect-[2.5/3.5] rounded-2xl p-3 sm:p-4 text-slate-900 shadow-2xl flex flex-col justify-between select-none overflow-hidden ${
            isCrown
              ? "bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-400 border-4 border-amber-300 shadow-amber-500/40"
              : isHolo
              ? "bg-gradient-to-br from-indigo-100 via-sky-50 to-pink-100 border-4 border-indigo-300 shadow-indigo-500/30"
              : isRare
              ? "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 border-4 border-slate-300 shadow-slate-900/30"
              : "bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200/90 shadow-slate-900/20"
          }`}
        >
          {/* Holographic Sheen Layer */}
          {(isHolo || isCrown) && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge bg-gradient-to-tr from-transparent via-pink-400/40 via-cyan-400/40 to-transparent"
              style={{
                transform: `translateX(${tilt.y * 3}px) translateY(${tilt.x * 3}px)`,
                transition: "transform 0.15s ease-out"
              }}
            />
          )}

          {/* Top Header: Name, HP, Type */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-300/60 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-black text-sm sm:text-base tracking-tight truncate text-slate-900">
                {card.pokemonName}
              </span>
              {isCrown && <span title="Crown Secret Rare">👑</span>}
              {isHolo && <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 animate-pulse" />}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">KP</span>
              <span className="text-sm sm:text-base font-black text-red-600">{card.hp}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${typeStyle.badgeColor}`}>
                {card.type}
              </span>
            </div>
          </div>

          {/* Central Artwork Window */}
          <div className="relative z-10 my-2 rounded-xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300/80 aspect-[4/3] flex items-center justify-center p-2 shadow-inner">
            <div className={`absolute inset-0 bg-gradient-to-tr ${typeStyle.bgGradient} opacity-60`} />
            
            <img
              src={artworkUrl}
              alt={card.pokemonName}
              className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Dex Number Tag */}
            <span className="absolute bottom-1 right-2 text-[9px] font-black text-slate-500 bg-white/80 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              #{String(card.dexId).padStart(3, "0")}
            </span>
          </div>

          {/* Attack Section */}
          <div className="relative z-10 my-auto bg-white/70 backdrop-blur-xs rounded-xl p-2.5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-black text-xs sm:text-sm text-slate-800">
                  {card.attackName}
                </span>
              </div>
              <span className="font-black text-xs sm:text-sm text-slate-900">
                {card.attackDmg}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Zieht zusätzliche Energie aus gemeinsamen Abenteuern.
            </p>
          </div>

          {/* Footer: Rarity & Collection Info */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-300/60 text-[10px] font-bold text-slate-600">
            <div className="flex items-center gap-1">
              {card.rarity === "crown" && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  👑 CROWN RARE
                </span>
              )}
              {card.rarity === "holo" && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-black">
                  ★ HOLO RARE
                </span>
              )}
              {card.rarity === "rare" && (
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold">
                  ◆◆ RARE
                </span>
              )}
              {card.rarity === "common" && (
                <span className="px-1.5 py-0.5 rounded bg-slate-300 text-slate-800 font-medium">
                  ◆ COMMON
                </span>
              )}
            </div>

            {count > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black shadow-xs">
                x{count} im Besitz
              </span>
            )}
          </div>
        </div>

        {/* Card Info Bottom bar */}
        <div className="mt-4 text-center text-xs text-slate-400 font-medium">
          {trainerName && <p>Im Album von <strong className="text-white">{trainerName}</strong></p>}
          <p className="text-[11px] text-slate-500 mt-0.5">Bewege die Maus/Finger für den 3D-Holoeffekt</p>
        </div>
      </div>
    </div>
  );
};
