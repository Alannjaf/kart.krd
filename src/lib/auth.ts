'use client';

import { createClient } from '@neondatabase/neon-js';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL ?? '';

if (!authUrl && typeof window !== 'undefined') {
  console.warn('[kart.krd] NEXT_PUBLIC_NEON_AUTH_URL is not set. Auth will not work.');
}

// dataApi is required by the type but we only use auth for now
// Use a placeholder URL that won't be called (no DB queries yet)
export const neonClient = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: authUrl,
  },
  dataApi: {
    url: authUrl.replace('/auth', '/rest/v1'),
  },
});

export const authClient = neonClient.auth;
