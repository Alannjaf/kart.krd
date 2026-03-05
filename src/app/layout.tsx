import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "kart.krd — کارتی بزنسی کوردی",
  description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
  keywords: ["business card", "Kurdish", "کارتی بزنس", "کوردی", "kart", "card maker"],
  metadataBase: new URL("https://kart.krd"),
  openGraph: {
    title: "kart.krd — کارتی بزنسی کوردی",
    description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
    url: "https://kart.krd",
    siteName: "kart.krd",
    locale: "ku_IQ",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "kart.krd — Kurdish Business Card Maker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "kart.krd — کارتی بزنسی کوردی",
    description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" dir="rtl" className={`${geist.variable} ${notoSansArabic.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D9488" />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-[var(--color-panel)] focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-[var(--color-accent)]">
          Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
