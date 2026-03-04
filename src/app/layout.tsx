import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="ku" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
