'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/db/client';
import { loginSchema } from '@/lib/validation/auth';

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    if (!parsed.success) {
      setError('Enter a valid email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    if (signInError) {
      setSubmitting(false);
      setError('Incorrect email or password.');
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={submitting}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={submitting}
        />
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
