'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { register, getAuthMe, googleAuthUrl, validateAffiliateCode } from '@/lib/auth/api';
import { getStoredReferralCode, getReferralPayloadForRegister, clearStoredReferralCode } from '@/lib/auth/referral';
import { AuthCard, Button, CheckIcon, ErrorMsg, EyeIcon, GoogleIcon, Input, Label, OrDivider } from '@/lib/auth/ui';

const COUNTRIES = [
  ['US', '🇺🇸 United States'], ['GB', '🇬🇧 United Kingdom'], ['IN', '🇮🇳 India'], ['CA', '🇨🇦 Canada'],
  ['AU', '🇦🇺 Australia'], ['DE', '🇩🇪 Germany'], ['FR', '🇫🇷 France'], ['BR', '🇧🇷 Brazil'],
  ['MX', '🇲🇽 Mexico'], ['NG', '🇳🇬 Nigeria'], ['PH', '🇵🇭 Philippines'], ['PK', '🇵🇰 Pakistan'],
  ['ID', '🇮🇩 Indonesia'], ['AE', '🇦🇪 UAE'], ['SA', '🇸🇦 Saudi Arabia'], ['SG', '🇸🇬 Singapore'],
  ['ZA', '🇿🇦 South Africa'], ['KE', '🇰🇪 Kenya'], ['EG', '🇪🇬 Egypt'], ['TR', '🇹🇷 Turkey'],
  ['IT', '🇮🇹 Italy'], ['ES', '🇪🇸 Spain'], ['NL', '🇳🇱 Netherlands'], ['SE', '🇸🇪 Sweden'],
  ['NO', '🇳🇴 Norway'], ['JP', '🇯🇵 Japan'], ['KR', '🇰🇷 South Korea'], ['TH', '🇹🇭 Thailand'],
  ['VN', '🇻🇳 Vietnam'], ['MY', '🇲🇾 Malaysia'], ['AR', '🇦🇷 Argentina'], ['CO', '🇨🇴 Colombia'],
  ['CL', '🇨🇱 Chile'], ['PE', '🇵🇪 Peru'], ['NZ', '🇳🇿 New Zealand'], ['IE', '🇮🇪 Ireland'],
  ['PT', '🇵🇹 Portugal'], ['GH', '🇬🇭 Ghana'], ['ET', '🇪🇹 Ethiopia'], ['TZ', '🇹🇿 Tanzania'],
] as const;

function strengthScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function RegisterPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get('redirect') ?? '';
  const pendingPlanParam = params.get('plan')?.toUpperCase() ?? null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [refValid, setRefValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pendingPlanParam) localStorage.setItem('pending_plan', pendingPlanParam);
    const stored = getStoredReferralCode();
    if (stored) setReferralCode(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const code = referralCode.trim();
    if (!code) { setRefValid(null); return; }
    const t = setTimeout(async () => {
      try { setRefValid((await validateAffiliateCode(code)).valid); }
      catch { setRefValid(null); }
    }, 400);
    return () => clearTimeout(t);
  }, [referralCode]);

  const s = useMemo(() => strengthScore(pw), [pw]);
  const strengthColor = s <= 1 ? 'bg-destructive' : s === 2 ? 'bg-warning' : s === 3 ? 'bg-primary' : 'bg-success';

  const gUrl = mounted ? googleAuthUrl(redirectPath || '/dashboard', window.location.origin) : '#';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== cpw || !agreed) return;
    setError('');
    setLoading(true);
    try {
      const refPayload = getReferralPayloadForRegister();
      const result = await register({
        name,
        email,
        password: pw,
        country: country || undefined,
        referralCode: referralCode.trim() || refPayload.referralCode,
        clientRef: refPayload.clientRef,
        sessionRef: refPayload.sessionRef,
        localRef: refPayload.localRef,
      });
      clearStoredReferralCode();
      authStore.setSession({ accessToken: result.accessToken });
      const authMe = await getAuthMe({ token: result.accessToken });
      authStore.setAuthMe(authMe);
      router.replace(`/confirm-email${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <AuthCard wide>
        <header className="mb-6 border-b border-border pb-5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">Create your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Free forever · Connect Instagram in minutes · No card required</p>
        </header>

        <a href={gUrl} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted">
          <GoogleIcon />
          Continue with Google
        </a>

        <OrDivider />

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Alex Morgan" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="you@brand.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-input rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            >
              <option value="">Select your country…</option>
              {COUNTRIES.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <div className="relative">
              <Input id="pw" type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="new-password" className="pr-10" placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <EyeIcon open={showPw} />
              </button>
            </div>
            {pw.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < s ? strengthColor : 'bg-muted'}`} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpw">Confirm password</Label>
            <Input id="cpw" value={cpw} onChange={(e) => setCpw(e.target.value)} type={showPw ? 'text' : 'password'} required autoComplete="new-password" />
            {pw !== cpw && cpw.length > 0 && <p className="text-xs text-destructive">Passwords do not match</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="referral">
              Referral code <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="referral" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Friend's code" />
            {refValid === true && <p className="text-xs text-success">✓ Valid referral — 10% off your first payment</p>}
            {refValid === false && <p className="text-xs text-destructive">Referral code not found</p>}
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
              <Link href="/creators-policy" className="text-primary hover:underline">Creators Program Policy</Link>
            </span>
          </label>

          <ErrorMsg message={error} />

          <Button type="submit" className="w-full" loading={loading} disabled={!agreed || pw !== cpw || pw.length < 8}>
            Create account
          </Button>
        </form>

        <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} className="font-semibold gradient-text hover:opacity-90">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
