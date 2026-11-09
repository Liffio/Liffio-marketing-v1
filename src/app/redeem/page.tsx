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
};

export default function RedeemPage() {
  return (
    <Suspense fallback={null}>
      <ClaimPage slug={null} />
    </Suspense>
  );
}
