/**
 * `form_error` detail (automation v1.3, Section 12): which field failed and why, as fixed codes.
 *
 * 🔴 Never the visitor's input. The email, password, name or any part of them must not reach
 * analytics; only these enums do, and the tracker only accepts these types.
 */
import { splitEmail } from '@/lib/auth/email-rules';

export const FORM_ERROR_FIELDS = [
  'email',
  'password',
  'password_confirm',
  'name',
  'country',
  'terms',
  'code',
  'server',
] as const;
export type FormErrorField = (typeof FORM_ERROR_FIELDS)[number];

export const FORM_ERROR_REASONS = [
  'gmail_dots_blocked',
  'email_plus_blocked',
  'email_invalid',
  'email_disposable',
  'password_short',
  'password_mismatch',
  'name_short',
  'country_missing',
  'terms_unchecked',
  'code_not_applied',
  'code_invalid',
  'rate_limited',
  'server_400',
  'server_401',
  'server_403',
  'server_404',
  'server_409',
  'server_422',
  'server_429',
  'server_500',
  'server_502',
  'server_503',
  'server_network',
  'server_other',
] as const;
export type FormErrorReason = (typeof FORM_ERROR_REASONS)[number];

export type FormErrorDetail = { field: FormErrorField; reason: FormErrorReason };

/** Mirrors email-rules.ts: Gmail's "+" tags are left to the API's same-mailbox 409. */
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * Which rule `signupEmailError` refused this address under. Mirrors its order: invalid, then "+".
 * Returns null when the address passes. (`gmail_dots_blocked` stays in the enum so older events
 * still type-check; the form no longer raises it.)
 */
export function emailErrorReason(email: string): FormErrorReason | null {
  const parts = splitEmail(email);
  if (!parts) return 'email_invalid';
  if (parts.local.includes('+') && !GMAIL_DOMAINS.has(parts.domain)) return 'email_plus_blocked';
  return null;
}

/** An API failure as a reason: the HTTP status for the common ones, never the message. */
export function serverErrorReason(status: number | null | undefined): FormErrorReason {
  if (status == null || status === 0) return 'server_network';
  const code = `server_${status}`;
  return (FORM_ERROR_REASONS as readonly string[]).includes(code) ? (code as FormErrorReason) : 'server_other';
}
