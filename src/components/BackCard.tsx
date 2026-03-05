'use client';

import { CardData, TemplateId } from '@/types/card';
import { useState, useEffect } from 'react';
import { generateVCardQR } from '@/lib/qrUtils';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  data: CardData;
  template: TemplateId;
}

export default function BackCard({ data, template }: Props) {
  const [qrCode, setQrCode] = useState<string>('');
  const { t } = useLanguage();
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Geist', sans-serif";

  useEffect(() => {
    if (data.qrEnabled) {
      generateVCardQR(data).then(setQrCode).catch(() => setQrCode(''));
    } else {
      setQrCode('');
    }
  }, [data.qrEnabled, data.name, data.title, data.company, data.phone, data.email, data.website, data.address, data.facebook, data.instagram, data.linkedin, data.twitter]);

  // Modern template back
  if (template === 'modern') {
    return (
      <div
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom right, #4c1d95, #581c87, #312e81)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '10px', height: '100%', background: 'linear-gradient(to bottom, #facc15, #f59e0b)' }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={data.logoUrl}
              alt={t('alt.logo')}
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={qrCode}
              alt={t('alt.qrCode')}
              style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }}
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            style={{ fontSize: '10px', color: '#c4b5fd', textAlign: 'center' }}
            dir="ltr"
          >
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Classic template back
  if (template === 'classic') {
    return (
      <div
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom right, #fffbeb, #f5f5f4)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Outer border decoration */}
        <div style={{ position: 'absolute', inset: '8px', border: '2px solid rgba(180, 83, 9, 0.4)', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', inset: '12px', border: '1px solid rgba(180, 83, 9, 0.2)', borderRadius: '4px' }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={data.logoUrl}
              alt={t('alt.logo')}
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={qrCode}
              alt={t('alt.qrCode')}
              style={{ width: '88px', height: '88px', borderRadius: '4px' }}
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            style={{ fontSize: '10px', color: '#4b5563', textAlign: 'center' }}
            dir="ltr"
          >
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Bold template back
  if (template === 'bold') {
    return (
      <div
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#030712' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, #facc15, #f59e0b, #eab308)' }} />
        {/* Bottom accent line */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '2px', backgroundColor: '#1f2937' }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={data.logoUrl}
              alt={t('alt.logo')}
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={qrCode}
              alt={t('alt.qrCode')}
              style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }}
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center' }}
            dir="ltr"
          >
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Elegant template back
  if (template === 'elegant') {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#1C1C28' }}
      >
        {/* Thin gold top line */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', backgroundColor: '#B8965A', opacity: 0.5 }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img src={data.logoUrl} alt={t('alt.logo')} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img src={qrCode} alt={t('alt.qrCode')} style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }} />
          </div>
        )}

        {/* Website */}
        {data.website && data.qrEnabled && qrCode && (
          <p style={{ fontSize: '10px', color: '#8B8B9E', textAlign: 'center' }} dir="ltr">
            {data.website}
          </p>
        )}

        {/* Thin gold bottom line */}
        <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '1px', backgroundColor: '#B8965A', opacity: 0.5 }} />
      </div>
    );
  }

  // Creative template back
  if (template === 'creative') {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#8B3A3A' }}
      >
        {/* Decorative circle */}
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#A04848', opacity: 0.5 }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px', position: 'relative', zIndex: 1 }}>
            <img src={data.logoUrl} alt={t('alt.logo')} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px', position: 'relative', zIndex: 1 }}>
            <img src={qrCode} alt={t('alt.qrCode')} style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }} />
          </div>
        )}

        {/* Website */}
        {data.website && data.qrEnabled && qrCode && (
          <p style={{ fontSize: '10px', color: '#D4A0A0', textAlign: 'center', position: 'relative', zIndex: 1 }} dir="ltr">
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Corporate template back
  if (template === 'corporate') {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0C2340' }}
      >
        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img src={data.logoUrl} alt={t('alt.logo')} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img src={qrCode} alt={t('alt.qrCode')} style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }} />
          </div>
        )}

        {/* Website */}
        {data.website && data.qrEnabled && qrCode && (
          <p style={{ fontSize: '10px', color: '#4A6FA5', textAlign: 'center' }} dir="ltr">
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Gradient template back
  if (template === 'gradient') {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0D9488 0%, #115E59 50%, #134E4A 100%)' }}
      >
        {/* Decorative dot */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A7F3D0' }} />

        {/* Logo */}
        {data.logoUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img src={data.logoUrl} alt={t('alt.logo')} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
        )}

        {/* QR Code */}
        {data.qrEnabled && qrCode && (
          <div style={{ marginBottom: '8px' }}>
            <img src={qrCode} alt={t('alt.qrCode')} style={{ width: '88px', height: '88px', backgroundColor: 'white', padding: '6px', borderRadius: '4px' }} />
          </div>
        )}

        {/* Website */}
        {data.website && data.qrEnabled && qrCode && (
          <p style={{ fontSize: '10px', color: '#A7F3D0', textAlign: 'center' }} dir="ltr">
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Minimal template back (default)
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'white' }}
    >
      {/* Subtle border */}
      <div style={{ position: 'absolute', inset: '16px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />

      {/* Logo */}
      {data.logoUrl && (
        <div style={{ marginBottom: '8px' }}>
          <img
            src={data.logoUrl}
            alt={t('alt.logo')}
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* QR Code */}
      {data.qrEnabled && qrCode && (
        <div style={{ marginBottom: '8px' }}>
          <img
            src={qrCode}
            alt={t('alt.qrCode')}
            style={{ width: '88px', height: '88px', borderRadius: '4px' }}
          />
        </div>
      )}

      {/* Website URL below QR */}
      {data.website && data.qrEnabled && qrCode && (
        <p
          style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}
          dir="ltr"
        >
          {data.website}
        </p>
      )}
    </div>
  );
}
