'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  API_BASE,
  byCode,
  byRef,
  CLAIM_LINK,
  DECODED_TOKEN,
  EVENTS,
  PDF_URL,
  REQUEST_SAMPLES,
  RETRIES,
  SIGN_SAMPLES,
  SLUG,
  STATUSES,
  VERIFY_SAMPLES,
  WEBHOOK_HEADERS,
  type EventKey,
  type Sample,
  type Status,
} from './docs-content';
import { highlight, pretty } from './highlight';

/*
  liffio.com/partners/docs, built from liffio-partner-program designs/partner-docs-public.html
  section by section. Every rule on this page was checked against the live API code; where the
  design and the code disagreed, the page says what the code does.
*/

const NAV = [
  { id: 'how', label: 'How it works' },
  { id: 'links', label: 'Claim links' },
  { id: 'statuses', label: 'Statuses' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'verify', label: 'Verify' },
  { id: 'status-api', label: 'Status API' },
  { id: 'limits', label: 'Limits' },
];

const C = ({ children }: { children: ReactNode }) => <code className="ic">{children}</code>;

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Info = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 11v6M12 7.5h.01" />
  </svg>
);
const Warn = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

async function copyText(text: string, el: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (el) {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
    return false;
  }
}

function CopyButton({ text, target, label = 'Copy' }: { text: string; target?: React.RefObject<HTMLElement | null>; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy"
      onClick={async () => {
        if (await copyText(text, target?.current ?? null)) {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }
      }}
    >
      <span aria-live="polite">{done ? 'Copied' : label}</span>
    </button>
  );
}

/** A dark code card: a title or tabs on top, a Copy button, the code. */
function CodeCard({ title, tabs, active, onTab, code, lang, foot, ariaLabel }: {
  title?: ReactNode;
  tabs?: Array<{ id: string; label: string }>;
  active?: string;
  onTab?: (id: string) => void;
  code: string;
  lang: Sample['lang'];
  foot?: ReactNode;
  ariaLabel?: string;
}) {
  const pre = useRef<HTMLPreElement>(null);
  return (
    <div className="cc">
      <div className="cc-h">
        {tabs ? (
          <div className="tabs" role="tablist" aria-label={ariaLabel}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === active}
                className={t.id === active ? 'on' : ''}
                onClick={() => onTab?.(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="cc-t">{title}</span>
        )}
        <CopyButton text={code} target={pre} />
      </div>
      <pre ref={pre} className="cc-b" tabIndex={0}>
        <code>{highlight(code, lang)}</code>
      </pre>
      {foot && <div className="cc-f">{foot}</div>}
    </div>
  );
}

function Tabbed({ samples, ariaLabel }: { samples: Sample[]; ariaLabel: string }) {
  const [id, setId] = useState(samples[0].id);
  const s = samples.find((x) => x.id === id) ?? samples[0];
  return <CodeCard tabs={samples} active={s.id} onTab={setId} code={s.code} lang={s.lang} ariaLabel={ariaLabel} />;
}

function UrlBox({ method, url }: { method: string; url: string }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <div className="url">
      <span className={`m ${method === 'GET' ? 'get' : ''}`}>{method}</span>
      <code ref={ref}>{url}</code>
      <CopyButton text={url} target={ref} />
    </div>
  );
}

function Field({ name, type, req, children }: { name: string; type: string; req: boolean; children: ReactNode }) {
  return (
    <div className="fld">
      <div className="fld-h">
        <code>{name}</code>
        <span className="ty">{type}</span>
        <span className={req ? 'rq' : 'op'}>{req ? 'required' : 'optional'}</span>
      </div>
      <p>{children}</p>
    </div>
  );
}

function Steps({ items }: { items: Array<[ReactNode, ReactNode]> }) {
  return (
    <ol className="nsteps">
      {items.map(([b, rest], i) => (
        <li key={i}>
          <span className="n">{i + 1}</span>
          <span>
            <b>{b}</b> {rest}
          </span>
        </li>
      ))}
    </ol>
  );
}

const Pill = ({ s }: { s: Status }) => <span className={`pill s-${s}`}>{s}</span>;

