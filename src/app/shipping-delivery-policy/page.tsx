import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

/*
  The eighth document, and the only one with no page before now.

  Liffio sells no physical goods, so a "shipping" policy reads oddly - but
  Razorpay requires a shipping and delivery page on every merchant site before
  live keys are issued, which is why the go-live checklist lists "Shipping and
  Delivery page published" under Billing. The document says plainly that
  delivery is instant and electronic; that is the honest version of the page
  the payment gateway asks for.
*/
export const metadata: Metadata = buildPageMetadata({
  title: "Shipping and Delivery Policy - Liffio",
  description:
    "How Liffio delivers its service. Liffio is software delivered electronically - there is no physical shipment.",
  pathname: "/shipping-delivery-policy",
  ogImagePath: "/og/homepage.png",
});

export default function ShippingDeliveryPolicyPage() {
  return (
    <LegalPage
      title="Shipping and Delivery Policy"
      lastUpdated={policyPublicationDate("shipping-delivery-policy")}
      content={loadPolicy("shipping-delivery-policy")}
    />
  );
}
