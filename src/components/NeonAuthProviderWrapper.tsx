'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { ReactNode } from 'react';

export function NeonAuthProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient as any}>
      {children}
    </NeonAuthUIProvider>
  );
}