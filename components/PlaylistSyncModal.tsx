"use client";

import React, { useState } from "react";
import { X, RefreshCw, Check, AlertCircle, Sparkles, Film } from "lucide-react";

interface PlaylistSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewVideosSynced?: (count: number) => void;
}

export const PlaylistSyncModal: React.FC<PlaylistSyncModalProps> = ({
  isOpen,
  onClose,
  onNewVideosSynced
}) => {
  const [playlistInput, setPlaylistInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");

  if (!isOpen) return null;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistInput.trim()) {
      setStatus("error");
      setResultMessage("Bitte gib einen Playlist-Link oder eine Playlist-ID ein.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setResultMessage("");

    try {
      const res = await fetch("/api/sync-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlist: playlistInput.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResultMessage(`Erfolgreich synchronisiert! ${data.videoCount} Videos im Feed gefunden.`);
        if (typeof window !== "undefined") {
          localStorage.setItem("pokiwatch_custom_playlist", playlistInput.trim());
        }
        if (onNewVideosSynced) onNewVideosSynced(data.videoCount);
      } else {
        setStatus("error");
        setResultMessage(data.message || "Playlist konnte nicht synchronisiert werden.");
      }
    } catch (err: any) {
      setStatus("error");
      setResultMessage("Verbindungsfehler beim Abrufen der Playlist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 text-slate-900 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                YouTube Playlist Up-to-Date halten
              </h2>
              <p className="text-xs text-slate-500">
                Täglich neue Folgen automatisch erfassen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-1.5 text-xs text-amber-950 font-medium">
          <div className="font-black text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Wie funktioniert die Synchronisation?</span>
          </div>
          <p>
            Kopiere einfach den Link deiner YouTube-Playlist (z. B. aus der YouTube-App) und füge ihn hier ein. PokiWatch prüft über den offiziellen YouTube-Feed, ob neue Folgen hochgeladen wurden!
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSync} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
              Playlist URL oder Playlist-ID
            </label>
            <input
              type="text"
              value={playlistInput}
              onChange={(e) => setPlaylistInput(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=PL..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {status === "success" && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{resultMessage}</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{resultMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Schließen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Prüfe Feed...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Playlist prüfen & aktualisieren</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
