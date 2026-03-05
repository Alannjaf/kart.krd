'use client';

import { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getFontFamily } from "@/lib/i18n";
import ModernCard from "@/components/templates/ModernCard";
import { CardData } from "@/types/card";

const ClassicCard = dynamic(() => import("@/components/templates/ClassicCard"));
const BoldCard = dynamic(() => import("@/components/templates/BoldCard"));
const MinimalCard = dynamic(() => import("@/components/templates/MinimalCard"));
const ElegantCard = dynamic(() => import("@/components/templates/ElegantCard"));
const CreativeCard = dynamic(() => import("@/components/templates/CreativeCard"));
const CorporateCard = dynamic(() => import("@/components/templates/CorporateCard"));
const GradientCard = dynamic(() => import("@/components/templates/GradientCard"));

const sampleCard: CardData = {
  name: '', title: '', company: '', phone: '+964 750 123 4567',
  email: 'info@example.com', website: 'www.example.com', address: '',
  facebook: '', instagram: '', linkedin: '', twitter: '',
  language: 'ku', template: 'modern', qrEnabled: false, logoUrl: '',
};

const templateComponents = [
  { id: 'modern' as const, Component: ModernCard },
  { id: 'classic' as const, Component: ClassicCard },
  { id: 'bold' as const, Component: BoldCard },
  { id: 'minimal' as const, Component: MinimalCard },
  { id: 'elegant' as const, Component: ElegantCard },
  { id: 'creative' as const, Component: CreativeCard },
  { id: 'corporate' as const, Component: CorporateCard },
  { id: 'gradient' as const, Component: GradientCard },
];

const CARD_NATURAL_WIDTH = 350;
const CARD_NATURAL_HEIGHT = 200;

function ScaledCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / CARD_NATURAL_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${CARD_NATURAL_WIDTH} / ${CARD_NATURAL_HEIGHT}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${CARD_NATURAL_WIDTH}px`,
          height: `${CARD_NATURAL_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);

  const sampleData: CardData = {
    ...sampleCard,
    language: locale === 'en' ? 'en' : locale === 'ar' ? 'ar' : 'ku',
    name: t('preview.name'),
    title: t('preview.title'),
  };

  const features = [
    { title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
    { title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
    { title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir={dir}>
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-panel)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="font-bold text-lg text-[var(--color-text)]" style={{ fontFamily }}>
              kart.krd
            </span>
          </div>

          <LanguageSwitcher compact />
        </div>
      </header>

      <main id="main-content">
      {/* Hero — asymmetric */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="flex-1">
            <span
              className="inline-block text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1.5 rounded-md mb-6"
              style={{ fontFamily }}
            >
              {t('landing.badge')}
            </span>

            <h1
              className="text-3xl md:text-5xl font-bold text-[var(--color-text)] leading-tight mb-4"
              style={{ fontFamily }}
            >
              {t('landing.heroTitle')}
              <br />
              {t('landing.heroSubtitle')}
            </h1>

            <p
              className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-md mb-8 leading-relaxed"
              style={{ fontFamily }}
            >
              {t('landing.heroDesc')}
            </p>

            <Link
              href="/editor"
              className="inline-flex items-center h-12 px-8 rounded-md bg-[var(--color-accent)] text-white font-semibold text-base hover:bg-[var(--color-accent-hover)] transition-colors"
              style={{ fontFamily }}
            >
              {t('landing.ctaButton')}
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] mt-3" style={{ fontFamily }}>
              {t('landing.ctaSubtext')}
            </p>
          </div>

          {/* Hero card preview — tilted on desktop */}
          <div className="flex-shrink-0 w-full md:w-[340px]">
            <div className="md:-rotate-3 md:hover:rotate-0 transition-transform duration-300 shadow-lg">
              <ScaledCard className="rounded-md">
                <ModernCard data={sampleData} />
              </ScaledCard>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2
          className="text-sm font-semibold text-[var(--color-text-secondary)] mb-6"
          style={{ fontFamily }}
        >
          {t('landing.templatesTitle')}
        </h2>

        {/* Mobile: horizontal scroll, Desktop: 2x2 grid */}
        <div className="flex gap-4 overflow-x-auto scroll-hidden pb-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:gap-5">
          {templateComponents.map(({ id, Component }) => (
            <Link href={`/editor?template=${id}`} key={id} className="flex-shrink-0 w-60 md:w-auto group">
              <ScaledCard className="rounded-md border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:scale-[1.02] transition-all">
                <Component data={{ ...sampleData, template: id }} />
              </ScaledCard>
              <p
                className="text-sm font-medium text-[var(--color-text)] mt-2"
                style={{ fontFamily }}
              >
                {t(`template.${id}` as const)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features — clean list, not card grid */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-[var(--color-border)]">
        <div className="max-w-lg space-y-6">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5" style={{ fontFamily }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA — teal strip */}
      <section className="bg-[var(--color-accent)]">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily }}>
              {t('landing.ctaBottomTitle')}
            </h2>
            <p className="text-teal-100 text-sm mt-1" style={{ fontFamily }}>
              {t('landing.ctaBottomDesc')}
            </p>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-white text-[var(--color-accent)] font-semibold text-base hover:bg-teal-50 transition-colors flex-shrink-0"
            style={{ fontFamily }}
          >
            {t('landing.ctaBottomButton')}
          </Link>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
          {t('landing.footerText')}
        </p>
      </footer>
    </div>
  );
}
