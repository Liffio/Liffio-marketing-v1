/**
 * The visitor's cookie choice: reading it, writing it, and announcing it.
 *
 * Cookie Policy 2.1 lists "Your cookie choices" as an ESSENTIAL cookie kept
 * for 12 months, so this one is set without asking. It is the record of the
 * answer, and a site cannot remember "no" without storing something.
 *
 * Cookie Policy 4 promises the choice can be changed "at any time from the
 * cookie settings on our website", which is what `openCookieSettings()` and
 * the footer link are for.
 */

/**
 * Bumping this invalidates every stored choice and asks again.
 *
 * 🚩 It is the Cookie Policy's own publication date, not a serial number.
 * Consent is consent to a specific disclosure, so when the disclosure changes
 * materially the old answer no longer covers it. Keep this in step with the
 * entry for "cookie-policy" in PUBLICATION_DATES (src/lib/legal/load-policy.ts),
 * and only when the change is material: a typo fix is not a re-consent event.
 */
export const CONSENT_POLICY_VERSION = "2026-09-15";

/** Cookie Policy 2.1: "Your cookie choices", liffio.com, 12 months. */
export const CONSENT_COOKIE_NAME = "liffio_consent";
const CONSENT_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

/** Dispatched on `window` by the footer link, listened for by the banner. */
export const OPEN_COOKIE_SETTINGS_EVENT = "liffio:open-cookie-settings";

export type ConsentChoice = "accepted" | "rejected";

export type ConsentRecord = {
  choice: ConsentChoice;
  /** The policy version the visitor was answering about. */
  version: string;
  /** ISO 8601, so the record is auditable without decoding anything. */
  timestamp: string;
};

const isBrowser = typeof document !== "undefined";

function readCookie(name: string): string | null {
  if (!isBrowser) return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const entry = part.trim();
    if (entry.startsWith(prefix)) return entry.slice(prefix.length);
  }
  return null;
}

/**
 * The stored record, or null when there is none, it is unreadable, or it
 * answers an older policy version.
 *
 * Anything unparseable is treated as "no answer yet" rather than thrown. A
 * corrupted cookie must make the site ask again, never crash the page it is
 * rendered into.
 */
export function readConsent(): ConsentRecord | null {
  const raw = readCookie(CONSENT_COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Partial<ConsentRecord>;
    if (record.choice !== "accepted" && record.choice !== "rejected") return null;
    if (record.version !== CONSENT_POLICY_VERSION) return null;
    return {
      choice: record.choice,
      version: record.version,
      timestamp: typeof record.timestamp === "string" ? record.timestamp : "",
    };
  } catch {
    return null;
  }
}

/** Write the choice, the policy version it answers, and when it was given. */
export function writeConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = {
    choice,
    version: CONSENT_POLICY_VERSION,
    timestamp: new Date().toISOString(),
  };
  if (!isBrowser) return record;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(record))}` +
    `; max-age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax${secure}`;
  return record;
}

/** Reopen the banner from anywhere, including a server-rendered footer. */
export function openCookieSettings(): void {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}
