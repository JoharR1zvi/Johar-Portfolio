// One-time bootstrap: registers an existing Supabase Auth user as the
// site's single admin. Doesn't create the Auth user itself — create that
// first via the Supabase dashboard (Authentication > Users > Add user),
// so the admin's password is never typed anywhere near this codebase or
// this script. This just looks the user up by email with the secret key
// and inserts their id into `admin_users`, which is what `is_admin()`
// (supabase/migrations/0004_rls_policies.sql) checks.
//
// Run with: npm run admin:create -- someone@example.com

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';

function loadEnvLocal() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of raw.split('\n')) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (value) process.env[key] = value;
  }
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    throw new Error('Usage: npm run admin:create -- someone@example.com');
  }

  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local');
  }

  const db = createClient<Database>(url, secretKey, { auth: { persistSession: false } });

  console.log(`Looking up Supabase Auth user for ${email}...`);
  let user: { id: string; email?: string } | undefined;
  let page = 1;
  while (!user) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`Failed listing users: ${error.message}`);
    user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user || data.users.length < 200) break;
    page += 1;
  }

  if (!user) {
    throw new Error(
      `No Supabase Auth user found for ${email}. Create one first: Supabase dashboard > Authentication > Users > Add user.`,
    );
  }

  const { error: insertError } = await db
    .from('admin_users')
    .upsert({ user_id: user.id }, { onConflict: 'user_id' });
  if (insertError) throw new Error(`Failed registering admin: ${insertError.message}`);

  console.log(`Done. ${email} (${user.id}) is now the site admin.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
