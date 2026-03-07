'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

export default function CompactUserButton() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);

  const user = session?.user;
  const name = user?.name || '';
  const email = user?.email || '';
  const image = user?.image;

  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : email.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.replace('/');
        },
      },
    });
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] overflow-hidden"
        style={{
          backgroundColor: image ? 'transparent' : 'var(--color-accent)',
          color: 'white',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name || email}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] shadow-lg z-50"
          style={{
            [dir === 'rtl' ? 'left' : 'right']: 0,
            fontFamily,
          }}
          role="menu"
        >
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            {name && (
              <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                {name}
              </p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)] truncate" dir="ltr">
              {email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/account/settings"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              role="menuitem"
            >
              {t('auth.account')}
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-start px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-surface)] transition-colors"
              role="menuitem"
            >
              {t('auth.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
