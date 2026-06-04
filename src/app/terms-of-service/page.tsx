import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site.config";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";

export const metadata: Metadata = {
  title: `Terms of Service - ${siteConfig.brand.name}`,
  description: `Read the terms and conditions for using ${siteConfig.brand.name}.`
}

const CONTENT = `
Please read these Terms and Conditions carefully before using Reactova. By creating an account or using any part of the platform, you agree to be bound by these Terms.

1. Acceptance of Terms
By creating an account or accessing any feature of Reactova ("Platform", "we", "us", "our"), you agree to these Terms and Conditions. Reactova is operated as a sole proprietorship and is not a registered company at this time. We may require you to explicitly accept updated Terms before continuing to use the service.

2. Eligibility
You must be at least 18 years of age to use Reactova. By using this platform, you represent and warrant that you are 18 years or older. We reserve the right to terminate any account we believe is operated by a person under 18.

3. Description of Service
Reactova is a SaaS platform that enables users to automate Instagram comment-to-DM interactions. The platform includes:
- Comment-to-DM automation engine
- Bio link page builder with analytics
- Short link system with click tracking
- Conversion analytics and reporting dashboard
- Creator and influencer program
- White label agency tools
- Affiliate program

Reactova depends on third-party platforms including Instagram (Meta). Changes to these platforms, including API limitations, policy updates, or service restrictions, may affect platform functionality.

4. Instagram API Compliance
Reactova operates exclusively through Meta's official Instagram Graph API. You agree to comply with Meta's Platform Policies, Community Standards, and Terms of Service at all times. Any violation of Meta's policies by your account is solely your responsibility. Reactova accepts no liability for account restrictions, bans, or suspensions imposed by Instagram or Meta.

5. Account Registration
You agree to provide accurate, current, and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials.

6. Workspace and Subscription
Each workspace represents one connected Instagram account. Your subscription begins on the date of purchase and renews automatically unless cancelled. You are responsible for cancelling before the renewal date.

7. Acceptable Use
You agree not to use Reactova to:
- Send spam, unsolicited bulk messages, or harassing content
- Violate any applicable local, national, or international law
- Impersonate any person, business, or entity
- Distribute malware, viruses, or any harmful code
- Attempt to reverse engineer or extract source code
- Infringe intellectual property rights of any third party

8. Creator Program
The Creator Program provides free Business plan access to selected influencers in exchange for meeting monthly activity requirements and retaining the "Powered by @Reactova" tag. We reserve the right to revoke creator access at any time if requirements are not met.

9. Affiliate Program
Commissions are 25% one-time per referred paying customer, subject to a 14-30 day approval delay. Self-referrals are strictly prohibited.

10. White Label Services
Agency plan users may white label the platform. You acknowledge that the Instagram OAuth screen may display our platform name during account connection.

11. Intellectual Property
All content, features, functionality, trademarks, and technology of Reactova are the exclusive property of Reactova (sole proprietorship).

12. Third Party Integrations
Reactova integrates with third party services including Meta (Instagram), Stripe, and Razorpay. We are not responsible for the terms or actions of any third party service.

13. Service Availability
We strive to provide a reliable service but do not guarantee uninterrupted or error-free operation.

14. Limitation of Liability
Reactova (sole proprietorship) shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.

15. Disclaimer of Warranties
The platform is provided "as is" and "as available" without warranties of any kind. We do not guarantee any specific results including follower growth or leads.

16. Indemnification
You agree to indemnify and hold harmless Reactova and its proprietor from claims arising from your use of the platform or violation of these Terms.

17. Termination
We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms.

18. Governing Law
These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.

19. Changes to Terms
We may update these Terms and Conditions from time to time. Continued use of the platform after such changes constitutes your acceptance.

20. Contact
For questions about these Terms: support@reactova.com
`

const content = normalizePolicyContent(CONTENT.trim());

export default function TermsOfServicePage() {
  return <LegalPage title="Terms of Service" lastUpdated="June 2026" content={content} />;
}
