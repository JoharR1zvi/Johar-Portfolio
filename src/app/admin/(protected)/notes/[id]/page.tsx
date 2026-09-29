import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteNoteButton } from '@/components/admin/delete-note-button';
import { NoteEditTabs } from '@/components/admin/note-edit-tabs';
import { getAdminPost } from '@/lib/db/admin-posts';

export const metadata: Metadata = { title: 'Edit note' };

export default async function AdminNoteEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getAdminPost(id);
  if (!note) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/notes" className="text-muted-foreground text-sm hover:underline">
            &larr; All notes
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">
            {note.translations.en?.title ?? note.core.slug}
          </h1>
          <p className="text-muted-foreground text-sm">{note.core.slug}</p>
        </div>
        <DeleteNoteButton id={note.core.id} />
      </div>

      <NoteEditTabs note={note} />
    </div>
  );
}
