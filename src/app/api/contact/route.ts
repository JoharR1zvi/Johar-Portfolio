import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/db/admin';
import { sendContactNotification } from '@/lib/email';
import { hashIp } from '@/lib/hash-ip';
import { checkAndRecordRateLimit } from '@/lib/rate-limit';
import { contactFormSchema } from '@/lib/validation/contact';

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return NextResponse.json({ error: 'validation_failed', issues }, { status: 400 });
  }

  const ipHash = hashIp(clientIp(request));

  const allowed = await checkAndRecordRateLimit(ipHash, 'contact');
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const db = createAdminClient();
  const { error } = await db.from('contact_submissions').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    ip_hash: ipHash,
  });
  if (error) {
    return NextResponse.json({ error: 'submission_failed' }, { status: 500 });
  }

  const { data: profile } = await db.from('profiles').select('public_email').limit(1).maybeSingle();
  if (profile?.public_email) {
    await sendContactNotification({
      to: profile.public_email,
      fromName: parsed.data.name,
      fromEmail: parsed.data.email,
      message: parsed.data.message,
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
