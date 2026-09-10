"use client";

import React, { useEffect } from "react";
import { TrainerProfile, TrainerId } from "@/types";
import { Lock, ArrowRight, Check, X, ShieldAlert } from "lucide-react";

interface SequentialConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEpisodeId: number;
  currentProgress: number;
  nextEpisodeId: number;
  trainerProfile: TrainerProfile;
  trainerId: TrainerId;
  onConfirmCatchUp: (targetEpId: number, trainerId: TrainerId) => void;
}

export const SequentialConfirmationModal: React.FC<SequentialConfirmationModalProps> = ({
  isOpen,
  onClose,
  targetEpisodeId,
  currentProgress,
  nextEpisodeId,
  trainerProfile,
  trainerId,
  onConfirmCatchUp
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const missingCount = targetEpisodeId - currentProgress;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-sm">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Reihenfolge einhalten</span>
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Folge #{targetEpisodeId} kann nicht übersprungen werden
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Für <strong>{trainerProfile.name}</strong> ist aktuell Folge{" "}
            <strong className="text-slate-900 font-black">#{currentProgress === 0 ? "1 (Start)" : currentProgress}</strong> der letzte Stand.
            Die nächste Folge der Reihe nach ist <strong className="text-amber-700 font-black">Folge #{nextEpisodeId}</strong>.
          </p>
        </div>

        {/* Action Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-2">
          <p className="text-xs text-amber-900 font-bold">
            Möchtest du alle {missingCount} Folgen bis einschließlich Folge #{targetEpisodeId} aufholen und als gesehen markieren?
          </p>
          <p className="text-[11px] text-amber-700">
            (Folge #{nextEpisodeId} bis Folge #{targetEpisodeId} werden abgehakt)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={() => {
              onConfirmCatchUp(targetEpisodeId, trainerId);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Ja, bis Folge #{targetEpisodeId} alles abhaken</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Abbrechen
          </button>
        </div>

      </div>
    </div>
  );
};
