import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NeonAuthProviderWrapper } from "@/components/NeonAuthProviderWrapper";
import { UserMenu } from "@/components/UserMenu";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "kart.krd — کارتی بزنسی کوردی",
    description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Kurdish Business Card Maker.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <NeonAuthProviderWrapper>
          <AuthProvider>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-purple-950/80 backdrop-blur-md border-b border-purple-800/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
                  <span className="text-black font-bold text-sm">K</span>
                </div>
                <span
                  className="text-white font-bold text-lg hidden sm:block"
                  style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
                >
                  kart.krd
                </span>
              </div>
              <UserMenu />
            </header>
            <div className="pt-14">{children}</div>
          </AuthProvider>
        </NeonAuthProviderWrapper>
      </body>
    </html>
  );
}