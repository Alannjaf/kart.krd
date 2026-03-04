'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Locale } from '@/lib/i18n';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'ku', label: 'کو' },
  { value: 'ar', label: 'عر' },
  { value: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`flex bg-purple-900/30 border border-purple-700/50 rounded-lg p-1 ${className}`}>
      {LOCALES.map((loc) => (
        <button
          key={loc.value}
          onClick={() => setLocale(loc.value)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
            locale === loc.value
              ? 'bg-yellow-400 text-black'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
