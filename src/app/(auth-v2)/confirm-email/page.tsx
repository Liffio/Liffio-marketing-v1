'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { verifyEmailCode, resendEmailVerification, getAuthMe, appHandoffUrl } from '@/lib/auth/api';
import { MailIcon, OtpInput, type OtpState } from '@/lib/auth/ui';
import { useHydrated } from '@/lib/auth/use-hydrated';
import { AuthShell } from '@/components/auth-v2/AuthShell';

// PRO is retired: non-public in `packages`, hidden in `plan_catalog`, and not
// sold by any path, so it can never legitimately be a pending plan.
//
// ⚠️ GROWTH is deliberately NOT added here yet. It belongs, but the Free card's
// CTA is `?plan=STARTER` (see planSignupUrl in pricing.config), so this list
// cannot be widened to the real set of paid tiers until Free stops signing up
// as STARTER, otherwise every Free signup gets routed to checkout.
const PAID_PLANS = ['BUSINESS', 'AGENCY'];

function SuccessScreen() {
  return (
    <div className="animate-otp-success-pop" style={{ textAlign: 'center', padding: '8px 0' }}>
      <div
        style={{
          margin: '0 auto 20px',
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'hsl(var(--success) / 0.1)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="a2-h1" style={{ fontSize: 22 }}>
        Email verified!
      </h2>
      <p className="a2-sub" style={{ margin: '6px 0 22px', maxWidth: 'none' }}>
        Your account is ready. Taking you in…
      </p>
      <div style={{ width: 128, height: 4, borderRadius: 4, background: 'var(--a2-sand)', margin: '0 auto', overflow: 'hidden' }}>
        <div className="animate-otp-progress" style={{ display: 'block', height: '100%', background: 'hsl(var(--success))' }} />
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

  const mounted = useHydrated();
  const [accountChecked, setAccountChecked] = useState(false);

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

  // Consent comes before verification. Re-read the account first (the store may be empty when the
  // app's guard sent us here), and send a session that still owes the Terms + country back to it.
  useEffect(() => {
    if (!mounted) return;
    const { accessToken } = authStore.getState();
    if (!accessToken) return;
    getAuthMe({ token: accessToken })
      .then((me) => {
        authStore.setAuthMe(me);
        if (me.termsAccepted === false) {
          router.replace(`/complete-signup${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`);
          return;
        }
        setAccountChecked(true);
      })
      .catch(() => setAccountChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Auto-send verification email once the account check above has cleared.
  useEffect(() => {
    if (!accountChecked || initialSendDone.current) return;
    const { accessToken, emailVerified } = authStore.getState();
    if (!accessToken || emailVerified) return;
    initialSendDone.current = true;
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountChecked]);

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
      const data = (await resendEmailVerification()) as { emailVerified?: boolean; retryAfterSec?: number };
      if (data.emailVerified) {
        handleVerified();
        return;
      }
      setResendIn(60);
    } catch (err) {
      const msg = (err as Error).message;
      // Only surface delivery errors if the user explicitly clicked Resend ,
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

  const topRight = (
    <>
      Have an account?{' '}
      <Link href="/login" className="a2-swap">
        Sign in
      </Link>
    </>
  );

  const glow = phase === 'success' ? undefined : otpState === 'error' ? 'err' : otpState === 'success' ? 'ok' : undefined;

  return (
    <AuthShell topRight={topRight} storyHeadline="Someone comments. They get your link in their DMs." glow={glow}>
      {phase === 'success' ? (
        <SuccessScreen />
      ) : (
        <section aria-labelledby="h-confirm-email">
          <div className="a2-mailic">
            <MailIcon />
          </div>
          <h1 id="h-confirm-email" className="a2-h1">
            Verify your email
          </h1>
          <p className="a2-sub">
            We sent a 6-digit code to <strong className="rr-mask" style={{ color: 'var(--a2-ink)' }}>{user?.email ?? 'your inbox'}</strong>
          </p>

          <div className="a2-prog" aria-hidden="true">
            <span className="a2-done" />
            <span className="a2-done" />
            <span className="a2-now" />
          </div>
          <div className="a2-progtxt">Step 3 of 3, verify email</div>

          <div style={{ marginTop: 22 }}>
            <OtpInput value={otp} onChange={setOtp} state={otpState} />
          </div>

          {otpState === 'loading' && <p className="a2-note">Verifying…</p>}

          {error && (
            <div className="a2-msg" role="alert">
              {error}
            </div>
          )}

          {deliveryError && (
            <div className="a2-alert" role="alert">
              {deliveryError}
            </div>
          )}

          <button
            className="a2-outline"
            type="button"
            disabled={resendIn > 0 || otpState === 'loading'}
            onClick={() => {
              setOtp('');
              setOtpState('idle');
              sendCode(true);
            }}
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
          </button>
          <p className="a2-note">
            Wrong address?{' '}
            <Link href="/register" style={{ color: 'var(--a2-ink)', fontWeight: 600 }}>
              Change it
            </Link>
          </p>
        </section>
      )}
    </AuthShell>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailPageInner />
    </Suspense>
  );
}
