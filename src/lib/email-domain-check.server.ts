import "server-only";

import { isValidDomain, splitEmail } from "@/lib/auth/email-rules";

const TIMEOUT_MS = 3000;

/** The domain of an address (after the last "@", trimmed, lowercased), or null when unusable. */
export function emailDomain(email: string): string | null {
  return splitEmail(email)?.domain ?? null;
}

export async function isDisposableEmail(email: string): Promise<boolean | null> {
  const domain = emailDomain(email);
  return domain ? isDisposableDomain(domain) : null;
}

/**
 * Asks the mail checker whether a domain is a throwaway one.
 *
 * 🔴 Server only, and only the domain goes out: the body is "@domain", never a full address.
 * Fails OPEN: a missing config, a timeout or any non-200 answer returns null, and the caller lets
 * the signup through. An outage of the checker must never block a real signup.
 */
export async function isDisposableDomain(rawDomain: string): Promise<boolean | null> {
  const domain = rawDomain.trim().toLowerCase().replace(/^@/, "");
  if (!isValidDomain(domain)) return null;

  const baseUrl = process.env.MAILCHECK_API_URL?.trim().replace(/\/$/, "");
  const apiKey = process.env.MAILCHECK_API_KEY?.trim();
  if (!baseUrl || !apiKey) {
    console.warn("[mailcheck] not configured, skipping check");
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email: `@${domain}` }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.status !== 200) {
      console.warn(`[mailcheck] domain=${domain} unavailable status=${res.status}`);
      return null;
    }
    const data = (await res.json().catch(() => null)) as { disposable?: unknown } | null;
    if (typeof data?.disposable !== "boolean") {
      console.warn(`[mailcheck] domain=${domain} unexpected response`);
      return null;
    }
    if (data.disposable) console.info(`[mailcheck] domain=${domain} disposable=true`);
    return data.disposable;
  } catch (err) {
    const reason = (err as Error).name === "AbortError" ? "timeout" : "network error";
    console.warn(`[mailcheck] domain=${domain} unavailable (${reason})`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
