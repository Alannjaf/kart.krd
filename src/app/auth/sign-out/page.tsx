'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function AuthSignOutPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const runSignOut = async () => {
      try {
        await authClient.signOut({
          fetchOptions: {
            cache: "no-store",
          },
        });
      } catch {
        if (isMounted) {
          setErrorMessage("نەتوانرا دەرچوون انجام بدرێت. تکایە دووبارە هەوڵبدە.");
          setIsProcessing(false);
        }
        return;
      }

      if (!isMounted) return;
      router.replace("/?signed_out=1");
      router.refresh();
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
