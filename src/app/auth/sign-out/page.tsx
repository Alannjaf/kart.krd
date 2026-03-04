'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthSignOutPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const runSignOut = async () => {
      try {
        const res = await fetch("/api/auth/sign-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        });

        if (!res.ok) throw new Error(`sign-out failed: ${res.status}`);
      } catch {
        if (isMounted) {
          setErrorMessage("نەتوانرا دەرچوون انجام بدرێت. تکایە دووبارە هەوڵبدە.");
          setIsProcessing(false);
        }
        return;
      }

      if (!isMounted) return;
      // Full page navigation to clear React state + NeonAuthUIProvider session cache
      window.location.href = "/";
    };

    void runSignOut();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-700/50 bg-purple-950/40 p-6 text-center text-white">
        {isProcessing && !errorMessage && (
          <p style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>دەرچوون ئەنجام دەدرێت...</p>
        )}
        {errorMessage && (
          <>
            <p className="mb-4 text-red-200" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-yellow-400 px-4 py-2 font-bold text-black hover:bg-yellow-300"
              style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
            >
              دووبارە هەوڵبدە
            </button>
          </>
        )}
      </div>
    </main>
  );
}
