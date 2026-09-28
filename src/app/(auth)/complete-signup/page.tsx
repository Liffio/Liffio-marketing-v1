import { headers } from 'next/headers';
import { Suspense } from 'react';
import { getCountryCodeFromHeaders } from '@/lib/pricing-region';
import CompleteSignupForm from './complete-signup-form';

/**
 * Terms / Privacy consent screen, mandatory for every account that has not yet agreed: new
 * "Continue with Google" signups and all accounts that predate recorded agreement. Server shell
 * only for the geo header, the same fallback prefill `/register` uses; the account's own country
 * (prefilled server-side from the Google account) wins.
 */
export default async function CompleteSignupPage() {
  const headerStore = await headers();
  const countryCode = getCountryCodeFromHeaders(headerStore) ?? '';

  return (
    <Suspense fallback={null}>
      <CompleteSignupForm defaultCountry={countryCode} />
    </Suspense>
  );
}
