'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { type Locale, type Direction, type TranslationKey, translations, getDirection } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  dir: Direction;
  t: (key: TranslationKey) => string;
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = 'kart-krd-locale';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ku');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && (stored === 'ku' || stored === 'ar' || stored === 'en')) {
        setLocaleState(stored);
      }
    } catch {}
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {}
    // Update html attributes
    document.documentElement.lang = newLocale;
    document.documentElement.dir = getDirection(newLocale);
  }, []);

  // Set initial html attributes once mounted
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = getDirection(locale);
    }
  }, [mounted, locale]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] ?? key;
  }, [locale]);

  const dir = getDirection(locale);

  return (
    <LanguageContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
