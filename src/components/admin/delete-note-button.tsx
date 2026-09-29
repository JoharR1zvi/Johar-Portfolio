'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteNote } from '@/app/admin/(protected)/notes/actions';
import { Button } from '@/components/ui/button';

export function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteNote(id);
        router.push('/admin/notes');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete.');
      }
    });
  }

  if (!confirming) {
    return (
      <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
        Delete note
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Delete permanently?</span>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Deleting…' : 'Confirm'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={isPending}>
        Cancel
      </Button>
      {error ? <span className="text-destructive text-sm">{error}</span> : null}
    </div>
  );
}
