'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { login, mfaLoginEmailSend, mfaLoginVerify, getAuthMe, googleAuthUrl } from '@/lib/auth/api';
import { nextSignupStep } from '@/lib/auth/signup-steps';
import { EyeIcon, GoogleIcon, OtpInput, SignedInNotice, Spinner } from '@/lib/auth/ui';
import { useRedirectWhenSignedIn } from '@/lib/auth/app-redirect';
import { markEmailAuthUsed, wasGoogleLastUsed } from '@/lib/auth/last-auth-method';
import { useHydrated } from '@/lib/auth/use-hydrated';
import { AuthShell } from '@/components/auth-v2/AuthShell';
import { rememberPendingHold } from '@/lib/partner-claim';

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get('redirect') ?? '/dashboard';
  const errorParam = params.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [mfaPreAuthToken, setMfaPreAuthToken] = useState<string | null>(null);
  const [mfaMethod, setMfaMethod] = useState<'authenticator' | 'email'>('authenticator');
  const [otp, setOtp] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);

  const mounted = useHydrated();

  const signedIn = useRedirectWhenSignedIn(redirectPath);

  // A partner perk hold in `?redirect=` is kept in case login leads through onboarding first.
  useEffect(() => rememberPendingHold(params), [params]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const id = setInterval(() => setExpiresIn((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [expiresIn]);

  async function navigatePostAuth() {
    const { accessToken } = authStore.getState();
    if (!accessToken) return;
    const next = nextSignupStep(authStore.getState(), accessToken, redirectPath);
    if (next.kind === 'site') router.replace(next.path);
    else window.location.href = next.url;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ email, password });
      if ('mfaRequired' in result && result.mfaRequired) {
        setMfaPreAuthToken(result.preAuthToken);
        setMfaMethod(result.methods.includes('authenticator') ? 'authenticator' : 'email');
        setOtp('');
        setLoading(false);
        return;
      }
      const loginSuccess = result as { accessToken: string };
      authStore.setSession({ accessToken: loginSuccess.accessToken });
      markEmailAuthUsed();
      const authMe = await getAuthMe({ token: loginSuccess.accessToken });
      authStore.setAuthMe(authMe);
      await navigatePostAuth();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyMfa() {
    if (!mfaPreAuthToken || otp.replace(/\s/g, '').length < 6) return;
    setMfaError('');
    setMfaLoading(true);
    try {
      const result = await mfaLoginVerify({ preAuthToken: mfaPreAuthToken, code: otp.trim(), method: mfaMethod });
      authStore.setSession({ accessToken: result.accessToken });
      markEmailAuthUsed();
      const authMe = await getAuthMe({ token: result.accessToken });
      authStore.setAuthMe(authMe);
      await navigatePostAuth();
    } catch (err) {
      setMfaError((err as Error).message);
    } finally {
      setMfaLoading(false);
    }
  }

  async function onSendEmailOtp() {
    if (!mfaPreAuthToken) return;
    setSendingOtp(true);
    try {
      const result = await mfaLoginEmailSend(mfaPreAuthToken);
      setResendIn(result.retryAfterSec ?? 60);
      setExpiresIn(result.expiresInSec ?? 300);
    } catch (err) {
      setMfaError((err as Error).message);
    } finally {
      setSendingOtp(false);
    }
  }

  const gUrl = mounted ? googleAuthUrl(redirectPath, window.location.origin) : '#';
  // Guarded by `mounted` so the badge never flashes in on hydration: it reads
  // localStorage, which has no value during server render.
  const showLastUsedBadge = mounted && wasGoogleLastUsed();

  if (signedIn) return <SignedInNotice />;

  const topRight = (
    <>
      New here?{' '}
      <Link href={`/register${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="a2-swap">
        Create account
      </Link>
    </>
  );

  return (
    <AuthShell topRight={topRight} storyHeadline="Your DMs kept going while you were away.">
      <section aria-labelledby="h-login">
        <h1 id="h-login" className="a2-h1">
          {mfaPreAuthToken ? "Verify it's you" : 'Welcome back'}
        </h1>
        <p className="a2-sub">
          {mfaPreAuthToken ? 'Enter your authenticator or email code.' : 'Your automations kept running while you were away.'}
        </p>

        {errorParam && !mfaPreAuthToken && (
          <div className="a2-alert" role="alert">
            {errorParam === 'google_denied' ? 'Google sign in was cancelled.' : 'Google sign in failed. Please try again.'}
          </div>
        )}

        {mfaPreAuthToken ? (
          <div>
            <div className="a2-f">
              <label>{mfaMethod === 'email' ? 'Email OTP (6 digits)' : 'Authenticator code (6 digits)'}</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {(['authenticator', 'email'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="a2-outline"
                    style={{
                      height: 34,
                      flex: 1,
                      fontSize: 12.5,
                      background: mfaMethod === m ? 'var(--a2-ink)' : '#fff',
                      color: mfaMethod === m ? '#fff' : 'var(--a2-ink)',
                    }}
                    onClick={() => setMfaMethod(m)}
                  >
                    {m === 'authenticator' ? 'Authenticator' : 'Email OTP'}
                  </button>
                ))}
              </div>
              {mfaMethod === 'email' && (
                <div className="a2-help" style={{ marginBottom: 10 }}>
                  <p>OTP expires 5 minutes after sending.</p>
                  {expiresIn > 0 && (
                    <p>
                      Expires in <strong>{Math.ceil(expiresIn / 60)} min</strong>.
                    </p>
                  )}
                  <button
                    type="button"
                    className="a2-outline"
                    style={{ height: 32, marginTop: 6 }}
                    disabled={resendIn > 0 || sendingOtp}
                    onClick={onSendEmailOtp}
                  >
                    {sendingOtp ? <Spinner size={14} /> : resendIn > 0 ? `Resend in ${resendIn}s` : 'Send OTP'}
                  </button>
                </div>
              )}
              <OtpInput value={otp} onChange={setOtp} disabled={mfaLoading} name="totp" />
            </div>

            {mfaError && (
              <div className="a2-msg" role="alert">
                {mfaError}
              </div>
            )}

            <button
              className="a2-go"
              type="button"
              disabled={mfaLoading || otp.replace(/\s/g, '').length < 6}
              onClick={onVerifyMfa}
            >
              <span>
                {mfaLoading && <Spinner size={16} />}
                Verify and sign in
              </span>
            </button>
            <button
              className="a2-back"
              type="button"
              style={{ marginTop: 14, marginBottom: 0 }}
              onClick={() => {
                setMfaPreAuthToken(null);
                setOtp('');
                setMfaError('');
              }}
            >
              ← Back to sign in
            </button>
          </div>
        ) : (
          <>
            <a href={gUrl} className="a2-gbtn">
              {showLastUsedBadge && <span className="a2-last">Last used</span>}
              <GoogleIcon />
              Sign in with Google
            </a>
            <div className="a2-or">or use your email</div>

            <form onSubmit={onSubmit} noValidate>
              <div className="a2-f">
                <label htmlFor="le">Email</label>
                <input
                  id="le"
                  type="email"
                  autoComplete="username"
                  placeholder="you@brand.com"
                  className="a2-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="a2-f">
                <label htmlFor="lp">
                  Password <Link href="/forgot-password">Forgot it?</Link>
                </label>
                <div className="a2-box">
                  <input
                    id="lp"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="a2-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="a2-eye" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw((s) => !s)}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="a2-msg" role="alert">
                  {error}
                </div>
              )}

              <button className="a2-go" type="submit" disabled={loading}>
                <span>
                  {loading && <Spinner size={16} />}
                  Sign in
                </span>
              </button>
            </form>
          </>
        )}

        {!mfaPreAuthToken && (
          <p className="a2-end">
            New here? <Link href="/register">Create a free account</Link>
          </p>
        )}
      </section>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
