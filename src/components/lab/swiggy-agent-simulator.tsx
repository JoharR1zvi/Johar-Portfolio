'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Step {
  node: string;
  desc: string;
}

interface Scenario {
  label: string;
  user: string;
  assistant: string;
  steps: Step[];
}

/**
 * Deterministic, fully client-side, mocked walkthrough of the Swiggy
 * Instamart assistant's agent graph. Every scenario is scripted content
 * from docs/CONTENT_FACTS.md (see supabase/seed/data/projects/swiggy.ts for
 * the same, already-reviewed facts) — this never calls a real LLM, a real
 * Swiggy API, or any network endpoint at all.
 */
export function SwiggyAgentSimulator() {
  const t = useTranslations('labSwiggy');
  const scenarios = t.raw('scenarios') as Scenario[];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = scenarios[activeIndex];

  if (!active) return null;

  return (
    <div className="mt-8">
      <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
        {t('pickHeading')}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {scenarios.map((scenario, index) => (
          <Button
            key={scenario.label}
            type="button"
            variant={index === activeIndex ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
          >
            {scenario.label}
          </Button>
        ))}
      </div>

      <div className="border-border bg-card mt-6 rounded-2xl border p-6">
        <Badge variant="secondary" className="w-fit">
          {t('mockedBadge')}
        </Badge>

        <div className="mt-4 flex flex-col gap-3">
          <p className="bg-muted text-foreground w-fit max-w-lg rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
            {active.user}
          </p>
          <p className="bg-primary text-primary-foreground ml-auto w-fit max-w-lg rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
            {active.assistant}
          </p>
        </div>

        <ol className="border-border mt-6 flex flex-col gap-3 border-t pt-4">
          {active.steps.map((step, index) => {
            const isApproval = /human-in-the-loop|human/i.test(step.node);
            return (
              <li key={`${active.label}-${step.node}`} className="flex items-start gap-3">
                <span
                  className={cn(
                    'border-border text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-foreground font-mono text-xs font-medium">
                    {step.node}
                    {isApproval ? (
                      <Badge variant="outline" className="ml-2 align-middle">
                        {t('approvalBadge')}
                      </Badge>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-muted-foreground mt-3 text-xs">{t('mockedNote')}</p>
    </div>
  );
}
