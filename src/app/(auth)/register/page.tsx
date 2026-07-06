import { Suspense } from 'react';
import { getPricingContext } from '@/lib/pricing-region.server';
import RegisterForm from './register-form';

// Detect the user's country server-side (via Vercel geo headers) and pass it
// to the form so the country dropdown is pre-filled on first render — no
// client-side API call or layout shift needed.
export default async function RegisterPage() {
  const { countryCode } = await getPricingContext();

  return (
    <Suspense fallback={null}>
      <RegisterForm defaultCountry={countryCode ?? ''} />
    </Suspense>
  );
}
