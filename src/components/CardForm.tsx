'use client';

import { useState, useId, useCallback } from 'react';
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
  maxLength?: number;
}

function Field({ label, value, onChange, placeholder, type = 'text', dir, error, fontFamily, maxLength }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
        style={{ fontFamily }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        dir={dir}
        maxLength={maxLength}
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
  const [logoError, setLogoError] = useState('');

  const set = (key: {[K in keyof CardData]: CardData[K] extends string ? K : never}[keyof CardData]) => (value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5" dir={dir}>
      {/* Card language */}
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
          {t('form.cardLanguage')}
        </label>
        <div role="radiogroup" aria-label={t('form.cardLanguage')} className="flex gap-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              role="radio"
              aria-checked={data.language === lang.value}
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
        <Field label={t('form.fullName')} value={data.name} onChange={set('name')} placeholder={t('form.namePlaceholder')} error={errors.name} fontFamily={fontFamily} maxLength={50} />
        <Field label={t('form.jobTitle')} value={data.title} onChange={set('title')} placeholder={t('form.titlePlaceholder')} fontFamily={fontFamily} maxLength={60} />
        <Field label={t('form.company')} value={data.company} onChange={set('company')} placeholder={t('form.companyPlaceholder')} fontFamily={fontFamily} maxLength={60} />
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Contact */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
          {t('form.contactInfo')}
        </h3>
        <Field label={t('form.phone')} value={data.phone} onChange={set('phone')} placeholder={t('form.phonePlaceholder')} type="tel" dir="ltr" error={errors.phone} fontFamily={fontFamily} maxLength={20} />
        <Field label={t('form.email')} value={data.email} onChange={set('email')} placeholder={t('form.emailPlaceholder')} type="email" dir="ltr" error={errors.email} fontFamily={fontFamily} maxLength={80} />
        <Field label={t('form.website')} value={data.website} onChange={set('website')} placeholder={t('form.websitePlaceholder')} dir="ltr" fontFamily={fontFamily} maxLength={80} />
        <Field label={t('form.address')} value={data.address} onChange={set('address')} placeholder={t('form.addressPlaceholder')} fontFamily={fontFamily} maxLength={100} />
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
                setLogoError(t('form.fileTooLarge'));
                setTimeout(() => setLogoError(''), 4000);
              }
            }}
            className="w-full h-11 border border-[var(--color-border)] rounded-md px-3 text-sm bg-[var(--color-surface)] file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[var(--color-accent)]/10 file:text-[var(--color-accent)]"
            style={{ fontFamily }}
          />
          {logoError && (
            <p className="text-xs text-[var(--color-error)] mt-1">{logoError}</p>
          )}
          {data.logoUrl && (
            <>
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
              <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1" style={{ fontFamily }}>
                {t('form.logoWarning')}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* Social — collapsible */}
      <div>
        <button
          onClick={() => setSocialOpen(!socialOpen)}
          aria-expanded={socialOpen}
          aria-controls="social-section"
          className="flex items-center justify-between w-full text-sm font-semibold text-[var(--color-text)] py-1"
          style={{ fontFamily }}
        >
          <span>{t('form.socialToggle')}</span>
          <svg
            className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${socialOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {socialOpen && (
          <div id="social-section" className="space-y-3 mt-3">
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
