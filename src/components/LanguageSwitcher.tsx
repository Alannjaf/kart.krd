'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Locale } from '@/lib/i18n';

const LOCALES: { value: Locale; label: string; title: string }[] = [
  { value: 'ku', label: 'کو', title: 'کوردی' },
  { value: 'ar', label: 'عر', title: 'العربية' },
  { value: 'en', label: 'EN', title: 'English' },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-0.5 gap-0.5">
      {LOCALES.map((loc) => (
        <button
          key={loc.value}
          onClick={() => setLocale(loc.value)}
          title={loc.title}
          className={`${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} rounded font-medium transition-colors ${
            locale === loc.value
              ? 'bg-[var(--color-accent)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
