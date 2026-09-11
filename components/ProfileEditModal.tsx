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

  // Compute stats and activity history
  const { trainer1Count, trainer2Count, sharedCount, recentDays } = React.useMemo(() => {
    let t1 = 0;
    let t2 = 0;
    let shared = 0;
    const dayMap: Record<string, { t1: number; t2: number }> = {};

    // Get last 7 days keys
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push(key);
      dayMap[key] = { t1: 0, t2: 0 };
    }

    Object.values(watchState).forEach((rec) => {
      if (rec.trainer_1) t1++;
      if (rec.trainer_2) t2++;
      if (rec.trainer_1 && rec.trainer_2) shared++;

      if (rec.watchedAt_1) {
        const dStr = rec.watchedAt_1.split("T")[0];
        if (dayMap[dStr]) dayMap[dStr].t1++;
      }
      if (rec.watchedAt_2) {
        const dStr = rec.watchedAt_2.split("T")[0];
        if (dayMap[dStr]) dayMap[dStr].t2++;
      }
    });

    const recentDaysFormatted = days.map((dateStr) => {
      const d = new Date(dateStr + "T00:00:00");
      const weekday = d.toLocaleDateString("de-DE", { weekday: "short" });
      const dayNum = d.getDate();
      return {
        dateStr,
        weekday,
        dayNum,
        t1: dayMap[dateStr]?.t1 || 0,
        t2: dayMap[dateStr]?.t2 || 0
      };
    });

    return { trainer1Count: t1, trainer2Count: t2, sharedCount: shared, recentDays: recentDaysFormatted };
  }, [watchState]);

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
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-bold">PIN-Schutz (optional):</span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={trainer1Pin}
              onChange={(e) => setTrainer1Pin(e.target.value)}
              placeholder="z. B. 1234 (leer = kein PIN)"
              className="w-44 px-2.5 py-1.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
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
            placeholder="Name z.B. Misty"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-bold">PIN-Schutz (optional):</span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={trainer2Pin}
              onChange={(e) => setTrainer2Pin(e.target.value)}
              placeholder="z. B. 5678 (leer = kein PIN)"
              className="w-44 px-2.5 py-1.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold focus:outline-none focus:border-blue-500"
            />
          </div>
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

        {/* Watch-Aktivität & Kalender (Verlauf) */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>📅</span> Letzte 7 Tage Watch-Aktivität
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Gemeinsam: <strong className="text-emerald-600">{sharedCount}</strong> Folgen
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {recentDays.map((day) => {
              const hasActivity = day.t1 > 0 || day.t2 > 0;
              return (
                <div
                  key={day.dateStr}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[58px] transition ${
                    hasActivity
                      ? "bg-amber-50 border-amber-300 shadow-xs"
                      : "bg-white border-slate-200 opacity-60"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{day.weekday}</span>
                  <span className="text-xs font-black text-slate-800">{day.dayNum}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {day.t1 > 0 && (
                      <span className="text-[9px] font-black text-amber-700 bg-amber-200/80 px-1 rounded">
                        +{day.t1}
                      </span>
                    )}
                    {day.t2 > 0 && (
                      <span className="text-[9px] font-black text-blue-700 bg-blue-200/80 px-1 rounded">
                        +{day.t2}
                      </span>
                    )}
                    {!hasActivity && <span className="text-[10px] text-slate-300">-</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
            <span>{profiles.trainer_1.name}: <strong className="text-slate-800">{trainer1Count} gesamt</strong></span>
            <span>{profiles.trainer_2.name}: <strong className="text-slate-800">{trainer2Count} gesamt</strong></span>
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
