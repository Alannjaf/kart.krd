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

      // Step 1: Call Better Auth signOut (clears server session + sets cookie expiry headers)
      try {
        console.log('[sign-out] Calling authClient.signOut()...');
        await authClient.signOut();
        console.log('[sign-out] authClient.signOut() succeeded');
      } catch (err) {
        console.error('[sign-out] authClient.signOut() failed:', err);
      }

      // Step 2: Call our custom endpoint to force-clear all auth cookies
      try {
        console.log('[sign-out] Calling /api/signout to force-clear cookies...');
        const res = await fetch('/api/signout', { method: 'POST' });
        const data = await res.json();
        console.log('[sign-out] /api/signout response:', data);
      } catch (err) {
        console.error('[sign-out] /api/signout failed:', err);
      }

      console.log('[sign-out] Sign-out complete, redirecting to /auth/sign-in');
      router.push('/auth/sign-in');
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
