'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import {
  login,
  mfaLoginEmailSend,
  mfaLoginVerify,
  getAuthMe,
  googleAuthUrl,
  appHandoffUrl,
  APP_BASE,
} from '@/lib/auth/api';
import {
  AuthCard,
  Button,
  ErrorMsg,
  EyeIcon,
  GoogleIcon,
  Input,
  Label,
  OrDivider,
  OtpInput,
} from '@/lib/auth/ui';

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
    const { emailVerified, isOnboarded, accessToken } = authStore.getState();
    if (!accessToken) return;
    if (!emailVerified) {
      router.replace(`/confirm-email?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (!isOnboarded) {
      router.replace('/onboarding');
      return;
    }
    window.location.href = appHandoffUrl(accessToken, redirectPath);
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

  return (
    <div className="w-full max-w-md">
      <div className="hidden lg:block max-w-sm mb-8 lg:mb-0 lg:mr-16 lg:absolute lg:left-[calc(50%-400px)]">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-gray-900">
          Turn Instagram comments into{' '}
          <span className="gradient-text">customers</span> — on autopilot.
        </h2>
      </div>

      <AuthCard>
        <header className="mb-6 border-b border-gray-100 pb-5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-gray-900">
            {mfaPreAuthToken ? "Verify it's you" : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {mfaPreAuthToken
              ? 'Enter your authenticator or email code.'
              : 'Sign in to manage your Instagram automations.'}
          </p>
        </header>

        {errorParam && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorParam === 'google_denied' ? 'Google sign in was cancelled.' : 'Google sign in failed. Please try again.'}
          </div>
        )}

        {mfaPreAuthToken ? (
          <div className="space-y-4">
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              {(['authenticator', 'email'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMfaMethod(m)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${mfaMethod === m ? 'bg-brand-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {m === 'authenticator' ? 'Authenticator' : 'Email OTP'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>{mfaMethod === 'email' ? 'Email OTP (6 digits)' : 'Authenticator code (6 digits)'}</Label>
              {mfaMethod === 'email' && (
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p>OTP expires 5 minutes after sending.</p>
                  {expiresIn > 0 && <p>Expires in <span className="font-semibold">{Math.ceil(expiresIn / 60)} min</span>.</p>}
                  <Button variant="outline" loading={sendingOtp} disabled={resendIn > 0} onClick={onSendEmailOtp} className="h-8 text-xs px-3 py-1.5">
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Send OTP'}
                  </Button>
                </div>
              )}
              <div className="pt-1">
                <OtpInput value={otp} onChange={setOtp} disabled={mfaLoading} />
              </div>
            </div>

            <ErrorMsg message={mfaError} />

            <Button className="w-full" loading={mfaLoading} disabled={otp.replace(/\s/g, '').length < 6} onClick={onVerifyMfa}>
              Verify and sign in
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => { setMfaPreAuthToken(null); setOtp(''); setMfaError(''); }}>
              ← Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <a
              href={gUrl}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <GoogleIcon />
              Continue with Google
            </a>

            <OrDivider />

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@brand.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-brand-500 hover:opacity-80">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password" className="pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              <ErrorMsg message={error} />

              <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
            </form>
          </>
        )}

        <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
          New to Liffio?{' '}
          <Link href={`/register${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="font-semibold gradient-text hover:opacity-90">
            Create free account
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
