import type { ReactNode } from 'react';
import type { Metadata } from 'next';

// This route is a Meta OAuth popup callback, never a landing page, but it sits
// OUTSIDE the (auth) route group and `page.tsx` is a client component, so it
// could not export metadata of its own. Next.js's shallow per-field merge
// therefore handed it every field from the ROOT layout, which spreads
// `rootSeo` (src/config/seo.config.ts): the homepage title, the homepage
// description, `alternates.canonical` resolving to "/", and robots
// "index, follow". A callback URL was indexable under the homepage's identity.
//
// Same fix as src/app/(auth)/layout.tsx — a server layout carrying the
// metadata, because the page underneath is 'use client'. The layout renders
// nothing of its own, so client behaviour is untouched. Canonical is pointed
// at this route rather than left inheriting "/", and openGraph/twitter are
// left inherited exactly as the (auth) group leaves them; `robots: noindex`
// is what keeps this URL out of the index either way.
export const metadata: Metadata = {
  title: 'Connecting Instagram — Liffio',
  description: 'Finishing the Instagram connection for your Liffio workspace.',
  alternates: { canonical: '/oauth/meta/complete' },
  robots: 'noindex',
};

export default function MetaOAuthCompleteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
