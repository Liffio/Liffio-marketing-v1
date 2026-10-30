'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { API_BASE, APP_BASE } from '@/lib/auth/api';
import { useSession } from '@/lib/auth/session';
import { LiffioLogoMark } from '@/components/Logo';
import { v4FeatureList } from '@/config/pricing-v4.config';
import {
  checkClaim,
  codeEntry,
  codeFromHash,
  codeHash,
  codeHint,
  durationLabel,
  fetchPartner,
  initials,
  partnerClaimPath,
  priceDisplay,
  stripHashOnLoad,
  tokenFromHash,
  viewFor,
  type CheckResult,
  type CheckState,
  type PublicPartner,
} from '@/lib/partner-claim';
import type { PricingRegion } from '@/lib/pricing-region';

/*
  The claim page, built from designs/claim-page.html. The marketing side owns
  six of its eight states (signed link, code entry, already claimed, expired,
  bad link, offer ended); "Unlocked" and "IG already used" happen in the app
  after Instagram connects.

  Signed links arrive as #t=<jwt>. The fragment is posted to /check and then
  removed with history.replaceState, so the token never sits in the address
  bar, the history entry, a Referer or an analytics hit. What travels after
  that is the 30-minute holdId.

  Code links arrive as #code=<code> (partner-codes v2 §8) and are checked
  exactly as if Redeem had been pressed, but the fragment stays: Instagram and
  Telegram pass the current URL to "Open in browser", so stripping it lost the
  code. Editing the box keeps #code= in step (replaceState), clearing it drops
  the fragment. Only code partners use them; a signed-link partner ignores the
  code, and `?code=` is never read.
*/

