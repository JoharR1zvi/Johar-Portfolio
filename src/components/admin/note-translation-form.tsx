'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { saveNoteTranslation } from '@/app/admin/(protected)/notes/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { AdminPostTranslation } from '@/lib/db/admin-posts';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

const REVIEW_STATUS_OPTIONS = ['draft', 'machine_assisted', 'reviewed'];

const selectClassName =
  'border-input bg-transparent h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 md:text-sm';

export function NoteTranslationForm({
  postId,
  locale,
  translation,
}: {
  postId: string;
  locale: Locale;
  translation: AdminPostTranslation | undefined;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const isNew = !translation;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values: AdminPostTranslation = {
      title: String(formData.get('title') ?? ''),
      bodyMarkdown: formData.get('bodyMarkdown') ? String(formData.get('bodyMarkdown')) : null,
      reviewStatus: String(formData.get('reviewStatus')) as AdminPostTranslation['reviewStatus'],
      published: formData.get('published') === 'on',
    };

    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }

    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await saveNoteTranslation(postId, locale, values);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isNew ? (
        <p className="text-muted-foreground text-sm">
          No {locale.toUpperCase()} translation yet — saving this form creates one.
        </p>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`note-title-${locale}`}>Title</Label>
        <Input
          id={`note-title-${locale}`}
          name="title"
          defaultValue={translation?.title ?? ''}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`note-body-${locale}`}>Body (Markdown)</Label>
        <Textarea
          id={`note-body-${locale}`}
          name="bodyMarkdown"
          rows={16}
          defaultValue={translation?.bodyMarkdown ?? ''}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`note-review-${locale}`}>Review status</Label>
        <select
          id={`note-review-${locale}`}
          name="reviewStatus"
          defaultValue={translation?.reviewStatus ?? 'draft'}
          className={selectClassName}
        >
          {REVIEW_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <label htmlFor={`note-published-${locale}`} className="flex w-fit items-center gap-2">
        <Switch
          id={`note-published-${locale}`}
          name="published"
          defaultChecked={translation?.published ?? false}
        />
        <span className="text-sm">Translation published</span>
      </label>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Saving…' : isNew ? 'Create translation' : 'Save translation'}
      </Button>
      {saved && !isPending ? <p className="text-muted-foreground text-sm">Saved.</p> : null}
    </form>
  );
}
