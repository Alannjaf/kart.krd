'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth/client';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result =
        mode === 'signin'
          ? await signIn(email, password)
          : await signUp(email, password, name || undefined);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/editor');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({ provider: 'google' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'هەڵەیەک ڕوویدا');
      setGoogleLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center px-4"
      dir="rtl"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-lg">K</span>
            </div>
            <span
              className="text-white font-bold text-2xl"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              kart.krd
            </span>
          </Link>
          <p
            className="text-purple-300 mt-2 text-sm"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            {mode === 'signin' ? 'بەخێربێی بۆ حسابەکەت' : 'دروستکردنی حسابی نوێ'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Mode toggle */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              چوونەژوورەوە
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              تۆمارکردن
            </button>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200 mb-4"
            dir="ltr"
          >
            {googleLoading ? (
              <svg className="animate-spin w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>یان</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label
                  className="block text-white/80 text-sm font-medium mb-1"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  ناوی تەواو
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ناوی تەواوت بنووسە"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                />
              </div>
            )}

            <div>
              <label
                className="block text-white/80 text-sm font-medium mb-1"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                ئیمەیل
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ئیمەیلەکەت بنووسە"
                required
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all text-right"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              />
            </div>

            <div>
              <label
                className="block text-white/80 text-sm font-medium mb-1"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                وشەی نهێنی
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="وشەی نهێنیت بنووسە"
                required
                minLength={8}
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all"
              />
            </div>

            {error && (
              <div
                className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-200 text-sm"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/20 mt-2"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              {loading
                ? 'چاوەڕێبکە...'
                : mode === 'signin'
                ? 'چوونەژوورەوە'
                : 'دروستکردنی حساب'}
            </button>
          </form>

          <p
            className="text-center text-white/50 text-xs mt-6"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            بە چوونەژوورەوە، ڕازیبوون بە{' '}
            <span className="text-yellow-400/70">مەرج و مەرجەکانمان</span>
            {' '}ئەكەیت
          </p>
        </div>
      </div>
    </div>
  );
}
