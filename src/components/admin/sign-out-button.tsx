'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/db/client';

export function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={signingOut}>
      {signingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
