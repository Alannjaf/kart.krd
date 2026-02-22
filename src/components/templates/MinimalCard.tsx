'use client';

import { CardData } from '@/types/card';

interface Props {
  data: CardData;
}

export default function MinimalCard({ data }: Props) {
  const isRTL = data.language !== 'en';
  const fontFamily = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif";

  return (
    <div
      className="w-full h-full bg-white relative overflow-hidden flex flex-col justify-between"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily }}
    >
      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-7 py-5">
        {/* Top: Name & title */}
        <div>
          <h1
            className="text-gray-900 font-light tracking-wide leading-tight"
            style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', marginBottom: '4px' }}
          >
            {data.name || 'ناوی تەواو'}
          </h1>
          <p
            className="text-gray-500 font-light"
            style={{ fontSize: 'clamp(8px, 2vw, 12px)' }}
          >
            {data.title || 'پیشە'}
          </p>
          {data.company && (
            <p
              className="text-gray-400 font-light"
              style={{ fontSize: 'clamp(7px, 1.8vw, 10px)', marginTop: '2px' }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-2" />

        {/* Bottom: Contact info */}
        <div className="space-y-1">
          {data.phone && (
            <p className="text-gray-500 font-light" style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }} dir="ltr">
              {data.phone}
            </p>
          )}
          {data.email && (
            <p className="text-gray-400 font-light" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }} dir="ltr">
              {data.email}
            </p>
          )}
          {data.website && (
            <p className="text-gray-400 font-light" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }} dir="ltr">
              {data.website}
            </p>
          )}
          {data.address && (
            <p className="text-gray-400 font-light" style={{ fontSize: 'clamp(6px, 1.6vw, 9px)' }}>
              {data.address}
            </p>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-300/80 select-none"
        style={{ fontSize: '7px' }}
      >
        kart.krd
      </div>
    </div>
  );
}
