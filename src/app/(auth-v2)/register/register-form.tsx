'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { register, getAuthMe, googleAuthUrl, validateAffiliateCode } from '@/lib/auth/api';
import {
  readReferralCodeFromSearch,
  getStoredReferralCode,
  getReferralPayloadForRegister,
  clearStoredReferralCode,
} from '@/lib/auth/referral';
import { SignedInNotice, CheckIcon, EyeIcon, GoogleIcon, Spinner } from '@/lib/auth/ui';
import { useRedirectWhenSignedIn } from '@/lib/auth/app-redirect';
import { isHoldId, partnerClaimPath } from '@/lib/partner-claim';
import { useHydrated } from '@/lib/auth/use-hydrated';
import { COUNTRIES, CountryFlagImg, isKnownCountryCode } from '@/lib/auth/countries';
import { precheckRegistration } from './actions';
import { signupEmailError, splitEmail } from '@/lib/auth/email-rules';
import {
  trackFormStart,
  trackFormError,
  trackFormSubmit,
  trackFormAbandon,
  trackSignupStep,
} from '@/lib/analytics/analytics';
import type { PricingRegion } from '@/lib/pricing-region';
import { getPricingPlans } from '@/config/pricing.config';
import { AuthShell } from '@/components/auth-v2/AuthShell';

function GiftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18M12 8S10.5 3 7.5 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={3} />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

const PERKS = [
  { icon: <GiftIcon />, tint: '#FFF1F3', accent: '#F5184C', title: 'Free', sub: 'forever' },
  { icon: <ChatIcon />, tint: '#FDF1E6', accent: '#EE7A1F', title: 'Unlimited', sub: 'DMs' },
  { icon: <BoltIcon />, tint: '#F6ECF6', accent: '#AD36A7', title: 'Live', sub: 'in 5 min' },
];

function pwRules(v: string) {
  return { len: v.length >= 8, num: /\d/.test(v), case: /[a-z]/.test(v) && /[A-Z]/.test(v) };
}

