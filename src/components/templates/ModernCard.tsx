'use client';

import { CardData } from '@/types/card';

interface Props {
  data: CardData;
}

export default function ModernCard({ data }: Props) {
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";

  return (
    <div
      className="w-full h-full bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden flex"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Left accent bar */}
      <div className="w-2.5 h-full bg-gradient-to-b from-yellow-400 to-amber-500 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-5">
        {/* Top: Name & title */}
        <div>
          <h1
            className="text-white font-bold leading-tight"
            style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', marginBottom: '4px' }}
          >
            {data.name || 'ناوی تەواو'}
          </h1>
          <p
            className="text-yellow-400 font-medium"
            style={{ fontSize: 'clamp(9px, 2.2vw, 13px)' }}
          >
            {data.title || 'پیشە'}
          </p>
          {data.company && (
            <p
              className="text-purple-300"
              style={{ fontSize: 'clamp(8px, 2vw, 11px)', marginTop: '2px' }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Bottom: Contact info */}
        <div className="space-y-1">
          {data.phone && (
            <div className="flex items-center gap-2 text-purple-200" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>
              <span className="text-yellow-400">📞</span>
              <span dir="ltr">{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-2 text-purple-200" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>
              <span className="text-yellow-400">✉</span>
              <span dir="ltr">{data.email}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2 text-purple-200" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>
              <span className="text-yellow-400">🌐</span>
              <span dir="ltr">{data.website}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-2 text-purple-200" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}>
              <span className="text-yellow-400">📍</span>
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-purple-600/50 select-none"
        style={{ fontSize: '7px' }}
      >
        kart.krd
      </div>
    </div>
  );
}
