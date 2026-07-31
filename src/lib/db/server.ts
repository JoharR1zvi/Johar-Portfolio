import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * Server-side Supabase client for Server Components, Route Handlers, and
 * Server Actions. Uses the publishable key and the visitor's auth cookies
 * — subject to RLS, same as the browser client. This is what almost all
 * server-side reads should use; reach for `lib/db/admin.ts` only for the
 * handful of trusted operations that must bypass RLS (see that file).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component that can't set cookies (no
            // active response, e.g. static rendering) — safe to ignore as
            // long as middleware/proxy refreshes the session elsewhere.
          }
        },
      },
    },
  );
}
