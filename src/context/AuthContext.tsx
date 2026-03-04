'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { authClient } from '@/lib/auth/client';

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

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const rawUser = session?.user;
  const user: User | null = rawUser
    ? { id: rawUser.id, email: rawUser.email, name: rawUser.name ?? undefined }
    : null;

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) return { error: result.error.message ?? 'هەڵەیەک ڕوویدا' };
      return {};
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'هەڵەیەک ڕوویدا' };
    }
  }

  async function signUp(email: string, password: string, name?: string): Promise<{ error?: string }> {
    try {
      const result = await authClient.signUp.email({ email, password, name: name ?? '' });
      if (result.error) return { error: result.error.message ?? 'هەڵەیەک ڕوویدا' };
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