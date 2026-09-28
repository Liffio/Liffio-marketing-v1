import { headers } from 'next/headers';
import { Suspense } from 'react';
import { getCountryCodeFromHeaders } from '@/lib/pricing-region';
import CompleteSignupForm from './complete-signup-form';

/**
 * Consent screen for accounts that never saw the register form: "Continue with Google" signups
 * (plan/google-signup-gates.md). Server shell only for the geo header, the same fallback prefill
 * `/register` uses; the account's own country (prefilled server-side from the Google account) wins.
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
