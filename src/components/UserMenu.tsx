'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function UserMenu() {
  const { user, isPending, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-700 text-white hover:bg-purple-600 transition-colors"
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      >
        <span>👤</span>
        <span>چوونەژوورەوە</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-100"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-bold">
          {user.email[0].toUpperCase()}
        </div>
        <span
          className="text-sm text-gray-700 hidden sm:block max-w-[120px] truncate"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          {user.name || user.email}
        </span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p
                className="text-xs text-gray-500 mb-0.5"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                چوونەژوورەوە وەک
              </p>
              <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
            </div>
            <button
              onClick={async () => { setOpen(false); await signOut(); }}
              className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-right flex items-center gap-2"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              <span>🚪</span>
              <span>چوونەدەرەوە</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
