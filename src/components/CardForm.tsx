'use client';

import { CardData, CardLanguage } from '@/types/card';
import type { FormErrors } from '@/app/editor/page';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily } from '@/lib/i18n';

interface Props {
  data: CardData;
  onChange: (data: CardData) => void;
  errors?: FormErrors;
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white placeholder-gray-400';

const inputErrorClass =
  'w-full border border-red-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all bg-white placeholder-gray-400';

const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

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
      <label className={labelClass} style={{ fontFamily }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        dir={dir}
        className={error ? inputErrorClass : inputClass}
        style={{ fontFamily }}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1" style={{ fontFamily }}>
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

  const set = (key: keyof CardData) => (value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4" dir={dir}>
      {/* Language toggle */}
      <div>
        <label
          className={labelClass}
          style={{ fontFamily }}
        >
          {t('form.cardLanguage')}
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => onChange({ ...data, language: lang.value })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                data.language === lang.value
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
              }`}
              style={{ fontFamily }}
            >
              {lang.flag} {t(`cardLang.${lang.value}` as const)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Personal info */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily }}
        >
          {t('form.personalInfo')}
        </h3>

        <Field
          label={t('form.fullName')}
          value={data.name}
          onChange={set('name')}
          placeholder={t('form.namePlaceholder')}
          error={errors.name}
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.jobTitle')}
          value={data.title}
          onChange={set('title')}
          placeholder={t('form.titlePlaceholder')}
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.company')}
          value={data.company}
          onChange={set('company')}
          placeholder={t('form.companyPlaceholder')}
          fontFamily={fontFamily}
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* Contact */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily }}
        >
          {t('form.contactInfo')}
        </h3>

        <Field
          label={t('form.phone')}
          value={data.phone}
          onChange={set('phone')}
          placeholder={t('form.phonePlaceholder')}
          type="tel"
          dir="ltr"
          error={errors.phone}
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.email')}
          value={data.email}
          onChange={set('email')}
          placeholder={t('form.emailPlaceholder')}
          type="email"
          dir="ltr"
          error={errors.email}
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.website')}
          value={data.website}
          onChange={set('website')}
          placeholder={t('form.websitePlaceholder')}
          dir="ltr"
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.address')}
          value={data.address}
          onChange={set('address')}
          placeholder={t('form.addressPlaceholder')}
          fontFamily={fontFamily}
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* V2 Features */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily }}
        >
          {t('form.newFeatures')}
        </h3>

        {/* QR Code checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="qr-enabled"
            checked={data.qrEnabled}
            onChange={(e) => onChange({ ...data, qrEnabled: e.target.checked })}
            className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label
            htmlFor="qr-enabled"
            className="text-sm text-gray-700 cursor-pointer"
            style={{ fontFamily }}
          >
            {t('form.qrCode')}
          </label>
        </div>

        {/* Logo upload */}
        <div>
          <label className={labelClass} style={{ fontFamily }}>
            {t('form.logo')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
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
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            style={{ fontFamily }}
          />
          {data.logoUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img src={data.logoUrl} alt={t('alt.logoPreview')} className="w-12 h-12 object-contain border rounded-lg" />
              <button
                onClick={() => onChange({ ...data, logoUrl: '' })}
                className="text-xs text-red-500 hover:text-red-700"
                style={{ fontFamily }}
              >
                {t('form.removeLogo')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Social links */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily }}
        >
          {t('form.socialMedia')}
        </h3>

        <Field
          label={t('form.facebook')}
          value={data.facebook}
          onChange={set('facebook')}
          placeholder={t('form.facebookPlaceholder')}
          dir="ltr"
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.instagram')}
          value={data.instagram}
          onChange={set('instagram')}
          placeholder={t('form.instagramPlaceholder')}
          dir="ltr"
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.linkedin')}
          value={data.linkedin}
          onChange={set('linkedin')}
          placeholder={t('form.linkedinPlaceholder')}
          dir="ltr"
          fontFamily={fontFamily}
        />
        <Field
          label={t('form.twitter')}
          value={data.twitter}
          onChange={set('twitter')}
          placeholder={t('form.twitterPlaceholder')}
          dir="ltr"
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
}
