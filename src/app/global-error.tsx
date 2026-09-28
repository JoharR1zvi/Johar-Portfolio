'use client';

/**
 * Last-resort error boundary for the true root of the app (only invoked in
 * production, per Next.js docs). Unlike `[locale]/error.tsx`, which handles
 * ordinary page-level failures below an already-mounted `<html lang>`, this
 * one fires when an error happens early enough that Next.js has to discard
 * the whole document and replace it with a fresh shell — which is exactly
 * why this file, uniquely, must define its own `<html>`/`<body>`: without
 * it, that fallback shell has no `lang` attribute at all (a real WCAG
 * "html-has-lang" failure, found via an axe accessibility scan while a
 * database outage was triggering this exact path). No locale is reliably
 * known this early, so this stays in English rather than guessing.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem 1.5rem', maxWidth: 480 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: '1rem', color: '#5f6b7a' }}>
          This page couldn&apos;t load right now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid currentColor',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
