import type { PricingPlan } from '@/config/pricing.config'
import type { PricingRegion } from '@/lib/pricing-region'
import { getPricingPlans as getFallbackPricingPlans } from '@/config/pricing.config'
import { getLiffioMarketingUrl } from '@/lib/liffio-api'

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
      features: p.features,
      cta: p.cta,
      href: p.href,
    }))
    return {
      plans: plans.length > 0 ? plans : getFallbackPricingPlans(region),
      businessPlanValue: payload.businessPlanValue,
    }
  } catch (error) {
    console.error('[marketing-plans] fallback to static config', error)
    const plans = getFallbackPricingPlans(region)
    const business = plans.find((p) => p.name === 'Business')
    return {
      plans,
      businessPlanValue: business ? `${business.monthly}/mo` : region === 'india' ? '₹2,499/mo' : '$79/mo',
    }
  }
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
  return `Four tiers: ${parts.join(', ')}. Every plan includes unlimited Instagram accounts and unlimited automated DMs.`
}

export function buildCreatorsProgramFaqAnswer(businessPlanValue: string): string {
  return `Yes. Qualified Instagram creators (5K–100K followers) can apply for our Creators Program and receive the full Business plan (${businessPlanValue} value) at no cost in exchange for active platform usage. No credit card required.`
}
