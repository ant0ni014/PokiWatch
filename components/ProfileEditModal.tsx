"use client";

import React, { useState } from "react";
import { TrainerProfile, TrainerId } from "@/types";
import { X, Check, User } from "lucide-react";

interface ProfileEditModalProps {
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  onSelectActiveTrainer: (id: TrainerId) => void;
  onSaveProfiles: (updated: { trainer_1: TrainerProfile; trainer_2: TrainerProfile }) => void;
  onClose: () => void;
}

const AVAILABLE_AVATARS = ["🔴", "💧", "🔵", "⭐", "⚡", "🔥", "🌿", "🎒", "🧢", "🏆", "🥚", "✨"];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profiles,
  activeTrainerId,
  onSelectActiveTrainer,
  onSaveProfiles,
  onClose
}) => {
  const [trainer1Name, setTrainer1Name] = useState(profiles.trainer_1.name);
  const [trainer1Avatar, setTrainer1Avatar] = useState(profiles.trainer_1.avatar);

  const [trainer2Name, setTrainer2Name] = useState(profiles.trainer_2.name);
  const [trainer2Avatar, setTrainer2Avatar] = useState(profiles.trainer_2.avatar);

  const handleSave = () => {
    onSaveProfiles({
      trainer_1: {
        ...profiles.trainer_1,
        name: trainer1Name.trim() || "Trainer 1",
        avatar: trainer1Avatar
      },
      trainer_2: {
        ...profiles.trainer_2,
        name: trainer2Name.trim() || "Trainer 2",
        avatar: trainer2Avatar
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Trainer-Profile anpassen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Who is watching on this device? */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-amber-900">
            Wer schaut auf diesem Gerät? (Dauerhaft gespeichert)
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onSelectActiveTrainer("trainer_1")}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition font-black text-sm ${
                activeTrainerId === "trainer_1"
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-500">
                {profiles.trainer_1.image ? (
                  <img src={profiles.trainer_1.image} alt={trainer1Name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{trainer1Avatar}</span>
                )}
              </div>
              <span className="truncate">{trainer1Name}</span>
              {activeTrainerId === "trainer_1" && <Check className="w-4 h-4 ml-auto text-slate-950 flex-shrink-0" />}
            </button>

            <button
              onClick={() => onSelectActiveTrainer("trainer_2")}
              className={`p-3 rounded-xl border-2 flex items-center gap-3 transition font-black text-sm ${
                activeTrainerId === "trainer_2"
                  ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-500">
                {profiles.trainer_2.image ? (
                  <img src={profiles.trainer_2.image} alt={trainer2Name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{trainer2Avatar}</span>
                )}
              </div>
              <span className="truncate">{trainer2Name}</span>
              {activeTrainerId === "trainer_2" && <Check className="w-4 h-4 ml-auto text-white flex-shrink-0" />}
            </button>
          </div>
        </div>

        {/* Edit Trainer 1 */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-amber-800">
            Profil 1 (Trainer 1)
          </label>
          <input
            type="text"
            value={trainer1Name}
            onChange={(e) => setTrainer1Name(e.target.value)}
            placeholder="Name z.B. Ash"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-500"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {AVAILABLE_AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setTrainer1Avatar(av)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition ${
                  trainer1Avatar === av
                    ? "bg-amber-300 border-amber-500 scale-110 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Edit Trainer 2 */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-blue-800">
            Profil 2 (Trainer 2)
          </label>
          <input
            type="text"
            value={trainer2Name}
            onChange={(e) => setTrainer2Name(e.target.value)}
            placeholder="Name z.B. Gary"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {AVAILABLE_AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setTrainer2Avatar(av)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition ${
                  trainer2Avatar === av
                    ? "bg-blue-200 border-blue-500 scale-110 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition"
          >
            Speichern
          </button>
        </div>

      </div>
    </div>
  );
};
