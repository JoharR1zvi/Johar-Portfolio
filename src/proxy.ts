import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import type { Database } from './types/supabase';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // /admin is a private, English-only tool outside the [locale] segment —
  // it needs its Supabase Auth session cookie kept fresh (Supabase's
  // documented middleware pattern), not locale routing.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return refreshAdminSession(request);
  }
  return intlMiddleware(request);
}

/**
 * Reading `auth.getUser()` here refreshes an expiring session token and
 * writes the updated cookies onto the response — without this, a signed-in
 * admin's session could silently fail to refresh, since Server Components
 * alone can only read cookies, not reliably write them back (see the
 * `setAll` comment in `lib/db/server.ts`). Authorization itself (is this
 * user actually the admin) is checked separately in
 * `src/lib/auth/session.ts`, not here — this only keeps the session alive.
 */
async function refreshAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
