/**
 * The demo's keyword matcher — a deliberate mirror of the server's.
 *
 * The demo on onboarding screen 3 is a promise: *this is what will happen on your account*. It is
 * worth nothing if a comment that fires here would not fire in production, or the reverse. So the
 * three rules below are copied from `reactova-api/src/services/commentAutomation.ts` exactly:
 *
 * 1. lower-case;
 * 2. every character that is not a letter, a number or whitespace becomes a space, then runs of
 *    whitespace collapse — so "GUIDE!!!" and "guide," both normalize to "guide"; and
 * 3. whole-word matching against the normalized comment, so "how much is this?" matches the
 *    keyword "how much" but "guidebook" does not match "guide".
 *
 * 🚩 **This is a duplicate of server logic, and that is a cost, not an oversight.** The alternative
 * — asking the API whether a demo comment matched — would put a network round trip inside a typing
 * interaction, on the screen whose entire job is to make the product feel instant. The duplication
 * is bounded (one function, no state).
 *
 * If `commentAutomation.normalize` changes, this changes with it.
 */

/** Mirrors `nonWordRegex` in `commentAutomation.ts`. */
const NON_WORD = /[^\p{L}\p{N}\s]/gu;
const MULTI_SPACE = /\s+/g;
const REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;

export function normalizeComment(text: string): string {
  return text.toLowerCase().replace(NON_WORD, ' ').replace(MULTI_SPACE, ' ').trim();
}

const escapeRegex = (value: string): string => value.replace(REGEX_SPECIALS, '\\$&');

/**
 * Does `comment` contain any of `keywords` as a whole word (or whole phrase)?
 *
 * A keyword that normalizes to nothing — `'!!!'`, a bare emoji — never matches, which is the same
 * answer the server gives and the reason it refuses to store one.
 */
export function commentMatchesKeywords(comment: string, keywords: string[]): boolean {
  const normalizedComment = normalizeComment(comment);
  if (!normalizedComment) return false;

  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeComment(keyword);
    if (!normalizedKeyword) return false;
    return new RegExp(`\\b${escapeRegex(normalizedKeyword)}\\b`).test(normalizedComment);
  });
}
