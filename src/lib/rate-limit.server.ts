import "server-only";

type Bucket = { count: number; resetAt: number };

/**
 * A fixed-window, per-key limiter held in memory.
 *
 * Each serverless instance keeps its own map, so on Vercel this is a per-instance ceiling rather
 * than a global one. That is enough to stop one visitor hammering a form from a single warm
 * instance; a shared store (Redis/KV) is the upgrade if a global limit is ever needed.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function hit(key: string): boolean {
    const now = Date.now();
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    bucket.count += 1;
    return bucket.count <= limit;
  };
}

/** The caller's IP as Vercel reports it, or "unknown" off-platform. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
