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
  /*
    `canonical: null` removes the homepage canonical these pages inherit from
    rootSeo. The note in src/app/(auth)/layout.tsx left that inheritance in
    place on the grounds that `noindex` already keeps the URLs out of the
    index, and called the canonical a separate decision. This is that decision,
    taken 2026-11-23 while clearing Search Console's index-coverage report.

    The reason to change it: Google's own guidance is not to pair `noindex`
    with a canonical pointing at a DIFFERENT url. The two directives say
    opposite things, "do not index me" and "credit this other page for me",
    and when they conflict Google may honour the canonical, which can carry
    the noindex across to the target. The target here is the homepage.

    Nothing suggests that has happened; the homepage is indexed and ranking.
    This removes a documented conflicting signal rather than fixing an
    observed failure.
  */
  alternates: { canonical: null },
};
