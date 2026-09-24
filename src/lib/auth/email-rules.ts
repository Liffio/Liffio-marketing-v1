/**
 * Signup email rules shared by the forms (instant feedback) and the server handlers (enforcement).
 * Pure, no env, no network: safe to bundle for the client.
 */

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** Gmail ignores dots in the local part, so "a.b@gmail.com" is the same inbox as "ab@gmail.com". */
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/** Trimmed and lowercased local part and domain, split at the last "@"; null when there is no usable domain. */
export function splitEmail(email: string): { local: string; domain: string } | null {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  if (at < 1) return null;
  const domain = normalized.slice(at + 1);
  if (!DOMAIN_RE.test(domain)) return null;
  return { local: normalized.slice(0, at), domain };
}

export function isValidDomain(domain: string): boolean {
  return DOMAIN_RE.test(domain);
}

/**
 * The message to show under the email field, or null when the address is acceptable.
 *
 * Both rules stop one inbox from opening several accounts: "+" sub-addressing works on most
 * providers, and dotted variants only on Gmail, so the dot rule is Gmail-only.
 */
export function signupEmailError(email: string): string | null {
  const parts = splitEmail(email);
  if (!parts) return 'Please enter a valid email address.';
  if (parts.local.includes('+')) {
    return 'Email addresses with a "+" are not allowed. Please use your main address.';
  }
  if (GMAIL_DOMAINS.has(parts.domain) && parts.local.includes('.')) {
    return 'Please enter your Gmail address without dots, for example johnsmith@gmail.com.';
  }
  return null;
}
