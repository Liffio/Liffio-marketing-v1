'use server';

import { headers } from 'next/headers';
import { isDisposableDomain } from '@/lib/email-domain-check.server';
import { isValidDomain } from '@/lib/auth/email-rules';
import { clientIp, createRateLimiter } from '@/lib/rate-limit.server';

export type RegisterPrecheck = { ok: true } | { ok: false; error: string };

const precheckLimiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

/**
 * Runs on this site's server right before the register form hands the signup to the API. Takes
 * only the domain ("@example.com"), never the full address, so nothing before the "@" reaches this
 * server or the mail checker. The browser gets back only ok or a ready-to-show message.
 *
 * 🚩 Server Actions are still reachable by a direct POST (with the encrypted action id and a
 * same-origin Origin header), so it is rate-limited per IP to keep it from becoming a free
 * domain checker. Fails open: a checker outage returns ok.
 */
export async function precheckRegistration(emailDomain: string): Promise<RegisterPrecheck> {
  if (!precheckLimiter(clientIp(await headers()))) {
    return { ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' };
  }
  const domain = typeof emailDomain === 'string' ? emailDomain.trim().toLowerCase().replace(/^@/, '') : '';
  if (!isValidDomain(domain)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if ((await isDisposableDomain(domain)) === true) {
    return { ok: false, error: 'Please use a permanent email address.' };
  }
  return { ok: true };
}