export default function RegisterForm({
  defaultCountry,
  region,
}: {
  defaultCountry: string;
  region: PricingRegion;
}) {
  const router = useRouter();
  const params = useSearchParams();
  // A partner perk hold from liffio.com/claim/:slug rides the same redirect the email, Google
  // and login paths already carry, landing on the app's attach route after signup.
  const hold = params.get('hold');
  const redirectPath = params.get('redirect') ?? (isHoldId(hold) ? partnerClaimPath(hold) : '');
  const pendingPlanParam = params.get('plan')?.toUpperCase() ?? null;

  const [step, setStep] = useState<1 | 2>(1);

  // ── step 1 ──
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [cpwError, setCpwError] = useState('');
  const [planRemoved, setPlanRemoved] = useState(false);

  // ── step 2 ──
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [country, setCountry] = useState(isKnownCountryCode(defaultCountry) ? defaultCountry : '');
  const [referralCode, setReferralCode] = useState('');
  const [referralOpen, setReferralOpen] = useState(false);
  const [refValid, setRefValid] = useState<boolean | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useHydrated();

  const signedIn = useRedirectWhenSignedIn(redirectPath);

  const formStartedRef = useRef(false);
  const formSubmittedRef = useRef(false);
  const detailsStartedRef = useRef(false);

  function markFormStarted() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackFormStart('register');
    trackSignupStep('signup_started');
  }

  useEffect(() => {
    if (pendingPlanParam) localStorage.setItem('pending_plan', pendingPlanParam);
    const urlRef = params.get('ref');
    /*
      🚩 READ, not capture. See the identical note this was carried over from
      in the pre-redesign register-form.tsx: filling the field is not storing,
      and the write stays with CookieConsent.
    */
    const captured = urlRef ? readReferralCodeFromSearch(`?ref=${encodeURIComponent(urlRef)}`) : null;
    const stored = captured ?? getStoredReferralCode();
    if (stored) {
      setReferralCode(stored);
      setReferralOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onPageHide() {
      if (formStartedRef.current && !formSubmittedRef.current) {
        trackFormAbandon('register');
      }
    }
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, []);

  useEffect(() => {
    const code = referralCode.trim();
    if (!code) return;
    const t = setTimeout(async () => {
      try {
        setRefValid((await validateAffiliateCode(code)).valid);
      } catch {
        setRefValid(null);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [referralCode]);

  const gUrl = mounted ? googleAuthUrl(redirectPath || '/dashboard', window.location.origin, referralCode) : '#';

  const plan = useMemo(() => {
    if (!pendingPlanParam) return null;
    return getPricingPlans(region).find((p) => p.name.toUpperCase() === pendingPlanParam) ?? null;
  }, [pendingPlanParam, region]);
  const showPlanBanner = !!plan && !planRemoved;

  function togglePasswordVisibility() {
    setShowPw((s) => !s);
  }

  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    const ruleError = signupEmailError(email);
    const rules = pwRules(pw);
    const matches = cpw.length > 0 && pw === cpw;

    setEmailTouched(true);
    setEmailError(ruleError ?? '');
    setPwError(!rules.len);
    setCpwError(cpw.length === 0 ? 'Type your password again to confirm it.' : !matches ? "The two passwords don't match." : '');

    if (ruleError || !rules.len || !matches) {
      trackFormError('register');
      return;
    }

    setStep(2);
    if (!detailsStartedRef.current) {
      detailsStartedRef.current = true;
      trackSignupStep('details_started');
    }
  }

  async function onCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    setNameError(!fn || !ln);
    setTermsError(!agreed);
    if (!fn || !ln || !agreed) {
      trackFormError('register');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Server-side domain check right before the API sees the signup. Only "@domain" is sent, never
      // the part before the "@". A failed call (network, deploy skew) is not a verdict, so it falls
      // through to register rather than blocking.
      const precheck = await precheckRegistration(`@${splitEmail(email)?.domain ?? ''}`).catch(() => null);
      if (precheck && !precheck.ok) {
        trackFormError('register');
        setStep(1);
        setEmailError(precheck.error);
        setLoading(false);
        return;
      }

      const refPayload = getReferralPayloadForRegister();
      const result = await register({
        name: `${fn} ${ln}`.trim(),
        email,
        password: pw,
        country: country || undefined,
        acceptedTerms: true,
        referralCode: referralCode.trim() || refPayload.referralCode,
        clientRef: refPayload.clientRef,
        sessionRef: refPayload.sessionRef,
        localRef: refPayload.localRef,
      });
      clearStoredReferralCode();
      authStore.setSession({ accessToken: result.accessToken });
      const authMe = await getAuthMe({ token: result.accessToken });
      authStore.setAuthMe(authMe);
      formSubmittedRef.current = true;
      trackFormSubmit('register');
      trackSignupStep('account_created');
      // The workspace is created together with the account, right here, not
      // at any point in onboarding. See CHECKLIST.md C5.
      trackSignupStep('workspace_created');
      router.replace(`/confirm-email${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`);
    } catch (err) {
      trackFormError('register');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (signedIn) return <SignedInNotice />;

  const topRight = (
    <>
      Have an account?{' '}
      <Link href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="a2-swap">
        Sign in
      </Link>
    </>
  );

  return (
    <AuthShell topRight={topRight} storyHeadline="Someone comments. They get your link in their DMs.">
      {step === 1 ? (
        <section aria-labelledby="h-register-1">
          <h1 id="h-register-1" className="a2-h1">
            Start free on Liffio
          </h1>
          <p className="a2-sub">Auto DM everyone who comments on your posts. No card needed.</p>

          <div className="a2-mini" aria-label="What you get">
            {PERKS.map((p) => (
              <div key={p.title} style={{ '--a2-tint': p.tint } as React.CSSProperties}>
                <i style={{ '--a2-accent': p.accent } as React.CSSProperties}>{p.icon}</i>
                <span>
                  <b>{p.title}</b>
                  <small>{p.sub}</small>
                </span>
              </div>
            ))}
          </div>

          {showPlanBanner && plan && (
            <div className="a2-plan">
              <div className="a2-plan-dot">{plan.name[0]}</div>
              <p>
                <strong>
                  {plan.name}, {plan.monthly} a month
                </strong>
                You&apos;ll check out after verifying your email.
              </p>
              <button type="button" onClick={() => setPlanRemoved(true)}>
                Remove
              </button>
            </div>
          )}

          <a href={gUrl} className="a2-gbtn">
            <GoogleIcon />
            Sign up with Google
          </a>
          <div className="a2-or">or use your email</div>

          <div className="a2-prog" aria-hidden="true">
            <span className="a2-now" />
            <span />
            <span />
          </div>
          <div className="a2-progtxt">Step 1 of 3, your login</div>

          <form onSubmit={onContinue} noValidate>
            <div className="a2-f">
              <label htmlFor="email">Email</label>
              <div className="a2-box">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@brand.com"
                  className={`a2-input${emailTouched && emailError ? ' a2-bad' : emailTouched && !emailError && email ? ' a2-good' : ''}`}
                  value={email}
                  onFocus={markFormStarted}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  onBlur={() => {
                    if (!email.trim()) return;
                    setEmailTouched(true);
                    setEmailError(signupEmailError(email) ?? '');
                  }}
                  aria-describedby="emailMsg"
                  aria-invalid={emailTouched && !!emailError}
                />
                {emailTouched && !emailError && email && (
                  <svg className="a2-tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </div>
              {emailTouched && emailError && (
                <div className="a2-msg" id="emailMsg" role="alert">
                  {emailError}
                </div>
              )}
            </div>

            <div className="a2-f">
              <label htmlFor="pw">Password</label>
              <div className="a2-box">
                <input
                  id="pw"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className={`a2-input${pwError ? ' a2-bad' : ''}`}
                  value={pw}
                  onFocus={markFormStarted}
                  onChange={(e) => {
                    setPw(e.target.value);
                    setPwError(false);
                  }}
                  aria-describedby="pwRules"
                />
                <button type="button" className="a2-eye" aria-label={showPw ? 'Hide passwords' : 'Show passwords'} onClick={togglePasswordVisibility}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <div className="a2-rules" id="pwRules">
                <span className={pwRules(pw).len ? 'a2-ok' : ''}>8+ characters</span>
                <span className={pwRules(pw).num ? 'a2-ok' : ''}>A number</span>
                <span className={pwRules(pw).case ? 'a2-ok' : ''}>Upper and lower case</span>
              </div>
            </div>

            <div className="a2-f">
              <label htmlFor="cpw">Confirm password</label>
              <div className="a2-box">
                <input
                  id="cpw"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Type it again"
                  className={`a2-input${cpw.length > 0 && cpw !== pw ? ' a2-bad' : cpw.length > 0 && cpw === pw ? ' a2-good' : ''}`}
                  value={cpw}
                  onFocus={markFormStarted}
                  onChange={(e) => {
                    setCpw(e.target.value);
                    setCpwError('');
                  }}
                  aria-describedby="cpwMsg"
                />
                {cpw.length > 0 && cpw === pw && (
                  <svg className="a2-tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </div>
              {cpw.length > 0 && cpw !== pw && (
                <div className="a2-msg" id="cpwMsg" role="alert">
                  The two passwords don&apos;t match.
                </div>
              )}
              {cpwError && cpw.length === 0 && (
                <div className="a2-msg" role="alert">
                  {cpwError}
                </div>
              )}
            </div>

            <button className="a2-go" type="submit">
              <span>Continue</span>
            </button>
          </form>
          <p className="a2-end">
            Have an account?{' '}
            <Link href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>Sign in</Link>
          </p>
        </section>
      ) : (
        <section aria-labelledby="h-register-2">
          <button className="a2-back" type="button" onClick={() => setStep(1)}>
            <BackIcon />
            Back
          </button>
          <h1 id="h-register-2" className="a2-h1">
            Set up your workspace
          </h1>
          <p className="a2-sub">This goes on your invoices and in your account.</p>

          <div className="a2-prog" aria-hidden="true">
            <span className="a2-done" />
            <span className="a2-now" />
            <span />
          </div>
          <div className="a2-progtxt">Step 2 of 3, about you</div>

          <div className="a2-who">
            <span className="a2-av">{email.trim()[0]?.toUpperCase() ?? ''}</span>
            <span>{email}</span>
            <button type="button" onClick={() => setStep(1)}>
              Change
            </button>
          </div>

          <form onSubmit={onCreateAccount} noValidate>
            <div className="a2-two">
              <div className="a2-f">
                <label htmlFor="fn">First name</label>
                <input
                  id="fn"
                  autoComplete="given-name"
                  placeholder="Alex"
                  className={`a2-input${nameError && !firstName.trim() ? ' a2-bad' : ''}`}
                  value={firstName}
                  onFocus={markFormStarted}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setNameError(false);
                  }}
                />
              </div>
              <div className="a2-f">
                <label htmlFor="ln">Last name</label>
                <input
                  id="ln"
                  autoComplete="family-name"
                  placeholder="Morgan"
                  className={`a2-input${nameError && !lastName.trim() ? ' a2-bad' : ''}`}
                  value={lastName}
                  onFocus={markFormStarted}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setNameError(false);
                  }}
                />
              </div>
            </div>
            {nameError && (
              <div className="a2-msg" role="alert">
                Add your first and last name.
              </div>
            )}

            <div className="a2-f">
              <label htmlFor="country">
                Country <small>Picked from your location</small>
              </label>
              <div className="a2-sel">
                <span className="a2-flag">{country ? <CountryFlagImg code={country} /> : null}</span>
                <select
                  id="country"
                  className="a2-select"
                  value={country}
                  onFocus={markFormStarted}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="" disabled>
                    Select your country…
                  </option>
                  {COUNTRIES.map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="a2-help">
                {country === 'IN' ? "You'll see prices in rupees, GST included." : "You'll see prices in US dollars."}
              </div>
            </div>

            <button
              className="a2-reflink"
              type="button"
              aria-expanded={referralOpen}
              aria-controls="refBox"
              onClick={() => setReferralOpen((o) => !o)}
            >
              {referralOpen ? 'Hide referral code' : 'Got a referral code?'}
            </button>
            {referralOpen && (
              <div className="a2-f" id="refBox">
                <label htmlFor="ref">
                  Referral code <small>Optional</small>
                </label>
                <input
                  id="ref"
                  placeholder="Friend's code"
                  className="a2-input"
                  value={referralCode}
                  onFocus={markFormStarted}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
                {referralCode.trim() && refValid === true && (
                  <div className="a2-refok">Code applied. 10% off your first payment.</div>
                )}
                {referralCode.trim() && refValid === false && (
                  <div className="a2-msg" role="alert">
                    Referral code not found
                  </div>
                )}
              </div>
            )}

            <label className="a2-agree" htmlFor="terms">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setTermsError(false);
                }}
              />
              <span className="a2-cb">
                <CheckIcon size={11} />
              </span>
              <span>
                I agree to the <Link href="/terms-of-service">Terms</Link>, <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
                <Link href="/creators-policy">Creators Program Policy</Link>
              </span>
            </label>
            {termsError && (
              <div className="a2-msg" role="alert">
                Tick the box to accept the terms.
              </div>
            )}

            {error && (
              <div className="a2-msg" role="alert">
                {error}
              </div>
            )}

            <button className="a2-go" type="submit" disabled={loading}>
              <span>
                {loading && <Spinner size={16} />}
                Create account
              </span>
            </button>
          </form>
        </section>
      )}
    </AuthShell>
  );
}
