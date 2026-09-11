"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { PokeballLogo } from "@/components/PokeballLogo";
import { ComparisonBar, FilterMode } from "@/components/ComparisonBar";
import { EpisodeList } from "@/components/EpisodeList";
import { EasyModeMobile } from "@/components/EasyModeMobile";
import { EpisodeDetailModal } from "@/components/EpisodeDetailModal";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { PinLockModal } from "@/components/PinLockModal";
import { AuthModal } from "@/components/AuthModal";
import { TrainerSelectModal } from "@/components/TrainerSelectModal";
import { SupabaseSetupModal } from "@/components/SupabaseSetupModal";
import { PlaylistSyncModal } from "@/components/PlaylistSyncModal";
import { PlaylistLinkModal } from "@/components/PlaylistLinkModal";
import { PokedexView } from "@/components/PokedexView";
import { ActivityView } from "@/components/ActivityView";
import { getAllEpisodes } from "@/lib/data/episodes";
import { calculateSharedPokedex } from "@/lib/data/pokedex";
import { getSavedPlaylistId, DEFAULT_PLAYLIST_ID } from "@/lib/playlist";
import {
  getInitialData,
  saveLocalData,
  fetchRemoteState,
  pushRemoteState,
  DEFAULT_PROFILES
} from "@/lib/storage";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Episode, TrainerId, TrainerProfile, WatchStateMap } from "@/types";
import { Zap, Smartphone } from "lucide-react";

