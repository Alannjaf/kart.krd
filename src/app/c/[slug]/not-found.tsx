'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

export default function CardNotFound() {
  const { t, dir, locale } = useLanguage();
  const fontFamily = getFontFamily(locale);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center" dir={dir}>
      <div className="text-center px-4" style={{ fontFamily }}>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          {t('profile.notFound')}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          {t('profile.notFoundDesc')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-5 rounded-md text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          {t('profile.backHome')}
        </Link>
      </div>
    </div>
  );
}
