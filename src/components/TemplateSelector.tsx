'use client';

import { useRef, useEffect, useState, type ComponentType } from 'react';
import { TemplateId, TEMPLATES, CardData } from '@/types/card';
import ModernCard from './templates/ModernCard';
import ClassicCard from './templates/ClassicCard';
import BoldCard from './templates/BoldCard';
import MinimalCard from './templates/MinimalCard';

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
  cardData: CardData;
}

const CARD_WIDTH = 350;
const CARD_HEIGHT = 200;

const templateComponents: Record<TemplateId, ComponentType<{ data: CardData }>> = {
  modern: ModernCard,
  classic: ClassicCard,
  bold: BoldCard,
  minimal: MinimalCard,
};

function MiniPreview({ templateId, data }: { templateId: TemplateId; data: CardData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      if (width > 0) setScale(width / CARD_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const previewData = {
    ...data,
    template: templateId,
    name: data.name || 'ئەحمەد عەلی',
    title: data.title || 'بەڕێوەبەر',
  };

  const Card = templateComponents[templateId];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${CARD_WIDTH}/${CARD_HEIGHT}`,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        opacity: scale > 0 ? 1 : 0,
      }}>
        <Card data={previewData} />
      </div>
    </div>
  );
}

export default function TemplateSelector({ selected, onChange, cardData }: Props) {
  return (
    <div>
      <label
        className="block text-sm font-semibold text-gray-700 mb-3"
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      >
        شێواز هەڵبژێرە
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => {
          const isSelected = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              className={`group text-start rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                isSelected
                  ? 'border-purple-600 shadow-md shadow-purple-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={tpl.label}
            >
              <MiniPreview templateId={tpl.id} data={cardData} />

              {/* Template label */}
              <div className={`px-3 py-1.5 flex items-center justify-between border-t ${
                isSelected
                  ? 'bg-purple-50 border-purple-100'
                  : 'bg-white border-gray-100 group-hover:bg-gray-50'
              }`}>
                <span
                  className={`text-[11px] font-semibold tracking-wide uppercase ${
                    isSelected ? 'text-purple-700' : 'text-gray-500'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em' }}
                >
                  {tpl.label}
                </span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
