'use client';

import { TemplateId, TEMPLATES, CardData } from '@/types/card';
import ModernCard from './templates/ModernCard';
import ClassicCard from './templates/ClassicCard';
import BoldCard from './templates/BoldCard';
import MinimalCard from './templates/MinimalCard';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily, type TranslationKey } from '@/lib/i18n';

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
  cardData: CardData;
}

function MiniPreview({ templateId, data, t }: { templateId: TemplateId; data: CardData; t: (key: TranslationKey) => string }) {
  const previewData = {
    ...data,
    template: templateId,
    name: data.name || t('preview.name'),
    title: data.title || t('preview.title'),
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
  const { locale, t } = useLanguage();
  const fontFamily = getFontFamily(locale);

  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-3"
        style={{ fontFamily }}
      >
        {t('form.selectTemplate')}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => {
          const templateName = t(`template.${tpl.id}` as TranslationKey);
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                selected === tpl.id
                  ? 'border-purple-600 shadow-lg shadow-purple-200'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              style={{ aspectRatio: '3.5/2' }}
              title={templateName}
            >
              <MiniPreview templateId={tpl.id} data={cardData} t={t} />

              {/* Selected indicator */}
              {selected === tpl.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Template name overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 text-white text-center py-0.5 bg-black/40"
                style={{ fontSize: '9px', fontFamily }}
              >
                {templateName}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
