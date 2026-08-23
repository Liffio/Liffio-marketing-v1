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


/**
 * Compliance guard for plan feature strings sourced from the backend
 * plan_catalog table. The DB drifts independently of this repo, so this
 * fails CLOSED: strings are normalized first, and anything still carrying
 * a non-compliant claim (Live automation in any phrasing, welcome DMs
 * while the partner-beta flag is off) is dropped and logged rather than
 * rendered.
 */
function sanitizeFeatures(
  features: Array<{ text: string; included: boolean }>,
): Array<{ text: string; included: boolean }> {
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
      annual: p.annual,
      introPrice: p.introPrice,
      introPriceLabel: p.introPriceLabel,
      description: p.description,
      badge: p.badge,
      highlight: p.highlight,
      popular: p.popular,
      features: sanitizeFeatures(p.features),
      cta: p.cta,
      href: p.href,
    }))
    return {
      plans: plans.length > 0 ? plans : getFallbackPricingPlans(region),
      businessPlanValue: payload.businessPlanValue,
    }
  } catch (error) {
    console.error('[marketing-plans] fallback to static config', error)
    const plans = getFallbackPricingPlans(region).map((p) => ({ ...p, features: sanitizeFeatures(p.features) }))
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
  return `Yes. The Free plan is ${price}/month. No credit card required. You get unlimited Instagram accounts, unlimited automated DMs, comment keyword triggers, public auto-replies, a bio link page, and basic analytics.`
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
  return `${count} tiers: ${parts.join(', ')}. Every plan includes unlimited Instagram accounts and unlimited automated DMs.`
}

export function buildCreatorsProgramFaqAnswer(businessPlanValue: string): string {
  return `Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan (${businessPlanValue} value) at no cost in exchange for active platform usage. No credit card required.`
}
