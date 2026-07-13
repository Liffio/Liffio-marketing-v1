'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPassword, resetPassword } from '@/lib/auth/api';
import { AuthCard, Button, ErrorMsg, EyeIcon, Input, KeyRoundIcon, Label, MailIcon, OtpInput, type OtpState } from '@/lib/auth/ui';

function SuccessScreen() {
  return (
    <div className="animate-otp-success-pop text-center py-2">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1.5">Password reset!</h2>
      <p className="text-sm text-muted-foreground mb-6">Taking you to sign in…</p>
      <div className="h-1 w-32 mx-auto rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-success rounded-full animate-otp-progress" />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpState, setOtpState] = useState<OtpState>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  async function sendCode() {
    setError('');
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      setResendIn(result.retryAfterSec ?? 60);
      setStep('reset');
      setSuccess('If that email exists, a reset code is on its way.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== cpw || pw.length < 8 || code.replace(/\s/g, '').length !== 6) return;
    setError('');
    setOtpState('loading');
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword: pw });
      setOtpState('success');
      setTimeout(() => setStep('done'), 900);
      setTimeout(() => router.push('/login'), 1800);
    } catch (err) {
      setError((err as Error).message);
      setOtpState('error');
      setCode('');
      setTimeout(() => setOtpState('idle'), 650);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard otpState={step === 'reset' ? otpState : undefined}>
        {step === 'done' ? (
          <SuccessScreen />
        ) : (
          <>
            <header className="mb-6 border-b border-border pb-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                {step === 'email' ? <MailIcon /> : <KeyRoundIcon />}
              </div>
              <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {step === 'email' ? 'Reset your password' : 'Enter the code'}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {step === 'email' ? (
                  "We'll email you a 6-digit code to reset your password."
                ) : (
                  <>Code sent to <span className="rr-mask">{email}</span>. It expires in 5 minutes.</>
                )}
              </p>
            </header>

            {success && step === 'reset' && (
              <div className="mb-4 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-xs text-success">
                {success}
              </div>
            )}

            {step === 'email' ? (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void sendCode(); }}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" required autoComplete="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <ErrorMsg message={error} />
                <Button type="submit" className="w-full" loading={loading}>Send reset code</Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={onReset}>
                <div className="space-y-2">
                  <Label>Reset code</Label>
                  <OtpInput value={code} onChange={setCode} disabled={loading} state={otpState} />
                  <div className="text-center">
                    <Button variant="ghost" type="button" className="h-7 text-xs" disabled={resendIn > 0 || loading} onClick={sendCode}>
                      {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pw">New password</Label>
                  <div className="relative">
                    <Input id="pw" type={showPw ? 'text' : 'password'} required autoComplete="new-password" className="pr-10" placeholder="At least 8 characters" value={pw} onChange={(e) => setPw(e.target.value)} />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cpw">Confirm new password</Label>
                  <Input id="cpw" type={showPw ? 'text' : 'password'} required autoComplete="new-password" value={cpw} onChange={(e) => setCpw(e.target.value)} />
                  {pw !== cpw && cpw.length > 0 && <p className="text-xs text-destructive">Passwords do not match</p>}
                </div>

                <ErrorMsg message={error} />

                <Button type="submit" className="w-full" loading={loading} disabled={pw !== cpw || pw.length < 8 || code.replace(/\s/g, '').length !== 6}>
                  Reset password
                </Button>
              </form>
            )}

            <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
              Remembered it?{' '}
              <Link href="/login" className="font-semibold gradient-text hover:opacity-90">Sign in</Link>
            </p>
          </>
        )}
      </AuthCard>
    </div>
  );
}
