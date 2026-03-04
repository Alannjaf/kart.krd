'use client';

import { CardData, CardLanguage } from '@/types/card';
import type { FormErrors } from '@/app/editor/page';

interface Props {
  data: CardData;
  onChange: (data: CardData) => void;
  errors?: FormErrors;
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white placeholder-gray-500';

const inputErrorClass =
  'w-full border border-red-400 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all bg-white placeholder-gray-500';

const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

interface FieldProps {
  label: string;
  labelEn: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
  error?: string;
}

function Field({ label, labelEn, value, onChange, placeholder, type = 'text', dir, error }: FieldProps) {
  return (
    <div>
      <label className={labelClass} style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
        {label} <span className="text-gray-400 font-normal">— {labelEn}</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        dir={dir}
        className={error ? inputErrorClass : inputClass}
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const LANGUAGES: { value: CardLanguage; label: string; flag: string }[] = [
  { value: 'ku', label: 'کوردی', flag: '🏔️' },
  { value: 'ar', label: 'عەرەبی', flag: '🌙' },
  { value: 'en', label: 'English', flag: '🌍' },
];

export default function CardForm({ data, onChange, errors = {} }: Props) {
  const set = (key: keyof CardData) => (value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4" dir="rtl">
      {/* Language toggle */}
      <div>
        <label
          className={labelClass}
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          زمانی کارت — Card Language
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
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Personal info */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          زانیاری کەسی
        </h3>

        <Field
          label="ناوی تەواو"
          labelEn="Full Name"
          value={data.name}
          onChange={set('name')}
          placeholder="ناوی تەواو"
          error={errors.name}
        />
        <Field
          label="پیشە"
          labelEn="Job Title"
          value={data.title}
          onChange={set('title')}
          placeholder="بەڕێوەبەر، دیزاینەر، ..."
        />
        <Field
          label="ناوی کۆمپانیا"
          labelEn="Company"
          value={data.company}
          onChange={set('company')}
          placeholder="ناوی کۆمپانیا (ئیختیاری)"
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* Contact */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          زانیاری پەیوەندی
        </h3>

        <Field
          label="ژمارەی مۆبایل"
          labelEn="Phone"
          value={data.phone}
          onChange={set('phone')}
          placeholder="+964 750 000 0000"
          type="tel"
          dir="ltr"
          error={errors.phone}
        />
        <Field
          label="ئیمەیل"
          labelEn="Email"
          value={data.email}
          onChange={set('email')}
          placeholder="name@example.com"
          type="email"
          dir="ltr"
          error={errors.email}
        />
        <Field
          label="وێبسایت"
          labelEn="Website"
          value={data.website}
          onChange={set('website')}
          placeholder="www.example.com"
          dir="ltr"
        />
        <Field
          label="ناونیشان"
          labelEn="Address"
          value={data.address}
          onChange={set('address')}
          placeholder="شار، کوی، ..."
        />
      </div>

      <div className="h-px bg-gray-100" />

      {/* V2 Features */}
      <div className="space-y-3">
        <h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          تایبەتمەندیەکانی نوێ
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
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            QR کۆد — QR Code
          </label>
        </div>

        {/* Logo upload */}
        <div>
          <label className={labelClass} style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
            لۆگۆ — Upload Logo
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
                alert('پەڕگەکە گەورەترە لە 2MB. تکایە پەڕگەیەکی بچووکتر هەڵبژێرە.');
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          />
          {data.logoUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img src={data.logoUrl} alt="Logo preview" className="w-12 h-12 object-contain border rounded-lg" />
              <button
                onClick={() => onChange({ ...data, logoUrl: '' })}
                className="text-xs text-red-500 hover:text-red-700"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                سڕینەوە
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
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          میدیای کۆمەڵایەتی (ئیختیاری)
        </h3>

        <Field
          label="فەیسبووک"
          labelEn="Facebook"
          value={data.facebook}
          onChange={set('facebook')}
          placeholder="facebook.com/username"
          dir="ltr"
        />
        <Field
          label="ئینستاگرام"
          labelEn="Instagram"
          value={data.instagram}
          onChange={set('instagram')}
          placeholder="@username"
          dir="ltr"
        />
        <Field
          label="لینکدین"
          labelEn="LinkedIn"
          value={data.linkedin}
          onChange={set('linkedin')}
          placeholder="linkedin.com/in/username"
          dir="ltr"
        />
        <Field
          label="ئێکس / تویتەر"
          labelEn="X / Twitter"
          value={data.twitter}
          onChange={set('twitter')}
          placeholder="@username"
          dir="ltr"
        />
      </div>
    </div>
  );
}