export default function Home() {
  const episodes = useMemo(() => getAllEpisodes(), []);

  // Application state
  const [isMounted, setIsMounted] = useState(false);
  const [profiles, setProfiles] = useState<{ trainer_1: TrainerProfile; trainer_2: TrainerProfile }>(DEFAULT_PROFILES);
  const [activeTrainerId, setActiveTrainerId] = useState<TrainerId>("trainer_1");
  const [deviceTrainerChosen, setDeviceTrainerChosen] = useState(false);
  const [watchState, setWatchState] = useState<WatchStateMap>({});

  // Active Category Tab: 'episodes' | 'pokedex' | 'activity'
  const [activeTab, setActiveTab] = useState<"episodes" | "pokedex" | "activity">("episodes");

  // View mode & Easy Mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isEasyMode, setIsEasyMode] = useState(true); // Default to Easy Mode for clean mobile experience

  // YouTube Playlist ID for direct playlist jumps (defaults to user's 423-video playlist)
  const [playlistId, setPlaylistId] = useState<string | null>(DEFAULT_PLAYLIST_ID);

  // Sync & Supabase state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modals
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isPlaylistLinkModalOpen, setIsPlaylistLinkModalOpen] = useState(false);
  const [pendingTrainerPin, setPendingTrainerPin] = useState<TrainerId | null>(null);

  // Filters & Search
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  // Initial load
  useEffect(() => {
    const initial = getInitialData();
    setProfiles(initial.profiles || DEFAULT_PROFILES);
    setWatchState(initial.watchState || {});

    // Check if user has explicitly chosen a trainer for this device
    const savedTrainer = localStorage.getItem("pokiwatch_device_trainer") as TrainerId | null;
    if (savedTrainer === "trainer_1" || savedTrainer === "trainer_2") {
      setActiveTrainerId(savedTrainer);
      setDeviceTrainerChosen(true);
    } else {
      setActiveTrainerId(initial.activeTrainerId || "trainer_1");
      setDeviceTrainerChosen(false);
    }

    // Saved Easy Mode
    const savedEasy = localStorage.getItem("pokiwatch_easy_mode");
    if (savedEasy !== null) {
      setIsEasyMode(savedEasy === "true");
    }

    const savedMode = localStorage.getItem("pokiwatch_view_mode") as "grid" | "list" | null;
    if (savedMode === "grid" || savedMode === "list") {
      setViewMode(savedMode);
    }

    const savedPlaylist = getSavedPlaylistId();
    if (savedPlaylist) {
      setPlaylistId(savedPlaylist);
    }

    setIsMounted(true);

    // Supabase check
    const client = getSupabaseClient();
    if (client) {
      setIsSupabaseConnected(true);
      setIsSyncing(true);
      fetchRemoteState().then((remote) => {
        if (remote) {
          if (remote.watchState) {
            setWatchState((prev) => {
              const merged = { ...prev, ...remote.watchState };
              saveLocalData({
                profiles: remote.profiles || initial.profiles,
                activeTrainerId: initial.activeTrainerId,
                watchState: merged,
                lastUpdated: new Date().toISOString()
              });
              return merged;
            });
          }
          if (remote.profiles) {
            setProfiles(remote.profiles);
          }
        }
        setIsSyncing(false);
      });

      // Check current auth session
      client.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          setCurrentUser(data.session.user);
        }
        setIsAuthChecked(true);
      }).catch(() => {
        setIsAuthChecked(true);
      });

      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user || null);
        setIsAuthChecked(true);
      });

      const channel = client
        .channel("pokiwatch_live_sync")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pokiwatch_state"
          },
          (payload: any) => {
            const newRecord = payload.new;
            if (newRecord && newRecord.watch_state) {
              setWatchState(newRecord.watch_state);
              if (newRecord.profiles) {
                setProfiles(newRecord.profiles);
              }
              showToast("⚡ Watch-Status vom Partner aktualisiert!");
            }
          }
        )
        .subscribe();

      return () => {
        authListener?.subscription?.unsubscribe();
        client.removeChannel(channel);
      };
    }
  }, [showToast]);

  const handleToggleEasyMode = useCallback(() => {
    setIsEasyMode((prev) => {
      const next = !prev;
      localStorage.setItem("pokiwatch_easy_mode", String(next));
      return next;
    });
  }, []);

  const handleToggleViewMode = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("pokiwatch_view_mode", mode);
  }, []);

  const commitWatchState = useCallback(
    (newState: WatchStateMap) => {
      setWatchState(newState);
      saveLocalData({
        profiles,
        activeTrainerId,
        watchState: newState,
        lastUpdated: new Date().toISOString()
      });

      if (isSupabaseConnected) {
        pushRemoteState(newState, profiles);
      }
    },
    [profiles, activeTrainerId, isSupabaseConnected]
  );

  const handleToggleWatch = useCallback(
    (episodeId: number, trainerId: TrainerId) => {
      const current = watchState[episodeId] || { trainer_1: false, trainer_2: false };
      const currentlyWatched = !!current[trainerId];
      const trainerName = profiles[trainerId].name;

      // Case 1: Uncheck an already watched episode -> uncheck from episodeId upwards
      if (currentlyWatched) {
        const newState = { ...watchState };
        for (let ep = episodeId; ep <= 423; ep++) {
          if (!newState[ep]?.[trainerId]) break;
          newState[ep] = {
            ...newState[ep],
            [trainerId]: false,
            [trainerId === "trainer_1" ? "watchedAt_1" : "watchedAt_2"]: undefined
          };
        }
        commitWatchState(newState);
        showToast(`↩️ Stand für ${trainerName} auf Folge ${episodeId - 1} zurückgesetzt`);
        return;
      }

      // Case 2: 1-Tap Catch-up: Mark all episodes 1..episodeId as watched!
      const newState = { ...watchState };
      for (let ep = 1; ep <= episodeId; ep++) {
        const cur = newState[ep] || { trainer_1: false, trainer_2: false };
        newState[ep] = {
          ...cur,
          [trainerId]: true,
          [trainerId === "trainer_1" ? "watchedAt_1" : "watchedAt_2"]:
            cur[trainerId] && (trainerId === "trainer_1" ? cur.watchedAt_1 : cur.watchedAt_2)
              ? (trainerId === "trainer_1" ? cur.watchedAt_1 : cur.watchedAt_2)
              : new Date().toISOString()
        };
      }

      commitWatchState(newState);

      if (episodeId % 10 === 0 || episodeId === 82 || episodeId === 276) {
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
      showToast(`⚡ ${trainerName}: Bis Folge ${episodeId} alles als gesehen abgehakt!`);
    },
    [watchState, profiles, commitWatchState, showToast]
  );

  // Set current episode (Marks all 1..targetEpId as watched!)
  const handleSetCurrentEpisode = useCallback(
    (targetEpId: number, trainerId: TrainerId) => {
      const newState = { ...watchState };
      const trainerName = profiles[trainerId].name;

      for (let ep = 1; ep <= targetEpId; ep++) {
        const cur = newState[ep] || { trainer_1: false, trainer_2: false };
        newState[ep] = {
          ...cur,
          [trainerId]: true,
          [trainerId === "trainer_1" ? "watchedAt_1" : "watchedAt_2"]:
            cur[trainerId] && (trainerId === "trainer_1" ? cur.watchedAt_1 : cur.watchedAt_2)
              ? (trainerId === "trainer_1" ? cur.watchedAt_1 : cur.watchedAt_2)
              : new Date().toISOString()
        };
      }

      commitWatchState(newState);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch {}
      showToast(`⚡ Reihenfolge aktualisiert: ${trainerName} ist jetzt bei Folge ${targetEpId}!`);
    },
    [watchState, profiles, commitWatchState, showToast]
  );

  const handleJumpToNextEpisode = useCallback(() => {
    for (const ep of episodes) {
      const rec = watchState[ep.id];
      if (!rec || !rec[activeTrainerId]) {
        setSelectedEpisode(ep);
        return;
      }
    }
    setSelectedEpisode(episodes[0]);
    showToast("🏆 Alle Folgen geschaut!");
  }, [episodes, watchState, activeTrainerId, showToast]);

  const handleSelectActiveTrainer = useCallback((id: TrainerId) => {
    const target = profiles[id];
    if (target?.customPin) {
      setPendingTrainerPin(id);
    } else {
      setActiveTrainerId(id);
      if (typeof window !== "undefined") {
        localStorage.setItem("pokiwatch_active_trainer", id);
      }
    }
  }, [profiles]);

  const handleSaveProfiles = useCallback(
    (newProfiles: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }) => {
      setProfiles(newProfiles);
      saveLocalData({
        profiles: newProfiles,
        activeTrainerId,
        watchState,
        lastUpdated: new Date().toISOString()
      });
      if (isSupabaseConnected) {
        pushRemoteState(watchState, newProfiles);
      }
      showToast("Profile erfolgreich aktualisiert!");
    },
    [activeTrainerId, watchState, isSupabaseConnected, showToast]
  );

  const handleSaveSupabaseCredentials = useCallback(
    async (url: string, anonKey: string) => {
      localStorage.setItem("pokiwatch_supabase_url", url);
      localStorage.setItem("pokiwatch_supabase_key", anonKey);

      const client = getSupabaseClient();
      if (!client) return false;

      const ok = await pushRemoteState(watchState, profiles);
      if (ok) {
        setIsSupabaseConnected(true);
        showToast("✅ Supabase erfolgreich verbunden!");
        return true;
      }
      return false;
    },
    [watchState, profiles, showToast]
  );

  const handleClearSupabaseCredentials = useCallback(() => {
    localStorage.removeItem("pokiwatch_supabase_url");
    localStorage.removeItem("pokiwatch_supabase_key");
    setIsSupabaseConnected(false);
    showToast("Verbindung getrennt. App speichert lokal.");
  }, [showToast]);

  const sharedPokedex = useMemo(
    () => calculateSharedPokedex(episodes, watchState),
    [episodes, watchState]
  );

  const handleForceSync = useCallback(async () => {
    setIsSyncing(true);
    const remote = await fetchRemoteState();
    if (remote) {
      if (remote.watchState) setWatchState(remote.watchState);
      if (remote.profiles) setProfiles(remote.profiles);
      showToast("🔄 Daten synchronisiert!");
    }
    setIsSyncing(false);
  }, [showToast]);

  if (!isMounted || !isAuthChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-slate-200">PokiWatch lädt...</p>
        </div>
      </div>
    );
  }

  // Not logged in to Main Account -> Show Gatekeeper Lock Screen (Clean Light Pokeball Theme)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pokeball-bg-pattern text-slate-900 flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl">
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
            <PokeballLogo size="xl" className="hover:rotate-45 transition-transform duration-500" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              PokiWatch
            </h1>
            <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto">
              Privater 2-Personen Pokémon Watch-Tracker
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-lg shadow-red-500/25 transition active:scale-95"
          >
            <span>Anmelden</span>
            <span className="text-base">➔</span>
          </button>

          <p className="text-[11px] text-slate-400 font-semibold">
            Zugang nur für autorisierte Trainer
          </p>
        </div>

        {/* Modal for logging in */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          forceLogin={true}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            showToast(`🎉 Willkommen zurück, ${user.email}!`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pokeball-bg-pattern text-slate-900 flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-amber-300 shadow-2xl border-2 border-amber-400 animate-in slide-in-from-bottom-3 duration-200">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
          <span className="text-xs sm:text-sm font-black truncate">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation with authentic Pokéball Logo & Category tabs */}
      <Navbar
        profiles={profiles}
        activeTrainerId={activeTrainerId}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        discoveredCount={sharedPokedex.unlockedCount}
        totalPokemonCount={sharedPokedex.totalUniqueCount}
        onSelectActiveTrainer={handleSelectActiveTrainer}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
        onOpenPlaylistLinkModal={() => setIsPlaylistLinkModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        isSyncing={isSyncing}
        onForceSync={handleForceSync}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={async () => {
          const client = getSupabaseClient();
          if (client) {
            await client.auth.signOut();
            setCurrentUser(null);
            showToast("👋 Erfolgreich abgemeldet.");
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Unlinked Playlist Alert Banner */}
        {!playlistId && (
          <div
            onClick={() => setIsPlaylistLinkModalOpen(true)}
            className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white flex items-center justify-between gap-3 shadow-md hover:brightness-105 transition active:scale-[0.99] animate-in fade-in"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl flex-shrink-0 animate-bounce">▶️</span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black">
                  YouTube-Playlist verknüpfen (Tab: „Pokemon Alle Staffel Und Folgen“)
                </p>
                <p className="text-[11px] text-red-100 truncate">
                  Klicke hier, um deinen Playlist-Link einzufügen, damit Videos direkt in deiner Playlist starten!
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-black text-xs whitespace-nowrap shadow-sm flex-shrink-0">
              Link einfügen ➜
            </span>
          </div>
        )}

        {activeTab === "pokedex" ? (
          /* Gemeinsamer Pokédex Tab */
          <PokedexView
            episodes={episodes}
            watchState={watchState}
            profiles={profiles}
            onSelectEpisode={(ep) => setSelectedEpisode(ep)}
            onSwitchToEpisodesTab={() => setActiveTab("episodes")}
          />
        ) : activeTab === "activity" ? (
          /* Gemeinsame Watch-Aktivität Tab */
          <ActivityView
            watchState={watchState}
            profiles={profiles}
          />
        ) : (
          /* Normal Episodes Tracking Tab */
          <>
            {/* Comparison Dashboard (Du vs Partner) */}
            <ComparisonBar
              profiles={profiles}
              activeTrainerId={activeTrainerId}
              watchState={watchState}
              totalEpisodes={episodes.length}
              filterMode={filterMode}
              onFilterChange={setFilterMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onJumpToNextEpisode={handleJumpToNextEpisode}
              onMarkUpToHere={handleSetCurrentEpisode}
            />

            {/* Easy Mode (Mobile Focus) */}
            {isEasyMode ? (
              <>
                {/* Mobile Easy Mode View: 1-Tap on episode to set progress */}
                <EasyModeMobile
                  episodes={episodes}
                  watchState={watchState}
                  profiles={profiles}
                  activeTrainerId={activeTrainerId}
                  playlistId={playlistId}
                  onOpenPlaylistModal={() => setIsPlaylistLinkModalOpen(true)}
                  onSetCurrentEpisode={handleSetCurrentEpisode}
                  onToggleWatch={handleToggleWatch}
                  onOpenDetail={(ep) => setSelectedEpisode(ep)}
                />

                {/* Desktop Fallback for Easy Mode: Clean Grid/List */}
                <div className="hidden sm:block">
                  <EpisodeList
                    episodes={episodes}
                    watchState={watchState}
                    profiles={profiles}
                    activeTrainerId={activeTrainerId}
                    playlistId={playlistId}
                    onOpenPlaylistModal={() => setIsPlaylistLinkModalOpen(true)}
                    filterMode={filterMode}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                    onToggleWatch={handleToggleWatch}
                    onMarkUpToHere={handleSetCurrentEpisode}
                    onOpenDetail={(ep) => setSelectedEpisode(ep)}
                  />
                </div>
              </>
            ) : (
              /* Full Detail View */
              <section className="space-y-3">
                <EpisodeList
                  episodes={episodes}
                  watchState={watchState}
                  profiles={profiles}
                  activeTrainerId={activeTrainerId}
                  playlistId={playlistId}
                  onOpenPlaylistModal={() => setIsPlaylistLinkModalOpen(true)}
                  filterMode={filterMode}
                  searchQuery={searchQuery}
                  viewMode={viewMode}
                  onToggleWatch={handleToggleWatch}
                  onMarkUpToHere={handleSetCurrentEpisode}
                  onOpenDetail={(ep) => setSelectedEpisode(ep)}
                />
              </section>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-200 bg-white py-5 text-center text-xs text-slate-600 mt-auto">
        <p className="font-bold text-slate-800">
          Von Antonio Pham Ngoc erstellt
        </p>
      </footer>

      {/* Modals */}
      <EpisodeDetailModal
        episode={selectedEpisode}
        onClose={() => setSelectedEpisode(null)}
        watchRecord={selectedEpisode ? watchState[selectedEpisode.id] : undefined}
        watchState={watchState}
        profiles={profiles}
        activeTrainerId={activeTrainerId}
        playlistId={playlistId}
        onOpenPlaylistModal={() => setIsPlaylistLinkModalOpen(true)}
        onToggleWatch={handleToggleWatch}
      />

      {isProfileModalOpen && (
        <ProfileEditModal
          profiles={profiles}
          activeTrainerId={activeTrainerId}
          watchState={watchState}
          onSelectActiveTrainer={handleSelectActiveTrainer}
          onSaveProfiles={handleSaveProfiles}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isSupabaseModalOpen && (
        <SupabaseSetupModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          onSaveCredentials={handleSaveSupabaseCredentials}
          onClearCredentials={handleClearSupabaseCredentials}
          isConnected={isSupabaseConnected}
        />
      )}

      {isPlaylistModalOpen && (
        <PlaylistSyncModal
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
        />
      )}

      {isPlaylistLinkModalOpen && (
        <PlaylistLinkModal
          isOpen={isPlaylistLinkModalOpen}
          onClose={() => setIsPlaylistLinkModalOpen(false)}
          onSaved={(newId) => {
            setPlaylistId(newId);
            showToast("✅ YouTube-Playlist erfolgreich hinterlegt!");
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`🎉 Eingeloggt als ${user.email}!`);
          }}
        />
      )}

      {pendingTrainerPin && (
        <PinLockModal
          isOpen={Boolean(pendingTrainerPin)}
          onClose={() => setPendingTrainerPin(null)}
          targetTrainer={profiles[pendingTrainerPin]}
          onSuccess={() => {
            const nextId = pendingTrainerPin;
            setActiveTrainerId(nextId);
            if (typeof window !== "undefined") {
              localStorage.setItem("pokiwatch_active_trainer", nextId);
            }
            showToast(`🔓 Als ${profiles[nextId].name} eingeloggt!`);
            setPendingTrainerPin(null);
          }}
          onSetNewPin={(newPin) => {
            const nextId = pendingTrainerPin;
            const updated = {
              ...profiles,
              [nextId]: {
                ...profiles[nextId],
                customPin: newPin
              }
            };
            handleSaveProfiles(updated);
          }}
        />
      )}

      {/* Trainer Choice Popup for this device (Ash or Misty) */}
      {currentUser && !deviceTrainerChosen && (
        <TrainerSelectModal
          isOpen={!deviceTrainerChosen}
          profiles={profiles}
          onSelectTrainer={(chosenId) => {
            setActiveTrainerId(chosenId);
            setDeviceTrainerChosen(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("pokiwatch_device_trainer", chosenId);
              localStorage.setItem("pokiwatch_active_trainer", chosenId);
            }
            showToast(`⭐ Dieses Gerät ist jetzt ${profiles[chosenId].name}!`);
          }}
          onLogout={async () => {
            const client = getSupabaseClient();
            if (client) {
              await client.auth.signOut();
              setCurrentUser(null);
              setDeviceTrainerChosen(false);
              localStorage.removeItem("pokiwatch_device_trainer");
              showToast("👋 Erfolgreich abgemeldet.");
            }
          }}
        />
      )}

    </div>
  );
}
