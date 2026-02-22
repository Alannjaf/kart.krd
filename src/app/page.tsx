import Link from "next/link";

const templatePreviews = [
  {
    id: "modern",
    name: "مۆدێرن",
    nameEn: "Modern",
    bg: "from-violet-900 to-purple-800",
    accent: "bg-gradient-to-b from-yellow-400 to-amber-500",
    textColor: "text-white",
  },
  {
    id: "classic",
    name: "کلاسیک",
    nameEn: "Classic",
    bg: "from-gray-50 to-gray-100",
    accent: "border-2 border-amber-500",
    textColor: "text-gray-800",
  },
  {
    id: "bold",
    name: "بۆڵد",
    nameEn: "Bold",
    bg: "from-gray-950 to-gray-900",
    accent: "bg-yellow-400",
    textColor: "text-white",
  },
  {
    id: "minimal",
    name: "مینیمال",
    nameEn: "Minimal",
    bg: "from-white to-gray-50",
    accent: "border-b border-gray-300",
    textColor: "text-gray-700",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#0f0520]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
              kart.krd
            </span>
          </div>
          <Link
            href="/editor"
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-5 py-2 rounded-lg text-sm hover:from-yellow-300 hover:to-amber-400 transition-all"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            دروستی بکە
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
          <div
            className="inline-block bg-purple-900/40 border border-purple-700/50 text-purple-300 text-sm px-4 py-2 rounded-full mb-8"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            ✦ بەخۆڕایی — بەبێ تۆمارکردن
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            کارتی بزنسی ئامادەکە
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              لە چەند چرکەیەکدا
            </span>
          </h1>

          <p
            className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            کارتی بزنسی پیشەیی بۆ خۆت ئامادەبکە — بەکوردی، عەرەبی، یان ئینگلیزی.
            پی‌دی‌ئێف دابەزێنە، بەبێ هیچ تۆمارکردنێک.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-8 py-4 rounded-xl text-lg hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 w-full sm:w-auto"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              🎨 دروستی بکە — بەخۆڕایی
            </Link>
            <span
              className="text-purple-400 text-sm"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              هیچ تۆمارکردنێک پێویست نییە
            </span>
          </div>
        </div>
      </section>

      {/* Template Previews */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2
          className="text-2xl md:text-3xl font-bold text-center text-white mb-4"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          چوار شێوازی جیاواز
        </h2>
        <p
          className="text-purple-300 text-center mb-12"
          style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
        >
          شێوازێک هەڵبژێرە کە لە خۆت نوێنەرایەتی بکات
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templatePreviews.map((tpl) => (
            <Link key={tpl.id} href={`/editor?template=${tpl.id}`}>
              <div className="group cursor-pointer">
                {/* Card Preview */}
                <div
                  className={`relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br ${tpl.bg} mb-3 border border-white/10 hover:scale-105 transition-transform duration-300`}
                  style={{ aspectRatio: "3.5/2" }}
                >
                  {/* Mock card content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {tpl.id === "modern" && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-400 to-amber-500" />
                        <div className="pr-4">
                          <div className="w-24 h-3 bg-white/80 rounded mb-2" />
                          <div className="w-16 h-2 bg-white/50 rounded" />
                        </div>
                        <div className="pr-4">
                          <div className="w-20 h-2 bg-white/40 rounded mb-1" />
                          <div className="w-24 h-2 bg-white/40 rounded" />
                        </div>
                      </>
                    )}
                    {tpl.id === "classic" && (
                      <div className="border-2 border-amber-500/60 inset-2 absolute rounded-lg p-3 flex flex-col justify-between">
                        <div>
                          <div className="w-20 h-2.5 bg-gray-700/60 rounded mb-2" />
                          <div className="w-14 h-2 bg-gray-500/50 rounded" />
                        </div>
                        <div>
                          <div className="w-16 h-1.5 bg-gray-500/40 rounded mb-1" />
                          <div className="w-20 h-1.5 bg-gray-500/40 rounded" />
                        </div>
                      </div>
                    )}
                    {tpl.id === "bold" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400" />
                        <div>
                          <div className="w-28 h-4 bg-white/90 rounded mb-2" />
                          <div className="w-20 h-2.5 bg-yellow-400/80 rounded" />
                        </div>
                        <div>
                          <div className="w-20 h-2 bg-white/40 rounded mb-1" />
                          <div className="w-24 h-2 bg-white/40 rounded" />
                        </div>
                      </>
                    )}
                    {tpl.id === "minimal" && (
                      <>
                        <div>
                          <div className="w-24 h-3 bg-gray-700/70 rounded mb-2" />
                          <div className="w-16 h-2 bg-gray-500/50 rounded" />
                        </div>
                        <div>
                          <div className="w-full h-px bg-gray-300/60 mb-2" />
                          <div className="w-20 h-1.5 bg-gray-400/50 rounded mb-1" />
                          <div className="w-24 h-1.5 bg-gray-400/50 rounded" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Template name */}
                <div className="text-center">
                  <span
                    className="text-white font-medium"
                    style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                  >
                    {tpl.name}
                  </span>
                  <span className="text-purple-400 text-sm mr-2">— {tpl.nameEn}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-purple-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🌐",
              title: "سێ زمان",
              titleEn: "3 Languages",
              desc: "کوردی، عەرەبی، ئینگلیزی — هەموو لەگەڵ پشتگیری چەپ‌بەراستەوە و ڕاست‌بەچەپەوە",
            },
            {
              icon: "⚡",
              title: "خێرا و ئاسان",
              titleEn: "Fast & Easy",
              desc: "زانیاریت داخڵ بکە، پێشبینی زیندوو ببینە، PIF دابەزێنە — هەمووی لەسەر وێب",
            },
            {
              icon: "🎨",
              title: "چوار شێواز",
              titleEn: "4 Templates",
              desc: "مۆدێرن، کلاسیک، بۆڵد، مینیمال — شێوازێک هەڵبژێرە کە لە پیشەی خۆت نوێنەرایەتی بکات",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-purple-900/20 border border-purple-800/30 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3
                className="text-white font-bold text-xl mb-2"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                {f.title}
              </h3>
              <p
                className="text-purple-300 text-sm leading-relaxed"
                style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-700/40 rounded-3xl p-12">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            ئەمڕۆ کارتەکەت ئامادەبکە
          </h2>
          <p
            className="text-purple-200 mb-8"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            بەخۆڕایی — بەبێ تۆمارکردن — PIF دابەزێنە
          </p>
          <Link
            href="/editor"
            className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-10 py-4 rounded-xl text-lg hover:from-yellow-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/20"
            style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
          >
            دروستی بکە — ئیستا
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-8 text-center text-purple-500 text-sm">
        <p style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
          © 2026 kart.krd — دروستکراوە لە کوردستان 🏔️
        </p>
      </footer>
    </div>
  );
}
