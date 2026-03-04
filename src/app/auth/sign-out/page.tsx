'use client';

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthView } from '@neondatabase/auth/react';
import { authClient } from "@/lib/auth/client";

export default function AuthSignOutPage() {
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();
  const sawSignedInRef = useRef(false);
  const redirectedRef = useRef(false);

  const completeSignOut = useCallback(() => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    router.replace("/?signed_out=1");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (sessionData?.user?.id) {
      sawSignedInRef.current = true;
      return;
    }

    if (sawSignedInRef.current) {
      completeSignOut();
    }
  }, [completeSignOut, sessionData?.user?.id]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      if (!sessionData?.user?.id) {
        completeSignOut();
      }
    }, 2500);

    return () => window.clearTimeout(fallbackTimer);
  }, [completeSignOut, sessionData?.user?.id]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthView path="sign-out" />
      </div>
    </main>
  );
}
