"use client";

import React, { useState } from "react";
import { TrainerProfile, TrainerId, WatchStateMap } from "@/types";
import { X, Check, User } from "lucide-react";

interface ProfileEditModalProps {
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  watchState?: WatchStateMap;
  onSelectActiveTrainer: (id: TrainerId) => void;
  onSaveProfiles: (updated: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }) => void;
  onClose: () => void;
}

const AVAILABLE_AVATARS = ["🔴", "💧", "🔵", "⭐", "⚡", "🔥", "🌿", "🎒", "🧢", "🏆", "🥚", "✨"];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profiles,
  activeTrainerId,
  watchState = {},
  onSelectActiveTrainer,
  onSaveProfiles,
  onClose
}) => {
  const [trainer1Name, setTrainer1Name] = useState(profiles.trainer_1.name);
  const [trainer1Avatar, setTrainer1Avatar] = useState(profiles.trainer_1.avatar);

  const [trainer2Name, setTrainer2Name] = useState(profiles.trainer_2.name);
  const [trainer2Avatar, setTrainer2Avatar] = useState(profiles.trainer_2.avatar);

  const [trainer1Pin, setTrainer1Pin] = useState(profiles.trainer_1.customPin || "");
  const [trainer2Pin, setTrainer2Pin] = useState(profiles.trainer_2.customPin || "");

  const handleSave = () => {
    onSaveProfiles({
      trainer_1: {
        ...profiles.trainer_1,
        name: trainer1Name.trim() || "Trainer 1",
        avatar: trainer1Avatar,
        customPin: trainer1Pin.trim() || undefined
      },
      trainer_2: {
        ...profiles.trainer_2,
        name: trainer2Name.trim() || "Trainer 2",
        avatar: trainer2Avatar,
        customPin: trainer2Pin.trim() || undefined
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (Sticky at top) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-slate-900">
              Trainer-Profile anpassen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">

        {/* Switch Device Trainer (Ash <-> Misty) */}
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
              Aktiver Trainer auf diesem Gerät:
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Klicke zum Wechseln</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectActiveTrainer("trainer_1")}
              className={`flex items-center gap-2 p-2 rounded-xl border-2 font-black text-xs transition ${
                activeTrainerId === "trainer_1"
                  ? "bg-amber-100 border-amber-500 text-amber-950 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{trainer1Avatar}</span>
              <span className="truncate">{trainer1Name}</span>
              {activeTrainerId === "trainer_1" && <Check className="w-3.5 h-3.5 ml-auto text-amber-700 flex-shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectActiveTrainer("trainer_2")}
              className={`flex items-center gap-2 p-2 rounded-xl border-2 font-black text-xs transition ${
                activeTrainerId === "trainer_2"
                  ? "bg-orange-100 border-orange-500 text-orange-950 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{trainer2Avatar}</span>
              <span className="truncate">{trainer2Name}</span>
              {activeTrainerId === "trainer_2" && <Check className="w-3.5 h-3.5 ml-auto text-orange-700 flex-shrink-0" />}
            </button>
          </div>
        </div>

        {/* Active Trainer's Profile Edit Form */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
              activeTrainerId === "trainer_1" ? "bg-amber-500" : "bg-orange-500"
            }`}>
              {activeTrainerId === "trainer_1" ? "Trainer 1" : "Trainer 2"}
            </span>
            <span className="text-xs font-black text-slate-800">
              Profil bearbeiten ({activeTrainerId === "trainer_1" ? trainer1Name : trainer2Name})
            </span>
          </div>

          {activeTrainerId === "trainer_1" ? (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Trainer-Name
                </label>
                <input
                  type="text"
                  value={trainer1Name}
                  onChange={(e) => setTrainer1Name(e.target.value)}
                  placeholder="Name z.B. Ash"
                  style={{ fontSize: "16px" }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 text-base text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  PIN-Schutz (optional)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={trainer1Pin}
                  onChange={(e) => setTrainer1Pin(e.target.value)}
                  placeholder="z. B. 1234 (leer = kein PIN)"
                  style={{ fontSize: "16px" }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 text-base font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Wähle dein Trainer-Icon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setTrainer1Avatar(av)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition ${
                        trainer1Avatar === av
                          ? "bg-amber-300 border-amber-500 scale-110 shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Trainer-Name
                </label>
                <input
                  type="text"
                  value={trainer2Name}
                  onChange={(e) => setTrainer2Name(e.target.value)}
                  placeholder="Name z.B. Misty"
                  style={{ fontSize: "16px" }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 text-base text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  PIN-Schutz (optional)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={trainer2Pin}
                  onChange={(e) => setTrainer2Pin(e.target.value)}
                  placeholder="z. B. 5678 (leer = kein PIN)"
                  style={{ fontSize: "16px" }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 text-base font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Wähle dein Trainer-Icon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setTrainer2Avatar(av)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition ${
                        trainer2Avatar === av
                          ? "bg-orange-300 border-orange-500 scale-110 shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        </div>

        {/* Footer Buttons (Sticky at bottom) */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 bg-white sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition"
          >
            Speichern
          </button>
        </div>

      </div>
    </div>
  );
};
