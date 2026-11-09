import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PartnerLogoWall from '@/components/PartnerLogoWall';
import PartnerDocs from './partner-docs';
import './docs.css';

/*
  liffio.com/partners/docs: the public partner docs (claim links, webhooks, status API). Public,
  no login, indexable. The same page for every partner: placeholders only, never a partner's
  name, slug, key or secret.
*/
export const metadata: Metadata = {
  title: 'Partner docs: claim links, webhooks and status API | Liffio',
  description:
    'How Liffio partners sign claim links, receive claim webhooks, verify signatures and check a customer with the status API.',
  alternates: { canonical: '/partners/docs' },
};

export default function PartnerDocsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <PartnerDocs wall={<PartnerLogoWall title="Partners already giving their customers Liffio" />} />
      </main>
      <Footer />
    </>
  );
}
