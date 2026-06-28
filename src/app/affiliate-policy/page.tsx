import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { normalizePolicyContent } from "@/lib/legal/normalize-policy";
import { buildPageMetadata } from "@/config/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Affiliate Program Policy - Liffio",
  description: "Commission rates, payout rules, and prohibited activity for the Liffio Affiliate Program.",
  pathname: "/affiliate-policy",
  ogImagePath: "/og/homepage.png",
});

const CONTENT = `
This Affiliate Program Policy ("Policy") governs your participation in the Affiliate Program. By joining the program or using an affiliate link, you agree to be bound by this Policy as well as our Terms and Conditions, Privacy Policy, and Acceptable Use Policy.

1. Program Overview
The Affiliate Program allows all registered users to earn commissions by referring new paying customers to the platform. The program is open to all users including those on the Free plan. There is no separate application process - your affiliate link is available in your account dashboard immediately after registration.

Key features of the program:
- Open to all registered users
- 50% lifetime recurring commission on every payment from referred workspaces
- Commission continues as long as referred user maintains continuous active subscription
- 10% discount applied to referred user's first payment only
- 15-day grace period for subscription renewal before affiliate commission is permanently lost
- Workspaces purchased within the 15-day grace period remain eligible for future commission
- On-demand withdrawal when available balance reaches $50
- 20-day hold period before earnings become withdrawable
- Custom referral codes supported alongside auto-generated random codes

2. Commission Structure

2.1 Lifetime Recurring Commission
Affiliates earn 50% of every payment made by a referred workspace subscription for as long as the referred user maintains an unbroken, continuously active subscription. There is no expiry on commission as long as the subscription remains active and continuous.

- Commission rate: 50% of every recurring payment
- Applies to: every billing cycle (monthly, quarterly, or yearly)
- Applies per workspace independently
- No cap on total commission earned
- Commission stops permanently if the referred user's subscription lapses beyond the 15-day grace period described in Section 4

2.2 First Payment Discount for Referred Users
Users who sign up through a referral link or enter a valid referral code at signup receive a 10% discount on their first payment only. This discount is applied automatically and is not recurring. It applies whether the referred user clicks a referral link or manually enters a referral code in the signup form.

2.3 Per-Workspace Commission
Commission applies per workspace independently. If a referred user creates multiple workspaces within the 90-day attribution window, each workspace starts its own independent commission stream. Affiliates benefit from referring power users and agencies who manage multiple workspaces.

2.4 Annual Plan Commission
For yearly subscriptions, commission is calculated on the full annual payment amount as a single commission event - not split into 12 monthly commissions. Example: if a referred user pays $279 for a Pro annual plan, the affiliate earns $139.50 as one commission. The next commission for that workspace is due on the following annual renewal.

2.5 Eligible Plans
Commissions are earned on Starter, Pro, Business, and Agency plan subscriptions in both USD and INR billing. Free plan signups do not generate commission. Creator Program access does not generate commission as it involves no payment.

3. Attribution Rules

3.1 Attribution Window
Commission eligibility applies to workspace subscriptions purchased by the referred user within 90 days of their account creation date. Purchases made after the 90-day window has expired do not generate commission regardless of how many workspaces the user has.

3.2 First Referral Wins
Attribution is assigned to the first affiliate link clicked or the first referral code entered by a user. If a user encounters multiple referral links or codes from different affiliates, only the first is credited. Subsequent clicks or code entries do not override the original attribution.

3.3 Attribution Tied to User Account
Attribution is tied to the referred user account, not to individual workspaces. You do not need separate referral links for each workspace the user creates.

4. Recurring Commission Policy and Grace Period
This section governs how lifetime recurring commission is maintained, lost, and how workspaces are treated during lapses.

4.1 Continuous Subscription Requirement
Lifetime recurring commission is earned only while the referred user maintains an unbroken, continuously active subscription on each workspace. Commission is workspace-specific - a lapse on one workspace does not affect commission on other workspaces owned by the same referred user.

4.2 The 15-Day Grace Period
When a referred user's workspace subscription expires or fails to renew, a 15-day grace period begins immediately from the expiry date.

- If the referred user renews their subscription within 15 days of expiry: subscription is considered continuous, commission continues uninterrupted, and no commission is lost
- If the referred user does not renew within 15 days: the affiliate permanently loses commission on that workspace, even if the user later resubscribes
- If the referred user renews on day 16 or later: the subscription gap exceeds the grace period and the affiliate loses all future commission on that workspace permanently

4.3 Workspace Purchases During Grace Period
Any new workspaces created or subscribed to by the referred user during the 15-day grace period are treated as valid and remain eligible for future commission. The 15-day grace period applies to the lapse on the specific workspace that expired - other workspace commissions continue unaffected.

Example - Referred user has Workspace A (Pro) and Workspace B (Starter). Workspace A expires on June 1. Grace period ends June 16.

Scenario 1 - User renews Workspace A on June 10: Within grace period - commission continues on both workspaces.

Scenario 2 - User renews Workspace A on June 20: Beyond grace period - affiliate loses Workspace A commission permanently. Workspace B commission continues unaffected.

Scenario 3 - User creates Workspace C on June 8 (during grace period): Workspace C commission is valid regardless of Workspace A lapse. Workspace A commission still lost if renewed after June 16.

4.4 Permanent Loss of Commission
Once commission is permanently lost on a workspace due to grace period expiry:

- The loss is irreversible, even if the referred user contacts us or appeals
- Affiliate receives email notification when grace period expires without renewal
- Commission is permanently removed from all future calculations for that workspace
- Any commissions already earned and in the hold or available balance from that workspace remain unaffected by the loss - only future commissions are stopped

4.5 Payment Timing and Grace Period
The grace period clock starts from the subscription expiry date, not from the payment due date or any notice sent. Affiliates are responsible for monitoring their referred users' status through the affiliate dashboard. We will send an email alert one day before a grace period expires where reasonably possible, but this is not guaranteed.

5. Tracking System

5.1 Multi-Layer Tracking
We use a five-layer tracking system to ensure reliable attribution across all browsers and devices. Attribution is captured if any layer succeeds:

1. Server-side cookie (Primary) - Set immediately when a referral link is clicked. Most reliable. Persists for 90 days.
2. URL parameter capture (Secondary) - ?ref= parameter captured and stored server-side on landing
3. Browser cookie (Tertiary) - Client-side cookie set as backup
4. Session storage (Fallback) - For same-session tracking
5. localStorage (Fallback) - Backup only. Note: Safari and iOS may clear this aggressively

Attribution resolves in the priority order above. The first successful layer is used.

5.2 Referral Link Formats
Every affiliate gets an auto-generated random referral token on account creation:

- Random token format: yourdomain.com/?ref=x7k2mQ9p
- Redirect format: yourdomain.com/r/x7k2mQ9p
- Custom code format: yourdomain.com/?ref=yourcustomcode (if custom code is set)

Both your random token and custom code (if created) are active simultaneously. You may share either format.

5.3 Custom Referral Codes
You may create one custom referral code in addition to your auto-generated random token:

- Custom codes must be alphanumeric only (letters and numbers, no spaces or symbols)
- Minimum 3 characters, maximum 20 characters
- Must be unique across the entire platform
- Custom codes can be used in referral links and entered manually in the signup form referral box
- Custom codes take effect immediately after creation
- You may update your custom code at any time. Old custom code becomes inactive immediately.

5.4 Manual Code Entry at Signup
Referred users who enter a valid referral code manually in the signup form referral box receive the same 10% first payment discount and generate the same commission as users who click a referral link. Both methods are treated identically.

6. Payout System

6.1 Hold Period
All earned commissions enter a 20-day hold period before becoming available for withdrawal. This hold period exists to protect against refund abuse and fraudulent referrals. Commission in the hold period does not count towards your withdrawable balance.

6.2 On-Demand Withdrawals
We operate an on-demand payout system. There are no automatic monthly payouts. You may request a withdrawal at any time once your available balance (excluding held amounts) reaches the minimum threshold of $50.

6.3 Minimum Payout Threshold
The minimum withdrawal amount is $50 of available balance. The hold amount is not included in this calculation. You must have at least $50 of cleared, available earnings before a withdrawal request can be processed.

A negative available balance (resulting from commission clawbacks) must be cleared to zero before any withdrawal can be processed, regardless of the $50 minimum.

6.4 Payout Status Stages
- Pending - Commission earned, within 20-day hold period
- Available - Hold period complete, ready for withdrawal request
- Withdrawal Requested - You have submitted a withdrawal request
- Approved - Withdrawal approved, being processed
- Paid - Funds transferred to your payout method

6.5 Processing Time
Once a withdrawal is approved, funds are transferred within 5-10 business days. Processing times may vary depending on your payment method and location.

7. Refund Clawback
If a referred user receives a refund on a subscription payment for which you earned commission, the corresponding commission will be reversed and deducted from your balance:

- If the commission is still in your pending or available balance, it will be deducted directly
- If the commission has already been paid out, the reversed amount will be deducted from your next available balance
- If your balance is insufficient to cover the reversal, your account will carry a negative balance which must be cleared before any future withdrawals can be processed
- Repeatedly referring users who request refunds may result in your affiliate account being reviewed or suspended

8. Identity Verification and Tax Compliance
We track cumulative payouts per affiliate per Indian financial year (April 1 to March 31) to comply with Indian tax law including the Income Tax Act and Prevention of Money Laundering Act (PMLA).

8.1 Indian Affiliates
Identity verification requirements for Indian residents are triggered based on cumulative annual payouts:

- Below ₹15,000/year - No verification required
- Above ₹15,000/year - PAN card required. TDS at 5% applied to non-business individuals.
- Above ₹50,000/year - PAN card mandatory. Aadhaar may be required.
- Above ₹1,00,000/year - Full KYC - PAN, Aadhaar, and bank account verification required.

Payouts will be held until required verification documents are submitted. You will be notified via email when your cumulative payouts approach a verification threshold.

8.2 International Affiliates
Indian tax law verification requirements apply to Indian residents only. International affiliates are exempt from PAN and Aadhaar requirements but must provide a valid payout method, confirmation of their country of residence, and a self-declaration confirming non-Indian residency upon request.

8.3 Your Tax Responsibility
You are solely responsible for reporting affiliate income to your relevant tax authority and paying any applicable taxes in your country of residence. We are not responsible for your personal tax obligations outside of TDS deductions required under Indian law.

9. Fraud Prevention

9.1 Prohibited Activities
The following activities are strictly prohibited and will result in immediate suspension of your affiliate account and forfeiture of all pending commissions:

- Self-referrals - referring your own accounts or devices
- Paying or incentivising others to sign up through your referral link
- Creating fake accounts to generate referral commissions
- Using misleading, deceptive, or false advertising to generate referrals
- Cookie stuffing or any form of artificial attribution manipulation
- Colluding with referred users to generate fraudulent commissions through sign-ups and refunds
- Creating multiple platform accounts to circumvent fraud detection

9.2 Risk Scoring
We evaluate fraud risk per transaction using signals including device fingerprint, referral velocity, payment behaviour, and account activity patterns. IP addresses are stored for fraud detection purposes only and are not used for attribution decisions.

9.3 Transaction Outcomes
Based on risk scoring, individual transactions may be:

- Approved - commission enters normal 20-day hold
- Held for review - commission held beyond 20 days pending manual review
- Rejected - commission voided, account flagged for further monitoring

We reserve the right to withhold, void, or clawback any commission we determine to have been obtained through fraudulent, deceptive, or manipulative means.

10. Affiliate Link Rules
- Your affiliate link must be shared manually. Affiliate links must not be automatically inserted into any automated DM messages, emails, or bulk communications
- You may share your affiliate link on your website, social media, YouTube, email newsletter, or in direct conversations
- You must clearly disclose that your link is an affiliate link wherever required by law or platform policy
- You must not represent yourself as an official partner, employee, or representative of the platform
- You must not bid on our branded keywords in paid advertising without our written permission

11. Program Modifications and Termination
We reserve the right to modify, suspend, or terminate the Affiliate Program at any time. We may change commission rates, attribution windows, grace periods, payout thresholds, or any other program terms.

If we make material changes that reduce commission rates or shorten grace periods, we will notify active affiliates via email with at least 30 days notice where possible. Changes that increase benefits take effect immediately.

We reserve the right to suspend or terminate any individual affiliate account at any time for violation of this Policy, fraudulent activity, or any other reason at our sole discretion. Upon termination, any commissions still within the hold period may be forfeited if the termination was due to policy violation or fraud.

12. Changes to This Policy
We may update this Affiliate Program Policy from time to time. If we make material changes, we will notify you via email or through the platform. By creating an account on the platform, you permanently accept this Policy and all future modifications to it, regardless of whether you continue to actively use the platform after registration. Continued use of the platform after any update further confirms your acceptance. In some cases, we may require you to explicitly accept updated terms before continuing to use the service.

Material changes include updates that affect your rights, commission rates, grace periods, payout thresholds, or core functionality of the affiliate program.

13. Governing Law
This Policy is governed by the laws of India. Any disputes arising under or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts in India.

14. Contact
For affiliate program enquiries: support@liffio.com
Website: liffio.com
`;

const content = normalizePolicyContent(CONTENT.trim());

export default function AffiliatePolicyPage() {
  return <LegalPage title="Affiliate Program Policy" lastUpdated="June 2026" content={content} />;
}
