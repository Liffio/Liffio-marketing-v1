'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPassword, resetPassword } from '@/lib/auth/api';
import { AuthCard, Button, ErrorMsg, EyeIcon, Input, KeyRoundIcon, Label, MailIcon, OtpInput } from '@/lib/auth/ui';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword: pw });
      router.push('/login');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard>
        <header className="mb-6 border-b border-gray-100 pb-5">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
            {step === 'email' ? <MailIcon /> : <KeyRoundIcon />}
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-gray-900">
            {step === 'email' ? 'Reset your password' : 'Enter the code'}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {step === 'email'
              ? "We'll email you a 6-digit code to reset your password."
              : `Code sent to ${email}. It expires in 5 minutes.`}
          </p>
        </header>

        {success && step === 'reset' && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-xs text-green-700">
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
              <OtpInput value={code} onChange={setCode} disabled={loading} />
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
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cpw">Confirm new password</Label>
              <Input id="cpw" type={showPw ? 'text' : 'password'} required autoComplete="new-password" value={cpw} onChange={(e) => setCpw(e.target.value)} />
              {pw !== cpw && cpw.length > 0 && <p className="text-xs text-red-500">Passwords do not match</p>}
            </div>

            <ErrorMsg message={error} />

            <Button type="submit" className="w-full" loading={loading} disabled={pw !== cpw || pw.length < 8 || code.replace(/\s/g, '').length !== 6}>
              Reset password
            </Button>
          </form>
        )}

        <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
          Remembered it?{' '}
          <Link href="/login" className="font-semibold gradient-text hover:opacity-90">Sign in</Link>
        </p>
      </AuthCard>
    </div>
  );
}
