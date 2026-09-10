import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// This route is the Google sign-in callback, never a landing page, but it sits
// OUTSIDE the (auth) route group and `page.tsx` is a client component, so it
// could not export metadata of its own. Next.js's shallow per-field merge
// therefore handed it every field from the ROOT layout, which spreads
// `rootSeo` (src/config/seo.config.ts): the homepage title, the homepage
// description, `alternates.canonical` resolving to "/", and robots
// "index, follow". A callback URL carrying a `token` query param was
// indexable under the homepage's identity.
//
// Same fix as src/app/(auth)/layout.tsx — a server layout carrying the
// metadata, because the page underneath is 'use client'. The layout renders
// nothing of its own, so client behaviour is untouched. Canonical is pointed
// at this route rather than left inheriting "/", and openGraph/twitter are
// left inherited exactly as the (auth) group leaves them; `robots: noindex`
// is what keeps this URL out of the index either way.
export const metadata: Metadata = {
  title: 'Signing in — Liffio',
  description: 'Finishing your Google sign-in to Liffio.',
  alternates: { canonical: '/auth/google/complete' },
  robots: 'noindex',
};

export default function GoogleAuthCompleteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
