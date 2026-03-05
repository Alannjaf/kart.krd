'use client';

import { CardData, TemplateId } from '@/types/card';
import { useState, useEffect, ReactNode } from 'react';
import { generateVCardQR } from '@/lib/qrUtils';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  data: CardData;
  template: TemplateId;
}

interface TemplateStyle {
  background: string;
  websiteColor: string;
  qrBg: boolean; // true = white bg + padding on QR (for dark templates)
  contentZIndex?: boolean; // true = add position:relative + zIndex:1 on content
  decorations: ReactNode;
}

const templateStyles: Record<TemplateId, TemplateStyle> = {
  modern: {
    background: 'linear-gradient(to bottom right, #4c1d95, #581c87, #312e81)',
    websiteColor: '#c4b5fd',
    qrBg: true,
    decorations: (
      <div style={{ position: 'absolute', left: 0, top: 0, width: '10px', height: '100%', background: 'linear-gradient(to bottom, #facc15, #f59e0b)' }} />
    ),
  },
  classic: {
    background: 'linear-gradient(to bottom right, #fffbeb, #f5f5f4)',
    websiteColor: '#4b5563',
    qrBg: false,
    decorations: (
      <>
        <div style={{ position: 'absolute', inset: '8px', border: '2px solid rgba(180, 83, 9, 0.4)', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', inset: '12px', border: '1px solid rgba(180, 83, 9, 0.2)', borderRadius: '4px' }} />
      </>
    ),
  },
  bold: {
    background: '#030712',
    websiteColor: '#9ca3af',
    qrBg: true,
    decorations: (
      <>
        <div style={{ position: 'absolute', top: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, #facc15, #f59e0b, #eab308)' }} />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '2px', backgroundColor: '#1f2937' }} />
      </>
    ),
  },
  minimal: {
    background: 'white',
    websiteColor: '#6b7280',
    qrBg: false,
    decorations: (
      <div style={{ position: 'absolute', inset: '16px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
    ),
  },
  elegant: {
    background: '#1C1C28',
    websiteColor: '#8B8B9E',
    qrBg: true,
    decorations: (
      <>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', backgroundColor: '#B8965A', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '1px', backgroundColor: '#B8965A', opacity: 0.5 }} />
      </>
    ),
  },
  creative: {
    background: '#8B3A3A',
    websiteColor: '#D4A0A0',
    qrBg: true,
    contentZIndex: true,
    decorations: (
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#A04848', opacity: 0.5 }} />
    ),
  },
  corporate: {
    background: '#0C2340',
    websiteColor: '#4A6FA5',
    qrBg: true,
    decorations: null,
  },
  gradient: {
    background: 'linear-gradient(135deg, #0D9488 0%, #115E59 50%, #134E4A 100%)',
    websiteColor: '#A7F3D0',
    qrBg: true,
    decorations: (
      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A7F3D0' }} />
    ),
  },
};

export default function BackCard({ data, template }: Props) {
  const [qrCode, setQrCode] = useState<string>('');
  const { t } = useLanguage();
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "var(--font-noto-arabic), sans-serif" : "var(--font-geist), sans-serif";

  useEffect(() => {
    if (data.qrEnabled) {
      generateVCardQR(data).then(setQrCode).catch(() => setQrCode(''));
    } else {
      setQrCode('');
    }
  }, [data.qrEnabled, data.name, data.title, data.company, data.phone, data.email, data.website, data.address, data.facebook, data.instagram, data.linkedin, data.twitter]);

  const style = templateStyles[template];
  const bgStyle = style.background.includes('gradient') || style.background.includes('#')
    ? style.background.startsWith('#') || style.background === 'white'
      ? { backgroundColor: style.background }
      : { background: style.background }
    : { background: style.background };
  const contentStyle = style.contentZIndex ? { position: 'relative' as const, zIndex: 1 } : {};

  return (
    <div
      style={{
        fontFamily,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...bgStyle,
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {style.decorations}

      {data.logoUrl && (
        <div style={{ marginBottom: '8px', ...contentStyle }}>
          <img
            src={data.logoUrl}
            alt={t('alt.logo')}
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
          />
        </div>
      )}

      {data.qrEnabled && qrCode && (
        <div style={{ marginBottom: '8px', ...contentStyle }}>
          <img
            src={qrCode}
            alt={t('alt.qrCode')}
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '4px',
              ...(style.qrBg ? { backgroundColor: 'white', padding: '6px' } : {}),
            }}
          />
        </div>
      )}

      {data.website && data.qrEnabled && qrCode && (
        <p
          style={{ fontSize: '10px', color: style.websiteColor, textAlign: 'center', ...contentStyle }}
          dir="ltr"
        >
          {data.website}
        </p>
      )}
    </div>
  );
}