const Icon = ({ d, className }: { d: ReactNode; className?: string }) => (
  <svg className={`i ${className ?? ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);
const I = {
  check: <Icon d={<path d="M20 6 9 17l-5-5" />} />,
  circleCheck: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></>} />,
  lock: <Icon d={<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></>} />,
  alert: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16.5h.01" /></>} />,
  arrow: <Icon d={<path d="M5 12h14M13 6l6 6-6 6" />} />,
  flag: <Icon d={<path d="M4 22V4M4 4h13l-2 4 2 4H4" />} />,
};

function PartnerMark({ p }: { p: PublicPartner }) {
  if (p.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="plogo" src={p.logoUrl} alt="" />;
  }
  return (
    <span className="plogo" style={{ background: p.brandColor ?? '#625551' }} aria-hidden>
      {initials(p.name)}
    </span>
  );
}

const features = (p: PublicPartner): string[] => (v4FeatureList(p.plan.name) ?? []).map((f) => f.text).slice(0, 5);

function OfferCard({ p, region }: { p: PublicPartner; region: PricingRegion }) {
  const { monthly, worth, format } = priceDisplay(p, region);
  return (
    <div className="ocard">
      <div className="oc-h">
        <span className="cobrand">
          <LiffioLogoMark size="xs" />
          <span className="x">×</span> <PartnerMark p={p} /> {p.name}
        </span>
        <span className="tag">Partner perk</span>
      </div>
      <div className="oc-plan">
        <small>Your plan</small>
        <div className="nm">Liffio {p.plan.name}</div>
        <div className="price">
          {monthly != null && <s>{format(monthly)}/mo</s>}
          <b>{format(0)}</b>
          <span>for {durationLabel(p.duration)}</span>
        </div>
      </div>
      <ul className="oc-list">
        {features(p).map((f) => (
          <li key={f}>
            {I.check}
            {f}
          </li>
        ))}
      </ul>
      <div className="oc-foot">
        {I.circleCheck}
        <span>
          {worth != null ? `Worth ${format(worth)}. ` : ''}No card needed. When it ends, the plan stops unless you subscribe.
          Nothing is charged automatically.
        </span>
      </div>
    </div>
  );
}

function Steps({ p }: { p: PublicPartner }) {
  const d = durationLabel(p.duration);
  return (
    <>
      <div className="steps">
        <div className="st">
          <span className="n">1</span>
          <div>
            <b>Sign up or log in</b>
            <span>Takes under a minute. No card needed.</span>
          </div>
        </div>
        <div className="st">
          <span className="n">2</span>
          <div>
            <b>Connect Instagram</b>
            <span>Your business or creator account, through Meta.</span>
          </div>
        </div>
        <div className="st">
          <span className="n">3</span>
          <div>
            <b>{p.plan.name} unlocks</b>
            <span>Free for {d}. We remind you 3 days before it ends.</span>
          </div>
        </div>
      </div>
      <p className="fine">
        One claim per {p.name} customer and per Instagram account. Can&apos;t be combined with other partner offers. After {d}{' '}
        the plan stops and your workspace goes read-only until you pick a plan. Nothing is charged automatically.
      </p>
    </>
  );
}

function Status({
  tone,
  icon,
  title,
  children,
  actions,
}: {
  tone: 'ok' | 'warn' | 'err' | 'mute';
  icon: ReactNode;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="status">
      <div className={`badge ${tone}`}>{icon}</div>
      <h1>{title}</h1>
      <p className="lede">{children}</p>
      <div className="actions">{actions}</div>
    </section>
  );
}

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ClaimPage({ slug, region }: { slug: string; region: PricingRegion }) {
  const session = useSession();
  const [partner, setPartner] = useState<PublicPartner | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [check, setCheck] = useState<CheckState | null>(null);
  const [hold, setHold] = useState<{ id: string; expiresAt: string } | null>(null);
  const [linkExp, setLinkExp] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [linkCode, setLinkCode] = useState<{ display: string; error: string | null } | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Read the fragment, and strip a signed token before anything else can see it.
    const token = tokenFromHash(window.location.hash);
    const code = codeFromHash(window.location.hash);
    if (stripHashOnLoad(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    void (async () => {
      try {
        const p = await fetchPartner(API_BASE, slug);
        setPartner(p);
        if (p && p.method === 'codes' && p.programState === 'active' && code) {
          // The link's code, checked exactly as pressing Redeem would check it.
          const entry = codeEntry(code, p.codePrefix ?? '');
          let error: string | null = entry.complete ? null : CODE_ERRORS.invalid!;
          if (entry.complete) {
            const r = await checkClaim(API_BASE, slug, { code: entry.submit });
            if (r.state === 'valid' && r.holdId && r.holdExpiresAt) setHold({ id: r.holdId, expiresAt: r.holdExpiresAt });
            // A link reopened after its claim is the full "already claimed" page, not a box error.
            else if (r.state === 'already_claimed') setCheck(r.state);
            else if (codeErrorFor(r)) error = codeErrorFor(r);
            else setCheck(r.state);
          }
          setLinkCode({ display: entry.display, error });
        }
        if (p && p.method === 'signed' && p.programState === 'active') {
          if (!token) {
            setCheck('invalid');
          } else {
            const r = await checkClaim(API_BASE, slug, { t: token });
            setCheck(r.state);
            if (r.state === 'valid' && r.holdId && r.holdExpiresAt) setHold({ id: r.holdId, expiresAt: r.holdExpiresAt });
            try {
              const exp = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp;
              if (typeof exp === 'number') setLinkExp(fmtDay(new Date(exp * 1000).toISOString()));
            } catch {
              /* only used for the "link works till" line */
            }
          }
        }
      } catch {
        setFailed(true);
      } finally {
        setLoaded(true);
      }
    })();
  }, [slug]);

  const view = !loaded ? 'loading' : failed ? 'error' : viewFor(partner, check);
  // From the "already claimed" page: drop #code= and go back to an empty code box.
  const tryAnotherCode = () => {
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    setLinkCode(null);
    setCheck(null);
  };
  const startFree = (
    <Link className="btn p block" href="/register">
      Start on Liffio Free
    </Link>
  );
  // The site's own login; its `?redirect=` sends the user on to that app path once signed in.
  const loginHref = (h?: string | null) =>
    `/login${h ? `?redirect=${encodeURIComponent(partnerClaimPath(h))}` : ''}`;

  return (
    <div className="cl-root">
      <header className="top">
        <Link className="brand" href="/" aria-label="Liffio home">
          <LiffioLogoMark size="medium" priority />
        </Link>
        <a className="login" href={loginHref(hold?.id)}>
          Have an account? <b>Log in</b>
        </a>
      </header>
      <main className="wrap" aria-live="polite">
        {view === 'loading' && <p className="small" style={{ paddingTop: 48 }}>Checking your offer…</p>}

        {view === 'error' && (
          <Status tone="err" icon={I.alert} title="We couldn't load this offer" actions={<button className="btn block" onClick={() => window.location.reload()}>Try again</button>}>
            Something went wrong on our side. Please try again in a moment.
          </Status>
        )}

        {view === 'offer' && partner && (
          <Offer
            partner={partner}
            hold={hold}
            setHold={setHold}
            setCheck={setCheck}
            linkExp={linkExp}
            linkCode={linkCode}
            region={region}
            signedIn={session.status === 'authenticated'}
          />
        )}

        {view === 'claimed' && (
          <Status
            tone="mute"
            icon={I.lock}
            title={partner?.method === 'codes' ? 'This code has already been used' : 'This perk was already claimed'}
            actions={
              <>
                <a className="btn p block" href={loginHref()}>
                  Log in to Liffio
                </a>
                {partner?.method === 'codes' && (
                  // /check is anonymous, so "used" means by anyone: let them try another code.
                  <button className="btn block" type="button" onClick={tryAnotherCode}>
                    Use a different code
                  </button>
                )}
                <Link className="link" href="/help">
                  Think this is a mistake? Contact support
                </Link>
              </>
            }
          >
            {partner?.method === 'codes'
              ? 'If you claimed it, log in to Liffio to use your plan. If not, try a different code.'
              : `Each ${partner?.name ?? 'partner'} customer can claim it once. If that was you, log in to see your plan.`}
          </Status>
        )}

        {view === 'expired' && (
          <Status tone="warn" icon={I.clock} title={partner?.method === 'codes' ? 'This code has expired' : 'This link has expired'} actions={<Link className="btn block" href="/register">Start on Liffio Free instead</Link>}>
            {partner?.method === 'codes'
              ? `Ask ${partner.name} for a new code.`
              : `Claim links work for a few days. Open the Liffio perk again from your ${partner?.name ?? 'partner'} dashboard to get a fresh one.`}
          </Status>
        )}

        {view === 'invalid' && (
          <Status tone="err" icon={I.alert} title="We couldn't verify this link" actions={<Link className="btn block" href="/register">Start on Liffio Free instead</Link>}>
            {partner
              ? `It may be cut off or changed. Open the Liffio perk again from ${partner.name}, or copy the full link.`
              : 'This offer link isn’t one we recognise. Check the address, or start on Liffio Free.'}
          </Status>
        )}

        {view === 'ended' && (
          <Status
            tone="mute"
            icon={I.flag}
            title={partner?.programState === 'not_started' ? "This offer hasn't started yet" : 'This offer has ended'}
            actions={
              <>
                {startFree}
                <Link className="link" href="/pricing">
                  See plans
                </Link>
              </>
            }
          >
            {partner?.programState === 'cap_reached'
              ? `All the ${partner.name} perks have been claimed. You can still start on Liffio Free and upgrade anytime.`
              : `The ${partner?.name ?? 'partner'} offer isn't open right now. You can still start on Liffio Free and upgrade anytime.`}
          </Status>
        )}
      </main>
    </div>
  );
}

