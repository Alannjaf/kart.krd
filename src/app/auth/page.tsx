'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
