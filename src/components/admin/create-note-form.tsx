'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '@/app/admin/(protected)/notes/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateNoteForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = String(new FormData(event.currentTarget).get('slug') ?? '');

    setError(null);
    startTransition(async () => {
      try {
        const id = await createNote(slug);
        router.push(`/admin/notes/${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create note.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-note-slug">New note slug</Label>
        <Input
          id="new-note-slug"
          name="slug"
          placeholder="my-new-note"
          disabled={isPending}
          required
        />
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating…' : 'Create'}
      </Button>
    </form>
  );
}
