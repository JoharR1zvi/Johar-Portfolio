import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CreateNoteForm } from '@/components/admin/create-note-form';
import { getAdminPostList } from '@/lib/db/admin-posts';

export const metadata: Metadata = { title: 'Notes' };

export default async function AdminNotesPage() {
  const notes = await getAdminPostList();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Notes</h1>
        <p className="text-muted-foreground text-sm">
          Technical notes shown at /notes. Nothing&apos;s published here yet.
        </p>
      </div>

      <CreateNoteForm />

      {notes.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/admin/notes/${note.id}`}
                className="border-border hover:border-foreground/30 flex flex-col gap-2 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{note.title}</p>
                  <p className="text-muted-foreground text-sm">{note.slug}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={note.published ? 'default' : 'secondary'}>
                    post: {note.published ? 'published' : 'unpublished'}
                  </Badge>
                  <Badge variant={note.enPublished ? 'default' : 'secondary'}>
                    en: {note.enReviewStatus}
                    {note.enPublished ? '' : ', unpublished'}
                  </Badge>
                  {note.hasDeTranslation ? (
                    <Badge variant={note.dePublished ? 'default' : 'secondary'}>
                      de: {note.deReviewStatus}
                      {note.dePublished ? '' : ', unpublished'}
                    </Badge>
                  ) : (
                    <Badge variant="outline">de: none</Badge>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No notes yet.</p>
      )}
    </div>
  );
}
