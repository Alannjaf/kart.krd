import type { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "kart.krd — کارتی بزنسی کوردی | Kurdish Business Card Maker",
  description: "کارتی بزنسی پیشەیی ئامادەکە — لە چەند چرکەیەکدا. Create professional bilingual business cards with PDF export. Free, no signup required.",
  alternates: {
    canonical: "https://kart.krd",
  },
};

export default function Page() {
  return <HomePage />;
}
