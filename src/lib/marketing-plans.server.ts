import type { PricingPlan } from '@/config/pricing.config'
import type { PricingRegion } from '@/lib/pricing-region'
import { getPricingPlans as getFallbackPricingPlans } from '@/config/pricing.config'
import { getLiffioMarketingUrl } from '@/lib/liffio-api'
import {
  FEATURE_BRANCHING_LOGIC,
  FEATURE_COLLECT_DATA_PROMPTS,
  FEATURE_CRM_INTEGRATION,
  FEATURE_SALE_TRACKING,
  FEATURE_STORY_REACTIONS,
  FEATURE_WELCOME_DM,
} from '@/config/feature-flags'

type ApiMarketingPlan = {
  plan: string
  name: string
  monthly: string
  annual: string
  introPrice: string | null
  introPriceLabel: string | null
  description: string
  badge: string | null
  highlight: boolean
  popular: boolean
  features: Array<{ text: string; included: boolean }>
  cta: string
  href: string
}

type PlansApiResponse = {
  region: PricingRegion
  plans: ApiMarketingPlan[]
  businessPlanValue: string
}


type PlanFeatureItem = { text: string; included: boolean }

/**
 * Claims the catalogue does not support.
 *
 * These are NOT feature flags, and the distinction matters. A flag gates
 * something that will ship, whose copy becomes accurate the day it does. These
 * are claims the `packages` catalogue contradicts TODAY, so they are dropped or
 * corrected here until plan_catalog is fixed at source.
 *
 * 🚩 Sanitizing here does NOT fix the source. plan_catalog still serves these
 * strings to every other consumer. docs/decisions/0002 records the exact rows.
 *
 * `plans` omitted means the rule applies to every tier.
 */
const UNSUPPORTED_CLAIMS: ReadonlyArray<{
  match: RegExp
  plans?: readonly string[]
  replaceWith?: string
  reason: string
}> = [
  {
    match: /^Unlimited Instagram accounts$/i,
    reason:
      'One account per workspace at every tier. workspacesIncluded is 1 on Free/Starter/Growth/Business and 20 on Agency, and V4 models 1 workspace = 1 account = 1 subscription. True of no tier.',
  },
  {
    match: /^Unlimited automated DMs$/i,
    plans: ['Free'],
    reason:
      'V4 gives Free 500 DMs/month, but nothing meters DMs: no DM key in package_limits, every dmsSent* reference is analytics, and V4 flags the cap as unbuilt (line 667, blocker 25.3). Dropped rather than restated with a number nothing enforces. The enforced Free cap is 3 automations (workflows), not a DM count.',
  },
  {
    match: /^3 DM message templates$/i,
    plans: ['Free'],
    reason: 'No template limit exists. package_limits has 8 keys and none counts templates.',
  },
  {
    match: /^Story automations$/i,
    plans: ['Starter'],
    reason:
      'D8 deleted the capability. All 15 children of the Automations module are comment-based — no Story, Live, mention or welcome trigger on any package — and the server rejects Stories.',
  },
  {
    match: /^Team members \(up to 5 seats\)$/i,
    plans: ['Business'],
    replaceWith: 'Team members (up to 15 seats)',
    reason: 'package_limits.teamMembers is 15 for business. The card understated the package.',
  },
  {
    match: /^External API keys \(plan-gated\)$/i,
    plans: ['Business'],
    reason:
      'D4 withheld the external API from V4 launch. Every package has maxApiCredentials 0 and apiRequestsPerDay 0, and there is no API module among the 14 parent modules.',
  },
  {
    match: /^Full API access & webhooks$/i,
    plans: ['Agency'],
    reason:
      'Same as Business — 0 credentials, 0 requests/day, no API module. Selling it is the same class of claim as Stories.',
  },
]

function applyClaimRules(planName: string, feature: PlanFeatureItem): PlanFeatureItem | null {
  for (const rule of UNSUPPORTED_CLAIMS) {
    if (!rule.match.test(feature.text)) continue
    if (rule.plans && !rule.plans.includes(planName)) continue
    if (rule.replaceWith) return { ...feature, text: rule.replaceWith }
    console.warn(`[marketing-plans] dropped unsupported claim on ${planName}: "${feature.text}"`)
    return null
  }
  return feature
}

/**
 * Compliance guard for plan feature strings sourced from the backend
 * plan_catalog table. The DB drifts independently of this repo, so this
 * fails CLOSED: strings are normalized first, anything still carrying a
 * non-compliant claim (Live automation in any phrasing, welcome DMs while the
 * partner-beta flag is off) is dropped and logged rather than rendered, and
 * finally anything the packages catalogue contradicts is dropped or corrected
 * per UNSUPPORTED_CLAIMS.
 */
