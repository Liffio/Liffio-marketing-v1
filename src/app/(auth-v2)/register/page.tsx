import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getCountryCodeFromHeaders } from '@/lib/pricing-region';
import { getPricingContext } from '@/lib/pricing-region.server';
import RegisterForm from './register-form';

// Read the raw Vercel geo header directly: getPricingContext() returns
// countryCode: null for non-India regions which would leave the dropdown
// blank for US, CA, UK etc. Reading the header directly gives us the
// actual country code regardless of pricing region.
export default async function RegisterPage() {
  const headerStore = await headers();
  const countryCode = getCountryCodeFromHeaders(headerStore) ?? '';
  // The plan banner's price must come from the pricing source for the
  // visitor's region, never be hardcoded.
  const { region } = await getPricingContext();

  return (
    <Suspense fallback={null}>
      <RegisterForm defaultCountry={countryCode} region={region} />
    </Suspense>
  );
}
