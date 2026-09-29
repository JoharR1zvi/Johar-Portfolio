import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  return <>{children}</>;
}
