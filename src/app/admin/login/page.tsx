import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
import { getAdminSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect('/admin');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-xl font-semibold">Admin sign in</h1>
      <LoginForm />
    </div>
  );
}
