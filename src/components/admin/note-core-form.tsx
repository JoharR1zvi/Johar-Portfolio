'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { saveNoteCore } from '@/app/admin/(protected)/notes/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { AdminPostCore } from '@/lib/db/admin-posts';

export function NoteCoreForm({ note }: { note: AdminPostCore }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: Omit<AdminPostCore, 'id' | 'slug'> = {
      published: formData.get('published') === 'on',
      publishedAt: formData.get('publishedAt') ? String(formData.get('publishedAt')) : null,
    };

    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await saveNoteCore(note.id, values);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="publishedAt">Published date</Label>
        <Input
          id="publishedAt"
          name="publishedAt"
          type="date"
          defaultValue={note.publishedAt ?? ''}
        />
      </div>
      <label htmlFor="published" className="flex w-fit items-center gap-2">
        <Switch id="published" name="published" defaultChecked={note.published} />
        <span className="text-sm">Note published</span>
      </label>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Saving…' : 'Save'}
      </Button>
      {saved && !isPending ? <p className="text-muted-foreground text-sm">Saved.</p> : null}
    </form>
  );
}
