import { readFileSync } from "fs";
import { join } from "path";

/**
 * The publication date of each document, one entry per document.
 *
 * 🚩 NOT a single shared constant, which is what this replaced. One constant
 * silently asserts that all eight publish together, and they do not: the
 * Affiliate Policy is held pending a business decision, because publishing it
 * starts a 30-day notice obligation to existing affiliates. With one constant
 * there was no way to publish it later that was not wrong - either it would
 * inherit a date on which it demonstrably was not live, or moving the constant
 * to its real date would retro-date the six that had been live for weeks.
 *
 * A document with no entry here is one that has not published. `loadPolicy`
 * leaves its `[PUBLICATION DATE]` literal in place, and the guard in
 * test/legal.test.ts fails the moment such a document is wired to a route -
 * so "forgot to set the date" cannot reach the page as a blank or a literal.
 */
const PUBLICATION_DATES: Partial<Record<PolicySlug, string>> = {
  "acceptable-use-policy": "15 September 2026",
  "cookie-policy": "15 September 2026",
  "creators-program-policy": "15 September 2026",
  "refund-policy": "15 September 2026",
  "shipping-delivery-policy": "15 September 2026",
  "terms-and-conditions": "15 September 2026",
  // Published in the same change that resolved its Grievance Officer name and
  // dropped the Stripe reference the old text still carried.
  "privacy-policy": "15 September 2026",
  // "affiliate-program-policy": deliberately absent. Set it in the change that
  // switches /affiliate-policy over, never before.
};

/** The date a published document carries. Throws for one that has not shipped. */
export function policyPublicationDate(slug: PolicySlug): string {
  const date = PUBLICATION_DATES[slug];
  if (!date) {
    throw new Error(
      `${slug} has no publication date: it is not published. Add its real date to ` +
        `PUBLICATION_DATES in the same change that wires its route, not before.`,
    );
  }
  return date;
}

const PLACEHOLDER = /\[PUBLICATION DATE\]/g;

/** Every policy in the pack, by the slug its `.md` file uses. */
export type PolicySlug =
  | "acceptable-use-policy"
  | "affiliate-program-policy"
  | "cookie-policy"
  | "creators-program-policy"
  | "privacy-policy"
  | "refund-policy"
  | "shipping-delivery-policy"
  | "terms-and-conditions";

/**
 * Read one policy's Markdown body.
 *
 * The `# Title` line and the `**Last updated: ...**` line under it are stripped
 * here: `LegalPage` renders both in the page header, and leaving them in the
 * body would print the title twice and the date twice. Everything below that is
 * returned untouched for `PolicyMarkdown` to render.
 */
export function loadPolicy(slug: PolicySlug): string {
  const raw = readFileSync(join(process.cwd(), "src/content/legal", `${slug}.md`), "utf8");
  // An unpublished document keeps its literal rather than borrowing a date from
  // a document that did publish. The guard test turns that into a build failure
  // if the route is ever wired without a date being set.
  const date = PUBLICATION_DATES[slug];

  return raw
    .replace(PLACEHOLDER, date ?? "[PUBLICATION DATE]")
    .split("\n")
    .filter((line) => !/^#\s/.test(line) && !/^\*\*Last updated:.*\*\*\s*$/.test(line.trim()))
    .join("\n")
    .trim();
}

/**
 * Anything a document says must be resolved before it is published.
 *
 * 🔴 The Privacy Policy's Grievance Officer line says, in the document itself,
 * "Do not publish with this placeholder." The Affiliate Policy's first-payment
 * discount is gated on a decision that had not been taken. Both are [BLOCKS]
 * items on the go-live checklist, and both are the kind of thing that ships by
 * accident when the only thing stopping it is someone remembering.
 *
 * `test/legal.test.ts` runs this over every PUBLISHED policy and fails the
 * build if one still carries a placeholder.
 */
export const UNRESOLVED_PLACEHOLDER = /\[(TODO|SUBJECT TO|PUBLICATION DATE|NAME REQUIRED)[^\]]*\]/i;

export function findUnresolvedPlaceholder(content: string): string | null {
  return UNRESOLVED_PLACEHOLDER.exec(content)?.[0] ?? null;
}
