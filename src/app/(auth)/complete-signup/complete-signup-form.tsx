'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStore } from '@/lib/auth/store';
import { getAuthMe, submitSignupConsent } from '@/lib/auth/api';
import { nextSignupStep } from '@/lib/auth/signup-steps';
import { AuthCard, Button, CheckIcon, ErrorMsg, Label, Spinner } from '@/lib/auth/ui';
import { CountrySelect, isKnownCountryCode } from '@/lib/auth/countries';

/**
 * The Terms of Service / Privacy Policy agreement, mandatory for EVERY account before anything else:
 * new Google signups (who never saw the register form) and every account that existed before
 * agreement was recorded. Asked once, together with a confirmed country. The same checkbox and
 * country field as the register form, nothing else.
 *
 * The server enforces it (`TERMS_NOT_ACCEPTED` on the workspace API), so this page is the only way
 * forward for such an account, not a suggestion.
 */
export default function CompleteSignupForm({ defaultCountry }: { defaultCountry: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get('redirect') ?? '/dashboard';

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [country, setCountry] = useState(isKnownCountryCode(defaultCountry) ? defaultCountry : '');
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function goNext(token: string) {
    const next = nextSignupStep(authStore.getState(), token, redirectPath);
    if (next.kind === 'site') router.replace(next.path);
    else window.location.href = next.url;
  }

  useEffect(() => {
    // The app's guard sends an un-consented session here with its token, like confirm-email.
    const urlToken = params.get('token');
    if (urlToken) authStore.setSession({ accessToken: urlToken });
    const { accessToken } = authStore.getState();
    if (!accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    getAuthMe({ token: accessToken })
      .then((me) => {
        authStore.setAuthMe(me);
        if (me.termsAccepted !== false) {
          goNext(accessToken);
          return;
        }
        setEmail(me.user.email);
        // The account's own country (from the Google account) beats the geo header.
        if (me.user.country && isKnownCountryCode(me.user.country)) setCountry(me.user.country);
        setReady(true);
      })
      .catch(() => router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { accessToken } = authStore.getState();
    if (!accessToken || !agreed || !country) return;
    setError('');
    setSaving(true);
    try {
      await submitSignupConsent(country);
      authStore.setAuthMe(await getAuthMe({ token: accessToken }));
      goNext(accessToken);
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard>
        <header className="mb-6 border-b border-border pb-5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">Review and accept our terms</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Signed in as <span className="rr-mask font-semibold text-foreground">{email}</span>. To use Liffio, please
            confirm your country and accept our Terms of Service and Privacy Policy.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <CountrySelect value={country} onChange={setCountry} disabled={saving} />
            <p className="text-xs text-muted-foreground">This sets the currency you&apos;re billed in.</p>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground">
            <div
              onClick={() => setAgreed((a) => !a)}
              className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${agreed ? 'bg-primary border-primary' : 'border-input bg-background'}`}
            >
              {agreed && <CheckIcon size={10} />}
            </div>
            <span>
              I agree to the{' '}
              <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>,{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, and{' '}
              <Link href="/creators-policy" className="text-primary hover:underline whitespace-nowrap">Creators Program Policy</Link>
            </span>
          </label>

          <ErrorMsg message={error} />

          <Button type="submit" className="w-full" loading={saving} disabled={!agreed || !country}>
            Accept and continue
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
