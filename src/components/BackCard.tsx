'use client';

import { CardData, TemplateId } from '@/types/card';
import { useState, useEffect } from 'react';
import { generateVCardQR } from '@/lib/qrUtils';

interface Props {
  data: CardData;
  template: TemplateId;
}

export default function BackCard({ data, template }: Props) {
  const [qrCode, setQrCode] = useState<string>('');
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";

  useEffect(() => {
    if (data.qrEnabled) {
      generateVCardQR(data).then(setQrCode);
    } else {
      setQrCode('');
    }
  }, [data.qrEnabled, data.name, data.title, data.company, data.phone, data.email, data.website, data.address]);

  // Modern template back
  if (template === 'modern') {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden flex flex-col items-center justify-center"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily }}
      >
        {/* Accent bar */}
        <div className="absolute left-0 top-0 w-2.5 h-full bg-gradient-to-b from-yellow-400 to-amber-500" />

        {/* Logo - centered, larger */}
        {data.logoUrl && (
          <div className="mb-4">
            <img
              src={data.logoUrl}
              alt="Logo"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        )}

        {/* Company name */}
        {data.company && (
          <h2
            className="text-white font-bold text-center mb-6"
            style={{ fontSize: '18px' }}
          >
            {data.company}
          </h2>
        )}

        {/* QR Code - centered, larger */}
        {data.qrEnabled && qrCode && (
          <div className="mb-4">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-[120px] h-[120px] bg-white p-2 rounded"
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            className="text-purple-300 text-center"
            style={{ fontSize: '12px' }}
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
        className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden flex flex-col items-center justify-center"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily }}
      >
        {/* Outer border decoration */}
        <div className="absolute inset-2 border-2 border-amber-600/40 rounded" />
        <div className="absolute inset-3 border border-amber-600/20 rounded" />

        {/* Logo - centered, larger */}
        {data.logoUrl && (
          <div className="mb-4">
            <img
              src={data.logoUrl}
              alt="Logo"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        )}

        {/* Company name */}
        {data.company && (
          <h2
            className="text-gray-900 font-bold text-center mb-6"
            style={{
              fontSize: '18px',
              fontFamily: isRTL ? "'Noto Sans Arabic', serif" : "Georgia, serif"
            }}
          >
            {data.company}
          </h2>
        )}

        {/* QR Code - centered, larger */}
        {data.qrEnabled && qrCode && (
          <div className="mb-4">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-[120px] h-[120px] bg-transparent rounded"
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            className="text-gray-600 text-center"
            style={{ fontSize: '12px' }}
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
        className="w-full h-full bg-gray-950 relative overflow-hidden flex flex-col items-center justify-center"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 w-full h-0.5 bg-gray-800" />

        {/* Logo - centered, larger */}
        {data.logoUrl && (
          <div className="mb-4">
            <img
              src={data.logoUrl}
              alt="Logo"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        )}

        {/* Company name */}
        {data.company && (
          <div className="mb-6">
            <h2
              className="text-white font-extrabold text-center"
              style={{ fontSize: '18px' }}
            >
              {data.company}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-0.5 w-6 bg-yellow-400" />
            </div>
          </div>
        )}

        {/* QR Code - centered, larger */}
        {data.qrEnabled && qrCode && (
          <div className="mb-4">
            <img
              src={qrCode}
              alt="QR Code"
              className="w-[120px] h-[120px] bg-white p-2 rounded"
            />
          </div>
        )}

        {/* Website URL below QR */}
        {data.website && data.qrEnabled && qrCode && (
          <p
            className="text-gray-400 text-center"
            style={{ fontSize: '12px' }}
            dir="ltr"
          >
            {data.website}
          </p>
        )}
      </div>
    );
  }

  // Minimal template back (default)
  return (
    <div
      className="w-full h-full bg-white relative overflow-hidden flex flex-col items-center justify-center"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Subtle border */}
      <div className="absolute inset-4 border border-gray-200 rounded" />

      {/* Logo - centered, larger */}
      {data.logoUrl && (
        <div className="mb-4">
          <img
            src={data.logoUrl}
            alt="Logo"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )}

      {/* Company name */}
      {data.company && (
        <h2
          className="text-gray-900 font-light text-center mb-6"
          style={{ fontSize: '18px' }}
        >
          {data.company}
        </h2>
      )}

      {/* QR Code - centered, larger */}
      {data.qrEnabled && qrCode && (
        <div className="mb-4">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-[120px] h-[120px] bg-transparent rounded"
          />
        </div>
      )}

      {/* Website URL below QR */}
      {data.website && data.qrEnabled && qrCode && (
        <p
          className="text-gray-500 text-center"
          style={{ fontSize: '12px' }}
          dir="ltr"
        >
          {data.website}
        </p>
      )}
    </div>
  );
}