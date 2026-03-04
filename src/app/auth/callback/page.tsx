import { AuthView } from '@neondatabase/auth/react';

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthView path="callback" />
      </div>
    </main>
  );
}
