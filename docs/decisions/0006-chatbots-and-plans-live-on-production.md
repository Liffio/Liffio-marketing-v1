# 6. Chatbots, and the plans live on production

Date: 2026-10-03
Status: **Proposed**: built and previewed locally, not merged or deployed

## Context

Chatbots are live on production and the marketing site did not mention them.
The plan cards also used "Everything in X, plus" with three or four bullets on
Growth and Business, so the expensive plans read as adding almost nothing.

This change also carries the live plan table that 0005 (commit 564aef7) tried
to ship and that was reverted after it broke the live site. The cause of that
break is not recorded. This change was therefore built with `next build` and
previewed with both `next dev` and `next start` before being handed over.

## The table

| | Free | Starter | Growth | Business | Agency |
| --- | --- | --- | --- | --- | --- |
| DMs | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |
| Automation workflows | 3 | 25 | 100 | 250 | 250 per workspace |
| DM follow-ups per automation | 0 | 2 | 5 | 10 | 10 |
| Team members | 1 | 3 | 5 | 15 | 15 per workspace |
| AI tokens a month | 1,000 | 10,000 | 30,000 | 75,000 | 75,000 |
| Live chatbots | 2 | 5 | 15 | Unlimited | Unlimited |
| Steps per bot | 15 | 40 | 100 | Unlimited | Unlimited |
| Keywords per bot | 5 | 15 | 40 | Unlimited | Unlimited |
| Condition rules | 0 | 5 | 15 | Unlimited | Unlimited |
| Chatbot follow-ups per step | 0 | 1 | 2 | 3 | 3 |
| Chatbot conversations a month | 500 | Unlimited | Unlimited | Unlimited | Unlimited |
| Buttons per step | 13 | 13 | 13 | 13 | 13 (Instagram's cap, not a tier difference) |

API limits, per workspace, always under their own "API limits" heading:
requests a day 0 / 200 / 500 / 1,000 / 1,000, API keys 0 / 5 / 10 / 15 / 15.

Chatbot ladder:

- **Free**: build and publish a chatbot, manage contacts, link buttons, chat analytics
- **Starter**: questions, conditions, media messages, personalization, follow-ups inside a chat, follow gate, turn off chatbot branding
- **Growth**: ice breakers, story reply and story mention triggers, default reply for unmatched DMs, chain bots, templates, tags, start a chatbot from a comment
- **Business**: lead capture into the leads list, webhook step, A/B testing on a step, handover routing, business hours, notify step
- **Agency**: Business, per workspace, across 20 workspaces

## Decision

- `src/config/pricing-v4.config.ts` holds the card copy (marketing plan section 3,
  one bullet per line, at least six per card), each card's limits panel with the
  four chatbot limits, a separate API limits group, and the matrix with a
  **Chatbots group of its own**, never mixed into automations.
- Prices are unchanged and still come live from `/marketing/plans`. Bullets,
  limits and the matrix come from the config above, through `applyV4Content`.
- Chatbots are positioned as a separate module. On competitor pages that keeps
  the existing advantage: a simple comment to DM automation needs no flow
  builder, and a chatbot is there when you want a full conversation.
- Competitor chatbot tiers are not verified, so those cells read "Check their
  plans" except where the page already establishes the fact.
- Creator gets Business chatbot features with Liffio branding kept on, and is
  never shown as a plan.

## Still not stated anywhere

- Agency white label beyond agency branding and hide Liffio branding.
- Any DM cap.
- Buttons per step as a selling point.

## Guarded by

`test/pricing.test.ts`: matrix cells against the table, the Chatbots and API
groups, "Unlimited" only where the table says so, six bullets per card, the
chatbot limits on every card, cards and matrix agreeing, "team members"
wording only, and no white label, Creator tier or dashes.
