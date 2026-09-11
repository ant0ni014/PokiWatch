"use client";

import React from "react";
import { Check, Sparkles, LogOut } from "lucide-react";
import { TrainerProfile, TrainerId } from "@/types";

interface TrainerSelectModalProps {
  isOpen: boolean;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  onSelectTrainer: (id: TrainerId) => void;
  onLogout: () => void;
}

export const TrainerSelectModal: React.FC<TrainerSelectModalProps> = ({
  isOpen,
  profiles,
  onSelectTrainer,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 text-slate-900 text-center space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Trainer-Auswahl</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Wer bist du auf diesem Gerät?
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            Deine Auswahl wird dauerhaft für dieses Handy gespeichert.
          </p>
        </div>

        {/* 2 Big Trainer Buttons */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* Trainer 1 (Ash) */}
          <button
            onClick={() => onSelectTrainer("trainer_1")}
            className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 flex flex-col items-center gap-3 transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform">
              {profiles.trainer_1.image ? (
                <img
                  src={profiles.trainer_1.image}
                  alt={profiles.trainer_1.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-white">
                  {profiles.trainer_1.avatar}
                </div>
              )}
            </div>
            <div>
              <p className="font-black text-sm text-slate-900 group-hover:text-amber-700">
                {profiles.trainer_1.name}
              </p>
              <span className="text-[10px] text-slate-400 font-bold">Trainer 1</span>
            </div>
          </button>

          {/* Trainer 2 (Misty) */}
          <button
            onClick={() => onSelectTrainer("trainer_2")}
            className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center gap-3 transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-400 shadow-md group-hover:scale-105 transition-transform">
              {profiles.trainer_2.image ? (
                <img
                  src={profiles.trainer_2.image}
                  alt={profiles.trainer_2.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-white">
                  {profiles.trainer_2.avatar}
                </div>
              )}
            </div>
            <div>
              <p className="font-black text-sm text-slate-900 group-hover:text-orange-700">
                {profiles.trainer_2.name}
              </p>
              <span className="text-[10px] text-slate-400 font-bold">Trainer 2</span>
            </div>
          </button>
        </div>

        {/* Footer Logout Option */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Hauptkonto abmelden</span>
          </button>
        </div>

      </div>
    </div>
  );
};
