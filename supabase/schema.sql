-- ==============================================================================
-- PokiWatch: Supabase Schema
-- Führe dieses SQL-Skript einfach im "SQL Editor" deines Supabase-Projekts aus.
-- ==============================================================================

-- 1. Tabelle für den synchronisierten Zustand (Watch-Status & Profile)
CREATE TABLE IF NOT EXISTS public.pokiwatch_state (
    id TEXT PRIMARY KEY DEFAULT 'global_state',
    profiles JSONB NOT NULL DEFAULT '{
        "trainer_1": {"id": "trainer_1", "name": "Ash", "avatar": "pikachu", "accentColor": "#ef4444"},
        "trainer_2": {"id": "trainer_2", "name": "Gary", "avatar": "charizard", "accentColor": "#3b82f6"}
    }'::jsonb,
    watch_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Initialen Eintrag erzeugen (falls noch nicht vorhanden)
INSERT INTO public.pokiwatch_state (id, watch_state)
VALUES ('global_state', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS) aktivieren & Lese-/Schreibzugriff für Anon erlauben
ALTER TABLE public.pokiwatch_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read & write to pokiwatch_state" ON public.pokiwatch_state;
CREATE POLICY "Allow anon read & write to pokiwatch_state"
    ON public.pokiwatch_state
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Realtime aktivieren (damit Änderungen sofort auf beiden Handys/PCs aufpoppen!)
ALTER PUBLICATION supabase_realtime ADD TABLE public.pokiwatch_state;
