import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let currentKey = '';

export function getSupabaseCredentials(): { url: string; anonKey: string } | null {
  if (typeof window === 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (envUrl && envKey) return { url: envUrl, anonKey: envKey };
    return null;
  }

  // Check localStorage first
  const customUrl = localStorage.getItem('pokiwatch_supabase_url');
  const customKey = localStorage.getItem('pokiwatch_supabase_key');
  if (customUrl && customKey) {
    return { url: customUrl, anonKey: customKey };
  }

  // Fallback to env vars
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  return null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds || !creds.url || !creds.anonKey) {
    return null;
  }

  const keySignature = `${creds.url}_${creds.anonKey}`;
  if (cachedClient && currentKey === keySignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } }
    });
    currentKey = keySignature;
    return cachedClient;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    return null;
  }
}
