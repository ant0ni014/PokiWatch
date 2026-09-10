-- Supabase schema for PokiWatch (User-specific state)

CREATE TABLE IF NOT EXISTS public.pokiwatch_user_state (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    watch_state jsonb NOT NULL DEFAULT '{}'::jsonb,
    profiles jsonb,
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pokiwatch_user_state ENABLE ROW LEVEL SECURITY;

-- Allow each user to SELECT, INSERT, UPDATE only their own row
CREATE POLICY "Allow user own access" ON public.pokiwatch_user_state
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user own insert" ON public.pokiwatch_user_state
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user own update" ON public.pokiwatch_user_state
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grant usage to authenticated and anon roles (optional)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.pokiwatch_user_state TO anon, authenticated;
