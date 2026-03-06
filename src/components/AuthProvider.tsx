'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient as never}
      redirectTo="/editor"
      emailOTP
      social={{ providers: ['google'] }}
      credentials={{ forgotPassword: true }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
