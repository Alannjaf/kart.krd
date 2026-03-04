# Mobile-First Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the entire kart.krd app to be mobile-first, clean, and professional using a warm stone/teal palette, Geist font, and tab-bar mobile editor — following the no-ai-design skill strictly.

**Architecture:** Full visual overhaul of landing page and editor page. New design system tokens in globals.css, Geist font replacing Inter, tab-bar pattern for mobile editor (Edit/Preview tabs), left-aligned asymmetric landing page. Card template components (ModernCard, ClassicCard, etc.) are NOT touched — they use inline styles for PDF capture.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

---

### Task 1: Design System Foundation — globals.css + layout.tsx

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Update globals.css with new design tokens**

Replace the entire file:

```css
@import "tailwindcss";

:root {
  --font-body: 'Geist', 'Noto Sans Arabic', sans-serif;
  --font-arabic: 'Noto Sans Arabic', sans-serif;
  --color-bg: #FAFAF8;
  --color-text: #1C1917;
  --color-text-secondary: #78716C;
  --color-accent: #0D9488;
  --color-accent-hover: #0F766E;
  --color-surface: #F5F5F4;
  --color-border: #E7E5E4;
  --color-error: #DC2626;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans Arabic', 'Geist', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Kurdish/Arabic RTL font */
.font-ku,
.font-ar {
  font-family: 'Noto Sans Arabic', sans-serif;
}

/* English LTR font */
.font-en {
  font-family: 'Geist', sans-serif;
}

/* Card preview aspect ratio */
.card-aspect {
  aspect-ratio: 3.5 / 2;
}

/* Smooth transitions */
.card-preview {
  transition: all 0.2s ease;
}

/* Hide scrollbar for horizontal scroll containers */
.scroll-hidden::-webkit-scrollbar {
  display: none;
}
.scroll-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**Step 2: Update layout.tsx — replace Inter with Geist, update font links**

Replace the entire `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "kart.krd — کارتی بزنسی کوردی",
  description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
  keywords: ["business card", "Kurdish", "کارتی بزنس", "کوردی", "kart", "card maker"],
  metadataBase: new URL("https://kart.krd"),
  openGraph: {
    title: "kart.krd — کارتی بزنسی کوردی",
    description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
    url: "https://kart.krd",
    siteName: "kart.krd",
    locale: "ku_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kart.krd — کارتی بزنسی کوردی",
    description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
```

**Step 3: Update i18n.ts getFontFamily to use Geist**

In `src/lib/i18n.ts`, change the `getFontFamily` function:

```typescript
export function getFontFamily(locale: Locale): string {
  return locale === 'en' ? "'Geist', sans-serif" : "'Noto Sans Arabic', sans-serif";
}
```

**Step 4: Run build to verify no breakage**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/i18n.ts
git commit -m "feat: new design system — warm palette, Geist font, design tokens"
```

---

### Task 2: LanguageSwitcher Redesign

**Files:**
- Modify: `src/components/LanguageSwitcher.tsx`

**Step 1: Rewrite LanguageSwitcher with stone/teal palette**

Replace the entire file:

```tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Locale } from '@/lib/i18n';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'ku', label: 'کو' },
  { value: 'ar', label: 'عر' },
  { value: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-0.5 gap-0.5">
      {LOCALES.map((loc) => (
        <button
          key={loc.value}
          onClick={() => setLocale(loc.value)}
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
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds (old `className` prop usage in editor will break — fix in Task 4)

**Step 3: Commit**

```bash
git add src/components/LanguageSwitcher.tsx
git commit -m "feat: redesign LanguageSwitcher with stone/teal palette"
```

---

### Task 3: Add New i18n Keys

**Files:**
- Modify: `src/lib/i18n.ts`

**Step 1: Add tab bar and new UI translation keys**

Add to each language object in `translations`:

Kurdish (`ku`):
```typescript
'editor.tabEdit': 'دەستکاری',
'editor.tabPreview': 'پێشبینی',
'form.socialToggle': 'میدیای کۆمەڵایەتی',
```

Arabic (`ar`):
```typescript
'editor.tabEdit': 'تحرير',
'editor.tabPreview': 'معاينة',
'form.socialToggle': 'وسائل التواصل',
```

English (`en`):
```typescript
'editor.tabEdit': 'Edit',
'editor.tabPreview': 'Preview',
'form.socialToggle': 'Social Media',
```

**Step 2: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat: add i18n keys for tab bar and social toggle"
```

---

### Task 4: CardForm Redesign

**Files:**
- Modify: `src/components/CardForm.tsx`

**Step 1: Rewrite CardForm with new design system**

Key changes:
- Input height: 44px (touch-friendly)
- Stone-200 borders, stone-50 bg, rounded-md
- Focus: teal ring
- Section headers: weight 600, stone-700, text-sm (not uppercase tracking-wider)
- Social media section: collapsible on mobile via disclosure pattern
- Card language pills: teal active state

Full replacement of `src/components/CardForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { CardData, CardLanguage } from '@/types/card';
import type { FormErrors } from '@/app/editor/page';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

interface Props {
  data: CardData;
  onChange: (data: CardData) => void;
  errors?: FormErrors;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
  error?: string;
  fontFamily: string;
}

function Field({ label, value, onChange, placeholder, type = 'text', dir, error, fontFamily }: FieldProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
        style={{ fontFamily }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        dir={dir}
        className={`w-full h-11 border rounded-md px-3 text-sm transition-colors bg-[var(--color-surface)] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent ${
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        }`}
        style={{ fontFamily }}
      />
      {error && (
        <p className="text-[var(--color-error)] text-xs mt-1" style={{ fontFamily }}>
          {error}
        </p>
      )}
    </div>
  );
}

const LANGUAGES: { value: CardLanguage; flag: string }[] = [
  { value: 'ku', flag: '🏔️' },
  { value: 'ar', flag: '🌙' },
  { value: 'en', flag: '🌍' },
];

export default function CardForm({ data, onChange, errors = {} }: Props) {
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);
  const [socialOpen, setSocialOpen] = useState(false);

  const set = (key: keyof CardData) => (value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5" dir={dir}>
      {/* Card language */}
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
          {t('form.cardLanguage')}
        </label>
        <div className="flex gap-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => onChange({ ...data, language: lang.value })}
              className={`flex-1 h-11 rounded-md text-sm font-medium transition-colors border ${
                data.language === lang.value
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
              }`}
              style={{ fontFamily }}
            >
              {lang.flag} {t(`cardLang.${lang.value}` as const)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Personal info */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
          {t('form.personalInfo')}
        </h3>
        <Field label={t('form.fullName')} value={data.name} onChange={set('name')} placeholder={t('form.namePlaceholder')} error={errors.name} fontFamily={fontFamily} />
        <Field label={t('form.jobTitle')} value={data.title} onChange={set('title')} placeholder={t('form.titlePlaceholder')} fontFamily={fontFamily} />
        <Field label={t('form.company')} value={data.company} onChange={set('company')} placeholder={t('form.companyPlaceholder')} fontFamily={fontFamily} />
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Contact */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
          {t('form.contactInfo')}
        </h3>
        <Field label={t('form.phone')} value={data.phone} onChange={set('phone')} placeholder={t('form.phonePlaceholder')} type="tel" dir="ltr" error={errors.phone} fontFamily={fontFamily} />
        <Field label={t('form.email')} value={data.email} onChange={set('email')} placeholder={t('form.emailPlaceholder')} type="email" dir="ltr" error={errors.email} fontFamily={fontFamily} />
        <Field label={t('form.website')} value={data.website} onChange={set('website')} placeholder={t('form.websitePlaceholder')} dir="ltr" fontFamily={fontFamily} />
        <Field label={t('form.address')} value={data.address} onChange={set('address')} placeholder={t('form.addressPlaceholder')} fontFamily={fontFamily} />
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
          {t('form.newFeatures')}
        </h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.qrEnabled}
            onChange={(e) => onChange({ ...data, qrEnabled: e.target.checked })}
            className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
          />
          <span className="text-sm text-[var(--color-text)]" style={{ fontFamily }}>
            {t('form.qrCode')}
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1" style={{ fontFamily }}>
            {t('form.logo')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size <= 2 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const dataUrl = event.target?.result as string;
                  onChange({ ...data, logoUrl: dataUrl });
                };
                reader.readAsDataURL(file);
              } else if (file) {
                alert(t('form.fileTooLarge'));
              }
            }}
            className="w-full h-11 border border-[var(--color-border)] rounded-md px-3 text-sm bg-[var(--color-surface)] file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[var(--color-accent)]/10 file:text-[var(--color-accent)]"
            style={{ fontFamily }}
          />
          {data.logoUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img src={data.logoUrl} alt={t('alt.logoPreview')} className="w-10 h-10 object-contain border border-[var(--color-border)] rounded-md" />
              <button
                onClick={() => onChange({ ...data, logoUrl: '' })}
                className="text-xs text-[var(--color-error)] hover:underline"
                style={{ fontFamily }}
              >
                {t('form.removeLogo')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Social — collapsible */}
      <div>
        <button
          onClick={() => setSocialOpen(!socialOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-[var(--color-text)] py-1"
          style={{ fontFamily }}
        >
          <span>{t('form.socialToggle')}</span>
          <svg
            className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${socialOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {socialOpen && (
          <div className="space-y-3 mt-3">
            <Field label={t('form.facebook')} value={data.facebook} onChange={set('facebook')} placeholder={t('form.facebookPlaceholder')} dir="ltr" fontFamily={fontFamily} />
            <Field label={t('form.instagram')} value={data.instagram} onChange={set('instagram')} placeholder={t('form.instagramPlaceholder')} dir="ltr" fontFamily={fontFamily} />
            <Field label={t('form.linkedin')} value={data.linkedin} onChange={set('linkedin')} placeholder={t('form.linkedinPlaceholder')} dir="ltr" fontFamily={fontFamily} />
            <Field label={t('form.twitter')} value={data.twitter} onChange={set('twitter')} placeholder={t('form.twitterPlaceholder')} dir="ltr" fontFamily={fontFamily} />
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/CardForm.tsx
git commit -m "feat: redesign CardForm — touch-friendly, stone/teal, collapsible social"
```

---

### Task 5: TemplateSelector Redesign

**Files:**
- Modify: `src/components/TemplateSelector.tsx`

**Step 1: Rewrite TemplateSelector with horizontal scroll on mobile, grid on desktop**

```tsx
'use client';

import { TemplateId, TEMPLATES, CardData } from '@/types/card';
import ModernCard from './templates/ModernCard';
import ClassicCard from './templates/ClassicCard';
import BoldCard from './templates/BoldCard';
import MinimalCard from './templates/MinimalCard';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily, type TranslationKey } from '@/lib/i18n';

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
  cardData: CardData;
  layout?: 'grid' | 'scroll';
}

function MiniPreview({ templateId, data, t }: { templateId: TemplateId; data: CardData; t: (key: TranslationKey) => string }) {
  const previewData = {
    ...data,
    template: templateId,
    name: data.name || t('preview.name'),
    title: data.title || t('preview.title'),
  };

  switch (templateId) {
    case 'modern': return <ModernCard data={previewData} />;
    case 'classic': return <ClassicCard data={previewData} />;
    case 'bold': return <BoldCard data={previewData} />;
    case 'minimal': return <MinimalCard data={previewData} />;
  }
}

export default function TemplateSelector({ selected, onChange, cardData, layout = 'grid' }: Props) {
  const { locale, t } = useLanguage();
  const fontFamily = getFontFamily(locale);

  if (layout === 'scroll') {
    return (
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
          {t('form.selectTemplate')}
        </label>
        <div className="flex gap-3 overflow-x-auto scroll-hidden pb-2">
          {TEMPLATES.map((tpl) => {
            const templateName = t(`template.${tpl.id}` as TranslationKey);
            return (
              <button
                key={tpl.id}
                onClick={() => onChange(tpl.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-32 rounded-md overflow-hidden border-2 transition-all ${
                    selected === tpl.id
                      ? 'border-[var(--color-accent)] scale-[1.02]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                  style={{ aspectRatio: '3.5/2' }}
                >
                  <MiniPreview templateId={tpl.id} data={cardData} t={t} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    selected === tpl.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontFamily }}
                >
                  {templateName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
        {t('form.selectTemplate')}
      </label>
      <div className="grid grid-cols-4 gap-3">
        {TEMPLATES.map((tpl) => {
          const templateName = t(`template.${tpl.id}` as TranslationKey);
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-full rounded-md overflow-hidden border-2 transition-all ${
                  selected === tpl.id
                    ? 'border-[var(--color-accent)] scale-[1.02]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                }`}
                style={{ aspectRatio: '3.5/2' }}
              >
                <MiniPreview templateId={tpl.id} data={cardData} t={t} />
              </div>
              <span
                className={`text-xs font-medium ${
                  selected === tpl.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                }`}
                style={{ fontFamily }}
              >
                {templateName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/TemplateSelector.tsx
git commit -m "feat: redesign TemplateSelector — horizontal scroll + grid layouts"
```

---

### Task 6: Landing Page Full Rewrite

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Rewrite landing page with asymmetric hero, warm palette, no AI patterns**

Full replacement of `src/app/page.tsx`. Key design elements:
- Left-aligned hero (not centered)
- No gradient text
- Tilted card preview on desktop
- Horizontal scroll template showcase on mobile, 2x2 on desktop
- Feature list (not card grid)
- Teal CTA strip at bottom
- Compact footer

```tsx
'use client';

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getFontFamily } from "@/lib/i18n";
import ModernCard from "@/components/templates/ModernCard";
import ClassicCard from "@/components/templates/ClassicCard";
import BoldCard from "@/components/templates/BoldCard";
import MinimalCard from "@/components/templates/MinimalCard";
import { CardData } from "@/types/card";

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
];

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
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="font-bold text-lg text-[var(--color-text)]" style={{ fontFamily }}>
              kart.krd
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <Link
              href="/editor"
              className="h-10 px-5 inline-flex items-center rounded-md bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
              style={{ fontFamily }}
            >
              {t('nav.createButton')}
            </Link>
          </div>
        </div>
      </header>

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
            <div
              className="md:-rotate-3 md:hover:rotate-0 transition-transform duration-300 rounded-md overflow-hidden shadow-lg"
              style={{ aspectRatio: '3.5/2' }}
            >
              <ModernCard data={sampleData} />
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
        <div className="flex gap-4 overflow-x-auto scroll-hidden pb-3 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:gap-5">
          {templateComponents.map(({ id, Component }) => (
            <Link href={`/editor?template=${id}`} key={id} className="flex-shrink-0 w-60 md:w-auto group">
              <div
                className="rounded-md overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:scale-[1.02] transition-all"
                style={{ aspectRatio: '3.5/2' }}
              >
                <Component data={{ ...sampleData, template: id }} />
              </div>
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

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
          {t('landing.footerText')}
        </p>
      </footer>
    </div>
  );
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign landing page — asymmetric hero, warm palette, no AI patterns"
```

---

### Task 7: Editor Page Full Rewrite with Mobile Tab Bar

**Files:**
- Modify: `src/app/editor/page.tsx`

**Step 1: Rewrite editor page with tab bar mobile layout**

Key changes:
- Mobile: fixed bottom tab bar (Edit/Preview), full-screen content area
- Desktop: side-by-side layout (380px form panel + preview area)
- Template selector: horizontal scroll on mobile (inside Edit tab), grid on desktop
- Download button: in header on desktop, in Preview tab on mobile
- All purple → teal/stone

Full replacement of `src/app/editor/page.tsx`:

```tsx
'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CardData, TemplateId, defaultCardData, TEMPLATES } from '@/types/card';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import TemplateSelector from '@/components/TemplateSelector';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { generatePdf } from '@/lib/generatePdf';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

const STORAGE_KEY = 'kart-krd-card-data';

function loadCardData(): CardData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.name === 'string' && typeof parsed.template === 'string') {
      return { ...defaultCardData, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

function saveCardData(data: CardData) {
  try {
    const { logoUrl, ...rest } = data;
    void logoUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {}
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);
  const urlTemplate = searchParams.get('template') as TemplateId;

  const validTemplate = TEMPLATES.find(t => t.id === urlTemplate);
  const initialTemplate = validTemplate ? urlTemplate : 'modern';

  const [cardData, setCardData] = useState<CardData>(() => {
    const stored = loadCardData();
    if (stored) {
      return { ...stored, template: validTemplate ? urlTemplate : stored.template };
    }
    return { ...defaultCardData, template: initialTemplate };
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveCardData(cardData);
  }, [cardData]);

  const validateCardData = useCallback((data: CardData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim()) errors.name = t('validation.nameRequired');
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = t('validation.emailInvalid');
    if (data.phone.trim() && !/^[0-9+\-\s()]+$/.test(data.phone.trim())) errors.phone = t('validation.phoneInvalid');
    return errors;
  }, [t]);

  const handleClear = useCallback(() => {
    const cleared = { ...defaultCardData, template: cardData.template };
    setCardData(cleared);
    setFormErrors({});
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template]);

  const handleDownloadPdf = useCallback(async () => {
    const errors = validateCardData(cardData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setActiveTab('edit');
      return;
    }
    if (!cardRef.current) return;
    setIsGenerating(true);
    setPdfSuccess(false);
    try {
      const showBackCallback = async (showBackView: boolean) => {
        setShowBack(showBackView);
        await new Promise(resolve => setTimeout(resolve, 200));
      };
      await generatePdf(cardRef.current, cardData, showBackCallback);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(t('editor.pdfError'));
    } finally {
      setIsGenerating(false);
    }
  }, [cardData, validateCardData, t]);

  const handleCardChange = useCallback((newData: CardData) => {
    setCardData(newData);
    if (formErrors.name && newData.name.trim()) setFormErrors(prev => ({ ...prev, name: undefined }));
    if (formErrors.email && (!newData.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.email.trim()))) setFormErrors(prev => ({ ...prev, email: undefined }));
    if (formErrors.phone && (!newData.phone.trim() || /^[0-9+\-\s()]+$/.test(newData.phone.trim()))) setFormErrors(prev => ({ ...prev, phone: undefined }));
  }, [formErrors]);

  const downloadButton = (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className={`inline-flex items-center justify-center h-11 px-6 rounded-md text-sm font-semibold transition-colors ${
        pdfSuccess
          ? 'bg-green-600 text-white'
          : isGenerating
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'
      }`}
      style={{ fontFamily }}
    >
      {pdfSuccess ? t('editor.downloaded') : isGenerating ? t('editor.downloading') : t('editor.downloadPdf')}
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir={dir}>
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="font-bold text-[var(--color-text)]" style={{ fontFamily }}>
              kart.krd
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <div className="hidden lg:block">
              {downloadButton}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left: Form */}
            <div className="w-[380px] flex-shrink-0">
              <div className="bg-white rounded-md border border-[var(--color-border)] p-5 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                    {t('editor.enterInfo')}
                  </h2>
                  <button
                    onClick={handleClear}
                    className="text-xs text-[var(--color-error)] hover:underline"
                    style={{ fontFamily }}
                  >
                    {t('editor.clear')}
                  </button>
                </div>
                <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />
              </div>
            </div>

            {/* Right: Preview + Templates */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-md border border-[var(--color-border)] p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                    {t('editor.livePreview')}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex bg-[var(--color-surface)] rounded-md p-0.5 border border-[var(--color-border)]">
                      <button
                        onClick={() => setShowBack(false)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          !showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
                        }`}
                        style={{ fontFamily }}
                      >
                        {t('editor.front')}
                      </button>
                      <button
                        onClick={() => setShowBack(true)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
                        }`}
                        style={{ fontFamily }}
                      >
                        {t('editor.back')}
                      </button>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
                      3.5&quot; × 2&quot;
                    </span>
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <CardPreview ref={cardRef} data={cardData} showBack={showBack} />
                </div>

                <p className="text-center text-xs text-[var(--color-text-secondary)] mt-4" style={{ fontFamily }}>
                  {t('editor.watermarkNote')}
                </p>
              </div>

              <div className="bg-white rounded-md border border-[var(--color-border)] p-5">
                <TemplateSelector
                  selected={cardData.template}
                  onChange={(tpl) => setCardData({ ...cardData, template: tpl })}
                  cardData={cardData}
                  layout="grid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout with tab bar */}
      <div className="lg:hidden pb-16">
        {/* Tab content */}
        {activeTab === 'edit' ? (
          <div className="px-4 py-4 space-y-4">
            <TemplateSelector
              selected={cardData.template}
              onChange={(tpl) => setCardData({ ...cardData, template: tpl })}
              cardData={cardData}
              layout="scroll"
            />
            <div className="bg-white rounded-md border border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                  {t('editor.enterInfo')}
                </h2>
                <button
                  onClick={handleClear}
                  className="text-xs text-[var(--color-error)] hover:underline"
                  style={{ fontFamily }}
                >
                  {t('editor.clear')}
                </button>
              </div>
              <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex bg-[var(--color-surface)] rounded-md p-0.5 border border-[var(--color-border)]">
                <button
                  onClick={() => setShowBack(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    !showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontFamily }}
                >
                  {t('editor.front')}
                </button>
                <button
                  onClick={() => setShowBack(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontFamily }}
                >
                  {t('editor.back')}
                </button>
              </div>
              <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
                3.5&quot; × 2&quot;
              </span>
            </div>

            <CardPreview ref={cardRef} data={cardData} showBack={showBack} />

            <div className="flex justify-center">
              {downloadButton}
            </div>

            <p className="text-center text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
              {t('editor.watermarkNote')}
            </p>
          </div>
        )}

        {/* Bottom tab bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] z-50 flex">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex flex-col items-center justify-center h-14 gap-0.5 transition-colors ${
              activeTab === 'edit' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-[10px] font-medium" style={{ fontFamily }}>{t('editor.tabEdit')}</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex flex-col items-center justify-center h-14 gap-0.5 transition-colors ${
              activeTab === 'preview' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-medium" style={{ fontFamily }}>{t('editor.tabPreview')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
          {t('editor.loading')}
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/editor/page.tsx
git commit -m "feat: redesign editor — mobile tab bar, warm palette, side-by-side desktop"
```

---

### Task 8: Final Build Verification + Single Commit

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 3: Visual check**

Run: `npm run dev`
Manually verify:
- Landing page: asymmetric hero, teal accent, template previews, features list
- Editor: tab bar works on mobile, side-by-side on desktop
- RTL: switch to Kurdish/Arabic, verify layout mirrors correctly
- PDF: download a PDF, verify it still works

**Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: final adjustments after visual review"
```
