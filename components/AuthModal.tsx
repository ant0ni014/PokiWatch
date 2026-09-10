import React, { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void; // receives supabase user object
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const client = getSupabaseClient();
    if (!client) {
      setError('Supabase client not available');
      setLoading(false);
      return;
    }
    try {
      let result;
      if (isRegister) {
        result = await client.auth.signUp({ email, password });
      } else {
        result = await client.auth.signInWithPassword({ email, password });
      }
      if (result.error) {
        setError(result.error.message);
      } else if (result.data?.user) {
        onLoginSuccess(result.data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-lg font-bold">{isRegister ? 'Registrieren' : 'Login'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">E‑Mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Passwort</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500" />
          </div>
          {error && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-rose-600" /> {error}
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-xs text-emerald-600 hover:underline">
              {isRegister ? 'Bereits ein Konto? Login' : 'Neues Konto erstellen'}
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegister ? 'Registrieren' : 'Login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
