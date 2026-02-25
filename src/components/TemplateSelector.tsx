'use client';

import { useState } from 'react';
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

// Toast component for Kurdish lock message
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }} className="text-sm">
        {message}
      </span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function MiniPreview({ templateId, data }: { templateId: TemplateId; data: CardData }) {
  const previewData = {
    ...data,
    template: templateId,
    name: data.name || 'ئەحمەد عەلی',
    title: data.title || 'بەڕێوەبەر',
  };

  switch (templateId) {
    case 'modern':
      return <ModernCard data={previewData} />;
    case 'classic':
      return <ClassicCard data={previewData} />;
    case 'bold':
      return <BoldCard data={previewData} />;
    case 'minimal':
      return <MinimalCard data={previewData} />;
  }
}

export default function TemplateSelector({ selected, onChange, cardData }: Props) {
  const [showToast, setShowToast] = useState(false);

  const handleTemplateClick = (templateId: TemplateId) => {
    const template = TEMPLATES.find(t => t.id === templateId);

    if (!template?.isFree) {
      // Show Kurdish toast message for locked templates
      setShowToast(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Allow selection for free templates
    onChange(templateId);
  };

  return (
    <div>
      <Toast
        message="ئەم شێوازە داخراوە، تەنها شێوازی مۆدێرن بەخۆڕاییە"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <label
        className="block text-sm font-medium text-gray-700 mb-3"
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      >
        شێواز هەڵبژێرە
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleTemplateClick(tpl.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              selected === tpl.id
                ? 'border-purple-600 shadow-lg shadow-purple-200'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            style={{ aspectRatio: '3.5/2' }}
            title={tpl.labelKu}
          >
            <MiniPreview templateId={tpl.id} data={cardData} />

            {/* Lock icon for premium templates */}
            {!tpl.isFree && (
              <div className="absolute top-1 left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}

            {/* Selected indicator */}
            {selected === tpl.id && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Premium overlay for locked templates */}
            {!tpl.isFree && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            )}

            {/* Template name overlay */}
            <div className={`absolute bottom-0 left-0 right-0 text-white text-center py-0.5 ${
              tpl.isFree ? 'bg-black/40' : 'bg-red-500/60'
            }`} style={{ fontSize: '9px', fontFamily: "'Noto Sans Arabic', sans-serif" }}>
              {tpl.labelKu} {!tpl.isFree && '🔒'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
