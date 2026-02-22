'use client';

import { CardData, CardLanguage } from '@/types/card';

interface Props {
  data: CardData;
  onChange: (data: CardData) => void;
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white placeholder-gray-400';

const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

interface FieldProps {
  label: string;
  labelEn: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
}

function Field({ label, labelEn, value, onChange, placeholder, type = 'text', dir }: FieldProps) {
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
        className={inputClass}
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      />
    </div>
  );
}

const LANGUAGES: { value: CardLanguage; label: string; flag: string }[] = [
  { value: 'ku', label: 'کوردی', flag: '🏔️' },
  { value: 'ar', label: 'عەرەبی', flag: '🌙' },
  { value: 'en', label: 'English', flag: '🌍' },
];

export default function CardForm({ data, onChange }: Props) {
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
        />
        <Field
          label="ئیمەیل"
          labelEn="Email"
          value={data.email}
          onChange={set('email')}
          placeholder="name@example.com"
          type="email"
          dir="ltr"
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
