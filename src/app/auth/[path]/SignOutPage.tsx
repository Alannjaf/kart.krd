'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export default function SignOutPage() {
  const signingOut = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;

    async function performSignOut() {
      console.log('[sign-out] Starting sign-out flow');

      // Step 1: Call Better Auth signOut
      try {
        console.log('[sign-out] Calling authClient.signOut()...');
        await authClient.signOut();
        console.log('[sign-out] authClient.signOut() succeeded');
      } catch (err) {
        console.error('[sign-out] authClient.signOut() failed:', err);
      }

      // Step 2: Clear all auth cookies client-side
      console.log('[sign-out] Clearing cookies client-side...');
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const name = cookie.split('=')[0].trim();
        console.log('[sign-out] Clearing cookie:', name);
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      }

      console.log('[sign-out] All cookies cleared, redirecting...');

      // Hard redirect to ensure fresh state
      window.location.href = '/auth/sign-in';
    }

    performSignOut();
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--color-text-secondary)]">
        Signing out...
      </p>
    </div>
  );
}