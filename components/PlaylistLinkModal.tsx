"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Link2, Sparkles, AlertCircle, Play } from "lucide-react";
import { getSavedPlaylistUrl, savePlaylistSetting, extractPlaylistId } from "@/lib/playlist";

interface PlaylistLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (playlistId: string) => void;
}

export const PlaylistLinkModal: React.FC<PlaylistLinkModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedPlaylistUrl() || "";
      setUrlInput(current);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError("Bitte gib einen Playlist-Link oder eine Playlist-ID ein.");
      return;
    }

    const savedId = savePlaylistSetting(urlInput.trim());
    if (savedId) {
      setSuccess(true);
      setError(null);
      onSaved(savedId);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError("Ungültiger YouTube-Playlist Link. Bitte prüfe das Format (z.B. mit 'list=...').");
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
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                YouTube Playlist direkt verknüpfen
              </h2>
              <p className="text-xs text-slate-500">
                Direkt in Videos deiner Playlist mit Autoplay springen
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

        {/* Feature Explanation Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xs text-amber-950 font-medium space-y-2">
          <div className="font-black text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Warum den Playlist-Link speichern?</span>
          </div>
          <p className="leading-relaxed">
            Statt YouTube nur nach dem Folgentitel suchen zu lassen, springst du durch die Verknüpfung <strong>direkt in das Video an deiner aktuellen Playlist-Position</strong> (<code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">&list=...&index=...</code>). YouTube spielt nach Ende der Folge automatisch die nächste Folge deiner Playlist ab!
          </p>
          <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-[11px] text-amber-900 font-bold flex items-start gap-2">
            <span className="text-sm">💡</span>
            <span>
              <strong>Tipp:</strong> Du hast den Tab <em>„Pokemon Alle Staffel Und Folgen“</em> bereits in deinem Browser geöffnet! Klicke einfach kurz auf diesen Tab, kopiere oben die Adresse aus der Adressleiste (<kbd className="px-1 py-0.5 rounded bg-white font-mono text-[10px]">Strg+C</kbd>) und füge sie hier ein (<kbd className="px-1 py-0.5 rounded bg-white font-mono text-[10px]">Strg+V</kbd>).
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              Link zu deiner Playlist („Pokemon Alle Staffel Und Folgen“)
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PL... oder https://www.youtube.com/watch?v=...&list=PL..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Erkennt automatisch <code className="font-mono text-slate-700 font-bold">list=...</code> aus Playlist- oder Video-URLs.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Playlist erfolgreich verknüpft! Videos starten ab sofort direkt in deiner Playlist.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Playlist verknüpfen & speichern</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
