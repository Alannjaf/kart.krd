import { AuthView } from '@neondatabase/auth/react';
import SignOutPage from './SignOutPage';

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (path === 'sign-out') {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <SignOutPage />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthView path={path} />
      </div>
    </main>
  );
}
