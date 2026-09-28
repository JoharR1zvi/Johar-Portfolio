import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

function toLocale(locale: string): Locale {
  return locale as Locale;
}

export interface TimelineEntry {
  itemType: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
  title: string;
  description: string | null;
}

export async function getTimeline(locale: string): Promise<TimelineEntry[]> {
  const db = await createClient();

  const { data, error } = await db
    .from('timeline_items')
    .select(
      'item_type, organization, start_date, end_date, display_order, timeline_translations!inner(title, description)',
    )
    .eq('timeline_translations.locale', toLocale(locale))
    .order('display_order', { ascending: true, nullsFirst: false });
  if (error) throw new Error(`Failed loading timeline: ${error.message}`);

  return (data ?? []).flatMap((item) => {
    const translation = item.timeline_translations[0];
    if (!translation) return [];
    return [
      {
        itemType: item.item_type,
        organization: item.organization,
        startDate: item.start_date,
        endDate: item.end_date,
        title: translation.title,
        description: translation.description,
      },
    ];
  });
}
