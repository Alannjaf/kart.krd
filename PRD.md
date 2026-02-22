# kart.krd — Kurdish Business Card Maker

## Overview
A web app where users enter their info and generate a professional bilingual business card as a downloadable PDF. Supports Kurdish (Sorani), Arabic, and English.

## MVP Scope (v1)
- Landing page (Kurdish RTL, bilingual)
- Card editor: input form + live preview
- 4 card templates (modern, classic, bold, minimal)
- PDF generation (front side only for MVP)
- Free: 1 template, watermarked PDF
- No auth required for MVP — just generate and download

## Input Fields
- Full name (ناوی تەواو)
- Job title (پیشە)
- Company name (ناوی کۆمپانیا) — optional
- Phone number (ژمارەی مۆبایل)
- Email (ئیمەیل) — optional
- Website (وێبسایت) — optional
- Address (ناونیشان) — optional
- Social links: Facebook, Instagram, LinkedIn, X — optional
- Language toggle: Kurdish / Arabic / English (affects card text direction)

## Templates
1. **Modern** — clean, gradient accent bar, sans-serif
2. **Classic** — traditional, bordered, serif font
3. **Bold** — dark background, large name, high contrast
4. **Minimal** — white, minimal lines, lots of whitespace

All templates must support RTL (Kurdish/Arabic) and LTR (English) properly.

## PDF Output
- Standard business card size: 3.5" × 2" (89mm × 51mm)
- High-res PDF, 300 DPI equivalent
- Embedded fonts (Noto Sans Arabic for Kurdish/Arabic, Inter for English)
- Watermark on free version: small "kart.krd" text at bottom

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (dark mode landing, light editor)
- PDF generation: React → HTML → PDF via Puppeteer (same as Work.krd)
  - OR use html2canvas + jsPDF for client-side generation (simpler, no server needed)
- Deploy: Netlify with @netlify/plugin-nextjs
- NO database for MVP — everything client-side
- NO auth for MVP

## Landing Page
- Hero: "کارتی بزنسی ئامادەکە — لە چەند چرکەیەکدا" (Your business card ready — in seconds)
- Show 4 template previews
- CTA: "دروستی بکە" (Create it)
- Features: RTL support, multiple templates, instant PDF
- Footer with links

## File Structure
```
src/app/page.tsx          — Landing page
src/app/editor/page.tsx   — Card editor (form + preview)
src/app/api/pdf/route.ts  — PDF generation endpoint
src/components/CardPreview.tsx — Live preview component
src/components/templates/  — 4 template components
src/lib/pdf.ts            — PDF generation logic
```

## Future (v2)
- Back side of card
- QR code with contact info (vCard)
- Clerk auth + saved cards
- Payment: FIB manual (same as Work.krd) for premium templates
- Logo upload
- Bulk order (print shop integration?)
- Admin dashboard
