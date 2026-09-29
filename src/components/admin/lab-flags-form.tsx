'use client';

import { useState, useTransition } from 'react';
import { updateLabFlags } from '@/app/admin/(protected)/settings/actions';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { SiteSettingsRecord } from '@/lib/db/site-settings';

export function LabFlagsForm({ settings }: { settings: SiteSettingsRecord }) {
  const [f1Enabled, setF1Enabled] = useState(settings.f1ExplorerEnabled);
  const [swiggyEnabled, setSwiggyEnabled] = useState(settings.swiggySimulatorEnabled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function save(next: { f1ExplorerEnabled: boolean; swiggySimulatorEnabled: boolean }) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateLabFlags(settings.id, next);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="f1-flag">F1 Race Predictor Explorer</Label>
          <p className="text-muted-foreground text-sm">Public at /lab/f1-explorer</p>
        </div>
        <Switch
          id="f1-flag"
          checked={f1Enabled}
          disabled={isPending}
          onCheckedChange={(checked) => {
            setF1Enabled(checked);
            save({ f1ExplorerEnabled: checked, swiggySimulatorEnabled: swiggyEnabled });
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="swiggy-flag">Swiggy Instamart Simulator</Label>
          <p className="text-muted-foreground text-sm">Public at /lab/swiggy-simulator</p>
        </div>
        <Switch
          id="swiggy-flag"
          checked={swiggyEnabled}
          disabled={isPending}
          onCheckedChange={(checked) => {
            setSwiggyEnabled(checked);
            save({ f1ExplorerEnabled: f1Enabled, swiggySimulatorEnabled: checked });
          }}
        />
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {saved && !isPending ? <p className="text-muted-foreground text-sm">Saved.</p> : null}
    </div>
  );
}
