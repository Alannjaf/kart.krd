'use client';

import { CardData } from '@/types/card';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  data: CardData;
}

const PhoneIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 flex-shrink-0">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 flex-shrink-0">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);

const WebIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 flex-shrink-0">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 flex-shrink-0">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function BoldCard({ data }: Props) {
  const { t } = useLanguage();
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";
  const contactSize = '14px';

  return (
    <div
      className="w-full h-full bg-gray-950 relative overflow-hidden flex flex-col justify-between"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Top accent bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 flex items-center px-6 py-4">
        <div className="flex-1 flex flex-col justify-between h-full min-h-[140px]">
        {/* Name & title — large and prominent */}
        <div>
          <h1
            className="text-white font-extrabold leading-none tracking-tight"
            style={{ fontSize: '26px', marginBottom: '6px' }}
          >
            {data.name || 'ناوی تەواو'}
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-yellow-400" />
            <p
              className="text-yellow-400 font-semibold uppercase tracking-widest"
              style={{ fontSize: '11px' }}
            >
              {data.title || 'پیشە'}
            </p>
          </div>
          {data.company && (
            <p
              className="text-gray-400 mt-1"
              style={{ fontSize: '10px' }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: contactSize }} className="text-gray-300">
              <PhoneIcon />
              <span style={{ whiteSpace: 'nowrap' }} dir="ltr">{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: contactSize }} className="text-gray-400">
              <EmailIcon />
              <span style={{ whiteSpace: 'nowrap' }} dir="ltr">{data.email}</span>
            </div>
          )}
          {data.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: contactSize }} className="text-gray-400">
              <WebIcon />
              <span style={{ whiteSpace: 'nowrap' }} dir="ltr">{data.website}</span>
            </div>
          )}
          {data.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: contactSize }} className="text-gray-500">
              <LocationIcon />
              <span style={{ whiteSpace: 'nowrap', unicodeBidi: 'plaintext' as React.CSSProperties['unicodeBidi'] }}>{data.address}</span>
            </div>
          )}

          {/* Social Links - icons only for compact layout */}
          {(data.facebook || data.instagram || data.linkedin || data.twitter) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '2px',
            }}>
              {data.facebook && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2" className="flex-shrink-0">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              {data.instagram && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#E4405F" className="flex-shrink-0">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              )}
              {data.linkedin && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2" className="flex-shrink-0">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              )}
              {data.twitter && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Logo - vertically centered on opposite side of name */}
        {data.logoUrl && (
          <div className="flex items-center justify-center ms-4">
            <img
              src={data.logoUrl}
              alt={t('alt.logo')}
              className="w-[60px] h-[60px] object-contain"
            />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="w-full h-0.5 bg-gray-800 flex-shrink-0" />

      {/* watermark only in PDF */}
    </div>
  );
}
