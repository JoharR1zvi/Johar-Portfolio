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
