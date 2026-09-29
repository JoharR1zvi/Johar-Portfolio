import type { Metadata } from 'next';
import { SignOutButton } from '@/components/admin/sign-out-button';
import { getAdminSession } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-muted-foreground text-sm">Signed in as {admin?.email}</p>
        </div>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground text-sm">
        Project/translation/media/notes/settings management and the AI-assisted import workflow land
        here next.
      </p>
    </div>
  );
}
