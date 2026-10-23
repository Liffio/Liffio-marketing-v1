import type { Metadata } from 'next';

/**
 * Shared by every auth layout (old shell and new two-column shell) so the two
 * never drift: see the note on canonical/openGraph inheritance in
 * `src/app/(auth)/layout.tsx`.
 */
export const authPageMetadata: Metadata = {
  title: 'Account | Liffio',
  description:
    'Sign in to Liffio or create an account to set up Instagram DM automations.',
  robots: 'noindex',
};
