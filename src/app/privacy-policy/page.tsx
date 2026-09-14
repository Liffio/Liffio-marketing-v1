import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { loadPolicy, policyPublicationDate } from "@/lib/legal/load-policy";
import { buildPageMetadata } from "@/config/seo.config";

/*
  Switched to the policy pack. This one corrected a factual misstatement, not
  just wording.

  🔴 The text this replaced named STRIPE as the payment processor that receives
  customer data. Stripe was removed from the backend on 11 September, so the
  page was telling people their data went to a company that no longer touches
  it - wrong in the one section of a privacy policy where being wrong matters,
  and wrong about a third-party recipient specifically. The new document names
  Razorpay and nothing else.

  🚩 NOT wrapped in `legacyPolicyToMarkdown`, unlike /affiliate-policy. That
  bridge re-adds heading structure to plain text by guessing which lines are
  headings; run against real Markdown it does damage rather than nothing. On
  this document it would promote two ordinary sentences - "We play two
  different roles, depending on whose data it is:" and "Depending on where you
  live, you have the right to:" - into section headings, because both are
  capitalised, under 72 characters and end in a colon rather than a full stop.
  The file is Markdown now, so its headings are marked as headings and nothing
  needs inferring.
*/
export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy - Liffio",
  description:
    "Read how Liffio collects, uses, and protects your personal information when you use our Instagram DM automation platform.",
  pathname: "/privacy-policy",
  ogImagePath: "/og/homepage.png",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={policyPublicationDate("privacy-policy")}
      content={loadPolicy("privacy-policy")}
    />
  );
}
