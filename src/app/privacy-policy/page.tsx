import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — Liffio",
  description: "Read how Liffio collects, uses, and protects your personal information when you use our Instagram DM automation platform.",
  pathname: "/privacy-policy",
  ogImagePath: "/og/homepage.png",
});

const CONTENT = `
This Privacy Policy explains how Reactova collects, uses, stores, and shares your personal information. By using Reactova, you agree to the practices described in this policy.

1. Who We Are
Reactova is operated as a sole proprietorship based in India. We operate reactova.com and the Reactova SaaS platform. Contact us at support@reactova.com for privacy-related matters.

2. Information We Collect
2.1 Information You Provide
- Full name and email address
- Country of residence
- Instagram username and profile URL
- Payment information (processed by Stripe or Razorpay — we do not store card details)
- Content you create including workflows, messages, and bio link pages
- Communications with our support team

2.2 Information Collected Automatically
- IP address and approximate location
- Browser type, device type, and operating system
- Pages visited, time on site, and interaction events
- UTM parameters and referral source
- Timezone and language settings
- Session duration and engagement data

2.3 Instagram Data
When you connect your Instagram account, we access data through Meta's official API including profile information, post comments, and DM sending capabilities. We access only what is required for platform functionality.

3. How We Use Your Information
- Providing, maintaining, and improving our platform
- Processing payments and managing subscriptions
- Sending transactional emails including receipts, alerts, and account notifications
- Analysing platform usage to improve features and user experience
- Sending marketing communications from Reactova (you may opt out at any time)
- Fraud detection, security monitoring, and abuse prevention
- Responding to support requests
- Complying with legal obligations under Indian law

4. Legal Basis for Processing (India DPDP Act 2023 and Rules 2025)
- Contractual necessity — to fulfil the services you subscribe to
- Legitimate interests — for platform security, fraud prevention, and analytics
- Your consent — for marketing communications, which you may withdraw at any time
- Legal obligation — for tax, accounting, and regulatory compliance

5. Data Sharing
5.1 Trusted Service Providers
We only share personal data with trusted service providers necessary to operate the platform. These include:
- Stripe and Razorpay — payment processing
- Meta (Instagram) — API integration for automation
- Email service providers — for transactional and marketing emails
- Cloud hosting providers — for server infrastructure
- Analytics tools — for platform usage insights
All service providers are contractually required to handle your data securely and only for the purposes we specify.

5.2 We Do Not Sell Your Data
We do not sell personal data to third parties. We may use aggregated and anonymised data (which cannot identify you) for analytics, product improvement, and marketing purposes.

5.3 Future Data Sharing Practices
If we introduce new data sharing practices that materially change how your personal data is used, we will notify you and, where required by law, obtain your consent before implementing such changes.

5.4 Legal Disclosures
We may disclose your information if required by law, court order, or government authority, or if necessary to protect our rights, prevent fraud, or ensure user safety.

5.5 Business Transfers
If Reactova is acquired or its assets transferred, your data may be transferred as part of that transaction. We will notify you via email or platform notice in such an event.

6. Data Retention
We retain your personal data for as long as necessary to provide our services and fulfil the purposes described in this policy, or as required by applicable law. When data is no longer needed for these purposes, we will delete or anonymise it.

Specific retention periods:
- Active account data — retained while your account remains open
- Billing and payment records — retained for 7 years as required by Indian tax law
- Support communications — retained for up to 3 years for dispute resolution
- Analytics data — retained in anonymised form for platform improvement
- Data subject to active legal dispute — retained until resolution

7. Your Rights
- Access — request a copy of personal data we hold about you
- Correction — request correction of inaccurate data
- Deletion — request deletion of your personal data (see Section 8)
- Portability — receive your data in a machine-readable format
- Opt out — unsubscribe from marketing emails at any time
- Lodge a complaint — with India's Data Protection Board
To exercise any of these rights, email support@reactova.com. We will respond within 30 days.

8. Data Deletion Process
To request deletion of your personal data, email support@reactova.com with the subject line "Data Deletion Request" and include your account email address and registered name. We may verify your identity before processing the request. Requests are processed within 30 days, subject to legal and operational requirements.
Please note that certain data cannot be deleted immediately or at all, including:
- Billing records required by Indian tax law (retained for 7 years)
- Data involved in an active legal dispute or investigation
- Anonymised data that cannot be linked back to you

9. Data Security
We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), access controls, and secure infrastructure. No method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data and will notify you promptly in the event of a data breach affecting your information.

10. Cookies and Tracking
We use cookies and similar tracking technologies. See our Cookie Policy for full details on what cookies we use and how to manage them.

11. Children's Privacy
Reactova is not intended for persons under 18. We do not knowingly collect personal data from minors. If we become aware a user is under 18, we will terminate their account and delete their data promptly.

12. International Data Transfers
Your data may be processed on servers outside India when using third party services such as Stripe or our hosting provider. We ensure such providers maintain appropriate data protection standards.

13. Changes to This Policy
We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email or through the platform. Continued use of the platform after such changes constitutes your acceptance.

14. Contact
For privacy-related enquiries: support@reactova.com
`

const content = normalizePolicyContent(CONTENT.trim());

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" lastUpdated="June 2026" content={content} />;
}
