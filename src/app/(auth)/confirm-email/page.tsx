'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { verifyEmailCode, resendEmailVerification, getAuthMe, appHandoffUrl } from '@/lib/auth/api';
import { AuthCard, Button, ErrorMsg, MailIcon, OtpInput, type OtpState } from '@/lib/auth/ui';

const PAID_PLANS = ['PRO', 'BUSINESS', 'AGENCY'];

function SuccessScreen() {
  return (
    <div className="animate-otp-success-pop text-center py-2">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1.5">Email verified!</h2>
      <p className="text-sm text-muted-foreground mb-6">Your account is ready. Taking you in…</p>
      <div className="h-1 w-32 mx-auto rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-success rounded-full animate-otp-progress" />
      </div>
    </div>
  );
}

function ConfirmEmailPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get('redirect') ?? '/dashboard';

  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<OtpState>('idle');
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');
  const [phase, setPhase] = useState<'input' | 'success'>('input');
  const initialSendDone = useRef(false);
  const userTriggeredResend = useRef(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Accept token passed from app.liffio.com guard or auth-navigation
  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      authStore.setSession({ accessToken: urlToken });
      router.replace(`/confirm-email${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to login if no token
  useEffect(() => {
    if (!mounted) return;
    const { accessToken } = authStore.getState();
    if (!accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [mounted, redirectPath, router]);

  // Auto-send verification email on mount
  useEffect(() => {
    if (!mounted || initialSendDone.current) return;
    const { accessToken, emailVerified } = authStore.getState();
    if (!accessToken || emailVerified) return;
    initialSendDone.current = true;
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function handleVerified() {
    const { accessToken, isOnboarded } = authStore.getState();
    if (!accessToken) return;
    const pendingPlan = localStorage.getItem('pending_plan');
    if (pendingPlan && PAID_PLANS.includes(pendingPlan)) {
      localStorage.removeItem('pending_plan');
      window.location.href = appHandoffUrl(accessToken, `/checkout?plan=${pendingPlan}`);
      return;
    }
    if (pendingPlan) localStorage.removeItem('pending_plan');
    if (!isOnboarded) {
      router.replace('/onboarding');
      return;
    }
    window.location.href = appHandoffUrl(accessToken, redirectPath);
  }

  async function sendCode(userTriggered = false) {
    setDeliveryError('');
    try {
      const data = await resendEmailVerification() as { emailVerified?: boolean; retryAfterSec?: number };
      if (data.emailVerified) { handleVerified(); return; }
      setResendIn(60);
    } catch (err) {
      const msg = (err as Error).message;
      // Only surface delivery errors if the user explicitly clicked Resend —
      // auto-send on mount hitting a rate limit should be silent
      if (userTriggered) setDeliveryError(msg);
      const match = msg.match(/(\d+)\s*seconds?/i);
      if (match) setResendIn(Number(match[1]));
    }
  }

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otp.replace(/\s/g, '').length !== 6) return;
    setError('');
    setOtpState('loading');

    verifyEmailCode(otp.trim())
      .then(async () => {
        const { accessToken } = authStore.getState();
        if (accessToken) {
          const authMe = await getAuthMe({ token: accessToken });
          authStore.setAuthMe(authMe);
        }
        // Show success screen, then redirect after progress bar completes
        setOtpState('success');
        // 420ms blob dissolve + 300ms square pop-in + 380ms checkmark = ~1100ms before SuccessScreen
        setTimeout(() => setPhase('success'), 900);
        setTimeout(() => handleVerified(), 1800);
      })
      .catch((err) => {
        setError((err as Error).message);
        setDeliveryError('');
        setOtpState('error');
        setOtp('');
        setTimeout(() => setOtpState('idle'), 650);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!mounted) return null;

  const user = authStore.getState().user;

  return (
    <div className="w-full max-w-md">
      <AuthCard otpState={otpState}>
        {phase === 'success' ? (
          <SuccessScreen />
        ) : (
          <>
            <header className="mb-6 border-b border-border pb-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <MailIcon />
              </div>
              <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">Verify your email</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                We sent a 6-digit code to{' '}
                <span className="rr-mask font-semibold text-foreground">{user?.email ?? 'your inbox'}</span>
              </p>
            </header>

            <div className="mb-5">
              <OtpInput value={otp} onChange={setOtp} state={otpState} />
            </div>

            {otpState === 'loading' && (
              <p className="mb-4 text-center text-xs text-muted-foreground">Verifying…</p>
            )}

            <ErrorMsg message={error} />

            {deliveryError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                {deliveryError}
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={resendIn > 0 || otpState === 'loading'}
                loading={false}
                onClick={() => { setOtp(''); setOtpState('idle'); sendCode(true); }}
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Wrong address?{' '}
                <Link href="/register" className="font-semibold gradient-text hover:opacity-90">Sign up again</Link>
              </p>
            </div>
          </>
        )}
      </AuthCard>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailPageInner />
    </Suspense>
  );
}
