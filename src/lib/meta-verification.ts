/**
 * Reads `IS_META_VERIFIED` or `isMetaVerified` from `.env` (exposed via next.config for client + server).
 * When false, hide Meta Tech Provider / Business Partner / similar certification copy sitewide.
 */
export function readIsMetaVerified(): boolean {
  const raw =
    process.env.IS_META_VERIFIED ??
    process.env.isMetaVerified ??
    "false";
  const normalized = String(raw).trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

/** Resolved at build/start from `.env`. Restart `npm run dev` after changing the flag. */
export const isMetaVerified = readIsMetaVerified();
