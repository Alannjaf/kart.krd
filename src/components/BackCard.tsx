'use client';

import { CardData } from '@/types/card';
import { useState, useEffect } from 'react';
import { generateVCardQR } from '@/lib/qrUtils';

interface Props {
  data: CardData;
}

// Get template accent color for border
function getAccentColor(template: string): string {
  switch (template) {
    case 'modern':
      return '#FBBF24'; // yellow-400
    case 'classic':
      return '#D97706'; // amber-600
    case 'bold':
      return '#FBBF24'; // yellow-400
    case 'minimal':
      return '#D1D5DB'; // gray-300
    default:
      return '#D1D5DB';
  }
}

export default function BackCard({ data }: Props) {
  const [qrCode, setQrCode] = useState<string>('');
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";
  const accentColor = getAccentColor(data.template);

  useEffect(() => {
    if (data.qrEnabled) {
      generateVCardQR(data).then(setQrCode);
    } else {
      setQrCode('');
    }
  }, [data]);

  return (
    <div
      className="w-full h-full bg-white relative overflow-hidden flex flex-col items-center justify-center"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        fontFamily,
        border: `2px solid ${accentColor}`,
        borderRadius: '8px'
      }}
    >
      {/* Logo - centered, larger */}
      {data.logoUrl && (
        <div className="mb-4">
          <img
            src={data.logoUrl}
            alt="Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
      )}

      {/* Company name */}
      {data.company && (
        <h2
          className="text-gray-800 font-semibold text-center mb-6"
          style={{
            fontSize: '16px',
            fontFamily: isRTL ? "'Noto Sans Arabic', serif" : "Georgia, serif"
          }}
        >
          {data.company}
        </h2>
      )}

      {/* QR Code - centered, larger */}
      {data.qrEnabled && qrCode && (
        <div className="mt-auto mb-4">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-25 h-25 bg-transparent rounded"
            style={{ width: '100px', height: '100px' }}
          />
        </div>
      )}
    </div>
  );
}