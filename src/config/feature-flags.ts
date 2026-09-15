/**
 * Marketing-site feature flags.
 *
 * These gate DATA, not presentation: gated entries are filtered out of
 * source config arrays (or swapped for accurate alternate copy) so the
 * strings never serialize into served page output. Do not use CSS
 * display:none, the hidden attribute, or conditional JSX wrapping a
 * still-present config entry.
 *
 * NEXT_PUBLIC_ vars are inlined at BUILD time, so flipping a value in
 * Vercel's env UI does nothing until the next deploy; a redeploy is
 * required for the change to take effect.
 *
 * public/llms.txt is a STATIC asset: no flag reaches it. Each edited line
 * is recorded below with its exact original wording so restoring it later
 * needs no re-derivation. Restore the "was" text when the named flag flips:
 *
 *   FEATURE_WELCOME_DM
 *     - "## What Liffio does" para, trigger list
 *         was: "...(a comment keyword, a story reply, a new follower) and sends a personalized DM."
 *         now: "...(a comment keyword or a story reply) and sends a personalized DM."
 *     - "## Automation types" list, RE-ADD the deleted line:
 *         "- Welcome DM: new follower → automatic welcome message"
 *     - intro para: re-add ", or following the account" to the trigger-events sentence.
 *
 *   FEATURE_STORY_REACTIONS
 *     - "## Automation types", story line
 *         was: "- Story reply automation: someone replies to a story → they receive a DM"
 *         now: "- Story reply automation: someone replies to or mentions a story → they receive a DM"
 *       (when reactions ship, use: "someone replies to, reacts to, or mentions a story")
 *
 *   FEATURE_COLLECT_DATA_PROMPTS
 *     - "## Automation types", Collect Data line
 *         was: "- Collect Data: ask follow-up questions in DM and store responses as leads"
 *         now: "- Collect Data: capture email addresses shared in DM conversations and store them as leads"
 */

/**
 * "Welcome New Followers" automation.
 * Blocked by: Meta grants follow-to-DM (Follow to DM) only through a
 * limited partner beta Liffio does not have access to yet.
 * Ship first: partner-beta access + the follower webhook handler.
 */
export const FEATURE_WELCOME_DM = process.env.NEXT_PUBLIC_FEATURE_WELCOME_DM === "true";

/**
 * Story REACTION triggers (emoji reactions to a story).
 * Missing on backend: `message_reactions` is neither subscribed in the
 * webhook config nor handled: the reaction event is typed but never
 * parsed, so reacting to a story produces zero behavior.
 * Ship first: subscribe message_reactions + add the handler branch.
 * NOTE: story REPLIES and story MENTIONS do ship and are NOT gated.
 */
export const FEATURE_STORY_REACTIONS = process.env.NEXT_PUBLIC_FEATURE_STORY_REACTIONS === "true";

/**
 * Comment and caption @mention triggers.
 * Missing on backend: the mentions webhook field is unsubscribed and no
 * handler branch exists. Story mentions ship via a different path and
 * are NOT gated: copy that said "mentions" generally has been narrowed
 * to "story mentions", which is accurate in both flag states.
 * Ship first: subscribe the mentions field + handler branch.
 */
export const FEATURE_COMMENT_MENTIONS = process.env.NEXT_PUBLIC_FEATURE_COMMENT_MENTIONS === "true";

/**
 * Branching / conditional DM logic.
 * Missing on backend: a trigger block is one keyword -> one DM plus an
 * optional public reply. There is no step chaining, no conditionals, and
 * no conversation state machine.
 * Ship first: conversation state + conditional step evaluation.
 * NOTE: "multi-step" alone is defensible (follow-up sequences ship) ,
 * only "with branching logic" / "conditional" is gated.
 */
export const FEATURE_BRANCHING_LOGIC = process.env.NEXT_PUBLIC_FEATURE_BRANCHING_LOGIC === "true";

/**
 * Prompting flows that ASK for user data in a DM (email, phone, custom
 * fields).
 * Missing on backend: no prompting flow exists: email capture is
 * passive extraction only, and the Lead entity has an `email` column
 * with no phone or custom-field storage.
 * Ship first: prompt/answer state machine + phone and custom-field
 * columns on Lead.
 * NOTE: the Collect Data feature card stays visible: passive email
 * capture and manual CSV export are real.
 */
export const FEATURE_COLLECT_DATA_PROMPTS =
  process.env.NEXT_PUBLIC_FEATURE_COLLECT_DATA_PROMPTS === "true";

/**
 * CRM integration (HubSpot / Zapier / Salesforce / outbound webhooks).
 * Missing on backend: no CRM, no integration provider, and no outbound
 * webhook delivery code exists anywhere.
 * Ship first: an integrations surface + outbound webhook delivery.
 * NOTE: "External API access" is a DIFFERENT, real claim: the
 * /api/v1/external router ships with API-key auth and per-plan limits
 * (api_enabled true from Starter up). It is NOT gated.
 */
export const FEATURE_CRM_INTEGRATION = process.env.NEXT_PUBLIC_FEATURE_CRM_INTEGRATION === "true";

/**
 * Sale / revenue attribution in analytics.
 * Missing on backend: comment, DM, and click all track, but there is no
 * sale, purchase, or revenue tracking: the in-code label is literally
 * "Conversion from DM to click".
 * Ship first: purchase events (pixel or commerce webhook) + revenue
 * attribution.
 * Flag-off copy is "comment -> DM -> click", which is accurate.
 */
export const FEATURE_SALE_TRACKING = process.env.NEXT_PUBLIC_FEATURE_SALE_TRACKING === "true";
