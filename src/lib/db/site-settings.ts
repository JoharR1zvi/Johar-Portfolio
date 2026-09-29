import 'server-only';
import { createClient } from '@/lib/db/server';

export interface SiteSettings {
  f1ExplorerEnabled: boolean;
  swiggySimulatorEnabled: boolean;
}

const DEFAULTS: SiteSettings = { f1ExplorerEnabled: false, swiggySimulatorEnabled: false };

/**
 * Fails soft (logs and falls back to both demos hidden) rather than
 * throwing: these flags only gate optional lab previews, so a transient
 * database outage should degrade to "no demos shown," not take down every
 * page that renders the lab preview section.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await createClient();
    const { data, error } = await db
      .from('site_settings')
      .select('f1_explorer_enabled, swiggy_simulator_enabled')
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return DEFAULTS;

    return {
      f1ExplorerEnabled: data.f1_explorer_enabled,
      swiggySimulatorEnabled: data.swiggy_simulator_enabled,
    };
  } catch (err) {
    console.error('Failed loading site settings, defaulting to demos hidden:', err);
    return DEFAULTS;
  }
}

export interface SiteSettingsRecord extends SiteSettings {
  id: string;
}

/**
 * Admin-facing read: unlike `getSiteSettings()`, this doesn't fail soft —
 * the admin settings page should show a real error if something's wrong,
 * not a silently-defaulted view of its own data. Uses the RLS-respecting
 * client; the public "read site settings" policy already allows this.
 */
export async function getSiteSettingsForAdmin(): Promise<SiteSettingsRecord | null> {
  const db = await createClient();
  const { data, error } = await db
    .from('site_settings')
    .select('id, f1_explorer_enabled, swiggy_simulator_enabled')
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed loading site settings: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    f1ExplorerEnabled: data.f1_explorer_enabled,
    swiggySimulatorEnabled: data.swiggy_simulator_enabled,
  };
}

/**
 * Uses the RLS-respecting client, not the admin/secret one: the
 * "admin can manage site settings" policy (0004_rls_policies.sql) already
 * permits this for a signed-in admin via `is_admin()`, so there's no need
 * to bypass RLS here the way the seed script or rate limiter legitimately
 * do.
 */
export async function updateSiteSettings(id: string, values: Partial<SiteSettings>): Promise<void> {
  const db = await createClient();
  const { error } = await db
    .from('site_settings')
    .update({
      ...(values.f1ExplorerEnabled !== undefined
        ? { f1_explorer_enabled: values.f1ExplorerEnabled }
        : {}),
      ...(values.swiggySimulatorEnabled !== undefined
        ? { swiggy_simulator_enabled: values.swiggySimulatorEnabled }
        : {}),
    })
    .eq('id', id);
  if (error) throw new Error(`Failed updating site settings: ${error.message}`);
}
