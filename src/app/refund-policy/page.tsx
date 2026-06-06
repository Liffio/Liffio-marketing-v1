import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy — Liffio",
  description: "Understand Liffio's refund and cancellation policies for paid plans.",
  pathname: "/refund-policy",
  ogImagePath: "/og/homepage.png",
});

const CONTENT = `
Thank you for choosing Reactova. We strive to provide the best Instagram automation experience. Please read our refund policy carefully before subscribing.

1. Free Trial and Samples
We offer free trials or limited free access to our platform features. We encourage you to use these free tools to evaluate Reactova before purchasing a paid subscription.

2. No-Refund Policy
As a SaaS provider with immediate access to digital tools, all payments to Reactova are generally non-refundable. This includes:
- Monthly and annual subscription fees
- Renewal payments already processed
- Add-on fees or credit purchases
- Unused portions of a subscription period

3. Exceptions
We may, at our sole discretion, issue a refund or credit in the following limited circumstances:
- Technical failure: If a major platform bug prevents you from using the service for more than 48 consecutive hours and our team cannot resolve it.
- Billing error: If you were incorrectly charged due to a documented system error.
- Double payment: If you accidentally paid for the same subscription twice for the same Instagram account.

4. Cancellation
You may cancel your subscription at any time through your dashboard. Upon cancellation, you will continue to have access to the platform until the end of your current billing period. No partial refunds will be issued for the remaining time in the period.

5. Instagram Restrictions
Reactova is not responsible for any restrictions, shadowbans, or account suspensions imposed by Instagram or Meta. No refunds will be issued if your Instagram account is limited or banned by Meta while using our platform.

6. Chargebacks
If you initiate a chargeback with your bank or credit card provider without first contacting our support team, we reserve the right to immediately terminate your account and blacklist your Instagram username and email address from future use of our platform.

7. How to Request a Refund
If you believe you qualify for an exception, please email support@reactova.com with:
- Your account email
- Transaction ID or receipt
- Detailed reason for the request
- Documented evidence of technical issues (if applicable)

We will review your request and respond within 5-7 business days.

8. Contact
For refund-related enquiries: support@reactova.com
`

const content = normalizePolicyContent(CONTENT.trim());

export default function RefundPolicyPage() {
  return <LegalPage title="Refund Policy" lastUpdated="June 2026" content={content} />;
}
