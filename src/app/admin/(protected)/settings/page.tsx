import type { Metadata } from 'next';
import { LabFlagsForm } from '@/components/admin/lab-flags-form';
import { getSiteSettingsForAdmin } from '@/lib/db/site-settings';

export const metadata: Metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsForAdmin();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-16">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-medium">Lab demos</h2>
          <p className="text-muted-foreground text-sm">
            Controls whether each demo is publicly visible or shows a &ldquo;coming soon&rdquo;
            placeholder.
          </p>
        </div>
        {settings ? (
          <LabFlagsForm settings={settings} />
        ) : (
          <p className="text-destructive text-sm">
            No site_settings row found — this shouldn&apos;t happen outside a fresh, unseeded
            database.
          </p>
        )}
      </section>
    </div>
  );
}
