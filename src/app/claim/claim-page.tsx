'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { API_BASE, APP_BASE } from '@/lib/auth/api';
import { useSession } from '@/lib/auth/session';
import { LiffioLogoMark } from '@/components/Logo';
import {
  BOX_ERRORS,
  checkClaim,
  claimUrlFor,
  codeFromHash,
  codeInput,
  codeOutcome,
  codeReady,
  fetchPartner,
  initials,
  linkNotice,
  lookupCode,
  noticeFor,
  offerCopy,
  partnerClaimPath,
  programNotice,
  safeBrandColor,
  safeLogoUrl,
  stripHashOnLoad,
  takesCodes,
  takesLinks,
  tokenFromHash,
  CODE_INPUT_MAX,
  type Notice,
  type PartnerBranding,
  type PublicOffer,
} from '@/lib/partner-claim';

/*
  One claim page at three addresses (partner rewards SPEC 9.4, designs/claim-redeem.html):
  liffio.com/redeem and liffio.com/claim show the code box; liffio.com/claim/<slug> is a
  partner's own page, for its signed links (#t=) and codes (#code=). Every one of them takes
  ANY partner's code: a found code switches the page in place to that partner's branding and the
  code's offer, and the address becomes /claim/<slug>#code=<CODE> with replaceState (no reload).

  Signed links arrive as #t=<jwt>, read only when the partner has signed links on. The token is
  posted to /check and the fragment stays in the address bar, as #code= does: Instagram and
  Telegram pass the current URL to "Open in browser", so stripping it lost the token. A fragment
  is never sent in a Referer, and the Umami hook drops t= and code= from every URL it reports
  (lib/analytics/umamiPrivacy.ts), which also keeps the session recorder off these pages.

  A typed code is looked up (read-only, no hold). The 30-minute hold is made by /check when
  Claim is pressed, and that holdId is all that travels to sign-up and the app.
*/

type Hold = { id: string; expiresAt: string };
type View =
  | { v: 'loading' }
  | { v: 'error' }
  | { v: 'redeem'; partner: PartnerBranding | null; notice: Notice | null }
  /** `code` is what /check gets (the server's normalised form); `shown` is the code as the visitor typed it. */
  | { v: 'offer'; partner: PartnerBranding; offer: PublicOffer; code: string | null; shown: string | null; hold: Hold | null };

