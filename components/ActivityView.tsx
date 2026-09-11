"use client";

import React, { useMemo } from "react";
import { WatchStateMap, TrainerProfile } from "@/types";
import { Calendar, Flame, TrendingUp, Award, Clock } from "lucide-react";

interface ActivityViewProps {
  watchState: WatchStateMap;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  watchState,
  profiles
}) => {
  // Calculate 14-day history and stats
  const { trainer1Count, trainer2Count, sharedCount, daysList, topDay } = useMemo(() => {
    let t1 = 0;
    let t2 = 0;
    let shared = 0;
    const dayMap: Record<string, { t1: number; t2: number }> = {};

    const weekdayNames = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
    const fullDays: {
      dateStr: string;
      weekday: string;
      dayNum: number;
      monthStr: string;
      t1: number;
      t2: number;
      total: number;
    }[] = [];

    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
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

    let maxEpisodesInOneDay = 0;
    let bestDayStr = "";

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const t1Val = dayMap[key]?.t1 || 0;
      const t2Val = dayMap[key]?.t2 || 0;
      const total = t1Val + t2Val;

      if (total > maxEpisodesInOneDay) {
        maxEpisodesInOneDay = total;
        bestDayStr = key;
      }

      fullDays.push({
        dateStr: key,
        weekday: weekdayNames[d.getDay()],
        dayNum: d.getDate(),
        monthStr: d.toLocaleDateString("de-DE", { month: "short" }),
        t1: t1Val,
        t2: t2Val,
        total
      });
    }

    return {
      trainer1Count: t1,
      trainer2Count: t2,
      sharedCount: shared,
      daysList: fullDays,
      topDay: { count: maxEpisodesInOneDay, date: bestDayStr }
    };
  }, [watchState]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 sm:p-7 shadow-xl border-4 border-indigo-900">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-black uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Aktivitäts-Zentrale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Watch-Aktivität der Trainer
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-xl">
              Hier seht ihr tagesaktuell, wer wann wie viele Folgen geschaut hat – synchronisiert in der Cloud.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2.5 bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">Gemeinsam</span>
              <p className="text-xl font-black text-emerald-400">{sharedCount}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">{profiles.trainer_1.name}</span>
              <p className="text-xl font-black text-amber-300">{trainer1Count}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">{profiles.trainer_2.name}</span>
              <p className="text-xl font-black text-orange-400">{trainer2Count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 14 Days Activity Calendar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Verlauf der letzten 14 Tage</h3>
              <p className="text-[11px] text-slate-500 font-semibold">Täglich geschaute Folgen beider Trainer</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {profiles.trainer_1.name}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              {profiles.trainer_2.name}
            </span>
          </div>
        </div>

        {/* 14 Day Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {daysList.map((day, idx) => {
            const hasActivity = day.t1 > 0 || day.t2 > 0;
            const isToday = idx === daysList.length - 1;

            return (
              <div
                key={day.dateStr}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[95px] transition ${
                  isToday
                    ? "border-indigo-500 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20"
                    : hasActivity
                    ? "bg-slate-50 border-slate-200 hover:border-slate-300"
                    : "bg-white border-slate-100 opacity-60"
                }`}
              >
                <div className="text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                    {day.weekday}
                  </span>
                  <span className="text-xs font-black text-slate-800 block leading-tight">
                    {day.dayNum}
                  </span>
                </div>

                {/* Badges for episodes watched */}
                <div className="w-full space-y-1 my-1">
                  {day.t1 > 0 && (
                    <div className="w-full py-0.5 px-1 rounded-md bg-amber-400/90 text-slate-950 font-black text-[9px] text-center shadow-xs">
                      +{day.t1}
                    </div>
                  )}
                  {day.t2 > 0 && (
                    <div className="w-full py-0.5 px-1 rounded-md bg-orange-500 text-white font-black text-[9px] text-center shadow-xs">
                      +{day.t2}
                    </div>
                  )}
                  {!hasActivity && (
                    <span className="text-[10px] text-slate-300 block text-center">-</span>
                  )}
                </div>

                <span className="text-[8px] font-bold text-slate-400">{isToday ? "Heute" : day.monthStr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Trainer 1 Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0">
            {profiles.trainer_1.image ? (
              <img src={profiles.trainer_1.image} alt={profiles.trainer_1.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-amber-100">
                {profiles.trainer_1.avatar}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Trainer 1</span>
            <h4 className="text-base font-black text-slate-900">{profiles.trainer_1.name}</h4>
            <p className="text-xs text-slate-600 font-bold">
              Insgesamt <strong className="text-slate-900">{trainer1Count}</strong> Folgen geschaut
            </p>
          </div>
        </div>

        {/* Trainer 2 Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-400 shadow-md flex-shrink-0">
            {profiles.trainer_2.image ? (
              <img src={profiles.trainer_2.image} alt={profiles.trainer_2.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-100">
                {profiles.trainer_2.avatar}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Trainer 2</span>
            <h4 className="text-base font-black text-slate-900">{profiles.trainer_2.name}</h4>
            <p className="text-xs text-slate-600 font-bold">
              Insgesamt <strong className="text-slate-900">{trainer2Count}</strong> Folgen geschaut
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
