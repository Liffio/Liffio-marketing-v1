import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site.config";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";

export const metadata: Metadata = {
  title: `Acceptable Use Policy - ${siteConfig.brand.name}`,
  description: `Guidelines for acceptable and prohibited use of the ${siteConfig.brand.name} platform.`
}

const CONTENT = `
This Acceptable Use Policy ("AUP") outlines the rules and guidelines for using Reactova. Our goal is to ensure a safe, reliable, and compliant platform for all creators.

1. Prohibited Content
You may not use Reactova to distribute, link to, or promote content that:
- Is illegal under Indian or international law
- Promotes violence, hate speech, or discrimination
- Contains sexually explicit material or pornography
- Infringes on the intellectual property of others
- Promotes illegal substances or regulated goods without proper authorisation
- Contains malware, viruses, or phishing links

2. Prohibited Activities
When using Reactova, you agree NOT to:
- Spamming: Send unsolicited bulk messages or automate DMs to accounts that have not interacted with your posts.
- Harassment: Use automated messages to harass, stalk, or threaten individuals.
- Deception: Use the platform to scam or mislead users, or to impersonate other people or brands.
- System Abuse: Attempt to bypass platform limits, scrap data without permission, or conduct stress tests on our infrastructure.
- API Violation: Attempt to use Reactova to bypass Instagram's official API restrictions or engage in "bot-like" behaviour that violates Meta's Platform Policies.

3. Instagram Best Practices
To maintain account health, we recommend:
- Setting reasonable human-like delays (30-90 seconds) between automated DMs.
- Limiting the number of automated interactions per hour as per Instagram's dynamic limits.
- Ensuring your automated messages provide genuine value to your followers.

4. Monitoring and Enforcement
We reserve the right to monitor platform usage for violations of this policy. If we detect a violation, we may:
- Issue a warning
- Temporarily suspend specific workflows
- Terminate your account immediately without refund
- Cooperate with legal authorities if illegal activities are detected

5. Reporting Abuse
If you encounter a user violating this policy, please report it to support@reactova.com.

6. Changes to This Policy
We may update this AUP from time to time. Your continued use of the platform constitutes acceptance of the latest policy.

7. Contact
For questions regarding acceptable use: support@reactova.com
`

const content = normalizePolicyContent(CONTENT.trim());

export default function AcceptableUsePolicyPage() {
  return <LegalPage title="Acceptable Use Policy" lastUpdated="April 2026" content={content} />;
}
