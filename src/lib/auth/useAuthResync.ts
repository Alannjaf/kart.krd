'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps client auth UI in sync after history restore/bfcache.
 */
export function useAuthResync(cooldownMs = 1000) {
  const router = useRouter();
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    const refreshAuthState = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < cooldownMs) return;
      lastRefreshRef.current = now;
      router.refresh();
    };

    const onPageShow = () => refreshAuthState();
    const onFocus = () => refreshAuthState();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshAuthState();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [cooldownMs, router]);
}
