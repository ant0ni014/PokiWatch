"use client";

import React, { useState, useMemo } from "react";
import { WatchStateMap, TrainerProfile } from "@/types";
import {
  Calendar as CalendarIcon,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Film,
  X
} from "lucide-react";

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
  // Navigation state for the Monthly Calendar
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Aggregate watch data from watchState into day-indexed entries
  const { dayMap, trainer1Total, trainer2Total, sharedTotal } = useMemo(() => {
    let t1 = 0;
    let t2 = 0;
    let shared = 0;
    const map: Record<
      string,
      { t1: number; t2: number; t1Episodes: number[]; t2Episodes: number[] }
    > = {};

    Object.entries(watchState).forEach(([epIdStr, rec]) => {
      const epId = Number(epIdStr);
      if (rec.trainer_1) t1++;
      if (rec.trainer_2) t2++;
      if (rec.trainer_1 && rec.trainer_2) shared++;

      if (rec.watchedAt_1) {
        const dStr = rec.watchedAt_1.split("T")[0];
        if (!map[dStr]) map[dStr] = { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] };
        map[dStr].t1++;
        map[dStr].t1Episodes.push(epId);
      }
      if (rec.watchedAt_2) {
        const dStr = rec.watchedAt_2.split("T")[0];
        if (!map[dStr]) map[dStr] = { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] };
        map[dStr].t2++;
        map[dStr].t2Episodes.push(epId);
      }
    });

    // Sort episode numbers in ascending order for each day
    Object.values(map).forEach((entry) => {
      entry.t1Episodes.sort((a, b) => a - b);
      entry.t2Episodes.sort((a, b) => a - b);
    });

    return {
      dayMap: map,
      trainer1Total: t1,
      trainer2Total: t2,
      sharedTotal: shared
    };
  }, [watchState]);

  // Last 14 days quick overview
  const daysList14 = useMemo(() => {
    const weekdayNames = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
    const list = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const data = dayMap[key] || { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] };
      list.push({
        dateStr: key,
        weekday: weekdayNames[d.getDay()],
        dayNum: d.getDate(),
        monthStr: d.toLocaleDateString("de-DE", { month: "short" }),
        t1: data.t1,
        t2: data.t2,
        total: data.t1 + data.t2
      });
    }
    return list;
  }, [dayMap]);

  // Calendar month grid calculation
  const monthGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    // German week starts on Monday: Mo=0, Di=1, ..., So=6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday?: boolean;
      data: { t1: number; t2: number; t1Episodes: number[]; t2Episodes: number[] };
    }[] = [];

    // Previous month padding cells
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const prevYear = prevDate.getFullYear();
      const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, "0");
      const prevDayStr = String(dayNum).padStart(2, "0");
      const dateStr = `${prevYear}-${prevMonthStr}-${prevDayStr}`;
      cells.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        data: dayMap[dateStr] || { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] }
      });
    }

    // Current month cells
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    let monthT1 = 0;
    let monthT2 = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const data = dayMap[dateStr] || { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] };
      monthT1 += data.t1;
      monthT2 += data.t2;

      cells.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        data
      });
    }

    // Next month padding cells to complete 7-column grid
    const totalCells = cells.length;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const nextYear = nextDate.getFullYear();
      const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, "0");
      const nextDayStr = String(d).padStart(2, "0");
      const dateStr = `${nextYear}-${nextMonthStr}-${nextDayStr}`;
      cells.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        data: dayMap[dateStr] || { t1: 0, t2: 0, t1Episodes: [], t2Episodes: [] }
      });
    }

    const monthName = viewDate.toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric"
    });

    const isCurrentMonthView =
      viewDate.getFullYear() === now.getFullYear() &&
      viewDate.getMonth() === now.getMonth();

    return {
      cells,
      monthName,
      monthT1,
      monthT2,
      isCurrentMonthView
    };
  }, [viewDate, dayMap]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setViewDate(new Date());
  };

  // Selected day details
  const selectedDayData = selectedDayKey ? dayMap[selectedDayKey] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 sm:p-7 shadow-xl border-4 border-indigo-900">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-black uppercase tracking-wider">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Aktivitäts-Zentrale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Watch-Aktivität der Trainer
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-xl">
              Hier seht ihr tagesaktuell und monatsweise, wer wann wie viele Folgen geschaut hat – synchronisiert in der Cloud.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2.5 bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">
                Gemeinsam
              </span>
              <p className="text-xl font-black text-emerald-400">{sharedTotal}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">
                {profiles.trainer_1.name}
              </span>
              <p className="text-xl font-black text-amber-300">{trainer1Total}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] text-indigo-200 uppercase font-black">
                {profiles.trainer_2.name}
              </span>
              <p className="text-xl font-black text-orange-400">{trainer2Total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Monatskalender */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Calendar Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 capitalize">
                {monthGrid.monthName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Monatsübersicht & Historie
              </p>
            </div>
          </div>

          {/* Controls: Prev, Today, Next */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!monthGrid.isCurrentMonthView && (
              <button
                onClick={handleToday}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                title="Zum aktuellen Monat springen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Heute</span>
              </button>
            )}

            <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-white hover:shadow-xs text-slate-700 transition active:scale-95 cursor-pointer"
                title="Vorheriger Monat"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 text-xs font-black text-slate-700 min-w-[90px] text-center capitalize">
                {viewDate.toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
              </span>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-white hover:shadow-xs text-slate-700 transition active:scale-95 cursor-pointer"
                title="Nächster Monat"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Activity Summary Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs font-bold">
          <span className="text-slate-500">
            Aktivität im <strong className="text-slate-800 capitalize">{monthGrid.monthName}</strong>:
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {profiles.trainer_1.name}: <strong className="text-amber-600">{monthGrid.monthT1}</strong> Folgen
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              {profiles.trainer_2.name}: <strong className="text-orange-600">{monthGrid.monthT2}</strong> Folgen
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center border-b border-slate-100 pb-2">
          {["MO", "DI", "MI", "DO", "FR", "SA", "SO"].map((dayName) => (
            <div
              key={dayName}
              className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* 7-Column Month Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthGrid.cells.map((cell) => {
            const hasActivity = cell.data.t1 > 0 || cell.data.t2 > 0;
            const isSelected = selectedDayKey === cell.dateStr;

            return (
              <button
                key={cell.dateStr}
                onClick={() => {
                  if (hasActivity) {
                    setSelectedDayKey((prev) => (prev === cell.dateStr ? null : cell.dateStr));
                  }
                }}
                disabled={!hasActivity}
                className={`p-1.5 sm:p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[75px] sm:min-h-[90px] transition text-left relative ${
                  !cell.isCurrentMonth
                    ? "bg-slate-50/50 border-slate-100 opacity-40"
                    : cell.isToday
                    ? "border-indigo-500 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20"
                    : isSelected
                    ? "border-purple-600 bg-purple-50 ring-2 ring-purple-500/20"
                    : hasActivity
                    ? "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer"
                    : "bg-white border-slate-100 text-slate-400 opacity-70"
                }`}
              >
                {/* Top Row: Day Number & Today indicator */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      cell.isToday
                        ? "text-indigo-600"
                        : cell.isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                  {cell.isToday && (
                    <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                      Heute
                    </span>
                  )}
                </div>

                {/* Activity Badges */}
                <div className="w-full space-y-1 my-1">
                  {cell.data.t1 > 0 && (
                    <div className="w-full py-0.5 px-1 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] text-center shadow-2xs truncate">
                      +{cell.data.t1}
                    </div>
                  )}
                  {cell.data.t2 > 0 && (
                    <div className="w-full py-0.5 px-1 rounded-md bg-orange-500 text-white font-black text-[9px] sm:text-[10px] text-center shadow-2xs truncate">
                      +{cell.data.t2}
                    </div>
                  )}
                  {!hasActivity && cell.isCurrentMonth && (
                    <span className="text-[9px] text-slate-300 block text-center">-</span>
                  )}
                </div>

                {/* Bottom hint for clickable days */}
                {hasActivity && (
                  <span className="text-[8px] font-semibold text-indigo-500 hidden sm:block">
                    Details
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Detail Card */}
        {selectedDayKey && selectedDayData && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/90 border-2 border-indigo-200 text-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-black text-indigo-950">
                  Aktivität am{" "}
                  {new Date(selectedDayKey + "T00:00:00").toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDayKey(null)}
                className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Trainer 1 detail */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>{profiles.trainer_1.name}</span>
                  <span className="ml-auto text-amber-600 font-bold">
                    {selectedDayData.t1} {selectedDayData.t1 === 1 ? "Folge" : "Folgen"}
                  </span>
                </div>
                {selectedDayData.t1Episodes.length > 0 ? (
                  <p className="text-slate-600 font-medium pt-1">
                    Folgen: <strong className="text-slate-900">#{selectedDayData.t1Episodes.join(", #")}</strong>
                  </p>
                ) : (
                  <p className="text-slate-400 italic pt-1">Keine Folgen an diesem Tag</p>
                )}
              </div>

              {/* Trainer 2 detail */}
              <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-orange-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>{profiles.trainer_2.name}</span>
                  <span className="ml-auto text-orange-600 font-bold">
                    {selectedDayData.t2} {selectedDayData.t2 === 1 ? "Folge" : "Folgen"}
                  </span>
                </div>
                {selectedDayData.t2Episodes.length > 0 ? (
                  <p className="text-slate-600 font-medium pt-1">
                    Folgen: <strong className="text-slate-900">#{selectedDayData.t2Episodes.join(", #")}</strong>
                  </p>
                ) : (
                  <p className="text-slate-400 italic pt-1">Keine Folgen an diesem Tag</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 14 Days Quick Glance Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Verlauf der letzten 14 Tage</h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Kompakte Ansicht der jüngsten Folgen
              </p>
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
          {daysList14.map((day, idx) => {
            const hasActivity = day.t1 > 0 || day.t2 > 0;
            const isToday = idx === daysList14.length - 1;

            return (
              <div
                key={day.dateStr}
                className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[90px] transition ${
                  isToday
                    ? "border-indigo-500 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20"
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
                    <div className="w-full py-0.5 px-1 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] text-center shadow-2xs">
                      +{day.t1}
                    </div>
                  )}
                  {day.t2 > 0 && (
                    <div className="w-full py-0.5 px-1 rounded-md bg-orange-500 text-white font-black text-[9px] text-center shadow-2xs">
                      +{day.t2}
                    </div>
                  )}
                  {!hasActivity && (
                    <span className="text-[10px] text-slate-300 block text-center">-</span>
                  )}
                </div>

                <span className="text-[8px] font-bold text-slate-400">
                  {isToday ? "Heute" : day.monthStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trainer Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Trainer 1 Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0">
            {profiles.trainer_1.image ? (
              <img
                src={profiles.trainer_1.image}
                alt={profiles.trainer_1.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-amber-100">
                {profiles.trainer_1.avatar}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
              Trainer 1
            </span>
            <h4 className="text-base font-black text-slate-900">{profiles.trainer_1.name}</h4>
            <p className="text-xs text-slate-600 font-bold">
              Insgesamt <strong className="text-slate-900">{trainer1Total}</strong> Folgen geschaut
            </p>
          </div>
        </div>

        {/* Trainer 2 Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-400 shadow-md flex-shrink-0">
            {profiles.trainer_2.image ? (
              <img
                src={profiles.trainer_2.image}
                alt={profiles.trainer_2.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-100">
                {profiles.trainer_2.avatar}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
              Trainer 2
            </span>
            <h4 className="text-base font-black text-slate-900">{profiles.trainer_2.name}</h4>
            <p className="text-xs text-slate-600 font-bold">
              Insgesamt <strong className="text-slate-900">{trainer2Total}</strong> Folgen geschaut
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