const Icon = ({ d }: { d: ReactNode }) => (
  <svg className="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);
const I = {
  check: <Icon d={<path d="M20 6 9 17l-5-5" />} />,
  alert: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16.5h.01" /></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></>} />,
  pause: <Icon d={<><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>} />,
  lock: <Icon d={<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>} />,
  arrow: <Icon d={<path d="M5 12h14M13 6l6 6-6 6" />} />,
  x: <Icon d={<path d="M18 6 6 18M6 6l12 12" />} />,
  ticket: <Icon d={<><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" /><path d="M13 6v2M13 11v2M13 16v2" /></>} />,
};

const NOTICE_LOOK: Record<Notice['kind'], { tone: 'warn' | 'bad' | 'mute'; icon: ReactNode }> = {
  expired: { tone: 'warn', icon: I.clock },
  inactive: { tone: 'mute', icon: I.pause },
  not_started: { tone: 'mute', icon: I.clock },
  unknown: { tone: 'bad', icon: I.search },
  bad_link: { tone: 'bad', icon: I.alert },
  claimed: { tone: 'mute', icon: I.lock },
  paid: { tone: 'mute', icon: I.check },
};

/** The partner's logo from its https URL (R2), or its initials on its brand colour. */
function PartnerMark({ p, className = 'pl' }: { p: Pick<PartnerBranding, 'name' | 'logoUrl' | 'brandColor'>; className?: string }) {
  const [broken, setBroken] = useState(false);
  const src = safeLogoUrl(p.logoUrl);
  if (src && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`${className} img`} src={src} alt="" onError={() => setBroken(true)} />;
  }
  return (
    <span className={className} style={{ background: safeBrandColor(p.brandColor) ?? undefined }} aria-hidden>
      {initials(p.name)}
    </span>
  );
}

/** The Liffio mark in both themes; CSS shows the one that fits. */
const LiffioMark = ({ size }: { size: 'xs' | 'small' }) => (
  <span className="lf">
    <LiffioLogoMark theme="light" size={size} priority className="lf-l" />
    <LiffioLogoMark theme="dark" size={size} priority className="lf-d" />
  </span>
);

export default function ClaimPage({ slug }: { slug: string | null }) {
  const session = useSession();
  const signedIn = session.status === 'authenticated';
  const [view, setView] = useState<View>({ v: 'loading' });
  const [code, setCode] = useState('');
  const [boxError, setBoxError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  /** Look a code up and act on the answer. `current` is the partner the page shows now, if any. */
  const runLookup = async (raw: string, current: PartnerBranding | null) => {
    setBusy(true);
    setBoxError(null);
    try {
      const r = await lookupCode(API_BASE, raw);
      const out = codeOutcome(r, r.partner ?? current);
      if (out.kind === 'found' && r.partner && r.offer && r.code) {
        setClaimError(null);
        setView({ v: 'offer', partner: r.partner, offer: r.offer, code: r.code, shown: codeInput(raw) || r.code, hold: null });
        // Same page, now that partner's: the address says so, without a reload.
        window.history.replaceState(window.history.state, '', claimUrlFor(r.partner.slug, r.code));
        return;
      }
      if (out.kind === 'notice') {
        setView({ v: 'redeem', partner: r.partner ?? current, notice: out.notice });
        return;
      }
      setView({ v: 'redeem', partner: current, notice: null });
      setBoxError(out.kind === 'box' ? out.message : BOX_ERRORS.invalid);
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (err) {
      setView({ v: 'redeem', partner: current, notice: null });
      setBoxError(err instanceof Error && err.message === 'rate_limited' ? BOX_ERRORS.tooMany : BOX_ERRORS.failed);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const hash = window.location.hash;
    const token = tokenFromHash(hash);
    const hashCode = codeFromHash(hash);
    if (stripHashOnLoad(hash)) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
    void (async () => {
      try {
        if (!slug) {
          // /redeem and /claim. A #code= link is checked exactly as if it had been typed.
          if (hashCode) {
            setCode(codeInput(hashCode));
            await runLookup(hashCode, null);
          } else {
            setView({ v: 'redeem', partner: null, notice: null });
          }
          return;
        }

        const p = await fetchPartner(API_BASE, slug);
        if (hashCode) {
          // Any partner's code, on any partner's page.
          setCode(codeInput(hashCode));
          await runLookup(hashCode, p);
          return;
        }
        if (!p) {
          setView({ v: 'redeem', partner: null, notice: noticeFor('unknown', null) });
          return;
        }
        if (token) {
          if (!takesLinks(p.methods)) {
            setView({ v: 'redeem', partner: p, notice: noticeFor('inactive', p, { via: 'link', programState: p.programState }) });
            return;
          }
          if (p.programState !== 'active') {
            setView({ v: 'redeem', partner: p, notice: programNotice(p) });
            return;
          }
          try {
            const r = await checkClaim(API_BASE, p.slug, { t: token });
            const notice = linkNotice(r, p);
            if (!notice && r.holdId && r.holdExpiresAt) {
              setView({ v: 'offer', partner: p, offer: r.offer ?? p.offer, code: null, shown: null, hold: { id: r.holdId, expiresAt: r.holdExpiresAt } });
            } else {
              setView({ v: 'redeem', partner: p, notice: notice ?? noticeFor('bad_link', p) });
            }
          } catch (err) {
            if (!(err instanceof Error && err.message === 'rate_limited')) throw err;
            setView({ v: 'redeem', partner: p, notice: null });
            setBoxError(BOX_ERRORS.tooMany);
          }
          return;
        }
        // A partner's page with neither: its code box, or why it can't be used.
        const closed = programNotice(p);
        setView({
          v: 'redeem',
          partner: p,
          notice: closed ?? (takesCodes(p.methods) ? null : noticeFor('bad_link', p)),
        });
      } catch {
        setView({ v: 'error' });
      }
    })();
  }, [slug]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!codeReady(code) || busy) return;
    void runLookup(code, view.v === 'redeem' ? view.partner : null);
  };

  /** From the offer: back to an empty code box, keeping this partner's header. */
  const useAnother = () => {
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    setView({ v: 'redeem', partner: view.v === 'offer' ? view.partner : null, notice: null });
    setCode('');
    setBoxError(null);
    setClaimError(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  /** Signed in: straight to the app's attach route. Otherwise sign up (or log in from there), carrying the hold. */
  const goWithHold = (holdId: string) => {
    window.location.href = signedIn ? `${APP_BASE}${partnerClaimPath(holdId)}` : `/register?hold=${encodeURIComponent(holdId)}`;
  };

  const claim = async () => {
    if (view.v !== 'offer' || claimBusy) return;
    if (view.hold) {
      goWithHold(view.hold.id);
      return;
    }
    if (!view.code) return;
    setClaimBusy(true);
    setClaimError(null);
    try {
      const r = await checkClaim(API_BASE, view.partner.slug, { code: view.code });
      if (r.state === 'valid' && r.holdId) {
        goWithHold(r.holdId);
        return;
      }
      // Taken or closed between the lookup and the click: show it the same way as a typed code.
      const out = codeOutcome(r, view.partner);
      setCode(view.shown ?? view.code);
      if (out.kind === 'notice') setView({ v: 'redeem', partner: view.partner, notice: out.notice });
      else {
        setView({ v: 'redeem', partner: view.partner, notice: null });
        setBoxError(out.kind === 'box' ? out.message : BOX_ERRORS.invalid);
      }
      setClaimBusy(false);
    } catch (err) {
      setClaimError(err instanceof Error && err.message === 'rate_limited' ? BOX_ERRORS.tooMany : "We couldn't start your claim right now. Try again in a moment.");
      setClaimBusy(false);
    }
  };

  const loginHref = (holdId?: string | null) => `/login${holdId ? `?redirect=${encodeURIComponent(partnerClaimPath(holdId))}` : ''}`;
  const headerPartner = view.v === 'offer' || view.v === 'redeem' ? view.partner : null;

  return (
    <div className="cl-root">
      <header className="top">
        {headerPartner ? (
          <span className="co">
            <PartnerMark p={headerPartner} />
            <b>{headerPartner.name}</b>
            <span className="x" aria-hidden>
              ×
            </span>
            <Link href="/" aria-label="Liffio home" className="co-l">
              <LiffioMark size="xs" />
            </Link>
          </span>
        ) : (
          <Link className="brand" href="/" aria-label="Liffio home">
            <LiffioMark size="small" />
          </Link>
        )}
        <a className="signin" href={loginHref(view.v === 'offer' ? view.hold?.id : null)}>
          Sign in
        </a>
      </header>

      <main className="wrap" aria-live="polite">
        {view.v === 'loading' && <p className="loading">Checking your offer…</p>}

        {view.v === 'error' && (
          <section className="card solo">
            <Msg tone="bad" icon={I.alert} title="We couldn't load this offer">
              Something went wrong on our side. Please try again in a moment.
            </Msg>
            <button className="btn s" type="button" onClick={() => window.location.reload()}>
              Try again
            </button>
          </section>
        )}

        {view.v === 'redeem' && (
          <>
            <section className={`hero${view.notice ? ' sm-hide' : ''}`}>
              <span className="kick">
                {I.ticket}
                {view.partner ? `${view.partner.name} offer` : 'Partner offers'}
              </span>
              <h1>
                Got a code? <em>Unlock Liffio.</em>
              </h1>
              <p className="lede">Enter the code from a Liffio partner, creator or event. We&apos;ll show you the offer before you sign up.</p>
              <div className="ticks">
                <div>{I.check}Works with any partner&apos;s code</div>
                <div>{I.check}No card needed to claim a free month</div>
                <div>{I.check}Codes aren&apos;t case-sensitive</div>
              </div>
            </section>

            <section className="card">
              {view.notice ? (
                <>
                  <Msg tone={NOTICE_LOOK[view.notice.kind].tone} icon={NOTICE_LOOK[view.notice.kind].icon} title={view.notice.title}>
                    {view.notice.body}
                  </Msg>
                  {view.notice.kind === 'paid' ? (
                    <a className="btn p" href={`${APP_BASE}/dashboard`}>
                      Go to my dashboard
                    </a>
                  ) : (
                    <div className="or">Have a code?</div>
                  )}
                </>
              ) : (
                <>
                  <h2>Redeem a code</h2>
                  <p className="sub">Letters and numbers, dashes optional.</p>
                </>
              )}

              {view.notice?.kind !== 'paid' && (
                <>
                  <form className="field" onSubmit={submit} noValidate>
                    <label htmlFor="code">Your code</label>
                    <div className={`cbox${boxError ? ' bad' : ''}`}>
                      <input
                        ref={inputRef}
                        id="code"
                        name="code"
                        autoComplete="one-time-code"
                        autoCapitalize="characters"
                        spellCheck={false}
                        inputMode="text"
                        placeholder="e.g. BOOST30"
                        maxLength={CODE_INPUT_MAX}
                        aria-describedby={boxError ? 'codeErr' : undefined}
                        aria-invalid={boxError ? 'true' : undefined}
                        value={code}
                        onChange={(e) => {
                          setCode(codeInput(e.target.value));
                          if (boxError !== BOX_ERRORS.tooMany) setBoxError(null);
                        }}
                      />
                      {code && (
                        <button
                          type="button"
                          className="clr"
                          aria-label="Clear code"
                          onClick={() => {
                            setCode('');
                            setBoxError(null);
                            inputRef.current?.focus();
                          }}
                        >
                          {I.x}
                        </button>
                      )}
                    </div>
                    {boxError && (
                      <p className="err" id="codeErr" role="alert">
                        {I.alert}
                        <span>{boxError}</span>
                      </p>
                    )}
                    <button className="btn p" type="submit" disabled={!codeReady(code) || busy}>
                      {busy ? (
                        <>
                          <span className="spin" aria-hidden />
                          Checking
                        </>
                      ) : (
                        'Check code'
                      )}
                    </button>
                  </form>
                  <details className="help">
                    <summary>Where do I find my code?</summary>
                    <p>It comes from the company or creator who sent you here: an email, a post, a card or an event. It looks like one of these:</p>
                    <div className="eg">
                      <span>BOOST30</span>
                      <span>LF-7KQ2-M9XD-4H2P</span>
                      <span>LF-BD-4H7K-QX2M</span>
                    </div>
                  </details>
                </>
              )}
            </section>
          </>
        )}

        {view.v === 'offer' && (
          <OfferView
            partner={view.partner}
            offer={view.offer}
            code={view.shown}
            signedIn={signedIn}
            busy={claimBusy}
            error={claimError}
            onClaim={() => void claim()}
            onAnother={useAnother}
          />
        )}
      </main>

      <footer className="foot">
        Codes and links are checked on our server. <Link href="/terms-of-service">Terms</Link> · <Link href="/privacy-policy">Privacy</Link>
      </footer>
    </div>
  );
}

function Msg({ tone, icon, title, children }: { tone: 'warn' | 'bad' | 'mute'; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className={`msg ${tone}`} role="status">
      <span className="ic">{icon}</span>
      <div>
        <b>{title}</b>
        <span>{children}</span>
      </div>
    </div>
  );
}

function OfferView({
  partner: p,
  offer,
  code,
  signedIn,
  busy,
  error,
  onClaim,
  onAnother,
}: {
  partner: PartnerBranding;
  offer: PublicOffer;
  code: string | null;
  signedIn: boolean;
  busy: boolean;
  error: string | null;
  onClaim: () => void;
  onAnother: () => void;
}) {
  const copy = offerCopy(offer, p.name);
  const band = safeBrandColor(p.brandColor);
  return (
    <>
      <section className="hero">
        <span className="kick pc">From {p.name}</span>
        {p.customHeadline ? (
          <h1>{p.customHeadline}</h1>
        ) : (
          <h1>
            {copy.headline[0]}
            <em>{copy.headline[1]}</em>
            {copy.headline[2]}
          </h1>
        )}
        <p className="lede">{copy.lede}</p>
        <div className="ticks">
          {copy.ticks.map((t) => (
            <div key={t}>
              {I.check}
              {t}
            </div>
          ))}
        </div>
      </section>

      <section className="offer">
        <div className="band" style={band ? { background: band } : undefined}>
          <small>
            <PartnerMark p={p} className="pl sm" />
            {p.name} offer
          </small>
          <h2>{offer.label}</h2>
          <p>{copy.cardNote}</p>
        </div>
        <div className="body">
          {code && (
            <div className="codechip">
              {I.ticket}
              <b>{code}</b>
              <span className="ok">{I.check}Applied</span>
            </div>
          )}
          <div className="inc">
            <div>{I.check}Auto-DMs from comments, stories and reels</div>
            <div>
              {I.check}Every {offer.plan.name} feature, nothing held back
            </div>
          </div>
          <button className="btn p" type="button" onClick={onClaim} disabled={busy}>
            {busy ? (
              <>
                <span className="spin" aria-hidden />
                One moment
              </>
            ) : (
              <>
                {copy.button} {I.arrow}
              </>
            )}
          </button>
          {error && (
            <p className="err" role="alert">
              {I.alert}
              <span>{error}</span>
            </p>
          )}
          <p className="then">
            {signedIn ? 'Next: connect Instagram in the app to start it.' : 'Next: sign up or log in. Then connect Instagram in the app.'}
          </p>
          {code && (
            <p className="small">
              Not the right code?{' '}
              <button type="button" className="lnk" onClick={onAnother}>
                Use another code
              </button>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
