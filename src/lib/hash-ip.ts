import 'server-only';
import { createHmac } from 'node:crypto';

/** HMAC (not a plain hash) because IPv4 space is small enough to brute-force a plain SHA-256 back to the original address; the secret makes that infeasible while still giving a stable per-visitor key for rate limiting. */
export function hashIp(ip: string): string {
  const secret = process.env.CONTACT_IP_HASH_SECRET;
  if (!secret) throw new Error('CONTACT_IP_HASH_SECRET must be set in .env.local');
  return createHmac('sha256', secret).update(ip).digest('hex');
}
