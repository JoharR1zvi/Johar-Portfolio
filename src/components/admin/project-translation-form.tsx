'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { saveProjectTranslation } from '@/app/admin/(protected)/projects/[id]/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { AdminProjectTranslation } from '@/lib/db/admin-projects';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

const REVIEW_STATUS_OPTIONS = ['draft', 'machine_assisted', 'reviewed'];

const selectClassName =
  'border-input bg-transparent h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 md:text-sm';

export function ProjectTranslationForm({
  projectId,
  locale,
  translation,
}: {
  projectId: string;
  locale: Locale;
  translation: AdminProjectTranslation | undefined;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const isNew = !translation;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values: AdminProjectTranslation = {
      title: String(formData.get('title') ?? ''),
      oneLiner: formData.get('oneLiner') ? String(formData.get('oneLiner')) : null,
      recruiterSummary: formData.get('recruiterSummary')
        ? String(formData.get('recruiterSummary'))
        : null,
      reviewStatus: String(formData.get('reviewStatus')) as AdminProjectTranslation['reviewStatus'],
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
        await saveProjectTranslation(projectId, locale, values);
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
        <Label htmlFor={`title-${locale}`}>Title</Label>
        <Input
          id={`title-${locale}`}
          name="title"
          defaultValue={translation?.title ?? ''}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`oneLiner-${locale}`}>One-liner</Label>
        <Input
          id={`oneLiner-${locale}`}
          name="oneLiner"
          defaultValue={translation?.oneLiner ?? ''}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`recruiterSummary-${locale}`}>Recruiter summary</Label>
        <Textarea
          id={`recruiterSummary-${locale}`}
          name="recruiterSummary"
          rows={4}
          defaultValue={translation?.recruiterSummary ?? ''}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`reviewStatus-${locale}`}>Review status</Label>
        <select
          id={`reviewStatus-${locale}`}
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
        <p className="text-muted-foreground text-xs">
          Must be &ldquo;reviewed&rdquo; (and published, and the project itself published) before
          this text is publicly visible.
        </p>
      </div>
      <label htmlFor={`published-${locale}`} className="flex w-fit items-center gap-2">
        <Switch
          id={`published-${locale}`}
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
