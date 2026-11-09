/*
  The partner docs' samples and payloads (liffio.com/partners/docs). Every value here is a
  placeholder: no real partner, slug, key or secret. Shapes and rules are checked against the
  live API (claim links, webhooks, status API); see the notes next to each.
*/

export const SLUG = 'your-partner-slug';
export const CLAIM_LINK = `https://liffio.com/claim/${SLUG}#t=<token>`;
export const API_BASE = 'https://api.liffio.com/partner/v1';

export type Lang = 'js' | 'py' | 'php' | 'bash' | 'json' | 'http';
export type Sample = { id: string; label: string; lang: Lang; code: string };

/** Signing a claim link. `iat` and `exp` are numbers (unix seconds); HS256 only. */
export const SIGN_SAMPLES: Sample[] = [
  {
    id: 'node',
    label: 'Node.js',
    lang: 'js',
    code: `const jwt = require("jsonwebtoken");

function claimLink(ref) {
  const token = jwt.sign(
    {
      partner: "${SLUG}",
      ref,
      // offer: "starter-2m",      optional, one of your offers
      // source: "newsletter-nov", optional, for your reports
    },
    process.env.LIFFIO_LINK_SECRET,
    { algorithm: "HS256", expiresIn: "7d" } // iat is added for you
  );
  return \`https://liffio.com/claim/${SLUG}#t=\${token}\`;
}

claimLink("123456789");`,
  },
  {
    id: 'py',
    label: 'Python',
    lang: 'py',
    code: `import os, time, jwt  # pip install PyJWT

def claim_link(ref: str) -> str:
    now = int(time.time())
    token = jwt.encode(
        {
            "partner": "${SLUG}",
            "ref": ref,
            "iat": now,
            "exp": now + 7 * 86400,
            # "offer": "starter-2m",       optional, one of your offers
            # "source": "newsletter-nov",  optional, for your reports
        },
        os.environ["LIFFIO_LINK_SECRET"],
        algorithm="HS256",
    )
    return f"https://liffio.com/claim/${SLUG}#t={token}"

claim_link("123456789")`,
  },
  {
    id: 'php',
    label: 'PHP',
    lang: 'php',
    code: `use Firebase\\JWT\\JWT; // composer require firebase/php-jwt

function claimLink(string $ref): string {
    $now = time();
    $token = JWT::encode([
        'partner' => '${SLUG}',
        'ref' => $ref,
        'iat' => $now,
        'exp' => $now + 7 * 86400,
        // 'offer' => 'starter-2m',       optional, one of your offers
        // 'source' => 'newsletter-nov',  optional, for your reports
    ], getenv('LIFFIO_LINK_SECRET'), 'HS256');
    return 'https://liffio.com/claim/${SLUG}#t=' . $token;
}

claimLink('123456789');`,
  },
];

export const DECODED_TOKEN = `// header
{ "alg": "HS256", "typ": "JWT" }

// payload
{
  "partner": "${SLUG}",
  "ref": "123456789",
  "iat": 1793952000,
  "exp": 1794556800,
  "offer": "starter-2m",
  "source": "newsletter-nov"
}`;

/** Signature check: `v1` = hex HMAC-SHA256 of "<t>.<raw body>"; one v1 per active secret. */
export const VERIFY_SAMPLES: Sample[] = [
  {
    id: 'node',
    label: 'Node.js',
    lang: 'js',
    code: `const crypto = require("crypto");

function isFromLiffio(rawBody, header, secret) {
  const parts = header.split(",");
  const t = Number((parts.find((p) => p.startsWith("t=")) || "").slice(2));
  // reject anything older than 5 minutes
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(\`\${t}.\${rawBody}\`)
    .digest("hex");

  return parts
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3))
    .some((s) =>
      s.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))
    );
}`,
  },
  {
    id: 'py',
    label: 'Python',
    lang: 'py',
    code: `import hashlib, hmac, time

def is_from_liffio(raw_body: bytes, header: str, secret: str) -> bool:
    parts = header.split(",")
    t = next((p[2:] for p in parts if p.startswith("t=")), None)
    # reject anything older than 5 minutes
    if not t or abs(time.time() - int(t)) > 300:
        return False

    expected = hmac.new(
        secret.encode(), f"{t}.".encode() + raw_body, hashlib.sha256
    ).hexdigest()

    return any(
        hmac.compare_digest(p[3:], expected)
        for p in parts
        if p.startswith("v1=")
    )`,
  },
];

export const REQUEST_SAMPLES: Sample[] = [
  {
    id: 'curl',
    label: 'cURL',
    lang: 'bash',
    code: `curl ${API_BASE}/claims/123456789 \\
  -H "Authorization: Bearer $LIFFIO_API_KEY"`,
  },
  {
    id: 'node',
    label: 'Node.js',
    lang: 'js',
    code: `const ref = "123456789";
const res = await fetch(
  \`${API_BASE}/claims/\${encodeURIComponent(ref)}\`,
  { headers: { Authorization: \`Bearer \${process.env.LIFFIO_API_KEY}\` } }
);
const claim = await res.json();

if (claim.status === "not_claimed") {
  // OK to send this customer a link
}`,
  },
  {
    id: 'py',
    label: 'Python',
    lang: 'py',
    code: `import os, requests
from urllib.parse import quote

ref = "123456789"
res = requests.get(
    f"${API_BASE}/claims/{quote(ref, safe='')}",
    headers={"Authorization": f"Bearer {os.environ['LIFFIO_API_KEY']}"},
    timeout=10,
)
claim = res.json()

if claim["status"] == "not_claimed":
    # OK to send this customer a link
    ...`,
  },
];

