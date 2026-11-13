import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClaimPage from '../claim/claim-page';
import '../claim/claim.css';

/*
  liffio.com/redeem: one code box for every partner's code (SPEC 9.4). Indexable, unlike
  /claim/*: it is the address on cards, posts and "Got a code? Redeem" links. A found code
  switches the page in place to /claim/<slug>#code=<CODE>.
*/
export const metadata: Metadata = {
  title: 'Redeem a partner code | Liffio',
  description: 'Got a code from a Liffio partner, creator or event? Enter it to see your offer before you sign up. No card needed.',
  alternates: { canonical: '/redeem' },
  // noindex per the Nov 2026 SEO pass: /redeem is a code-entry utility with no
  // H1 and no standalone search intent, and it was the only indexable page of
  // its kind in the sitemap. The URL still works as the printed address on
  // cards and posts (SPEC 9.4); it is simply no longer a search result.
  robots: { index: false, follow: true },
};

export default function RedeemPage() {
  return (
    <Suspense fallback={null}>
      <ClaimPage slug={null} />
    </Suspense>
  );
}
