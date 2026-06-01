import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/config/site.config";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";

export const metadata: Metadata = {
  title: `Affiliate Program Policy — ${siteConfig.brand.name}`,
  description: `Rules, commissions, and payouts for the ${siteConfig.brand.name} Affiliate Program.`,
};

const CONTENT = `
This Affiliate Program Policy ("Policy") governs your participation in the Reactova Affiliate Program. By joining the program or using an affiliate link, you agree to be bound by this Policy as well as our Terms and Conditions, Privacy Policy, and Acceptable Use Policy.

1. Program Overview
The Reactova Affiliate Program allows registered users to earn commissions by referring new paying customers to the platform. The program is open to all Reactova users including those on the Free plan. There is no separate application process — your affiliate link is available in your account dashboard.

Key features of the program:
- Open to all registered Reactova users
- Commission earned per workspace subscription independently
- 90-day attribution window from referred user signup date
- Hybrid commission model across first 3 months
- On-demand withdrawal when available balance reaches $50
- 20-day hold period before earnings become withdrawable

2. Commission Structure
Reactova uses a hybrid commission model that rewards affiliates across the first three months of a referred customer's subscription:

2.1 Commission Rates
- Month 1 — 25% of the first payment made by the referred workspace
- Month 2 — 10% of the second payment made by the referred workspace
- Month 3 — 10% of the third payment made by the referred workspace
- Month 4 onwards — no further commission on that workspace

2.2 Per-Workspace Commission
Commission applies per workspace independently. If a referred user creates multiple workspaces within the 90-day attribution window, each workspace starts its own 3-month commission cycle. This means affiliates benefit from referring power users who manage multiple accounts or agencies who onboard multiple clients.

2.3 Eligible Plans
Commissions are earned on Starter, Pro, Business, and Agency plan subscriptions. Free plan signups do not generate commission. Creator Program access does not generate commission as it involves no payment.

3. Attribution Rules
Attribution determines which affiliate receives commission for a referred customer.

3.1 Attribution Window
Commission is earned on any workspace subscription purchased by the referred user within 90 days of their account creation date. Purchases made after the 90-day window has expired do not generate commission regardless of how many workspaces the user has.

3.2 First Referral Wins
Attribution is assigned to the first affiliate link clicked by a user. If a user clicks multiple affiliate links from different affiliates, only the first affiliate link is credited. Subsequent clicks do not override the original attribution.

3.3 Attribution Tied to User
Attribution is tied to the referred user account, not to individual workspaces. You do not need separate referral links for each workspace the user creates.

4. Tracking System
Reactova uses a multi-layer tracking system to ensure reliable attribution. The primary tracking method is a server-side cookie set when your referral link is clicked. This is supported by URL parameter capture (?ref=yourusername) and session storage as backup layers.

Your affiliate links use the format: reactova.com/?ref=yourusername
Your redirect links use the format: reactova.com/r/yourusername

Attribution is recorded server-side as soon as the referral link is clicked, before the user even lands on the page. This ensures reliable tracking across all browsers and devices.

5. Payout System

5.1 Hold Period
All earned commissions enter a 20-day hold period before becoming available for withdrawal. This hold period exists to protect against refund abuse and fraudulent referrals. Commission in the hold period does not count towards your withdrawable balance.

5.2 On-Demand Withdrawals
Reactova operates an on-demand payout system. There are no automatic monthly payouts. You may request a withdrawal at any time once your available balance (excluding held amounts) reaches the minimum threshold of $50.

5.3 Minimum Payout Threshold
The minimum withdrawal amount is $50 of available balance. The hold amount is not included in this calculation. You must have at least $50 of cleared, available earnings before a withdrawal request can be processed.

5.4 Payout Status
Your earnings move through the following status stages:
- Pending — commission earned, within the 20-day hold period
- Available — hold period complete, ready for withdrawal request
- Withdrawal Requested — you have submitted a withdrawal request
- Approved — withdrawal approved, being processed
- Paid — funds transferred to your payout method

5.5 Processing Time
Once a withdrawal is approved, funds are transferred within 5-10 business days. Processing times may vary depending on your payment method and location.

6. Refund Clawback
If a referred user receives a refund on a subscription payment for which you earned commission, the corresponding commission will be reversed and deducted from your balance.

- If the commission is still in your pending or available balance, it will be deducted directly
- If the commission has already been paid out, the reversed amount will be deducted from your next available balance
- If your balance is insufficient to cover the reversal, your account will carry a negative balance which must be cleared before future withdrawals can be processed
- Repeatedly referring users who request refunds may result in your affiliate account being reviewed or suspended

7. Identity Verification and Tax Compliance
Reactova tracks cumulative payouts per affiliate per Indian financial year (April 1 to March 31) to comply with Indian tax law including the Income Tax Act and Prevention of Money Laundering Act (PMLA).

7.1 Indian Affiliates
Identity verification requirements for Indian residents are triggered based on cumulative annual payouts:
- Below ₹15,000 per year — no verification required
- Above ₹15,000 per year — PAN card required. Tax Deducted at Source (TDS) at 5% will be applied to payments above this threshold for non-business individuals.
- Above ₹50,000 per year — PAN card mandatory, Aadhaar may be required
- Above ₹1,00,000 per year — full KYC required including PAN, Aadhaar, and bank account verification

Payouts will be held until required verification documents are submitted. You will be notified via email when your cumulative payouts approach a verification threshold. Reactova reserves the right to request PAN card, Aadhaar, or other documentation at any point during the financial year when cumulative payouts approach or exceed applicable thresholds.

7.2 International Affiliates
Indian tax law verification requirements apply to Indian residents only. International affiliates are exempt from PAN and Aadhaar requirements but must provide a valid payout method, confirmation of their country of residence, and a self-declaration confirming non-Indian residency upon request.

7.3 Your Tax Responsibility
You are solely responsible for reporting affiliate income to your relevant tax authority and paying any applicable taxes in your country of residence. Reactova is not responsible for your personal tax obligations outside of TDS deductions required under Indian law.

8. Fraud Prevention

8.1 Prohibited Activities
The following activities are strictly prohibited and will result in immediate suspension of your affiliate account and forfeiture of all pending commissions:
- Self-referrals — referring your own accounts or devices
- Paying or incentivising others to sign up through your referral link
- Creating fake accounts to generate referral commissions
- Using misleading, deceptive, or false advertising to generate referrals
- Cookie stuffing or any form of artificial attribution manipulation
- Colluding with referred users to generate fraudulent commissions through sign-ups and refunds

8.2 Risk Scoring
Reactova evaluates fraud risk per transaction using signals including device fingerprint, referral velocity, payment behaviour, and account activity patterns. IP addresses are stored for fraud detection purposes only and are not used for attribution decisions.

8.3 Transaction Outcomes
Based on risk scoring, individual transactions may be:
- Approved — commission enters normal 20-day hold
- Held for review — commission held beyond 20 days pending manual review
- Rejected — commission voided, account flagged for further monitoring

We reserve the right to withhold, void, or clawback any commission we determine to have been obtained through fraudulent, deceptive, or manipulative means.

9. Affiliate Link Rules
- Your affiliate link must be shared manually. Affiliate links must not be automatically inserted into any automated DM messages, emails, or bulk communications.
- You may share your affiliate link on your website, social media, YouTube, email newsletter, or in direct conversations.
- You must clearly disclose that your link is an affiliate link wherever required by law or platform policy.
- You must not represent yourself as an official partner, employee, or representative of Reactova.
- You must not bid on Reactova branded keywords in paid advertising without our written permission.

10. Program Modifications and Termination
We reserve the right to modify, suspend, or terminate the Affiliate Program at any time. We may change commission rates, attribution windows, payout thresholds, or any other program terms. If we make material changes, we will notify active affiliates via email with reasonable notice where possible.

We reserve the right to suspend or terminate any individual affiliate account at any time for violation of this Policy, fraudulent activity, or any other reason at our sole discretion. Upon termination, any commissions still within the hold period may be forfeited if the termination was due to policy violation or fraud.

11. Changes to This Policy
We may update this Affiliate Program Policy from time to time. If we make material changes, we will notify you via email or through the platform. Continued use of the platform after such changes constitutes your acceptance. In some cases, we may require you to explicitly accept updated terms before continuing to use the service.

Material changes include updates that affect your rights, data usage, pricing, or core functionality of the platform.

12. Governing Law
This Policy is governed by the laws of India. Any disputes arising under or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts in Vadodara, Gujarat only.

13. Contact
For affiliate program enquiries: support@reactova.com
Website: reactova.com
`;

const content = normalizePolicyContent(CONTENT.trim());

export default function AffiliatePolicyPage() {
  return <LegalPage title="Affiliate Program Policy" lastUpdated="April 2026" content={content} />;
}