function Head({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="sh">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="lede">{children}</p>}
    </header>
  );
}

export default function PartnerDocs({ wall }: { wall?: ReactNode }) {
  const [ev, setEv] = useState<EventKey>('claimed');
  const [resKind, setResKind] = useState<'ref' | 'code'>('ref');
  const [resStatus, setResStatus] = useState<Status>('claimed');
  const [onNav, setOnNav] = useState<string>('how');
  const event = EVENTS.find((e) => e.key === ev) ?? EVENTS[0];
  const response = resKind === 'ref' ? byRef(resStatus) : byCode(resStatus);

  // The site navbar is sticky too: this page's section bar sits right under it, whatever its height.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('div.sticky.top-0');
    if (!bar || !root.current) return;
    const el = root.current;
    const set = () => el.style.setProperty('--pd-top', `${bar.getBoundingClientRect().height}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setOnNav(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="pd-root" ref={root}>
      <nav className="snav" aria-label="On this page">
        <div className="snav-in">
          <span className="snav-t">Partner docs</span>
          <div className="snav-l">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={onNav === n.id ? 'on' : ''}>
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero wrap">
        <div>
          <p className="eyebrow dot">Partner docs · v1.1</p>
          <h1>
            Know the moment your customers <em>claim</em>
          </h1>
          <p className="lede">
            Liffio tells your system when a customer claims the perk you gave them, so you never send a second link to someone who
            already has it.
          </p>
          <div className="two">
            <a href="#webhooks" className="mini">
              <b>
                Webhooks <span className="tag push">PUSH</span>
              </b>
              <span>We POST to your server the moment a claim changes.</span>
            </a>
            <a href="#status-api" className="mini">
              <b>
                Status API <span className="tag pull">PULL</span>
              </b>
              <span>You ask about one customer, any time.</span>
            </a>
          </div>
          <div className="hero-a">
            <a className="btn p" href={PDF_URL} download>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
              Download PDF
            </a>
            <a className="btn s" href="#links">
              Make your first link
            </a>
          </div>
        </div>
        <div className="flow" aria-hidden>
          <div className="flow-top">
            <div className="node">
              <span className="lf-tile">L</span>
              <small>Liffio</small>
            </div>
            <div className="wire">
              <span className="pulse" />
            </div>
            <div className="node">
              <span className="srv">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="4" y="4" width="16" height="7" rx="2" />
                  <rect x="4" y="13" width="16" height="7" rx="2" />
                  <path d="M8 7.5h.01M8 16.5h.01" />
                </svg>
              </span>
              <small>Your server</small>
            </div>
          </div>
          <div className="flow-card">
            <div className="fc-h">
              <span>POST /liffio-webhook</span>
              <span className="ok">200</span>
            </div>
            <pre>
              <code>{highlight(pretty({ type: 'claim.claimed', data: { ref: '123456789', status: 'claimed' } }), 'json')}</code>
            </pre>
          </div>
          <div className="flow-legend">
            <span>
              <i className="d red" /> Signed webhook
            </span>
            <span>
              <i className="d green" /> Reply 2xx in 10 s
            </span>
          </div>
        </div>
      </section>

      {wall}

      {/* How it works */}
      <section id="how" className="doc wrap">
        <Head eyebrow="How it works" title="From link to claim in five steps">
          The status changes as your customer moves through the claim. You only need to act on the last one.
        </Head>
        <ol className="journey">
          <li>
            <span className="jn">1</span>
            <b>You send a link</b>
            <p>
              A <a href="#links">signed link</a>{' '}with your customer&apos;s ref, or a code.
            </p>
            <Pill s="not_claimed" />
          </li>
          <li>
            <span className="jn">2</span>
            <b>They open it</b>
            <p>We hold the perk for them for 30 minutes.</p>
            <Pill s="pending" />
          </li>
          <li>
            <span className="jn">3</span>
            <b>They sign up</b>
            <p>They sign up or log in to Liffio by email, then connect Instagram.</p>
            <Pill s="pending" />
          </li>
          <li>
            <span className="jn">4</span>
            <b>Perk applied</b>
            <p>Their offer starts: free time right away, or the discount waits for their first payment.</p>
            <Pill s="claimed" />
          </li>
          <li className="last">
            <span className="jn">5</span>
            <b>We tell you</b>
            <p>
              A <C>claim.claimed</C> webhook. Stop sending links. Later payments send <C>claim.paid</C>.
            </p>
            <span className="pill s-claimed">claim.claimed</span>
          </li>
        </ol>
      </section>

      {/* Claim links */}
      <section id="links" className="doc wrap">
        <Head eyebrow="Claim links · signed" title="Create a claim link for each customer">
          A signed link is a short token (a JWT) that says which customer it&apos;s for. You make it on your server with your{' '}
          <b>link signing secret</b> (<C>lfp_sk_...</C>), which your Liffio contact gives you once. It&apos;s separate from the webhook
          secret.
        </Head>
        <div className="cols">
          <div className="col-main">
            <h3>The link</h3>
            <UrlBox method="URL" url={CLAIM_LINK} />
            <p className="p">
              The token goes after <C>#t=</C>, not <C>?t=</C>. The part after <C>#</C> never reaches any server or log, so the token
              stays private.
            </p>

            <h3>What goes in the token</h3>
            <div className="fields">
              <Field name="partner" type="string" req>
                Your partner slug, exactly as in your claim URL.
              </Field>
              <Field name="ref" type="string · 1 to 200" req>
                Your own id for this customer, for example your user id. Use the same ref for the same customer every time. It comes back
                to you in webhooks and the status API.
              </Field>
              <Field name="iat" type="unix seconds" req>
                When you made the link.
              </Field>
              <Field name="exp" type="unix seconds" req>
                When the link stops working. No later than your link lifetime after <C>iat</C>. Liffio tells you yours: 7 days unless
                agreed otherwise, and never more than 365.
              </Field>
              <Field name="offer" type="string" req={false}>
                Which of your offers this customer gets, for example <C>starter-2m</C>. Liffio gives you the list. Leave it out to use
                your default offer. A name that isn&apos;t on your list (or one that was retired) makes the link invalid.
              </Field>
              <Field name="source" type="string · max 64" req={false}>
                Where the link came from, for example <C>newsletter-nov</C>. Lowercase letters, numbers, <C>-</C> and <C>_</C>{' '}(we
                lowercase it for you). Shows up in your reports. It doesn&apos;t change the offer, and a source that breaks these rules is
                dropped while the link still works.
              </Field>
            </div>
            <p className="p">
              Sign with <b>HS256</b>; any other algorithm is refused. Any other fields in the token are ignored, so a token can never
              choose a plan or a length.
            </p>

            <h3>Rules</h3>
            <Steps
              items={[
                ['Sign on your server only.', 'Never put the secret in a web page, an app or an email template.'],
                [<>No personal data in <C>ref</C>.</>, 'No emails or phone numbers: the ref is readable inside the link. Use an internal id.'],
                ['Check before you send.', <>Call the status API and only send a link when the status is <C>not_claimed</C>.</>],
                ['One perk per ref.', 'A new link for a ref that already claimed only shows your customer "already claimed".'],
              ]}
            />

            <h3>What your customer sees</h3>
            <div className="sees">
              <div><span className="b ok">OK</span><p>The perk page, held for them for 30 minutes while they sign up.</p></div>
              <div><span className="b bad">Bad</span><p>&quot;This link isn&apos;t valid&quot;: wrong secret, wrong <C>partner</C>, a missing field, or an <C>offer</C> that isn&apos;t on your list.</p></div>
              <div><span className="b off">Off</span><p>&quot;This offer link is no longer active&quot;: your program is paused, ended or full, or signed links are turned off for you.</p></div>
              <div><span className="b old">Old</span><p>&quot;This link has expired&quot;: past <C>exp</C>, or <C>exp</C> is further from <C>iat</C> than your link lifetime.</p></div>
              <div><span className="b used">Used</span><p>&quot;Already claimed&quot;: this ref already has the perk.</p></div>
            </div>
            <p className="p small">Liffio checks in that order: not valid, then no longer active, then expired, then already claimed.</p>

            <div className="note info">
              <Info />
              <p>
                <b>Using codes too?</b> You can use signed links, unique codes and a shared code together. Liffio turns on the ones you
                need. For codes, share <C>liffio.com/claim/{SLUG}#code=LF-XXXX-XXXX-XXXX</C> so the code fills in by itself, or let
                customers type it at <C>liffio.com/redeem</C>. That page takes any partner&apos;s code and switches to your offer once it
                finds the code. Codes need no signing.
              </p>
            </div>
          </div>
          <div className="col-side">
            <Tabbed samples={SIGN_SAMPLES} ariaLabel="Signing language" />
            <CodeCard title="Inside the token (decoded)" code={DECODED_TOKEN} lang="json" foot={<><i className="d green" /> exp is 7 days after iat in this example</>} />
          </div>
        </div>
      </section>

      {/* Statuses */}
      <section id="statuses" className="doc wrap">
        <Head eyebrow="Statuses" title="Five statuses, one simple rule">
          Webhooks and the status API use the same words. Only <C>not_claimed</C>{' '}means it&apos;s OK to send a link.
        </Head>
        <div className="stat-cards">
          {(
            [
              ['not_claimed', 'Never claimed, or a 30 minute hold ran out.', 'OK to send a link', 'go'],
              ['pending', 'On the 30 minute hold, or the customer is signing up.', 'Wait, check later', 'wait'],
              ['claimed', 'The perk was applied, even after the free time ends.', 'Stop sending links', 'stop'],
              ['blocked', 'Their Instagram account already used a Liffio perk, or they already pay for Liffio.', 'Stop sending links', 'stop'],
              ['revoked', 'Liffio cancelled this claim.', 'Stop, ask Liffio', 'stop'],
            ] as Array<[Status, string, string, string]>
          ).map(([s, what, act, kind]) => (
            <div key={s} className="sc">
              <Pill s={s} />
              <p>{what}</p>
              <span className={`act ${kind}`}>{act}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Webhooks */}
      <section id="webhooks" className="doc wrap">
        <Head eyebrow="Webhooks · push" title="We POST to you when a claim changes">
          Give your Liffio contact an https URL, and we tell you about claims and payments. You get a signing secret (<C>whsec_...</C>)
          once, to check every request really came from us.
        </Head>
        <div className="cols">
          <div className="col-main">
            <h3>Events</h3>
            <p className="p">Pick one to see its payload.</p>
            <div className="events" role="tablist" aria-label="Webhook events">
              {EVENTS.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  role="tab"
                  aria-selected={e.key === ev}
                  className={`evr${e.key === ev ? ' on' : ''}`}
                  onClick={() => setEv(e.key)}
                >
                  <span className="m">POST</span>
                  <span>
                    <code>{e.type}</code>
                    <small>{e.what}</small>
                  </span>
                </button>
              ))}
            </div>
            <p className="p small">No events are sent for a link being opened or a hold running out. Use the status API for those.</p>
            <div className="note info">
              <Info />
              <p>
                <b>Revenue share.</b> <C>claim.paid</C> is sent for every payment from a customer you brought. <C>payment.earning</C>{' '}is
                your cut (excluding GST, after any discount, in the payment&apos;s currency), or <C>null</C>{' '}when that payment
                doesn&apos;t earn (no revenue share, or the first payment came after your window). Earnings sit <C>on_hold</C> for 20
                days, then become <C>available</C>. A refund sends <C>claim.refunded</C> and the earning becomes <C>clawed_back</C>.
              </p>
            </div>

            <h3>What we do with your reply</h3>
            <div className="reply">
              <div className="rq">Any <C>2xx</C> within 10 s</div><span className="ar">→</span><div className="rs good">Delivered</div>
              <div className="rq"><C>4xx</C>, <C>5xx</C>, timeout, server down</div><span className="ar">→</span><div className="rs">Retry later</div>
              <div className="rq">A redirect (<C>3xx</C>)</div><span className="ar">→</span><div className="rs">Retry. We don&apos;t follow redirects</div>
            </div>
            <p className="p">
              The reply body is ignored. A plain <C>200 OK</C> is enough.
            </p>

            <h3>Your side</h3>
            <Steps
              items={[
                ['Check the signature', 'and reject anything that fails.'],
                ['Skip duplicates.', <>Retries reuse the same <C>Liffio-Event-Id</C>.</>],
                ['Save the status', <>against <C>data.ref</C> (or <C>data.code</C>).</>],
                ['Reply 200 fast', 'and do slow work afterwards.'],
              ]}
            />
            <div className="note info">
              <Info />
              <p>
                Events can arrive out of order. Trust <C>data.status</C>, not the order they arrive in.
              </p>
            </div>
          </div>
          <div className="col-side">
            <CodeCard title="Request headers" code={WEBHOOK_HEADERS} lang="http" />
            <CodeCard
              title={event.type}
              code={pretty(event.payload)}
              lang="json"
              foot={
                <>
                  <i className="d green" /> Every <C>data</C> has the same six fields as the status API, plus <C>code</C>, and <C>payment</C> on
                  paid and refunded
                </>
              }
            />
          </div>
        </div>

        <div className="retry">
          <div className="retry-h">
            <b>If you don&apos;t reply 2xx, we keep trying for about 33 hours</b>
            <span>The wait after each failed try. Not to scale.</span>
          </div>
          <ol className="tl">
            {RETRIES.map((r, i) => (
              <li key={r.label} className={i === 0 ? 'first' : ''}>
                <i />
                <b>{r.label}</b>
                <span>{r.after}</span>
              </li>
            ))}
            <li className="fail">
              <i />
              <b>Failed</b>
              <span>Liffio can resend</span>
            </li>
          </ol>
          <div className="retry-f">
            <div><b>Same event id every time</b><span>So you can safely skip ones you&apos;ve seen.</span></div>
            <div><b>Turned off after 3 days</b><span>With no success and at least 20 failed tries.</span></div>
            <div><b>Back on when fixed</b><span>Liffio turns it on again once your URL works.</span></div>
          </div>
        </div>
      </section>

      {/* Verify */}
      <section id="verify" className="doc wrap">
        <Head eyebrow="Security" title="Check every webhook is really from Liffio">
          <C>v1</C> is an HMAC-SHA256 of <C>&lt;t&gt;.&lt;raw body&gt;</C> with your signing secret, in hex. Use the raw body, before
          parsing JSON.
        </Head>
        <div className="cols">
          <div className="col-main">
            <Steps
              items={[
                [<>Read <C>t</C> and every <C>v1</C></>, <>from the <C>Liffio-Signature</C> header.</>],
                ['Reject old requests.', <>If <C>t</C> is more than 5 minutes from now, drop it.</>],
                ['Compute the HMAC', <>of <C>t</C>, a dot, and the raw body.</>],
                ['Compare safely', <>with a constant-time compare. Any matching <C>v1</C> passes.</>],
              ]}
            />
            <div className="note warn">
              <Warn />
              <p>
                When Liffio rotates your secret, the header carries two <C>v1=</C> values for 24 hours. The code here accepts either, so
                nothing breaks.
              </p>
            </div>
          </div>
          <div className="col-side">
            <Tabbed samples={VERIFY_SAMPLES} ariaLabel="Verification language" />
          </div>
        </div>
      </section>

      {/* Status API */}
      <section id="status-api" className="doc wrap">
        <Head eyebrow="Status API · pull" title="Ask about one customer, any time">
          Call it from your server just before you send a link, or to catch a webhook you missed. Your API key (<C>lf_partner_...</C>)
          comes from your Liffio contact.
        </Head>
        <div className="cols">
          <div className="col-main">
            <UrlBox method="GET" url={`${API_BASE}/claims/{ref}`} />
            <h3>Headers</h3>
            <div className="fields">
              <Field name="Authorization" type="string" req>
                <C>Bearer lf_partner_...</C>. Server side only, never in a web page or app.
              </Field>
            </div>
            <h3>Path</h3>
            <div className="fields">
              <Field name="ref" type="string · max 200" req>
                Your customer reference, URL-encoded (a space becomes <C>%20</C>, a slash <C>%2F</C>). A ref we&apos;ve never seen returns{' '}
                <C>not_claimed</C>, not a 404.
              </Field>
            </div>
            <h3>Responses</h3>
            <div className="sees">
              <div><span className="b ok">200</span><p>Always the same six fields. Fields that don&apos;t apply are <C>null</C>.</p></div>
              <div><span className="b bad">400</span><p><C>{'{"error":"invalid_ref"}'}</C> The ref is empty or too long.</p></div>
              <div><span className="b bad">401</span><p><C>{'{"error":"unauthorized"}'}</C> Key missing, wrong or revoked.</p></div>
              <div><span className="b old">429</span><p><C>{'{"error":"rate_limited"}'}</C> Over 60 a minute. Wait the seconds in <C>Retry-After</C>.</p></div>
            </div>
            <h3>Using codes? Look up by code</h3>
            <UrlBox method="GET" url={`${API_BASE}/codes/{code}`} />
            <p className="p">
              Same key, same limit, same six fields, with <C>code</C> (as issued) in place of <C>ref</C>, plus <C>code_state</C>:{' '}
              <C>active</C>, <C>expired</C> or <C>voided</C>. Works for one-time codes. A shared code is used by many customers, so it
              returns <C>{'400 {"error":"shared_code"}'}</C>. A code that isn&apos;t yours returns <C>{'404 {"error":"unknown_code"}'}</C>,
              and one that isn&apos;t a code at all <C>{'400 {"error":"invalid_code"}'}</C>.
            </p>
          </div>
          <div className="col-side">
            <Tabbed samples={REQUEST_SAMPLES} ariaLabel="Request language" />
            <div className="cc">
              <div className="cc-h wrap-h">
                <div className="tabs" role="tablist" aria-label="Endpoint">
                  {(['ref', 'code'] as const).map((k) => (
                    <button key={k} type="button" role="tab" aria-selected={resKind === k} className={resKind === k ? 'on' : ''} onClick={() => setResKind(k)}>
                      {k === 'ref' ? '/claims/{ref}' : '/codes/{code}'}
                    </button>
                  ))}
                </div>
                <CopyButton text={pretty(response)} />
              </div>
              <div className="cc-h sub">
                <span className="code200">200</span>
                <div className="tabs" role="tablist" aria-label="Status">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" role="tab" aria-selected={resStatus === s} className={resStatus === s ? 'on' : ''} onClick={() => setResStatus(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="cc-b" tabIndex={0}>
                <code>{highlight(pretty(response), 'json')}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Limits */}
      <section id="limits" className="doc wrap">
        <Head eyebrow="Good to know" title="Limits and rules" />
        <div className="nums">
          <div><b>60<small>/min</small></b><p>Status API requests per key. Headers show what&apos;s left.</p></div>
          <div><b>10<small>s</small></b><p>Time your server has to reply to a webhook.</p></div>
          <div><b>7<small>tries</small></b><p>Per webhook, over about 33 hours.</p></div>
          <div><b>UTC</b><p>Every time ends in <C>Z</C>. 10:00Z is 3:30 PM in India.</p></div>
        </div>
        <div className="rules">
          <div><Check /><span><b>Use both</b>Webhooks keep your records current. Check the status API right before sending, in case one was missed.</span></div>
          <div><Check /><span><b>One perk per customer</b>A re-sent link never gives a second perk. It only shows your customer &quot;already claimed&quot;.</span></div>
          <div><Check /><span><b>No customer data</b>We never send emails, names or Instagram handles. Only the ref or code, status, plan and times.</span></div>
          <div><Check /><span><b>Keys shown once</b>If a key or secret leaks, ask Liffio to revoke or rotate it. To test, ask Liffio to press Send test.</span></div>
        </div>
        <div className="docfoot">
          <span>Liffio Partner API · v1.1</span>
          <a href={PDF_URL} download>
            Download this guide as a PDF
          </a>
          <span>Last updated 9 Nov 2026</span>
        </div>
      </section>
    </div>
  );
}