function sanitizeFeatures(planName: string, features: PlanFeatureItem[]): PlanFeatureItem[] {
  return features
    .map((f) => {
      let text = f.text
        .replace(/Story,\s*Live\s*&\s*/gi, 'Story & ')
        .replace(/All\s+\d+\s+(automation\s+)?trigger types/gi, 'All automation trigger types')
      if (!FEATURE_WELCOME_DM) {
        text = text.replace(/Story\s*&\s*welcome DM automations/gi, 'Story automations')
      }
      if (!FEATURE_SALE_TRACKING) {
        // "(comment → sale)" / "(comment to DM to click to sale)" -> click-terminal
        text = text
          .replace(/\(\s*comment\s*(→|->|to)\s*sale\s*\)/gi, '(comment → DM → click)')
          .replace(/\s*(→|->|to)\s*sale/gi, '')
      }
      if (!FEATURE_STORY_REACTIONS) {
        text = text.replace(/Story mention\s*&\s*reaction triggers/gi, 'Story mention & reply triggers')
      }
      return { ...f, text: text.trim() }
    })
    .filter((f) => {
      const liveLeak = /\bLive\b/i.test(f.text)
      const welcomeLeak = !FEATURE_WELCOME_DM && /welcome/i.test(f.text)
      const crmLeak = !FEATURE_CRM_INTEGRATION && /\bCRM\b|HubSpot|Zapier|Salesforce/i.test(f.text)
      // Narrow on purpose: bare /sale|revenue|phone/ would swallow benign plan
      // features like "Priority phone support" or "Revenue dashboard".
      const saleLeak =
        !FEATURE_SALE_TRACKING && /revenue\s+(tracking|attribution)|→\s*sale\b|\bto sale\b/i.test(f.text)
      const reactionLeak = !FEATURE_STORY_REACTIONS && /reaction/i.test(f.text)
      const promptLeak =
        !FEATURE_COLLECT_DATA_PROMPTS &&
        /custom field|phone\s+(number|field)|auto-export/i.test(f.text)
      const branchLeak = !FEATURE_BRANCHING_LOGIC && /branching|conditional/i.test(f.text)
      if (liveLeak || welcomeLeak || crmLeak || saleLeak || reactionLeak || promptLeak || branchLeak) {
        console.warn('[marketing-plans] dropped non-compliant plan feature:', f.text)
        return false
      }
      return true
    })
    // LAST, deliberately: the flag rewrites above turn the catalogue's
    // "Story, Live & welcome DM automations" into "Story automations", which is
    // the exact string the Starter rule matches. Running this earlier misses it.
    .map((f) => applyClaimRules(planName, f))
    .filter((f): f is PlanFeatureItem => f !== null)
}

/**
 * The static sheet, put through the same guard as the API payload.
 *
 * ⚠️ The fallback is NOT a safe copy. It carries the same unsupported claims as
 * plan_catalog, and it also contains Growth — which D2 part 2 is deliberately
 * withholding from the site until Razorpay keys are live. So an API outage does
 * not merely serve stale prices: it surfaces a tier that is not on sale. See
 * docs/decisions/0002.
 */
function sanitizeFallback(region: PricingRegion): PricingPlan[] {
  return getFallbackPricingPlans(region).map((p) => ({
    ...p,
    features: sanitizeFeatures(p.name, p.features),
  }))
}

/**
 * The API's `annual` field is WRONG and must not be rendered.
 *
 * `marketingPlansService` computes it as `monthly * ANNUAL_DISCOUNT` with
 * ANNUAL_DISCOUNT = 0.8, floored — so Starter serves $7 against a real $7.50,
 * Business $47 against $49.17, Agency $439 against $457.50. It is a 20% discount
 * off the monthly rate, not the annual price anyone authored.
 *
 * The authored annual totals live in `packages.yearly_price_usd_cents` /
 * `yearly_price_inr_paise` and are transcribed into pricing.config, where the
 * drift check asserts them against production by exact equality. So we take
 * `annual` and `annualTotal` from there and ignore what the API sent.
 *
 * ⏳ TEMPORARY. Delete this the day B1 ships (docs/decisions/0003). The guard
 * below shouts when that happens, so it cannot quietly outlive its purpose.
 */
function authoredAnnual(
  region: PricingRegion,
  planName: string,
  apiAnnual: string,
): { annual: string; annualTotal: string | null } | null {
  const authored = getFallbackPricingPlans(region).find((p) => p.name === planName)
  if (!authored) return null

  // Tiers with no annual plan match trivially ($0 === $0) and would fire this
  // on every request — noise that teaches people to ignore the one warning that
  // matters. Only a paid tier agreeing is evidence of anything.
  if (authored.annualTotal !== null && apiAnnual === authored.annual) {
    console.warn(
      `[marketing-plans] ${planName} (${region}): the API now serves the correct annual figure ` +
        `(${apiAnnual}). B1 has shipped — remove authoredAnnual() and this guard.`,
    )
  }
  return { annual: authored.annual, annualTotal: authored.annualTotal }
}