function Offer({
  partner: p,
  hold,
  setHold,
  setCheck,
  linkExp,
  linkCode,
  region,
  signedIn,
}: {
  partner: PublicPartner;
  hold: { id: string; expiresAt: string } | null;
  setHold: (h: { id: string; expiresAt: string } | null) => void;
  setCheck: (s: CheckState) => void;
  linkExp: string | null;
  linkCode: { display: string; error: string | null } | null;
  region: PricingRegion;
  signedIn: boolean;
}) {
  const d = durationLabel(p.duration);
  const headline = p.customHeadline || `${d} of Liffio ${p.plan.name}, free for you`;
  // Signed in: straight to the app's attach route. Otherwise sign up, carrying the hold.
  const claimHref = hold
    ? signedIn
      ? `${APP_BASE}${partnerClaimPath(hold.id)}`
      : `/register?hold=${encodeURIComponent(hold.id)}`
    : null;
  const claimBtn = claimHref && (
    <a className="btn p block" href={claimHref}>
      Claim {d} free {I.arrow}
    </a>
  );

  return (
    <>
      <section className="hero">
        <div>
          <span className="for">
            <PartnerMark p={p} />
            {p.method === 'signed' ? `For ${p.name} customers` : `${p.name} member perk`}
          </span>
          <h1>{headline}</h1>
          {p.method === 'signed' ? (
            <>
              <p className="lede">
                Since you&apos;re on {p.name}, you get Liffio {p.plan.name} free. Turn Instagram comments into DMs and leads, on
                autopilot.
              </p>
              <div className="actions">{claimBtn}</div>
              <p className="small">
                {I.circleCheck}No card needed.{linkExp ? ` Link works till ${linkExp}.` : ''}
              </p>
            </>
          ) : (
            <>
              <p className="lede">Enter the code you got from {p.name} to unlock it.</p>
              <CodeForm p={p} accepted={Boolean(hold)} onAccepted={setHold} onState={setCheck} linkCode={linkCode} />
              {hold && (
                <div className="actions" style={{ marginTop: 8 }}>
                  {claimBtn}
                </div>
              )}
              <p className="small">{I.circleCheck}No card needed. One perk per Liffio account.</p>
            </>
          )}
        </div>
        <div className="visual">
          <OfferCard p={p} region={region} />
        </div>
      </section>
      <Steps p={p} />
    </>
  );
}

