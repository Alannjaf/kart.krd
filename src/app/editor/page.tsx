'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CardData, TemplateId, defaultCardData, TEMPLATES } from '@/types/card';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import TemplateSelector from '@/components/TemplateSelector';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { generatePdf } from '@/lib/generatePdf';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily, TranslationKey } from '@/lib/i18n';

const STORAGE_KEY = 'kart-krd-card-data';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]+$/;

function loadCardData(): CardData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.name === 'string' && typeof parsed.template === 'string') {
      return { ...defaultCardData, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

function saveCardData(data: CardData): boolean {
  try {
    const { logoUrl, ...rest } = data;
    void logoUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    return true;
  } catch {
    return false;
  }
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

function CardSideToggle({ showBack, onToggle, fontFamily, t }: {
  showBack: boolean;
  onToggle: (back: boolean) => void;
  fontFamily: string;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div
      className="flex bg-[var(--color-surface)] rounded-md p-0.5 border border-[var(--color-border)]"
      role="radiogroup"
      aria-label={t('editor.cardSide')}
    >
      <button
        role="radio"
        aria-checked={!showBack}
        onClick={() => onToggle(false)}
        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
          !showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
        }`}
        style={{ fontFamily }}
      >
        {t('editor.front')}
      </button>
      <button
        role="radio"
        aria-checked={showBack}
        onClick={() => onToggle(true)}
        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
          showBack ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)]'
        }`}
        style={{ fontFamily }}
      >
        {t('editor.back')}
      </button>
    </div>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);
  const urlTemplate = searchParams.get('template') as TemplateId;

  const validTemplate = TEMPLATES.find(tpl => tpl.id === urlTemplate);
  const initialTemplate = validTemplate ? urlTemplate : 'modern';

  const [cardData, setCardData] = useState<CardData>(() => {
    const stored = loadCardData();
    if (stored) {
      return { ...stored, template: validTemplate ? urlTemplate : stored.template };
    }
    return { ...defaultCardData, template: initialTemplate };
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok = saveCardData(cardData);
    if (!ok && !saveError) setSaveError(true);
    else if (ok && saveError) setSaveError(false);
  }, [cardData, saveError]);

  const validateCardData = useCallback((data: CardData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim()) errors.name = t('validation.nameRequired');
    if (data.email.trim() && !EMAIL_REGEX.test(data.email.trim())) errors.email = t('validation.emailInvalid');
    if (data.phone.trim() && !PHONE_REGEX.test(data.phone.trim())) errors.phone = t('validation.phoneInvalid');
    return errors;
  }, [t]);

  const handleClear = useCallback(() => {
    if (!window.confirm(t('editor.clearConfirm'))) return;
    const cleared = { ...defaultCardData, template: cardData.template };
    setCardData(cleared);
    setFormErrors({});
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template]);

  const handleDownloadPdf = useCallback(async () => {
    const errors = validateCardData(cardData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setActiveTab('edit');
      return;
    }
    if (!cardRef.current) return;
    setIsGenerating(true);
    setPdfSuccess(false);
    try {
      const showBackCallback = async (showBackView: boolean) => {
        setShowBack(showBackView);
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
      };
      await generatePdf(cardRef.current, cardData, showBackCallback);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setPdfError(true);
      setTimeout(() => setPdfError(false), 4000);
    } finally {
      setIsGenerating(false);
    }
  }, [cardData, validateCardData, t]);

  const handleCardChange = useCallback((newData: CardData) => {
    setCardData(newData);
    if (formErrors.name && newData.name.trim()) setFormErrors(prev => ({ ...prev, name: undefined }));
    if (formErrors.email && (!newData.email.trim() || EMAIL_REGEX.test(newData.email.trim()))) setFormErrors(prev => ({ ...prev, email: undefined }));
    if (formErrors.phone && (!newData.phone.trim() || PHONE_REGEX.test(newData.phone.trim()))) setFormErrors(prev => ({ ...prev, phone: undefined }));
  }, [formErrors]);

  const downloadButton = (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className={`inline-flex items-center justify-center h-11 px-6 rounded-md text-sm font-semibold transition-colors ${
        pdfSuccess
          ? 'bg-green-600 text-white'
          : isGenerating
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'
      }`}
      style={{ fontFamily }}
    >
      {pdfSuccess ? t('editor.downloaded') : isGenerating ? t('editor.downloading') : t('editor.downloadPdf')}
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir={dir}>
      {/* PDF Error Toast */}
      {pdfError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium" role="alert">
          {t('editor.pdfError')}
        </div>
      )}
      {/* Save Error Banner */}
      {saveError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800" role="alert">
          {locale === 'en' ? 'Unable to save — storage may be full or unavailable' : locale === 'ar' ? 'تعذر الحفظ — قد يكون التخزين ممتلئًا' : 'پاشەکەوتکردن سەرنەکەوت — بیرگە پڕ بووە'}
        </div>
      )}
      {/* Header */}
      <header className="bg-[var(--color-panel)] border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="font-bold text-[var(--color-text)]" style={{ fontFamily }}>
              kart.krd
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <div className="hidden lg:block">
              {downloadButton}
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
      {/* Desktop layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left: Form */}
            <div className="w-[380px] flex-shrink-0">
              <div className="bg-[var(--color-panel)] rounded-md border border-[var(--color-border)] p-5 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                    {t('editor.enterInfo')}
                  </h2>
                  <button
                    onClick={handleClear}
                    className="text-xs text-[var(--color-error)] hover:underline"
                    style={{ fontFamily }}
                  >
                    {t('editor.clear')}
                  </button>
                </div>
                <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />
              </div>
            </div>

            {/* Right: Preview + Templates */}
            <div className="flex-1 min-w-0">
              <div className="bg-[var(--color-panel)] rounded-md border border-[var(--color-border)] p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                    {t('editor.livePreview')}
                  </h2>
                  <div className="flex items-center gap-3">
                    <CardSideToggle showBack={showBack} onToggle={setShowBack} fontFamily={fontFamily} t={t} />
                    <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
                      3.5&quot; × 2&quot;
                    </span>
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <CardPreview ref={cardRef} data={cardData} showBack={showBack} />
                </div>

                <p className="text-center text-xs text-[var(--color-text-secondary)] mt-4" style={{ fontFamily }}>
                  {t('editor.watermarkNote')}
                </p>
              </div>

              <div className="bg-[var(--color-panel)] rounded-md border border-[var(--color-border)] p-5">
                <TemplateSelector
                  selected={cardData.template}
                  onChange={(tpl) => setCardData({ ...cardData, template: tpl })}
                  cardData={cardData}
                  layout="grid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout with tab bar */}
      <div className="lg:hidden pb-16">
        {/* Edit tab */}
        <div className={`px-4 py-4 space-y-4 ${activeTab !== 'edit' ? 'hidden' : ''}`} role="tabpanel">
          <TemplateSelector
            selected={cardData.template}
            onChange={(tpl) => setCardData({ ...cardData, template: tpl })}
            cardData={cardData}
            layout="scroll"
          />
          <div className="bg-[var(--color-panel)] rounded-md border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily }}>
                {t('editor.enterInfo')}
              </h2>
              <button
                onClick={handleClear}
                className="text-xs text-[var(--color-error)] hover:underline"
                style={{ fontFamily }}
              >
                {t('editor.clear')}
              </button>
            </div>
            <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />
          </div>
        </div>

        {/* Preview tab */}
        <div className={`px-4 py-4 space-y-4 ${activeTab !== 'preview' ? 'hidden' : ''}`} role="tabpanel">
          <div className="flex items-center justify-between">
            <CardSideToggle showBack={showBack} onToggle={setShowBack} fontFamily={fontFamily} t={t} />
            <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
              3.5&quot; × 2&quot;
            </span>
          </div>

          <CardPreview ref={cardRef} data={cardData} showBack={showBack} />

          <div className="flex justify-center">
            {downloadButton}
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)]" style={{ fontFamily }}>
            {t('editor.watermarkNote')}
          </p>
        </div>

        {/* Bottom tab bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-panel)] border-t border-[var(--color-border)] z-50 flex" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'edit'}
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex flex-col items-center justify-center h-14 gap-0.5 transition-colors ${
              activeTab === 'edit' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-[10px] font-medium" style={{ fontFamily }}>{t('editor.tabEdit')}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'preview'}
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex flex-col items-center justify-center h-14 gap-0.5 transition-colors ${
              activeTab === 'preview' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-medium" style={{ fontFamily }}>{t('editor.tabPreview')}</span>
          </button>
        </div>
      </div>
      </main>
    </div>
  );
}

export default function EditorPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
          {t('editor.loading')}
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