export const WEBHOOK_HEADERS = `POST https://your-server.example/liffio-webhook
Content-Type: application/json
User-Agent: Liffio-Webhooks/1.0
Liffio-Event-Id: evt_3f9a1c7e5b2d4a6c8e0f1a2b
Liffio-Signature: t=1793963201,v1=5f2b9c...`;

export type Status = 'not_claimed' | 'pending' | 'claimed' | 'blocked' | 'revoked';
export const STATUSES: Status[] = ['claimed', 'pending', 'not_claimed', 'blocked', 'revoked'];

/** The six status fields, the same in the status API and in every webhook's `data`. */
export function statusFields(status: Status) {
  return {
    status,
    claimed_at: status === 'claimed' ? '2026-11-06T10:00:00Z' : null,
    plan: status === 'claimed' ? 'starter' : null,
    access_ends_at: status === 'claimed' ? '2026-12-06T10:00:00Z' : null,
    pending_until: status === 'pending' ? '2026-11-06T10:30:00Z' : null,
  };
}

export const byRef = (status: Status) => ({ ref: '123456789', ...statusFields(status) });

/** GET /codes/{code}: `code` as issued, plus `code_state`. */
export const byCode = (status: Status) => ({ code: 'LF-YP-4H7K-QX2M', ...statusFields(status), code_state: 'active' });

const data = (status: Status, extra: Record<string, unknown> = {}) => ({ ref: '123456789', code: null, ...statusFields(status), ...extra });

export type EventKey = 'claimed' | 'blocked' | 'revoked' | 'paid' | 'refunded' | 'ping';
export const EVENTS: Array<{ key: EventKey; type: string; what: string; payload: unknown }> = [
  {
    key: 'claimed',
    type: 'claim.claimed',
    what: 'The perk was applied',
    payload: { id: 'evt_3f9a1c7e5b2d4a6c8e0f1a2b', type: 'claim.claimed', created_at: '2026-11-06T10:00:01Z', data: data('claimed') },
  },
  {
    key: 'blocked',
    type: 'claim.blocked',
    what: 'Their Instagram account already used a Liffio perk, or they already pay for Liffio',
    payload: { id: 'evt_8b2e6d0f4a1c9e7b5d3f1a0c', type: 'claim.blocked', created_at: '2026-11-06T10:00:01Z', data: { ...data('blocked'), ref: '987654321' } },
  },
  {
    key: 'revoked',
    type: 'claim.revoked',
    what: 'Liffio cancelled the claim',
    payload: { id: 'evt_c4d7a2f9e1b3c5d8a6f0e2b4', type: 'claim.revoked', created_at: '2026-11-07T09:15:00Z', data: data('revoked') },
  },
  {
    key: 'paid',
    type: 'claim.paid',
    what: 'The customer paid. Includes your earning if you get revenue share',
    payload: {
      id: 'evt_1e5b9d3f7a2c6e0b4d8f2a6c',
      type: 'claim.paid',
      created_at: '2026-12-04T08:12:09Z',
      data: data('claimed', {
        payment: {
          number: 1,
          paid_at: '2026-12-04T08:12:05Z',
          earning: { amount: 149.7, currency: 'INR', status: 'on_hold', available_at: '2026-12-24T08:12:05Z' },
        },
      }),
    },
  },
  {
    key: 'refunded',
    type: 'claim.refunded',
    what: 'That payment was refunded. Its earning is taken back',
    payload: {
      id: 'evt_9a3c7e1b5d9f3a7c1e5b9d3f',
      type: 'claim.refunded',
      created_at: '2026-12-09T11:30:44Z',
      data: data('claimed', {
        payment: {
          number: 1,
          paid_at: '2026-12-04T08:12:05Z',
          earning: { amount: 149.7, currency: 'INR', status: 'clawed_back', available_at: null },
        },
      }),
    },
  },
  {
    key: 'ping',
    type: 'ping',
    what: 'A test from Liffio. data is null',
    payload: { id: 'evt_7d1f5b9e3c7a1d5f9b3e7c1a', type: 'ping', created_at: '2026-11-06T13:45:35Z', data: null },
  },
];

/** Webhook retries: the wait after each failed try (1 min, 5 min, 30 min, 2 h, 6 h, 24 h). Seven tries, about 33 hours. */
export const RETRIES: Array<{ label: string; after: string }> = [
  { label: 'Try 1', after: 'right away' },
  { label: 'Try 2', after: '+1 min' },
  { label: 'Try 3', after: '+5 min' },
  { label: 'Try 4', after: '+30 min' },
  { label: 'Try 5', after: '+2 h' },
  { label: 'Try 6', after: '+6 h' },
  { label: 'Try 7', after: '+24 h' },
];

export const PDF_URL = '/partners/liffio-partner-guide.pdf';
