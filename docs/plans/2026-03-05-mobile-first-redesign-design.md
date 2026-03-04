# Mobile-First Redesign — Design Document

## Decisions

- **Color palette:** Warm & grounded — stone neutrals + teal accent
- **Font:** Geist (English), Noto Sans Arabic (Kurdish/Arabic) — replacing Inter
- **Mobile editor:** Tab bar pattern (Edit/Preview tabs at bottom)
- **Scope:** Full visual overhaul of landing + editor pages

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| bg | #FAFAF8 | Page background |
| text-primary | #1C1917 | Headings, body text |
| text-secondary | #78716C | Subtitles, hints |
| accent | #0D9488 | CTAs, active states, links |
| accent-hover | #0F766E | Button hover |
| surface | #F5F5F4 | Cards, panels |
| border | #E7E5E4 | Dividers, input borders |
| error | #DC2626 | Validation errors |

No gradients. Flat colors only. Accent used sparingly.

### Typography

- English: Geist, weights 400/500/600/700
- Kurdish/Arabic: Noto Sans Arabic, weights 400/500/600/700
- Headings: weight 700, tight line-height
- Body: weight 400, relaxed line-height
- Labels: weight 500-600, text-sm

### Spacing & Borders

- All rounded: rounded-md (not rounded-xl/2xl/3xl — smaller radii)
- Touch targets: min 44px height
- Consistent 16px horizontal padding on mobile, 24px+ on desktop
- Borders: 1px stone-200

## Landing Page

### Header (sticky)
- Left: teal dot + "kart.krd" text (weight 700)
- Right: language switcher (stone pills) + "Create" CTA (teal button)
- Center: empty space for future auth
- 56px height, white bg, border-bottom stone-200

### Hero
- Left-aligned text (not centered), 60% width on desktop, full on mobile
- Small stone pill badge: "Free — No signup"
- Large heading: stone-900, weight 700, no gradient text
- Subtext: stone-500, max 480px
- Teal CTA button, 48px tall
- Desktop: tilted card preview on right (~-3deg rotation)
- Mobile: card preview below text

### Templates
- Section label: left-aligned, stone-500
- Mobile: horizontal snap-scroll of 4 template mini-previews
- Desktop: 2x2 grid
- Hover: scale(1.02) + teal border

### Features
- Single column, alternating icon+text rows
- Icon (teal, 24px) left, text right
- No card wrappers — clean list

### Bottom CTA
- Full-width teal strip, white text
- Headline + inverted button (white bg, teal text)

### Footer
- Single line, left-aligned, stone-400

## Editor Page

### Header (sticky, 56px)
- Left: logo (link to home)
- Right: language switcher + download PDF (teal)
- Mobile: compact, language switcher may be smaller

### Desktop (lg+)
- Left: form panel (380px, white, sticky, scrollable)
- Right: stone-50 bg, card preview centered, front/back toggle above, template selector below

### Mobile (< lg) — Tab Bar
- Fixed bottom bar, 56px, stone bg
- Two tabs: Edit, Preview
- Edit tab: template selector at top (horizontal scroll), then form
- Preview tab: card preview (large), front/back toggle, download button

### Form
- Section headers: weight 600, stone-700, text-sm (not uppercase)
- Inputs: 44px height, stone-200 border, stone-50 bg, rounded-md
- Focus: teal ring
- Card language: 3 teal pills
- Social section: collapsed accordion on mobile, open on desktop
- Dividers: thin stone-200 lines between sections

### Template Selector
- Desktop: horizontal row of 4 below card preview
- Mobile: horizontal scroll in Edit tab
- Active: teal border-2

### Card Preview
- Max-width 480px, centered
- shadow-md (subtle)
- Front/back toggle: pill buttons, stone bg, teal active
- Size badge below: "3.5 x 2" in stone-400

## Files to Modify

1. `src/app/globals.css` — New color tokens, remove old purple vars, font update
2. `src/app/layout.tsx` — Replace Inter with Geist font, update head links
3. `src/app/page.tsx` — Complete rewrite of landing page
4. `src/app/editor/page.tsx` — Complete rewrite with tab bar mobile layout
5. `src/components/LanguageSwitcher.tsx` — Stone/teal palette, mobile-compact variant
6. `src/components/CardForm.tsx` — New input styles, collapsible social section
7. `src/components/TemplateSelector.tsx` — Horizontal layout variant for mobile/desktop
8. `src/lib/i18n.ts` — Any new translation keys (tab labels, etc.)

## What NOT to Touch

- Card template components (ModernCard, ClassicCard, BoldCard, MinimalCard) — inline styles for PDF
- BackCard.tsx — inline styles for PDF
- CardPreview.tsx — just renders templates, no visual changes needed
- generatePdf.ts — PDF pipeline unchanged
- qrUtils.ts — QR generation unchanged
- types/card.ts — data model unchanged
