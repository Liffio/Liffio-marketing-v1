/**
 * Marketing-site feature flags.
 *
 * FEATURE_WELCOME_DM gates every marketing mention of the "Welcome New
 * Followers" automation (Meta grants follow-to-DM via a limited partner
 * beta that Liffio does not have access to yet). The flag gates DATA, not
 * presentation: gated entries are filtered out of source config arrays so
 * the strings never serialize into served page output. Flip
 * NEXT_PUBLIC_FEATURE_WELCOME_DM=true when Meta grants access.
 * NEXT_PUBLIC_ vars are inlined at BUILD time — flipping the value in
 * Vercel's env UI does nothing until the next deploy; a redeploy is
 * required for the change to take effect.
 * Note: public/llms.txt is a static asset — its welcome-DM lines were
 * removed alongside this flag and must be restored manually when it flips.
 */
export const FEATURE_WELCOME_DM = process.env.NEXT_PUBLIC_FEATURE_WELCOME_DM === "true";
