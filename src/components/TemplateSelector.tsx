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
  layout?: 'grid' | 'scroll';
}

function MiniPreview({ templateId, data, t }: { templateId: TemplateId; data: CardData; t: (key: TranslationKey) => string }) {
  const previewData = {
    ...data,
    template: templateId,
    name: data.name || t('preview.name'),
    title: data.title || t('preview.title'),
  };

  switch (templateId) {
    case 'modern': return <ModernCard data={previewData} />;
    case 'classic': return <ClassicCard data={previewData} />;
    case 'bold': return <BoldCard data={previewData} />;
    case 'minimal': return <MinimalCard data={previewData} />;
  }
}

export default function TemplateSelector({ selected, onChange, cardData, layout = 'grid' }: Props) {
  const { locale, t } = useLanguage();
  const fontFamily = getFontFamily(locale);

  if (layout === 'scroll') {
    return (
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
          {t('form.selectTemplate')}
        </label>
        <div className="flex gap-3 overflow-x-auto scroll-hidden pb-2">
          {TEMPLATES.map((tpl) => {
            const templateName = t(`template.${tpl.id}` as TranslationKey);
            return (
              <button
                key={tpl.id}
                onClick={() => onChange(tpl.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-32 rounded-md overflow-hidden border-2 transition-all ${
                    selected === tpl.id
                      ? 'border-[var(--color-accent)] scale-[1.02]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                  style={{ aspectRatio: '3.5/2' }}
                >
                  <MiniPreview templateId={tpl.id} data={cardData} t={t} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    selected === tpl.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontFamily }}
                >
                  {templateName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily }}>
        {t('form.selectTemplate')}
      </label>
      <div className="grid grid-cols-4 gap-3">
        {TEMPLATES.map((tpl) => {
          const templateName = t(`template.${tpl.id}` as TranslationKey);
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-full rounded-md overflow-hidden border-2 transition-all ${
                  selected === tpl.id
                    ? 'border-[var(--color-accent)] scale-[1.02]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                }`}
                style={{ aspectRatio: '3.5/2' }}
              >
                <MiniPreview templateId={tpl.id} data={cardData} t={t} />
              </div>
              <span
                className={`text-xs font-medium ${
                  selected === tpl.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                }`}
                style={{ fontFamily }}
              >
                {templateName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
