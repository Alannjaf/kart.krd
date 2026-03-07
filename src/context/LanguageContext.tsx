'use client';

import { createContext, useContext, useEffect, useCallback, useMemo, useSyncExternalStore, ReactNode } from 'react';
import { type Locale, type Direction, type TranslationKey, translations, getDirection } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  dir: Direction;
  t: (key: TranslationKey) => string;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = 'kart-krd-locale';
const VALID_LOCALES: Locale[] = ['ku', 'ar', 'en'];

// External store for locale — initialized from localStorage on module load (client only)
let currentLocale: Locale = 'ku';
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LOCALES.includes(stored as Locale)) {
      currentLocale = stored as Locale;
    }
  } catch {}
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => { listeners.delete(callback); };
}

function getSnapshot() { return currentLocale; }
function getServerSnapshot(): Locale { return 'ku'; }

function setLocaleStore(newLocale: Locale) {
  currentLocale = newLocale;
  try { localStorage.setItem(STORAGE_KEY, newLocale); } catch {}
  document.documentElement.lang = newLocale;
  document.documentElement.dir = getDirection(newLocale);
  listeners.forEach(l => l());
}

// Mounted detection — false on server, true on client
const noopSubscribe = () => () => {};
const returnTrue = () => true;
const returnFalse = () => false;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(noopSubscribe, returnTrue, returnFalse);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleStore(newLocale);
  }, []);

  // Sync html attributes when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] ?? key;
  }, [locale]);

  const dir = getDirection(locale);

  const value = useMemo(() => ({ locale, dir, t, setLocale }), [locale, dir, t, setLocale]);

  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
