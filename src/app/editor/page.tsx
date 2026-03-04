"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { CardData, TemplateId, defaultCardData, TEMPLATES } from "@/types/card";
import CardForm from "@/components/CardForm";
import CardPreview from "@/components/CardPreview";
import TemplateSelector from "@/components/TemplateSelector";
import { generatePdf } from "@/lib/generatePdf";

const STORAGE_KEY = "kart-krd-card-data";

function loadCardData(): CardData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.name === "string" && typeof parsed.template === "string") {
      return { ...defaultCardData, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

function saveCardData(data: CardData) {
  try {
    const { logoUrl, ...rest } = data;
    void logoUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Silently fail
  }
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function validateCardData(data: CardData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "ناو پێویستە";
  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "فۆرماتی ئیمەیل هەڵەیە";
  if (data.phone.trim() && !/^[0-9+\-\s()]+$/.test(data.phone.trim()))
    errors.phone = "تەنها ژمارە، +، - ڕێگەپێدراوە";
  return errors;
}

interface SavedCard {
  id: string;
  name: string;
  card_data: CardData;
  updated_at: string;
}

function MyCardsModal({
  onClose,
  onLoad,
  currentCardData,
}: {
  onClose: () => void;
  onLoad: (card: CardData) => void;
  currentCardData: CardData;
}) {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cardName, setCardName] = useState("کارتەکەم");
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardData: currentCardData,
          name: cardName,
          id: currentCardId || undefined,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setCurrentCardId(saved.id);
        setSaveMsg("پاشەکەوت کرا ✓");
        await fetchCards();
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch {
      setSaveMsg("هەڵە ڕوویدا");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("دڵنیایت لە سڕینەوەی ئەم کارتە؟")) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (currentCardId === id) setCurrentCardId(null);
  };

  const handleLoad = (card: SavedCard) => {
    setCurrentCardId(card.id);
    setCardName(card.name);
    onLoad(card.card_data);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        dir="rtl"
        style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-violet-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">کارتەکانم</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        {/* Save section */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-sm text-gray-600 mb-3">پاشەکەوت کردنی کارتی ئێستا:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="ناوی کارت"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-700 text-white rounded-xl text-sm font-bold hover:bg-purple-600 disabled:opacity-50 transition-colors"
            >
              {saving ? "..." : "پاشەکەوت"}
            </button>
          </div>
          {saveMsg && (
            <p className={`text-xs mt-2 ${saveMsg.includes("✓") ? "text-green-600" : "text-red-500"}`}>
              {saveMsg}
            </p>
          )}
        </div>

        {/* Cards list */}
        <div className="p-5 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8 text-sm">چاوەڕێبکە...</div>
          ) : cards.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">هیچ کارتێک پاشەکەوت نەکراوە</div>
          ) : (
            <ul className="space-y-2">
              {cards.map((card) => (
                <li
                  key={card.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                    currentCardId === card.id
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-100 hover:border-purple-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleLoad(card)}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{card.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(card.updated_at).toLocaleDateString("ku-IQ")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(card.id);
                    }}
                    className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 mr-2"
                  >
                    سڕینەوە
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const urlTemplate = searchParams.get("template") as TemplateId;
  const validTemplate = TEMPLATES.find((t) => t.id === urlTemplate);
  const initialTemplate = validTemplate ? urlTemplate : "modern";

  const { data: sessionData } = authClient.useSession();
  const isSignedIn = !!sessionData?.user?.id;

  const [cardData, setCardData] = useState<CardData>(() => {
    const stored = loadCardData();
    if (stored) {
      return { ...stored, template: validTemplate ? urlTemplate : stored.template };
    }
    return { ...defaultCardData, template: initialTemplate };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showMyCards, setShowMyCards] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDbCardIdRef = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Save to localStorage on every change
  useEffect(() => {
    saveCardData(cardData);
  }, [cardData]);

  // Auto-save to DB when signed in (debounced 3s)
  useEffect(() => {
    if (!isSignedIn) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      setAutoSaving(true);
      try {
        const res = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardData,
            name: cardData.name || "کارتەکەم",
            id: currentDbCardIdRef.current || undefined,
          }),
        });
        if (res.ok) {
          const saved = await res.json();
          currentDbCardIdRef.current = saved.id;
        }
      } catch {
        // ignore silently
      } finally {
        setAutoSaving(false);
      }
    }, 3000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [cardData, isSignedIn]);

  const handleClear = useCallback(() => {
    const cleared = { ...defaultCardData, template: cardData.template };
    setCardData(cleared);
    setFormErrors({});
    currentDbCardIdRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
  }, [cardData.template]);

  const handleDownloadPdf = useCallback(async () => {
    const errors = validateCardData(cardData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!cardRef.current) return;
    setIsGenerating(true);
    setPdfSuccess(false);
    try {
      const showBackCallback = async (showBackView: boolean) => {
        setShowBack(showBackView);
        await new Promise((resolve) => setTimeout(resolve, 200));
      };
      await generatePdf(cardRef.current, cardData, showBackCallback);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF دروستکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.");
    } finally {
      setIsGenerating(false);
    }
  }, [cardData]);

  const handleCardChange = useCallback(
    (newData: CardData) => {
      setCardData(newData);
      if (formErrors.name && newData.name.trim())
        setFormErrors((prev) => ({ ...prev, name: undefined }));
      if (
        formErrors.email &&
        (!newData.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.email.trim()))
      )
        setFormErrors((prev) => ({ ...prev, email: undefined }));
      if (
        formErrors.phone &&
        (!newData.phone.trim() || /^[0-9+\-\s()]+$/.test(newData.phone.trim()))
      )
        setFormErrors((prev) => ({ ...prev, phone: undefined }));
    },
    [formErrors]
  );

  const handleLoadCard = useCallback((card: CardData) => {
    setCardData({ ...defaultCardData, ...card });
    setFormErrors({});
  }, []);

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
            {isSignedIn && (
              <div className="flex items-center gap-2">
                {autoSaving && (
                  <span
                    className="text-xs text-purple-500 hidden sm:block"
                    style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                  >
                    پاشەکەوت دەکرێت...
                  </span>
                )}
                <button
                  onClick={() => setShowMyCards(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border border-purple-200 text-purple-700 hover:bg-purple-50 transition-all"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  <span>📋</span>
                  <span className="hidden sm:inline">کارتەکانم</span>
                </button>
              </div>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: Form */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-90px)] lg:overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h2
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  زانیاریەکانت داخڵ بکە
                </h2>
                <button
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2 py-1 rounded-lg transition-all"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  پاککردنەوە
                </button>
              </div>
              <CardForm data={cardData} onChange={handleCardChange} errors={formErrors} />

              {/* Signed-in hint */}
              {!isSignedIn && (
                <div
                  className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-700"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  <Link href="/auth/sign-in" className="font-bold underline">
                    چوونەژوورەوە
                  </Link>{" "}
                  بکە بۆ پاشەکەوتکردنی کارتەکانت لە هەژمارەکەت
                </div>
              )}
              {isSignedIn && (
                <div
                  className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-700"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  ✓ کارتەکەت بە خۆکاری پاشەکەوت دەکرێت
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Preview + Template selector */}
          <div className="flex-1 min-w-0">
            {/* Live preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-bold text-gray-800"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  پێشبینی زیندوو
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setShowBack(false)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        !showBack ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                    >
                      پێشەوە
                    </button>
                    <button
                      onClick={() => setShowBack(true)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        showBack ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                    >
                      پشتەوە
                    </button>
                  </div>
                  <span
                    className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                    style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                  >
                    3.5&quot; × 2&quot;
                  </span>
                </div>
              </div>

              <div className="w-full max-w-lg mx-auto overflow-x-auto">
                <CardPreview ref={cardRef} data={cardData} showBack={showBack} />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg w-full max-w-xs justify-center ${
                    pdfSuccess
                      ? "bg-green-500 text-white"
                      : isGenerating
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-600 hover:to-purple-800 shadow-purple-200"
                  }`}
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  {pdfSuccess ? "✓ PDF دابەزیندرا" : isGenerating ? "چاوەڕێبکە..." : "⬇ PDF دابەزێنە — بەخۆڕایی"}
                </button>
              </div>

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

      {/* My Cards Modal */}
      {showMyCards && (
        <MyCardsModal
          onClose={() => setShowMyCards(false)}
          onLoad={handleLoadCard}
          currentCardData={cardData}
        />
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
            چاوەڕێبکە...
          </div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}