"use client";

import React from "react";
import { TrainerProfile, TrainerId } from "@/types";
import { PokeballLogo } from "./PokeballLogo";
import { PokedexIcon } from "./PokedexIcon";
import { Database, UserCheck, RefreshCw, LogIn, LogOut, ShieldCheck, Flame } from "lucide-react";

interface NavbarProps {
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  activeTab: "episodes" | "pokedex" | "activity";
  onChangeTab: (tab: "episodes" | "pokedex" | "activity") => void;
  discoveredCount?: number;
  totalPokemonCount?: number;
  onSelectActiveTrainer: (id: TrainerId) => void;
  onOpenProfileModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenPlaylistModal: () => void;
  onOpenPlaylistLinkModal: () => void;
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  onForceSync: () => void;
  viewMode?: "grid" | "list";
  onToggleViewMode?: (mode: "grid" | "list") => void;
  currentUser?: any;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profiles,
  activeTrainerId,
  activeTab,
  onChangeTab,
  discoveredCount,
  totalPokemonCount,
  onSelectActiveTrainer,
  onOpenProfileModal,
  onOpenSupabaseModal,
  onOpenPlaylistModal,
  onOpenPlaylistLinkModal,
  isSupabaseConnected,
  isSyncing,
  onForceSync,
  viewMode,
  onToggleViewMode,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const activeProfile = profiles[activeTrainerId];
  const otherTrainerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const otherProfile = profiles[otherTrainerId];

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-xl border-b-4 border-red-800">
      
      {/* Pokédex Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* Left: Authentic Pokéball Logo & App Name */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Authentic Pokéball Logo as requested! */}
          <div className="cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <PokeballLogo size="md" className="group-hover:rotate-45 transition-transform duration-300" />
          </div>

          {/* Mini 3 LEDs: Red, Yellow, Green */}
          <div className="hidden xs:flex items-center gap-1.5 pr-2 border-r border-red-400/40">
            <div className="w-2.5 h-2.5 rounded-full bg-red-300 border border-red-800 shadow-inner" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-700 shadow-inner animate-pulse" />
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                PokiWatch
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[9px] uppercase font-black tracking-wider rounded-full bg-white/20 text-white border border-white/30">
                2-Trainer
              </span>
            </div>
            <p className="text-[10px] text-red-100 font-bold hidden sm:block">
              YouTube Pokémon Tracker für 2 Personen
            </p>
          </div>
        </div>

        {/* Right side: YouTube Playlist Button, Active Trainer & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Direct YouTube Playlist Button next to Ash */}
          <button
            onClick={onOpenPlaylistLinkModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-700/80 hover:bg-red-800 text-white text-xs font-black border border-red-500/50 shadow-sm transition active:scale-95 flex-shrink-0"
            title="YouTube-Playlist konfigurieren & öffnen"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white flex-shrink-0">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-[11px] sm:text-xs">Playlist</span>
          </button>

          {/* Supabase Status / Setup Button (Hidden for clean look, accessible via profile or settings) */}
          <button
            onClick={onOpenSupabaseModal}
            className="hidden"
            title={isSupabaseConnected ? "Supabase Live-Sync aktiv" : "Klicke für Supabase Echtzeit-Sync"}
          >
            <Database className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-[11px]">
              {isSupabaseConnected ? "Live" : "Cloud"}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? "bg-white animate-pulse" : "bg-red-300"}`} />
          </button>

          {/* If Logged In: Show Active Trainer on this Device */}
          {currentUser ? (
            <div className="flex items-center bg-white p-0.5 sm:p-1 rounded-2xl shadow-md border border-slate-200">
              {/* Active Trainer */}
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:from-amber-300 hover:to-yellow-300 transition"
                title="Dein Profil bearbeiten"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-slate-800">
                  {activeProfile.image ? (
                    <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{activeProfile.avatar}</span>
                  )}
                </div>
                <span className="truncate max-w-[80px] sm:max-w-[110px] text-[11px] sm:text-xs">
                  {activeProfile.name}
                </span>
              </button>
            </div>
          ) : null}

          {/* Login / Auth Button */}
          {currentUser ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-700/80 hover:bg-red-800 text-white text-xs font-bold border border-red-500/50 shadow-sm transition"
              title={`Eingeloggt als ${currentUser.email} (Klicke zum Abmelden)`}
            >
              <LogOut className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="hidden md:inline text-[11px] max-w-[80px] truncate">{currentUser.email?.split('@')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-md border border-amber-300 transition active:scale-95"
              title="Einloggen oder registrieren"
            >
              <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>

      {/* Category Tab Bar (Episoden vs. Gemeinsamer Pokédex vs. Aktivität) */}
      <div className="bg-red-900/60 backdrop-blur-md border-t border-red-500/30 px-3 sm:px-6 lg:px-8 py-1.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
          
          <button
            onClick={() => onChangeTab("episodes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex-shrink-0 ${
              activeTab === "episodes"
                ? "bg-white text-red-700 shadow-md scale-100"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>📺 Episoden</span>
          </button>

          <button
            onClick={() => onChangeTab("pokedex")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex-shrink-0 ${
              activeTab === "pokedex"
                ? "bg-amber-400 text-slate-950 shadow-md scale-100"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <PokedexIcon size="sm" />
            <span>Gemeinsamer Pokédex</span>
            {typeof discoveredCount === "number" && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === "pokedex"
                    ? "bg-slate-950 text-amber-300"
                    : "bg-white/20 text-white"
                }`}
              >
                {discoveredCount}
                {totalPokemonCount ? ` / ${totalPokemonCount}` : ""}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeTab("activity")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex-shrink-0 ${
              activeTab === "activity"
                ? "bg-indigo-500 text-white shadow-md scale-100"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Aktivität</span>
          </button>

        </div>
      </div>

    </header>
  );
};
