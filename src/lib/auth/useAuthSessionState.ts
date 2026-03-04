'use client';

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";

export function useAuthSessionState() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const result = await authClient.getSession({
        query: {
          disableCookieCache: true,
          disableRefresh: true,
        },
        fetchOptions: {
          cache: "no-store",
        },
      });

      const hasSession = !!result?.data?.user?.id;
      setIsSignedIn(hasSession);
    } catch {
      setIsSignedIn(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();

    const onPageShow = () => void refreshSession();
    const onFocus = () => void refreshSession();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshSession();
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
  }, [refreshSession]);

  return { isSignedIn, isChecking, refreshSession };
}
