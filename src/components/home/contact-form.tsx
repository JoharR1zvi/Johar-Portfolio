'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Status = 'idle' | 'submitting' | 'success' | 'rateLimited' | 'error';

export function ContactForm() {
  const t = useTranslations('contactForm');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });

      if (response.status === 429) {
        setStatus('rateLimited');
        return;
      }
      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="text-foreground text-sm">{t('success')}</p>;
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">{t('name')}</Label>
        <Input id="contact-name" name="name" required maxLength={100} disabled={submitting} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">{t('email')}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          disabled={submitting}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">{t('message')}</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={submitting}
        />
      </div>
      {status === 'rateLimited' ? (
        <p className="text-destructive text-sm">{t('errorRateLimited')}</p>
      ) : null}
      {status === 'error' ? <p className="text-destructive text-sm">{t('errorGeneric')}</p> : null}
      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
