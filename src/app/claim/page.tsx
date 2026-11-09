import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClaimPage from './claim-page';
import './claim.css';

/*
  liffio.com/claim: the same page as /redeem (SPEC 9.4, no redirect). It shares the /claim/*
  noindex and points search engines at /redeem, so the two don't compete.
*/
export const metadata: Metadata = {
  title: 'Redeem a partner code | Liffio',
  description: 'Got a code from a Liffio partner, creator or event? Enter it to see your offer.',
  robots: 'noindex',
  alternates: { canonical: '/redeem' },
};

export default function ClaimIndexPage() {
  return (
    <Suspense fallback={null}>
      <ClaimPage slug={null} />
    </Suspense>
  );
}
