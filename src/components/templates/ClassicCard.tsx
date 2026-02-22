'use client';

import { CardData } from '@/types/card';

interface Props {
  data: CardData;
}

export default function ClassicCard({ data }: Props) {
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";

  return (
    <div
      className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden flex items-center justify-center"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Outer border decoration */}
      <div className="absolute inset-2 border-2 border-amber-600/40 rounded" />
      <div className="absolute inset-3 border border-amber-600/20 rounded" />

      {/* Content */}
      <div className="relative z-10 w-full px-8 py-4 flex flex-col justify-between h-full">
        {/* Top: Name section */}
        <div className="text-center pt-3">
          <h1
            className="text-gray-900 font-bold leading-tight"
            style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', fontFamily: isRTL ? "'Noto Sans Arabic', serif" : "Georgia, serif", marginBottom: '4px' }}
          >
            {data.name || 'ناوی تەواو'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-1">
            <div className="h-px bg-amber-600/50 flex-1" />
            <p
              className="text-amber-700 font-medium"
              style={{ fontSize: 'clamp(8px, 2vw, 12px)' }}
            >
              {data.title || 'پیشە'}
            </p>
            <div className="h-px bg-amber-600/50 flex-1" />
          </div>
          {data.company && (
            <p
              className="text-gray-600 italic"
              style={{ fontSize: 'clamp(7px, 1.8vw, 11px)' }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Bottom: Contact info */}
        <div className="pb-3">
          <div className="h-px bg-amber-600/30 mb-3" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {data.phone && (
              <div className="text-gray-600 flex items-center gap-1" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
                <span className="text-amber-600">☎</span>
                <span dir="ltr">{data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="text-gray-600 flex items-center gap-1" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
                <span className="text-amber-600">@</span>
                <span dir="ltr">{data.email}</span>
              </div>
            )}
            {data.website && (
              <div className="text-gray-600 flex items-center gap-1" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
                <span className="text-amber-600">◈</span>
                <span dir="ltr">{data.website}</span>
              </div>
            )}
            {data.address && (
              <div className="text-gray-600 flex items-center gap-1" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
                <span className="text-amber-600">◉</span>
                <span>{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-amber-400/40 select-none"
        style={{ fontSize: '7px' }}
      >
        kart.krd
      </div>
    </div>
  );
}
