'use client';

import { useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';

export default function SignOutPage() {
  const signingOut = useRef(false);

  useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;

    async function performSignOut() {
      console.log('[sign-out] Starting sign-out flow');
      console.log('[sign-out] Current cookies (visible to JS):', document.cookie);

      try {
        console.log('[sign-out] Calling authClient.signOut()...');
        const result = await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              console.log('[sign-out] signOut onSuccess fired — server session invalidated');
              console.log('[sign-out] Cookies after signOut:', document.cookie);
              // Hard redirect to force fresh page load (clears React state + re-reads cookies)
              window.location.replace('/auth/sign-in');
            },
            onError: (ctx) => {
              console.error('[sign-out] signOut onError:', ctx.error);
              // Even on error, redirect — user wanted to sign out
              window.location.replace('/auth/sign-in');
            },
          },
        });
        console.log('[sign-out] signOut returned:', JSON.stringify(result));
      } catch (err) {
        console.error('[sign-out] signOut threw:', err);
        // Fallback: redirect anyway
        window.location.replace('/auth/sign-in');
      }
    }

    performSignOut();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--color-text-secondary)]">
        Signing out...
      </p>
    </div>
  );
}