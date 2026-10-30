import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPricingContext } from '@/lib/pricing-region.server';
import ClaimPage from './claim-page';
import './claim.css';

/*
  liffio.com/claim/:slug, the partner perk claim page.

  noindex: every partner's page is reached from that partner's own link or
  code list, and a search result for it would only hand out a page that can't
  be used without one.
*/
export const metadata: Metadata = {
  title: 'Claim your Liffio perk | Liffio',
  description: 'A free Liffio plan from one of our partners.',
  robots: 'noindex',
};

type Props = { params: Promise<{ slug: string }> };

export default async function ClaimSlugPage({ params }: Props) {
  const { slug } = await params;
  const { region } = await getPricingContext();
  return (
    <Suspense fallback={null}>
      <ClaimPage slug={slug.toLowerCase()} region={region} />
    </Suspense>
  );
}
