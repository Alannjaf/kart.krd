'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { CardData } from '@/types/card';
import CardPreview from '@/components/CardPreview';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

interface Props {
  cardData: CardData;
  cardId: string;
  slug: string;
  views: number;
}

export default function ProfileClient({ cardData, cardId, slug, views }: Props) {
  const { t, dir, locale } = useLanguage();
  const fontFamily = getFontFamily(locale);
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://kart.krd/c/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData.name} — ${t('profile.shareTitle')}`,
          url: profileUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to copy
      }
    }
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVCard = () => {
    window.open(`/api/cards/${cardId}/vcard`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir={dir}>
      {/* Header */}
      <header className="bg-[var(--color-panel)] border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="font-bold text-sm text-[var(--color-text)]" style={{ fontFamily }}>
              kart.krd
            </span>
          </Link>
          <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
            {views} {t('profile.views')}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Card Preview */}
        <div className="max-w-md mx-auto mb-8">
          <CardPreview data={cardData} />
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <QRCodeSVG value={profileUrl} size={160} level="M" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-8">
          <button
            onClick={handleDownloadVCard}
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            style={{ fontFamily }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('profile.downloadVCard')}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-sm font-semibold border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            style={{ fontFamily }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? t('profile.copied') : t('profile.share')}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
            {t('profile.madeWith')}{' '}
            <Link href="/" className="text-[var(--color-accent)] hover:underline">kart.krd</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
