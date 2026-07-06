'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authStore } from '@/lib/auth/store';
import { register, getAuthMe, googleAuthUrl, validateAffiliateCode } from '@/lib/auth/api';
import { captureReferralFromUrl, getStoredReferralCode, getReferralPayloadForRegister, clearStoredReferralCode } from '@/lib/auth/referral';
import { AuthCard, Button, CheckIcon, ErrorMsg, EyeIcon, GoogleIcon, Input, Label, OrDivider } from '@/lib/auth/ui';

const COUNTRIES: [string, string][] = [
  // Core English markets
  ['US', 'United States'], ['GB', 'United Kingdom'], ['IN', 'India'], ['CA', 'Canada'],
  ['AU', 'Australia'], ['NZ', 'New Zealand'], ['IE', 'Ireland'],
  // Western & Northern Europe
  ['DE', 'Germany'], ['FR', 'France'], ['NL', 'Netherlands'], ['CH', 'Switzerland'],
  ['IT', 'Italy'], ['ES', 'Spain'], ['BE', 'Belgium'], ['AT', 'Austria'],
  ['SE', 'Sweden'], ['NO', 'Norway'], ['DK', 'Denmark'], ['FI', 'Finland'], ['PT', 'Portugal'],
  // Gulf
  ['AE', 'UAE'], ['SA', 'Saudi Arabia'],
  // High income Asia
  ['SG', 'Singapore'], ['HK', 'Hong Kong'], ['JP', 'Japan'], ['KR', 'South Korea'], ['TW', 'Taiwan'],
  // MENA
  ['IL', 'Israel'], ['TR', 'Turkey'], ['EG', 'Egypt'],
  // South & Southeast Asia
  ['MY', 'Malaysia'], ['ID', 'Indonesia'], ['PH', 'Philippines'], ['TH', 'Thailand'], ['VN', 'Vietnam'],
  ['PK', 'Pakistan'], ['BD', 'Bangladesh'], ['LK', 'Sri Lanka'], ['NP', 'Nepal'],
  // Latin America
  ['BR', 'Brazil'], ['MX', 'Mexico'], ['AR', 'Argentina'], ['CO', 'Colombia'], ['CL', 'Chile'], ['PE', 'Peru'],
  // Eastern Europe
  ['RU', 'Russia'], ['PL', 'Poland'], ['UA', 'Ukraine'], ['CZ', 'Czech Republic'],
  ['RO', 'Romania'], ['HU', 'Hungary'], ['GR', 'Greece'], ['RS', 'Serbia'],
  // Africa
  ['ZA', 'South Africa'], ['NG', 'Nigeria'], ['KE', 'Kenya'], ['GH', 'Ghana'], ['ET', 'Ethiopia'], ['TZ', 'Tanzania'],
  // Other
  ['AF', 'Afghanistan'],
];

// Only renders countries in our list — falls back to blank for unrecognised codes
const KNOWN_CODES = new Set(COUNTRIES.map(([code]) => code));

function FlagImg({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      width={20}
      height={15}
      alt={code}
      className="rounded-[2px] object-cover"
    />
  );
}

function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(([code]) => code === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm border border-input rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-left"
      >
        {selected ? (
          <>
            <FlagImg code={selected[0]} />
            <span className="flex-1">{selected[1]}</span>
          </>
        ) : (
          <span className="flex-1 text-muted-foreground">Select your country…</span>
        )}
        <svg className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-input bg-background shadow-lg">
          {COUNTRIES.map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => { onChange(code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-primary/5 transition-colors ${value === code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}
            >
              <FlagImg code={code} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function strengthScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function RegisterForm({ defaultCountry }: { defaultCountry: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = params.get('redirect') ?? '';
  const pendingPlanParam = params.get('plan')?.toUpperCase() ?? null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // Pre-fill from server-detected geo, only if the code exists in our list
  const [country, setCountry] = useState(KNOWN_CODES.has(defaultCountry) ? defaultCountry : '');
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
    const urlRef = params.get('ref');
    const captured = urlRef ? captureReferralFromUrl(`?ref=${encodeURIComponent(urlRef)}`) : null;
    const stored = captured ?? getStoredReferralCode();
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
        name: `${firstName} ${lastName}`.trim(),
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
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-16">
      <div className="hidden max-w-sm shrink-0 lg:block">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground">
          Grow your Instagram with <span className="gradient-text">smart automations</span>.
        </h2>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            'Free forever — no card required to start',
            'Connect Instagram and go live in minutes',
            'Turn followers into paying customers',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckIcon size={12} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <AuthCard wide>
        <header className="mb-6 border-b border-border pb-5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">Create your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Join in seconds and start automating your Instagram DMs — free forever, no card required.</p>
        </header>

        <a href={gUrl} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-primary hover:bg-primary/5">
          <GoogleIcon />
          Continue with Google
        </a>

        <OrDivider />

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" placeholder="Alex" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" placeholder="Morgan" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="you@brand.com" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <CountrySelect value={country} onChange={setCountry} />
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
              <Link href="/creators-policy" className="text-primary hover:underline whitespace-nowrap">Creators Program Policy</Link>
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
