'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CardData, TemplateId, defaultCardData, TEMPLATES } from '@/types/card';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import TemplateSelector from '@/components/TemplateSelector';
import { QRCodeSVG } from 'qrcode.react';
import { generatePdf } from '@/lib/generatePdf';
import { useLanguage } from '@/context/LanguageContext';
import { getFontFamily, TranslationKey } from '@/lib/i18n';
import { SignedIn, SignedOut } from '@neondatabase/auth/react';
import CompactUserButton from '@/components/CompactUserButton';
import { authClient } from '@/lib/auth/client';

const STORAGE_KEY = 'kart-krd-card-data';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]+$/;

interface SavedCard {
  id: string;
  slug: string;
  card_name: string;
  template: string;
  views: number;
  created_at: string;
  updated_at: string;
}

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

function MyCardsDropdown({ fontFamily, t, onLoad }: {
  fontFamily: string;
  t: (key: TranslationKey) => string;
  onLoad: (cardData: CardData, cardId: string, slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dir } = useLanguage();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (res.ok) setCards(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(v => !v);
    if (!open) fetchCards();
  };

  const handleSelect = async (card: SavedCard) => {
    const res = await fetch(`/api/cards/${card.id}`);
    if (res.ok) {
      const full = await res.json();
      onLoad(full.card_data as CardData, card.id, card.slug);
      setOpen(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    if (!window.confirm(t('cards.deleteConfirm'))) return;
    const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
    if (res.ok) setCards(prev => prev.filter(c => c.id !== cardId));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
        style={{ fontFamily }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {t('cards.myCards')}
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] shadow-lg z-50 overflow-hidden"
          style={{ [dir === 'rtl' ? 'left' : 'right']: 0, fontFamily }}
        >
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-xs text-[var(--color-text-secondary)] text-center">
                {t('editor.loading')}
              </div>
            ) : cards.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[var(--color-text-secondary)] text-center">
                {t('cards.noCards')}
              </div>
            ) : (
              cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleSelect(card)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-start hover:bg-[var(--color-surface)] transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{card.card_name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">/{card.slug}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, card.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-error)] hover:bg-red-50 rounded transition-all flex-shrink-0"
                    aria-label="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </button>
              ))
            )}
          </div>
        </div>
      )}
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
  const fabRef = useRef<HTMLDivElement>(null);

  // Save-to-DB state
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const { data: session } = authClient.useSession();

  // Mobile FAB state
  const [fabOpen, setFabOpen] = useState(false);
  const [fabCards, setFabCards] = useState<SavedCard[]>([]);
  const [fabCardsLoading, setFabCardsLoading] = useState(false);
  const [fabShowCards, setFabShowCards] = useState(false);

  // Share state
  const [linkCopied, setLinkCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const ok = saveCardData(cardData);
    if (!ok && !saveError) setSaveError(true);
    else if (ok && saveError) setSaveError(false);
  }, [cardData, saveError]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (!fabOpen) return;
    function handleClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
        setFabShowCards(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [fabOpen]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/c/${currentSlug}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, [currentSlug]);

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
    setCurrentCardId(null);
    setCurrentSlug(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template, t]);

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
  }, [cardData, validateCardData]);

  const handleCardChange = useCallback((newData: CardData) => {
    setCardData(newData);
    setSaveStatus('idle');
    if (formErrors.name && newData.name.trim()) setFormErrors(prev => ({ ...prev, name: undefined }));
    if (formErrors.email && (!newData.email.trim() || EMAIL_REGEX.test(newData.email.trim()))) setFormErrors(prev => ({ ...prev, email: undefined }));
    if (formErrors.phone && (!newData.phone.trim() || PHONE_REGEX.test(newData.phone.trim()))) setFormErrors(prev => ({ ...prev, phone: undefined }));
  }, [formErrors]);

  const handleSave = useCallback(async () => {
    const errors = validateCardData(cardData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setActiveTab('edit');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      if (currentCardId) {
        // Update existing
        const res = await fetch(`/api/cards/${currentCardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardData, cardName: cardData.name || 'Untitled' }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setCurrentSlug(updated.slug);
      } else {
        // Create new
        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardData, cardName: cardData.name || 'Untitled' }),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setCurrentCardId(created.id);
        setCurrentSlug(created.slug);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [cardData, currentCardId, validateCardData]);

  const handleLoadCard = useCallback((data: CardData, cardId: string, slug: string) => {
    setCardData({ ...defaultCardData, ...data });
    setCurrentCardId(cardId);
    setCurrentSlug(slug);
    setSaveStatus('idle');
  }, []);

  const fetchFabCards = useCallback(async () => {
    setFabCardsLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (res.ok) setFabCards(await res.json());
    } finally {
      setFabCardsLoading(false);
    }
  }, []);

  const handleFabCardSelect = useCallback(async (card: SavedCard) => {
    const res = await fetch(`/api/cards/${card.id}`);
    if (res.ok) {
      const full = await res.json();
      handleLoadCard(full.card_data as CardData, card.id, card.slug);
      setFabOpen(false);
      setFabShowCards(false);
    }
  }, [handleLoadCard]);

  const handleNewCard = useCallback(() => {
    setCardData({ ...defaultCardData, template: cardData.template });
    setCurrentCardId(null);
    setCurrentSlug(null);
    setFormErrors({});
    setSaveStatus('idle');
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template]);

  const saveButtonLabel = isSaving ? t('cards.saving')
    : saveStatus === 'saved' ? t('cards.saved')
    : saveStatus === 'error' ? t('cards.saveError')
    : t('cards.save');

  const saveButton = (
    <>
      <SignedIn>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium transition-colors ${
            saveStatus === 'saved'
              ? 'bg-green-600 text-white'
              : saveStatus === 'error'
              ? 'bg-[var(--color-error)] text-white'
              : isSaving
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'
          }`}
          style={{ fontFamily }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {saveButtonLabel}
        </button>
      </SignedIn>
      <SignedOut>
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
          style={{ fontFamily }}
          title={t('cards.signInToSave')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {t('cards.save')}
        </Link>
      </SignedOut>
    </>
  );

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

          <div className="flex items-center gap-2">
            {/* Desktop: show all action buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {saveButton}
              <SignedIn>
                <MyCardsDropdown fontFamily={fontFamily} t={t} onLoad={handleLoadCard} />
                {currentCardId && (
                  <button
                    onClick={handleNewCard}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                    style={{ fontFamily }}
                  >
                    {t('cards.newCard')}
                  </button>
                )}
              </SignedIn>
              {downloadButton}
            </div>
            {/* Always show avatar */}
            <SignedIn>
              <CompactUserButton />
            </SignedIn>
            {/* Mobile sign-in link when signed out */}
            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="lg:hidden inline-flex items-center h-9 px-3 rounded-md text-xs font-medium text-[var(--color-accent)]"
                style={{ fontFamily }}
              >
                {t('auth.signIn')}
              </Link>
            </SignedOut>
          </div>
        </div>
        {/* Slug indicator + share section */}
        {currentSlug && session?.user && baseUrl && (
          <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
              <a
                href={`${baseUrl}/c/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ fontFamily, color: 'var(--color-accent)' }}
              >
                {new URL(baseUrl).host}/c/{currentSlug}
              </a>
              <span className="text-[var(--color-border)] text-xs">|</span>
              <button
                onClick={handleCopyLink}
                className="text-xs font-medium transition-colors"
                style={{ fontFamily, color: linkCopied ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                {linkCopied ? t('editor.linkCopied') : t('editor.copyLink')}
              </button>
              <a
                href={`${baseUrl}/c/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover:underline"
                style={{ fontFamily, color: 'var(--color-accent)' }}
              >
                {t('editor.openProfile')}
              </a>
              <QRCodeSVG value={`${baseUrl}/c/${currentSlug}`} size={28} />
            </div>
          </div>
        )}
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

        {/* Mobile FAB */}
        <div ref={fabRef} className="fixed z-50 flex flex-col items-end" style={{ bottom: '5rem', insetInlineEnd: '1rem' }}>
          {fabOpen && (
            <div className="mb-3 w-52 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] shadow-lg overflow-hidden" style={{ fontFamily }}>
              <SignedIn>
                <button
                  onClick={() => { handleSave(); setFabOpen(false); }}
                  disabled={isSaving}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${
                    saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'error' ? 'text-[var(--color-error)]' : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {saveButtonLabel}
                </button>
                {!fabShowCards ? (
                  <button
                    onClick={() => { setFabShowCards(true); fetchFabCards(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {t('cards.myCards')}
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between px-4 py-2 border-t border-b border-[var(--color-border)]">
                      <span className="text-xs font-semibold text-[var(--color-text)]">{t('cards.myCards')}</span>
                      <button onClick={() => setFabShowCards(false)} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" aria-label="Close">
                        &times;
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {fabCardsLoading ? (
                        <div className="px-4 py-3 text-xs text-[var(--color-text-secondary)] text-center">{t('editor.loading')}</div>
                      ) : fabCards.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-[var(--color-text-secondary)] text-center">{t('cards.noCards')}</div>
                      ) : (
                        fabCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => handleFabCardSelect(card)}
                            className="w-full flex items-center px-4 py-2.5 text-start hover:bg-[var(--color-surface)] transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--color-text)] truncate">{card.card_name}</p>
                              <p className="text-xs text-[var(--color-text-secondary)]">/{card.slug}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {currentCardId && (
                  <button
                    onClick={() => { handleNewCard(); setFabOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {t('cards.newCard')}
                  </button>
                )}
              </SignedIn>
              <SignedOut>
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                  onClick={() => setFabOpen(false)}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.signIn')}
                </Link>
              </SignedOut>
            </div>
          )}
          <button
            onClick={() => { if (fabOpen) setFabShowCards(false); setFabOpen(!fabOpen); }}
            className="w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-lg flex items-center justify-center transition-transform"
            style={{ transform: fabOpen ? 'rotate(45deg)' : 'none' }}
            aria-label="Actions"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
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
        <div className="text-[var(--color-text-secondary)]" style={{ fontFamily: "var(--font-noto-arabic), sans-serif" }}>
          {t('editor.loading')}
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
