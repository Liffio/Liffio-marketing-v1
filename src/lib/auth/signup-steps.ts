import { appHandoffUrl } from './api';
import type { AuthState } from './store';

/**
 * Where a signed-in account goes next in the signup sequence (plan/google-signup-gates.md D5):
 *
 *   consent (Terms + country) → verify email → onboarding → the app
 *
 * One function so every entry point (Google completion, the consent screen, confirm-email) agrees on
 * the order. Returns a site path for a pending step, or the app handoff URL when nothing is pending.
 * The caller decides how to navigate: a site path via the router, the handoff via a full load.
 */
export function nextSignupStep(
  state: Pick<AuthState, 'termsAccepted' | 'emailVerified' | 'isOnboarded'>,
  token: string,
  redirectPath = '/dashboard',
): { kind: 'site'; path: string } | { kind: 'app'; url: string } {
  const redirectQs = redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : '';
  if (!state.termsAccepted) return { kind: 'site', path: `/complete-signup${redirectQs}` };
  if (!state.emailVerified) return { kind: 'site', path: `/confirm-email${redirectQs}` };
  if (!state.isOnboarded) return { kind: 'site', path: '/onboarding' };
  return { kind: 'app', url: appHandoffUrl(token, redirectPath) };
}
