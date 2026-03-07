# Neon Auth Integration Guide (Better Auth)

## Packages
- `@neondatabase/auth@latest` — server + client SDK
- Styles: `@neondatabase/auth/ui/tailwind` (import in globals.css)

## Environment Variables (.env.local)
```
NEON_AUTH_BASE_URL=https://ep-odd-term-agu3n104.neonauth.c-2.eu-central-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">
DATABASE_URL=postgresql://neondb_owner:npg_jGpEYO14uoVe@ep-odd-term-agu3n104.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Server — lib/auth/server.ts
```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
```

## API Route — app/api/auth/[...path]/route.ts
```typescript
import { auth } from '@/lib/auth/server';
export const { GET, POST } = auth.handler();
```

## Middleware — middleware.ts
```typescript
import { auth } from '@/lib/auth/server';
export default auth.middleware({ loginUrl: '/auth/sign-in' });
export const config = { matcher: ['/account/:path*'] };
```

## Client — lib/auth/client.ts
```typescript
'use client';
import { createAuthClient } from '@neondatabase/auth/next';
export const authClient = createAuthClient();
```

## Layout wrap with NeonAuthUIProvider
```tsx
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';
<NeonAuthUIProvider authClient={authClient} redirectTo="/editor" emailOTP social={{ providers: ['google'] }} credentials={{ forgotPassword: true }}>
  {children}
</NeonAuthUIProvider>
```

## Styles — globals.css (add at top)
```css
@import "@neondatabase/auth/ui/tailwind";
```

## Auth Pages — app/auth/[path]/page.tsx
```tsx
import { AuthView } from '@neondatabase/auth/react';
export const dynamicParams = false;
export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return (<main className="container mx-auto flex grow flex-col items-center justify-center gap-3 p-4"><AuthView path={path} /></main>);
}
```

## Account Pages — app/account/[path]/page.tsx
```tsx
import { AccountView } from '@neondatabase/auth/react';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';
export const dynamicParams = false;
export function generateStaticParams() { return Object.values(accountViewPaths).map((path) => ({ path })); }
export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return (<main className="container p-4"><AccountView path={path} /></main>);
}
```

## Session access (server)
```typescript
import { auth } from '@/lib/auth/server';
export const dynamic = 'force-dynamic';
const { data: session } = await auth.getSession();
```

## Session access (client)
```typescript
'use client';
import { authClient } from '@/lib/auth/client';
const { data } = authClient.useSession();
```

## UI Components
- AuthView, UserButton, UserAvatar, SignedIn, SignedOut, AccountView

## Notes
- suppressHydrationWarning on html tag
- Server components with getSession need dynamic = 'force-dynamic'
- Google OAuth works with shared test credentials out of the box
