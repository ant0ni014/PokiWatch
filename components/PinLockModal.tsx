"use client";

import React, { useState } from "react";
import { Lock, X, Check, KeyRound } from "lucide-react";
import { TrainerProfile } from "@/types";

interface PinLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTrainer: TrainerProfile;
  onSuccess: () => void;
  onSetNewPin?: (newPin: string) => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onClose,
  targetTrainer,
  onSuccess,
  onSetNewPin
}) => {
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  const [isSettingMode, setIsSettingMode] = useState(false);
  const [newPinInput, setNewPinInput] = useState("");

  if (!isOpen) return null;

  const hasExistingPin = Boolean(targetTrainer.customPin);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasExistingPin) {
      onSuccess();
      onClose();
      return;
    }

    if (pinInput === targetTrainer.customPin) {
      setError("");
      onSuccess();
      onClose();
    } else {
      setError("Falscher PIN! Bitte erneut versuchen.");
      setPinInput("");
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setError("PIN muss mindestens 4 Ziffern lang sein.");
      return;
    }
    if (onSetNewPin) {
      onSetNewPin(newPinInput.trim());
    }
    setIsSettingMode(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 text-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {isSettingMode ? "PIN festlegen" : `Profil: ${targetTrainer.name}`}
              </h2>
              <p className="text-[11px] text-slate-500 font-bold">
                {isSettingMode ? "Erstelle deinen persönlichen PIN" : "PIN-Eingabe erforderlich"}
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

        {isSettingMode ? (
          <form onSubmit={handleSavePin} className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Neuer PIN (mind. 4 Zeichen)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="z. B. 1234"
                className="w-full text-center text-xl tracking-widest px-3.5 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-black focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-black text-center">{error}</p>
            )}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsSettingMode(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm"
              >
                PIN speichern
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Gib den PIN für {targetTrainer.name} ein:
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-widest px-3.5 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-black focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-black text-center">{error}</p>
            )}
            <div className="flex items-center justify-between pt-2">
              {onSetNewPin && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setIsSettingMode(true);
                  }}
                  className="text-xs text-amber-600 hover:underline font-bold flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  PIN ändern
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5"
              >
                <span>Entsperren</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
