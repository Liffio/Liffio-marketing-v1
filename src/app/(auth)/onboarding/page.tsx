import { headers } from 'next/headers';
import { getCountryCodeFromHeaders } from '@/lib/pricing-region';
import OnboardingClient from './onboarding-flow';

/**
 * Server shell, for one reason: the geo header.
 *
 * Onboarding has to ask for a country now — a Google signup arrives with `country: null`, because
 * that callback is a redirect with no form to ask on — and the ask is a great deal less annoying
 * when the likely answer is already selected. Same pattern, and the same header, as `/register`:
 * the geo code is a **pre-fill the customer confirms**, never the value itself. Nothing here picks
 * a country on anyone's behalf; what gets sent is what they left in the field.
 */
export default async function OnboardingPage() {
  const headerStore = await headers();
  const countryCode = getCountryCodeFromHeaders(headerStore) ?? '';

  return <OnboardingClient defaultCountry={countryCode} />;
}
