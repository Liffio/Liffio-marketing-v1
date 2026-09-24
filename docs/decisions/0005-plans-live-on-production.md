# 5. The plans live on production

Date: 2026-09-25
Status: **Accepted**: applied to every surface that describes a plan

## Context

The owner supplied the plan table now live on production and directed that
the site match it. It supersedes the V4 sheet that ADR 0004 shipped verbatim,
and it closes most of the divergences that ADR recorded.

## The table

| | Free | Starter | Growth | Business | Agency |
| --- | --- | --- | --- | --- | --- |
| Price | $0 | $9 / ₹499 | $29 / ₹1,499 | $59 / ₹2,499 | $549 / ₹22,999 |
| DMs | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |
| Automation workflows | 3 | 25 | 100 | 250 | 250 per workspace |
| DM follow-ups | 0 | 2 | 5 | 10 | 10 per workspace |
| Team members | 1 | 3 | 5 | 15 | 15 per workspace |
| Workspaces | 1 | 1 | 1 | 1 | 20 |
| AI tokens a month | 1,000 | 10,000 | 30,000 | 75,000, rollover up to 25,000 | same, per workspace |

API limits, per workspace. These limit calls through the Liffio API only, not
scheduling or automations in the app, and the site always shows them under an
"API limits" heading:

| | Free | Starter | Growth | Business | Agency |
| --- | --- | --- | --- | --- | --- |
| Requests a day | 0 | 200 | 500 | 1,000 | 1,000 |
| API keys | 0 | 5 | 10 | 15 | 15 |
| Automations a day | 0 | 50 | 150 | 400 | 400 |
| Scheduled posts a day | 0 | 50 | 150 | 400 | 400 |

Capabilities, each tier adding to the one before:

- **Free**: comment to DM automation (keywords, reply variants, DM button,
  excluded keywords, any comment, public replies); the full post scheduler
  (feed, reel, story, carousel, media library, first comment, music, alt text,
  timezone scheduling, cover selection); leads list and timeline, bio link,
  short links, team invites and roles, affiliate, audit log, two factor.
- **Starter**: trigger blocks (the multi-keyword builder), turn off Liffio
  branding, follow before DM, bio link styling (custom slug, hide badge, icons,
  thumbnails, item visibility, click tracking), short link custom slugs, lead
  export, conversion rate and time series analytics, API access.
- **Growth**: bulk upload, caption templates, schedule templates, hashtag
  groups, post metrics, video metrics, profile outcomes, AI insights.
- **Business**: approval workflow, approve posts, activity log, custom
  permissions, analytics export, automation attribution.
- **Agency**: 20 workspaces on one bill and one billing date, agency branding
  and hide Liffio branding. Every limit is per workspace.
- **Creator** (assigned by Liffio for the creator program, not for sale):
  everything in Business except turning off Liffio branding. **Never shown on
  the marketing site as a plan**: no card, column or row. The Creators Program
  pages describe it only as Business plan access with the Liffio branding left
  on.

## Decision

- `src/config/pricing-v4.config.ts` is rewritten to this table and nothing
  else. A capability not in the table has no bullet and no matrix row. The
  design's 87 rows became 52, all drawn from the table.
- The fallback sheet in `pricing.config.ts` now reads its bullets from that
  file, so an API outage cannot render different plan copy.
- "Unlimited DMs on every plan, Free included" leads the pricing hero, the Free
  card, the matrix and every FAQ that mentions DMs. "Every paid plan" wording
  is gone site-wide.
- "Team members", never "seats".

**Prices are unchanged and still live.** `/marketing/plans` returned exactly
the table's monthly figures in both currencies on 2026-09-25, so no price was
hardcoded or edited.

## What ADR 0004's divergence table becomes

| 0004 row | Now |
| --- | --- |
| API group, keys, requests per day | Closed. Starter and up per the table |
| Free "500 DMs / month" | Closed. Unlimited on every plan |
| AI token figures | Closed. Table figures; rollover up to 25,000 on Business and Agency |
| Lead storage: Unlimited | Row removed, not in the table |
| Agency white label / client workspaces | Still not claimed. Only "agency branding and hide Liffio branding" |

## Still not stated anywhere

- Agency white label beyond agency branding and hide Liffio branding. Client
  workspaces, custom domains, domain verification, short link domains and
  theme colour are not switched on.
- Any DM cap.
- The Creator plan, in any form: no card, column, row or plan name.

## Guarded by

`test/pricing.test.ts`: the matrix cells against this table, unlimited DMs on
every card and as the only "Unlimited" cell, cards and matrix agreeing on
every shared limit, no "seats", no white label wording, and no Creator tier.