/**
 * Tiers the catalogue sells that `/marketing/plans` withholds, merged in from
 * the sheet so the page describes the real ladder.
 *
 * Growth is a live package at $29/₹1,499, but `show_on_marketing_site = false`
 * (D2 part 2, blocked on live Razorpay keys), so the API serves four tiers while
 * the comparison matrix has five columns. That mismatch is what this closes.
 *
 * 🚩 Merged bullets go through `sanitizeFeatures` exactly like API-served ones.
 * UNSUPPORTED_CLAIMS otherwise runs only on the API payload, which would make
 * the one statically-sourced tier the one tier exempt from the guard — the
 * asymmetry in reverse.
 *
 * ⏳ Remove this the day D2 part 2 ships. `checkExpectedDivergence` in the drift
 * check fails when Growth appears in the served payload, so the duplicate cannot
 * go unnoticed.
 */
const MERGED_FROM_SHEET: ReadonlyArray<{ name: string; after: string }> = [
  { name: 'Growth', after: 'Starter' },
]

function mergeWithheldTiers(region: PricingRegion, served: PricingPlan[]): PricingPlan[] {
  const plans = [...served]

  for (const { name, after } of MERGED_FROM_SHEET) {
    if (plans.some((p) => p.name === name)) continue // the API serves it now

    const authored = getFallbackPricingPlans(region).find((p) => p.name === name)
    if (!authored) continue

    const provisional: PricingPlan = {
      ...authored,
      features: sanitizeFeatures(authored.name, authored.features),
      provisional: true,
      // Not a checkout link. See PricingPlan.provisional.
      cta: 'Coming soon',
      href: '',
      badge: 'Coming soon',
      highlight: false,
      popular: false,
    }

    const at = plans.findIndex((p) => p.name === after)
    plans.splice(at === -1 ? plans.length : at + 1, 0, provisional)
  }

  return plans
}

export async function fetchMarketingPlansContext(region: PricingRegion): Promise<{
  plans: PricingPlan[]
  businessPlanValue: string
}> {
  try {
    const url = `${getLiffioMarketingUrl('/plans')}?region=${region}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`plans ${res.status}`)
    const payload = (await res.json()) as PlansApiResponse
    const plans: PricingPlan[] = payload.plans.map((p) => ({
      name: p.name,
      monthly: p.monthly,
      // annual/annualTotal come from the authored sheet, never from the API.
      ...(authoredAnnual(region, p.name, p.annual) ?? { annual: p.annual, annualTotal: null }),
      introPrice: p.introPrice,
      introPriceLabel: p.introPriceLabel,
      description: p.description,
      badge: p.badge,
      highlight: p.highlight,
      popular: p.popular,
      features: sanitizeFeatures(p.name, p.features),
      cta: p.cta,
      href: p.href,
    }))
    return {
      // An empty API response falls back to the static sheet — which must be
      // sanitized too. It carries the same unsupported claims verbatim, so
      // returning it raw would reinstate every string this guard just removed.
      plans: plans.length > 0 ? mergeWithheldTiers(region, plans) : sanitizeFallback(region),
      businessPlanValue: payload.businessPlanValue,
    }
  } catch (error) {
    console.error('[marketing-plans] fallback to static config', error)
    const plans = sanitizeFallback(region)
    const business = plans.find((p) => p.name === 'Business')
    return {
      plans,
      businessPlanValue: business ? `${business.monthly}/mo` : region === 'india' ? '₹2,499/mo' : '$59/mo',
    }
  }
}

const TIER_COUNT_WORDS: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
}

export function buildFreePlanFaqAnswer(region: PricingRegion, plans: PricingPlan[]): string {
  const free = plans.find((p) => p.name === 'Free')
  const price = free?.monthly ?? (region === 'india' ? '₹0' : '$0')
  return `Yes. The Free plan is ${price}/month. No credit card required. You get one Instagram account, unlimited automated DMs, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.`
}

export function buildPlansOfferedFaqAnswer(region: PricingRegion, plans: PricingPlan[]): string {
  const parts = plans.map((p) => {
    const intro =
      region === 'india' && p.introPrice && p.introPriceLabel
        ? ` - ${p.introPrice} ${p.introPriceLabel}, then ${p.monthly}/mo`
        : ''
    const annual = p.annual !== p.monthly ? ` or ${p.annual}/mo billed annually` : ''
    return `${p.name} (${p.monthly}/mo${intro}${annual})`
  })
  // Derived, never hardcoded: this list is whatever the catalogue returns, so a
  // literal "Four tiers" here would silently misdescribe a five-tier response.
  const count = TIER_COUNT_WORDS[parts.length] ?? String(parts.length)
  return `${count} tiers: ${parts.join(', ')}. Every plan connects one Instagram account per workspace and includes unlimited automated DMs.`
}

export function buildCreatorsProgramFaqAnswer(businessPlanValue: string): string {
  return `Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan (${businessPlanValue} value) at no cost in exchange for active platform usage. No credit card required.`
}
