"use client";

import React, { useState, useEffect } from "react";
import { X, Database, Check, Copy, AlertCircle, RefreshCw } from "lucide-react";
import { getSupabaseCredentials } from "@/lib/supabaseClient";

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCredentials: (url: string, key: string) => Promise<boolean>;
  onClearCredentials: () => void;
  isConnected: boolean;
}

const SQL_SCHEMA_SAMPLE = `-- In Supabase SQL Editor ausführen:
CREATE TABLE IF NOT EXISTS public.pokiwatch_state (
    id TEXT PRIMARY KEY DEFAULT 'global_state',
    profiles JSONB NOT NULL DEFAULT '{"trainer_1": {"id": "trainer_1", "name": "Ash", "avatar": "⚡", "accentColor": "#ef4444"}, "trainer_2": {"id": "trainer_2", "name": "Gary", "avatar": "🔥", "accentColor": "#3b82f6"}}'::jsonb,
    watch_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO public.pokiwatch_state (id, watch_state) VALUES ('global_state', '{}'::jsonb) ON CONFLICT (id) DO NOTHING;
ALTER TABLE public.pokiwatch_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read & write" ON public.pokiwatch_state FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.pokiwatch_state;`;

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onSaveCredentials,
  onClearCredentials,
  isConnected
}) => {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      if (creds) {
        setUrl(creds.url);
        setKey(creds.anonKey);
      }
      setTestResult("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setTestResult("error");
      setErrorMessage("Bitte sowohl URL als auch Anon Key eingeben.");
      return;
    }

    setIsTesting(true);
    setTestResult("idle");
    setErrorMessage("");

    try {
      const ok = await onSaveCredentials(url.trim(), key.trim());
      if (ok) {
        setTestResult("success");
      } else {
        setTestResult("error");
        setErrorMessage("Verbindung fehlgeschlagen. Bitte prüfe URL, Anon Key und ob das SQL-Schema in Supabase angelegt wurde.");
      }
    } catch (err: any) {
      setTestResult("error");
      setErrorMessage(err?.message || "Unbekannter Verbindungsfehler");
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SAMPLE);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Supabase Live-Synchronisation
              </h2>
              <p className="text-xs text-slate-500">
                Echtzeit-Abgleich zwischen beiden Handys & PCs
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

        {/* Status */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <span className="font-bold text-slate-600">Verbindungsstatus:</span>
          {isConnected ? (
            <span className="flex items-center gap-1.5 font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Verbunden (Live-Sync aktiv)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Offline-Modus (Lokal im Browser)
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzabcdefg.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
              Supabase Anon / Public Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {testResult === "success" && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Erfolgreich verbunden und synchronisiert!</span>
            </div>
          )}

          {testResult === "error" && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {isConnected && (
              <button
                type="button"
                onClick={onClearCredentials}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 transition"
              >
                Trennen (Lokal speichern)
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Schließen
              </button>
              <button
                type="submit"
                disabled={isTesting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Prüfe...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Speichern</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* SQL Script */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Supabase SQL Editor Skript
            </span>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-slate-700 shadow-sm"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>SQL Kopieren</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Führe diesen Befehl einmal im SQL-Editor deines Supabase-Dashboards aus.
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto max-h-24">
            {SQL_SCHEMA_SAMPLE}
          </pre>
        </div>

      </div>
    </div>
  );
};
