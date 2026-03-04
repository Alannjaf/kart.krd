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
import { getFontFamily } from '@/lib/i18n';

const STORAGE_KEY = 'kart-krd-card-data';

function loadCardData(): CardData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Validate it has the expected shape
    if (parsed && typeof parsed.name === 'string' && typeof parsed.template === 'string') {
      return { ...defaultCardData, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

function saveCardData(data: CardData) {
  try {
    // Don't persist logoUrl to localStorage (too large as data URL)
    const { logoUrl, ...rest } = data;
    void logoUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Silently fail if storage is full
  }
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const { locale, dir, t } = useLanguage();
  const fontFamily = getFontFamily(locale);
  const urlTemplate = searchParams.get('template') as TemplateId;

  // Accept any valid template from URL
  const validTemplate = TEMPLATES.find(t => t.id === urlTemplate);
  const initialTemplate = validTemplate ? urlTemplate : 'modern';

  const [cardData, setCardData] = useState<CardData>(() => {
    const stored = loadCardData();
    if (stored) {
      // URL template overrides stored template
      return { ...stored, template: validTemplate ? urlTemplate : stored.template };
    }
    return { ...defaultCardData, template: initialTemplate };
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const cardRef = useRef<HTMLDivElement>(null);

  // Save to localStorage on every change
  useEffect(() => {
    saveCardData(cardData);
  }, [cardData]);

  const validateCardData = useCallback((data: CardData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim()) {
      errors.name = t('validation.nameRequired');
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = t('validation.emailInvalid');
    }
    if (data.phone.trim() && !/^[0-9+\-\s()]+$/.test(data.phone.trim())) {
      errors.phone = t('validation.phoneInvalid');
    }
    return errors;
  }, [t]);

  const handleClear = useCallback(() => {
    const cleared = { ...defaultCardData, template: cardData.template };
    setCardData(cleared);
    setFormErrors({});
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template]);

  const handleDownloadPdf = useCallback(async () => {
    // Validate before generating
    const errors = validateCardData(cardData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!cardRef.current) return;
    setIsGenerating(true);
    setPdfSuccess(false);
    try {
      const showBackCallback = async (showBackView: boolean) => {
        setShowBack(showBackView);
        await new Promise(resolve => setTimeout(resolve, 200));
      };

      await generatePdf(cardRef.current, cardData, showBackCallback);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(t('editor.pdfError'));
    } finally {
      setIsGenerating(false);
    }
  }, [cardData, validateCardData, t]);

  const handleCardChange = useCallback((newData: CardData) => {
    setCardData(newData);
    // Clear errors for fields that are now valid
    if (formErrors.name && newData.name.trim()) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
    if (formErrors.email && (!newData.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.email.trim()))) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
    if (formErrors.phone && (!newData.phone.trim() || /^[0-9+\-\s()]+$/.test(newData.phone.trim()))) {
      setFormErrors(prev => ({ ...prev, phone: undefined }));
    }
  }, [formErrors]);

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">K</span>
            </div>
            <span className="font-bold text-gray-900" style={{ fontFamily }}>
              kart.krd
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="!bg-gray-100 !border-gray-200" />
            <span
              className="text-sm text-gray-500 hidden sm:block"
              style={{ fontFamily }}
            >
              {t('nav.cardMaker')}
            </span>
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-md ${
                pdfSuccess
                  ? 'bg-green-500 text-white shadow-green-200'
                  : isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-amber-200'
              }`}
              style={{ fontFamily }}
            >
              {pdfSuccess ? (
                <>{t('editor.downloaded')}</>
              ) : isGenerating ? (
                <>{t('editor.downloading')}</>
              ) : (
                <>{t('editor.downloadPdf')}</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: Form */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20 max-h-[calc(100vh-90px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h2
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily }}
                >
                  {t('editor.enterInfo')}
                </h2>
                <button
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2 py-1 rounded-lg transition-all"
                  style={{ fontFamily }}
                >
                  {t('editor.clear')}
                </button>
              </div>
              <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />
            </div>
          </div>

          {/* Right panel: Preview + Template selector */}
          <div className="flex-1 min-w-0">
            {/* Live preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily }}
                >
                  {t('editor.livePreview')}
                </h2>
                <div className="flex items-center gap-3">
                  {/* Front/Back toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setShowBack(false)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        !showBack
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      style={{ fontFamily }}
                    >
                      {t('editor.front')}
                    </button>
                    <button
                      onClick={() => setShowBack(true)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        showBack
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      style={{ fontFamily }}
                    >
                      {t('editor.back')}
                    </button>
                  </div>
                  <span
                    className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                    style={{ fontFamily }}
                  >
                    3.5&quot; × 2&quot;
                  </span>
                </div>
              </div>

              {/* Card preview */}
              <div className="max-w-lg mx-auto">
                <CardPreview ref={cardRef} data={cardData} showBack={showBack} />
              </div>

              {/* Download button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg w-full max-w-xs justify-center ${
                    pdfSuccess
                      ? 'bg-green-500 text-white'
                      : isGenerating
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-600 hover:to-purple-800 shadow-purple-200'
                  }`}
                  style={{ fontFamily }}
                >
                  {pdfSuccess ? t('editor.downloaded') : isGenerating ? t('editor.wait') : t('editor.downloadPdfFree')}
                </button>
              </div>

              {/* Watermark note */}
              <p
                className="text-center text-xs text-gray-400 mt-3"
                style={{ fontFamily }}
              >
                {t('editor.watermarkNote')}
              </p>
            </div>

            {/* Template selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <TemplateSelector
                selected={cardData.template}
                onChange={(tpl) => setCardData({ ...cardData, template: tpl })}
                cardData={cardData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="text-gray-500"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          {t('editor.loading')}
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
