# Neon Auth Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add authentication to kart.krd using Neon Auth (Better Auth) with email/password, Google OAuth, email OTP, and forgot-password — protecting /editor and /account routes.

**Architecture:** Neon Auth provides server-side auth via `createNeonAuth` and client-side via `createAuthClient`. The `NeonAuthUIProvider` wraps the app to provide pre-built auth UI components (AuthView, UserButton, AccountView). Middleware protects routes by redirecting unauthenticated users to /auth/sign-in. The existing LanguageProvider nests inside the AuthProvider so both contexts are available.

**Tech Stack:** @neondatabase/auth (Better Auth SDK), Next.js 16 App Router, Tailwind CSS v4

---

## Important Context

- **Design system:** warm stone neutrals + teal accent (#0D9488), dark mode via `prefers-color-scheme`
- **RTL:** Root layout defaults `dir="rtl"`, LanguageContext dynamically updates `<html>` dir/lang
- **Two language systems:** UI language (LanguageContext) vs card content language (cardData.language)
- **No tests exist** — skip TDD for this integration (auth SDK is third-party, we're wiring it up)
- **Deployment:** Cloudflare Workers via OpenNextJS — verify with `npm run build` after each task
- **CSS:** globals.css uses `@import "tailwindcss"` (Tailwind v4 syntax)
- **.env.local:** Already configured with `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `DATABASE_URL`

---

### Task 1: Install @neondatabase/auth

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

Run:
```bash
npm install @neondatabase/auth@latest
```

**Step 2: Verify installation**

Run:
```bash
node -e "require('@neondatabase/auth/next/server')" 2>&1 || echo "FAIL"
```
Expected: No error output

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @neondatabase/auth for authentication"
```

---

### Task 2: Create auth server config

**Files:**
- Create: `src/lib/auth/server.ts`

**Step 1: Create the server auth config**

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

**Step 2: Commit**

```bash
git add src/lib/auth/server.ts
git commit -m "feat: add Neon Auth server configuration"
```

---

### Task 3: Create auth client config

**Files:**
- Create: `src/lib/auth/client.ts`

**Step 1: Create the client auth module**

```typescript
'use client';

import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
```

**Step 2: Commit**

```bash
git add src/lib/auth/client.ts
git commit -m "feat: add Neon Auth client configuration"
```

---

### Task 4: Create API route handler

**Files:**
- Create: `src/app/api/auth/[...path]/route.ts`

**Step 1: Create the catch-all API route**

```typescript
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

**Step 2: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add auth API route handler"
```

---

### Task 5: Create AuthProvider component

**Files:**
- Create: `src/components/AuthProvider.tsx`

**Step 1: Create the provider wrapping NeonAuthUIProvider**

This component wraps children with `NeonAuthUIProvider`, configuring:
- Email/password credentials with forgot-password
- Google OAuth
- Email OTP
- Redirect to /editor after auth

```tsx
'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/editor"
      emailOTP
      social={{ providers: ['google'] }}
      credentials={{ forgotPassword: true }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/AuthProvider.tsx
git commit -m "feat: add AuthProvider with email, Google OAuth, OTP, forgot-password"
```

---

### Task 6: Create middleware to protect routes

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create the middleware**

Protect `/editor` and `/account` routes. Unauthenticated users get redirected to `/auth/sign-in`.

```typescript
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: ['/editor/:path*', '/account/:path*'],
};
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add middleware protecting /editor and /account routes"
```

---

### Task 7: Create auth pages (sign-in, sign-up, etc.)

**Files:**
- Create: `src/app/auth/[path]/page.tsx`

**Step 1: Create the auth view page**

This renders Neon Auth's pre-built AuthView component (handles sign-in, sign-up, forgot-password, OTP, etc.).

```tsx
import { AuthView } from '@neondatabase/auth/react';

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthView path={path} />
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/auth/
git commit -m "feat: add auth pages with AuthView component"
```

---

### Task 8: Create account pages

**Files:**
- Create: `src/app/account/[path]/page.tsx`

**Step 1: Create the account view page**

```tsx
import { AccountView } from '@neondatabase/auth/react';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-4">
      <div className="max-w-2xl mx-auto">
        <AccountView path={path} />
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/account/
git commit -m "feat: add account management pages"
```

---

### Task 9: Add Neon Auth styles to globals.css

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add the Neon Auth Tailwind import**

Add `@import "@neondatabase/auth/ui/tailwind";` right after the existing `@import "tailwindcss";` line. This brings in Neon Auth's pre-built component styles.

The file currently starts with:
```css
@import "tailwindcss";
```

Change to:
```css
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind";
```

**Step 2: Add CSS custom property overrides for Neon Auth theme**

After the existing `:root` block's closing `}`, add custom properties to make Neon Auth components match the warm stone + teal theme. Check what CSS variables Neon Auth exposes — if it uses standard `--neon-auth-*` variables, override them. Otherwise, rely on the Tailwind theme. At minimum, no additional CSS may be needed since `@import "@neondatabase/auth/ui/tailwind"` should pick up Tailwind's theme.

> **Note to implementer:** After adding the import, run `npm run dev` and visit `/auth/sign-in` to check if the auth forms look right. If Neon Auth exposes CSS variable overrides for primary color, set them to `#0D9488` (teal). If not, the default styling should be acceptable.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add Neon Auth styles to globals.css"
```

---

### Task 10: Update layout.tsx to wrap with AuthProvider

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add AuthProvider import and wrap children**

Add the import:
```typescript
import AuthProvider from "@/components/AuthProvider";
```

Wrap the existing `<LanguageProvider>` with `<AuthProvider>`:

Current (line 57):
```tsx
<LanguageProvider>{children}</LanguageProvider>
```

Change to:
```tsx
<AuthProvider>
  <LanguageProvider>{children}</LanguageProvider>
</AuthProvider>
```

AuthProvider goes outside LanguageProvider because auth context is needed app-wide, and LanguageProvider doesn't depend on auth state.

**Step 2: Verify the dev server starts**

Run:
```bash
npm run dev
```
Expected: Server starts without errors.

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wrap app with AuthProvider in root layout"
```

---

### Task 11: Add Sign In button to HomePage header

**Files:**
- Modify: `src/app/HomePage.tsx`
- Modify: `src/lib/i18n.ts`

**Step 1: Add translation keys for auth UI**

In `src/lib/i18n.ts`, add these keys to each language object:

**Kurdish (ku) — add after `'cardLang.en'` line:**
```typescript
// Auth
'auth.signIn': 'چوونەژوورەوە',
'auth.signOut': 'چوونەدەرەوە',
'auth.account': 'هەژمار',
```

**Arabic (ar) — add after `'cardLang.en'` line:**
```typescript
// Auth
'auth.signIn': 'تسجيل الدخول',
'auth.signOut': 'تسجيل الخروج',
'auth.account': 'الحساب',
```

**English (en) — add after `'cardLang.en'` line:**
```typescript
// Auth
'auth.signIn': 'Sign In',
'auth.signOut': 'Sign Out',
'auth.account': 'Account',
```

**Step 2: Add Sign In / UserButton to HomePage header**

In `src/app/HomePage.tsx`:

Add imports at the top:
```typescript
import { SignedIn, SignedOut, UserButton } from '@neondatabase/auth/react';
import { useLanguage } from "@/context/LanguageContext";
```

Note: `useLanguage` is already imported, and `Link` is already imported.

In the header, between `<LanguageSwitcher compact />` and the closing `</div>`, add auth buttons:

Current header right side (lines 111-113):
```tsx
<LanguageSwitcher compact />
```

Change to:
```tsx
<LanguageSwitcher compact />
<SignedOut>
  <Link
    href="/auth/sign-in"
    className="inline-flex items-center h-9 px-4 rounded-md bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
    style={{ fontFamily }}
  >
    {t('auth.signIn')}
  </Link>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

**Step 3: Commit**

```bash
git add src/app/HomePage.tsx src/lib/i18n.ts
git commit -m "feat: add Sign In button and UserButton to landing page header"
```

---

### Task 12: Add UserButton + user info to editor header

**Files:**
- Modify: `src/app/editor/page.tsx`

**Step 1: Add auth imports**

Add to the imports at the top of `src/app/editor/page.tsx`:
```typescript
import { SignedIn, UserButton } from '@neondatabase/auth/react';
```

**Step 2: Add UserButton to editor header**

In the `EditorContent` component, find the header's right-side controls (around line 214-219):

Current:
```tsx
<div className="flex items-center gap-3">
  <LanguageSwitcher compact />
  <div className="hidden lg:block">
    {downloadButton}
  </div>
</div>
```

Change to:
```tsx
<div className="flex items-center gap-3">
  <LanguageSwitcher compact />
  <SignedIn>
    <UserButton />
  </SignedIn>
  <div className="hidden lg:block">
    {downloadButton}
  </div>
</div>
```

**Step 3: Commit**

```bash
git add src/app/editor/page.tsx
git commit -m "feat: add UserButton to editor header"
```

---

### Task 13: Update landing page CTAs

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/app/HomePage.tsx`

**Step 1: Update CTA text in translations**

Since the editor now requires auth, update the CTA subtext to reflect sign-in rather than "no registration":

**Kurdish (ku):**
- Change `'landing.ctaSubtext'` from `'پێویستی بە تۆمارکردن نییە'` to `'بەخۆڕایی — خۆتۆمار بکە'`
- Change `'landing.badge'` from `'✦ بەخۆڕایی — بەبێ تۆمارکردن'` to `'✦ بەخۆڕایی'`

**Arabic (ar):**
- Change `'landing.ctaSubtext'` from `'لا حاجة للتسجيل'` to `'مجاني — سجّل الآن'`
- Change `'landing.badge'` from `'✦ مجاني — بدون تسجيل'` to `'✦ مجاني'`

**English (en):**
- Change `'landing.ctaSubtext'` from `'No registration required'` to `'Free — Sign up to get started'`
- Change `'landing.badge'` from `'✦ Free — No Registration Required'` to `'✦ Free'`

**Step 2: Commit**

```bash
git add src/lib/i18n.ts src/app/HomePage.tsx
git commit -m "feat: update landing page CTAs for auth flow"
```

---

### Task 14: Build verification

**Step 1: Run the build**

```bash
npm run build
```

Expected: Build succeeds without errors.

**Step 2: Test auth flow manually**

Run:
```bash
npm run dev
```

Manual checks:
1. Visit `/` — landing page shows "Sign In" button in header
2. Click "Sign In" → redirects to `/auth/sign-in` with Neon Auth form
3. Visit `/editor` while not signed in → redirects to `/auth/sign-in`
4. Sign in with email/password → redirects to `/editor`
5. Editor header shows UserButton (avatar)
6. Test in Kurdish (RTL) and English (LTR) — auth forms should respect direction
7. Visit `/account/settings` while signed in → shows account management

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any build/runtime issues from auth integration"
```

---

### Task 15: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update project documentation**

Update these sections in CLAUDE.md:

1. **Project Overview:** Remove "No auth required" — replace with "Neon Auth (Better Auth) for authentication"
2. **Tech Stack table:** Add row `| Auth | @neondatabase/auth (Better Auth) |`
3. **Directory Structure:** Add:
   ```
   ├── app/
   │   ├── api/auth/[...path]/route.ts  # Auth API handler
   │   ├── auth/[path]/page.tsx          # Sign-in/sign-up pages
   │   ├── account/[path]/page.tsx       # Account management pages
   ├── components/
   │   ├── AuthProvider.tsx              # NeonAuthUIProvider wrapper
   ├── lib/
   │   ├── auth/
   │   │   ├── server.ts                 # createNeonAuth server config
   │   │   └── client.ts                 # createAuthClient client config
   ```
4. **Coding Conventions:** Remove "No API routes — everything is client-side"
5. **Current State:** Remove "Auth was removed" bullet. Add "Neon Auth integration with email/password, Google OAuth, email OTP, forgot-password"
6. **Current State:** Remove "No database integration" bullet. Add "Neon database for auth (via Neon Auth managed service)"
7. **Compact instructions:** Update "no API routes, no database, no auth" to reflect auth is now integrated

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with Neon Auth integration details"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install package | package.json |
| 2 | Server auth config | src/lib/auth/server.ts |
| 3 | Client auth config | src/lib/auth/client.ts |
| 4 | API route handler | src/app/api/auth/[...path]/route.ts |
| 5 | AuthProvider component | src/components/AuthProvider.tsx |
| 6 | Middleware | src/middleware.ts |
| 7 | Auth pages | src/app/auth/[path]/page.tsx |
| 8 | Account pages | src/app/account/[path]/page.tsx |
| 9 | Neon Auth styles | src/app/globals.css |
| 10 | Layout wrapper | src/app/layout.tsx |
| 11 | Sign In on landing | src/app/HomePage.tsx, src/lib/i18n.ts |
| 12 | UserButton in editor | src/app/editor/page.tsx |
| 13 | Update CTAs | src/lib/i18n.ts |
| 14 | Build verification | — |
| 15 | Update CLAUDE.md | CLAUDE.md |

**Dependencies:** Tasks 1-4 are sequential prerequisites. Tasks 5-9 can be parallelized after Task 4. Task 10 depends on Task 5. Tasks 11-12 depend on Task 10. Task 13-15 are final.
