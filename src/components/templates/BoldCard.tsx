'use client';

import { CardData } from '@/types/card';

interface Props {
  data: CardData;
}

export default function BoldCard({ data }: Props) {
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";

  return (
    <div
      className="w-full h-full bg-gray-950 relative overflow-hidden flex flex-col justify-between"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Top accent bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-6 py-4">
        {/* Name & title — large and prominent */}
        <div>
          <h1
            className="text-white font-extrabold leading-none tracking-tight"
            style={{ fontSize: 'clamp(16px, 4vw, 26px)', marginBottom: '6px' }}
          >
            {data.name || 'ناوی تەواو'}
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-yellow-400" />
            <p
              className="text-yellow-400 font-semibold uppercase tracking-widest"
              style={{ fontSize: 'clamp(7px, 1.8vw, 11px)' }}
            >
              {data.title || 'پیشە'}
            </p>
          </div>
          {data.company && (
            <p
              className="text-gray-400 mt-1"
              style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Contact info — right/bottom aligned */}
        <div className="space-y-0.5">
          {data.phone && (
            <p className="text-gray-300 font-medium" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }} dir="ltr">
              <span className="text-yellow-400 mr-1">+</span>{data.phone}
            </p>
          )}
          {data.email && (
            <p className="text-gray-400" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }} dir="ltr">
              {data.email}
            </p>
          )}
          {data.website && (
            <p className="text-gray-400" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }} dir="ltr">
              {data.website}
            </p>
          )}
          {data.address && (
            <p className="text-gray-500" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
              {data.address}
            </p>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="w-full h-0.5 bg-gray-800 flex-shrink-0" />

      {/* Watermark */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-700/60 select-none"
        style={{ fontSize: '7px' }}
      >
        kart.krd
      </div>
    </div>
  );
}
