'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { authClient } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  isPending: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// Inner component that uses the hook (must be inside the context of the auth client)
function AuthProviderInner({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionHook = (authClient as any).useSession?.();
  const user: User | null = sessionHook?.data?.user ?? null;
  const isPending: boolean = sessionHook?.isPending ?? false;

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (authClient as any).signIn.email({ email, password });
      return {};
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'هەڵەیەک ڕوویدا' };
    }
  }

  async function signUp(email: string, password: string, name?: string): Promise<{ error?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (authClient as any).signUp.email({ email, password, name });
      return {};
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'هەڵەیەک ڕوویدا' };
    }
  }

  async function signOut() {
    await authClient.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, isPending, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}