const CODE_ERRORS: Partial<Record<CheckState, string>> = {
  invalid: "We couldn't find that code. Check it and try again.",
  already_claimed: 'This code was already used. Each code works once.',
};

/**
 * The answers shown under the code box rather than as a full page: not found, already used, and a
 * shared code whose uses are all taken (the offer itself is still open). Null for the rest.
 */
const codeErrorFor = (r: CheckResult): string | null =>
  r.state === 'ended' && r.reason === 'code_limit'
    ? 'This code has reached its limit.'
    : r.state === 'invalid' || r.state === 'already_claimed'
      ? CODE_ERRORS[r.state]!
      : null;

function CodeForm({
  p,
  accepted,
  onAccepted,
  onState,
  linkCode,
}: {
  p: PublicPartner;
  accepted: boolean;
  onAccepted: (h: { id: string; expiresAt: string } | null) => void;
  onState: (s: CheckState) => void;
  linkCode: { display: string; error: string | null } | null;
}) {
  const prefix = p.codePrefix ?? '';
  // Filled from the link, the page has already checked it: show that answer from the start.
  const [value, setValue] = useState(linkCode?.display ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(linkCode?.error ?? null);
  const [fromLink, setFromLink] = useState(Boolean(linkCode && !linkCode.error));
  const inputRef = useRef<HTMLInputElement>(null);
  const entry = codeEntry(value, prefix);
  const placeholder = `LF-${prefix}-XXXX-XXXX`;

  const run = async (code: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await checkClaim(API_BASE, p.slug, { code });
      if (r.state === 'valid' && r.holdId && r.holdExpiresAt) {
        setFromLink(false);
        onAccepted({ id: r.holdId, expiresAt: r.holdExpiresAt });
      } else if (codeErrorFor(r)) {
        setError(codeErrorFor(r));
        inputRef.current?.focus();
      } else {
        onState(r.state);
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message === 'rate_limited'
          ? 'Too many tries. Wait a few minutes and try again.'
          : "We couldn't check that code right now. Try again in a moment.",
      );
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!entry.complete || busy || accepted) return;
    void run(entry.submit);
  };

  // Keep #code= in the address bar in step with the box, so "Open in browser" carries it.
  const syncHash = (next: string) => {
    const hash = codeHash(codeEntry(next, prefix).display);
    if (hash === window.location.hash) return;
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + hash);
  };

  const change = () => {
    onAccepted(null);
    setFromLink(false);
    setValue('');
    syncHash('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <form className="redeem" onSubmit={submit} noValidate>
      <label htmlFor="code">Your {p.name} code</label>
      <div className="row">
        <input
          ref={inputRef}
          id="code"
          name="code"
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          placeholder={placeholder}
          maxLength={Math.max(placeholder.length, 24)}
          readOnly={accepted}
          aria-describedby="codeMsg"
          aria-invalid={error ? 'true' : undefined}
          value={entry.display}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
            syncHash(e.target.value);
          }}
        />
        {accepted && (
          <button className="btn" type="button" onClick={change}>
            Change
          </button>
        )}
        {!accepted && (
          <button className="btn p" type="submit" disabled={!entry.complete || busy}>
            {busy ? (
              <>
                <span className="spin" aria-hidden />
                <span>Checking</span>
              </>
            ) : (
              'Redeem'
            )}
          </button>
        )}
      </div>
      <div id="codeMsg" className={`msg ${error ? 'err' : accepted ? 'ok' : ''}`}>
        {error ? (
          <>
            {I.alert}
            <span>{error}</span>
          </>
        ) : accepted ? (
          <>
            {I.circleCheck}
            <span>{fromLink ? 'Code added from your link and checked' : 'Code accepted. Your perk is ready.'}</span>
          </>
        ) : (
          <span className="hint">{codeHint(prefix)}</span>
        )}
      </div>
    </form>
  );
}
