"use client";

import React, { useState, useMemo } from "react";
import { WatchStateMap, TrainerProfile } from "@/types";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Film,
  Sparkles
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

  // Default selected day to today
  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });

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
  }, [viewDate, dayMap, todayStr]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setViewDate(new Date());
    setSelectedDayKey(todayStr);
  };

  // Selected day details
  const selectedDayData = dayMap[selectedDayKey] || {
    t1: 0,
    t2: 0,
    t1Episodes: [],
    t2Episodes: []
  };

  const selectedDayDateObj = useMemo(() => {
    if (!selectedDayKey) return new Date();
    return new Date(selectedDayKey + "T00:00:00");
  }, [selectedDayKey]);

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
                Klicke auf einen Tag, um die Aktivität einzusehen
              </p>
            </div>
          </div>

          {/* Controls: Prev, Today, Next */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!monthGrid.isCurrentMonthView && (
              <button
                onClick={handleToday}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                title="Zum heutigen Tag springen"
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

              <span className="px-3 text-xs font-black text-slate-700 min-w-[95px] text-center capitalize">
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
            Gesamt im <strong className="text-slate-800 capitalize">{monthGrid.monthName}</strong>:
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
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center border-b border-slate-100 pb-2">
          {["MO", "DI", "MI", "DO", "FR", "SA", "SO"].map((dayName) => (
            <div
              key={dayName}
              className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* 7-Column Month Grid - EVERY day is clickable! */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {monthGrid.cells.map((cell) => {
            const hasActivity = cell.data.t1 > 0 || cell.data.t2 > 0;
            const isSelected = selectedDayKey === cell.dateStr;

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDayKey(cell.dateStr)}
                className={`p-1.5 sm:p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between min-h-[76px] sm:min-h-[88px] transition text-left relative cursor-pointer active:scale-95 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30 shadow-sm"
                    : cell.isToday
                    ? "border-indigo-400/80 bg-indigo-50/30"
                    : !cell.isCurrentMonth
                    ? "bg-slate-50/40 border-slate-100 opacity-40 hover:opacity-75"
                    : hasActivity
                    ? "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                {/* Top Row: Day Number & Today indicator */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      isSelected
                        ? "text-indigo-900"
                        : cell.isToday
                        ? "text-indigo-600"
                        : cell.isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                  {cell.isToday && (
                    <span className="text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
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
                  {!hasActivity && (
                    <span className="text-[9px] text-slate-300 block text-center">-</span>
                  )}
                </div>

                {/* Subtle active indicator dot */}
                <div className="w-full flex justify-center">
                  {isSelected ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  ) : hasActivity ? (
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                  ) : (
                    <span className="w-1 h-1 opacity-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Detail Box (Always shows stats for the clicked day) */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-indigo-200/80 text-slate-800 space-y-3.5 animate-in fade-in duration-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Tagesaktivität
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {selectedDayDateObj.toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                  {selectedDayKey === todayStr && (
                    <span className="ml-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-100 px-2 py-0.5 rounded-full">
                      Heute
                    </span>
                  )}
                </h4>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Gesamt an diesem Tag:{" "}
              <strong className="text-slate-900 text-sm">
                {selectedDayData.t1 + selectedDayData.t2}
              </strong>{" "}
              {selectedDayData.t1 + selectedDayData.t2 === 1 ? "Folge" : "Folgen"}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Trainer 1 detail card */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-800">
                <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-sm">{profiles.trainer_1.name}</span>
                <span className="ml-auto px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-xs">
                  {selectedDayData.t1} {selectedDayData.t1 === 1 ? "Folge" : "Folgen"}
                </span>
              </div>
              {selectedDayData.t1Episodes.length > 0 ? (
                <div className="pt-1 text-slate-600">
                  <span className="font-semibold text-[11px] text-slate-400 block mb-0.5">
                    Geschaut:
                  </span>
                  <p className="font-bold text-slate-800 leading-relaxed">
                    Folge #{selectedDayData.t1Episodes.join(", #")}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic pt-1 text-[11px]">
                  Keine Folgen an diesem Tag geschaut
                </p>
              )}
            </div>

            {/* Trainer 2 detail card */}
            <div className="p-3.5 bg-white rounded-xl border border-orange-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-orange-800">
                <span className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                <span className="text-sm">{profiles.trainer_2.name}</span>
                <span className="ml-auto px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900 font-black text-xs">
                  {selectedDayData.t2} {selectedDayData.t2 === 1 ? "Folge" : "Folgen"}
                </span>
              </div>
              {selectedDayData.t2Episodes.length > 0 ? (
                <div className="pt-1 text-slate-600">
                  <span className="font-semibold text-[11px] text-slate-400 block mb-0.5">
                    Geschaut:
                  </span>
                  <p className="font-bold text-slate-800 leading-relaxed">
                    Folge #{selectedDayData.t2Episodes.join(", #")}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic pt-1 text-[11px]">
                  Keine Folgen an diesem Tag geschaut
                </p>
              )}
            </div>
          </div>

          {selectedDayData.t1 === 0 && selectedDayData.t2 === 0 && (
            <p className="text-center text-[11px] text-slate-400 font-medium pt-1">
              Tipp: Klicke auf andere Tage im Kalender (z.B. mit Farbabzeichen), um deren Verlauf zu sehen.
            </p>
          )}
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

