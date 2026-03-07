import { AccountView } from '@neondatabase/auth/react';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-4">
      <div className="max-w-2xl mx-auto">
        <AccountView path={path} />
      </div>
    </main>
  );
}
