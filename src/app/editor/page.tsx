'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CardData, TemplateId, defaultCardData } from '@/types/card';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import TemplateSelector from '@/components/TemplateSelector';
import { generatePdf } from '@/lib/generatePdf';

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTemplate = (searchParams.get('template') as TemplateId) || 'modern';

  const [cardData, setCardData] = useState<CardData>({
    ...defaultCardData,
    template: initialTemplate,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setPdfSuccess(false);
    try {
      await generatePdf(cardRef.current, cardData);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF دروستکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.');
    } finally {
      setIsGenerating(false);
    }
  }, [cardData]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">K</span>
            </div>
            <span className="font-bold text-gray-900" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
              kart.krd
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="text-sm text-gray-500 hidden sm:block"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              ئامێری دروستکردنی کارت
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
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              {pdfSuccess ? (
                <>✓ دابەزیندرا</>
              ) : isGenerating ? (
                <>⏳ چاوەڕێبکە...</>
              ) : (
                <>⬇ PDF دابەزێنە</>
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
              <h2
                className="text-base font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                زانیاریەکانت داخڵ بکە
              </h2>
              <CardForm data={cardData} onChange={setCardData} />
            </div>
          </div>

          {/* Right panel: Preview + Template selector */}
          <div className="flex-1 min-w-0">
            {/* Live preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  پێشبینی زیندوو
                </h2>
                <span
                  className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  3.5&quot; × 2&quot;
                </span>
              </div>

              {/* Card preview — constrained to business card aspect ratio */}
              <div className="max-w-lg mx-auto">
                <CardPreview ref={cardRef} data={cardData} />
              </div>

              {/* Download button (mobile friendly, below card) */}
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
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  {pdfSuccess ? '✓ PDF دابەزیندرا' : isGenerating ? 'چاوەڕێبکە...' : '⬇ PDF دابەزێنە — بەخۆڕایی'}
                </button>
              </div>

              {/* Watermark note */}
              <p
                className="text-center text-xs text-gray-400 mt-3"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                تێبینی: "kart.krd" بە وتەی بچووک لە خوارەوە زیاد دەکرێت
              </p>
            </div>

            {/* Template selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <TemplateSelector
                selected={cardData.template}
                onChange={(t) => setCardData({ ...cardData, template: t })}
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
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="text-gray-500"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          چاوەڕێبکە...
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
