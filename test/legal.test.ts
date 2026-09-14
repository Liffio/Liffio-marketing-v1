import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  findUnresolvedPlaceholder,
  loadPolicy,
  policyPublicationDate,
  type PolicySlug,
} from "@/lib/legal/load-policy";
import { parsePolicyMarkdown } from "@/lib/legal/parse-policy-markdown";

/*
  The policy pack, guarded.

  These documents are the ones a regulator, a payment gateway or a court reads,
  and they are the only content on the site that is not written by whoever
  edits the code. The risks are therefore different from the rest of the suite:
  not "does it look right" but "did something publish that was never meant to".
*/

const CONTENT_DIR = "src/content/legal";

/** Routes actually wired to a `.md` file today. */
const PUBLISHED: ReadonlyArray<{ slug: PolicySlug; route: string }> = [
  { slug: "acceptable-use-policy", route: "/acceptable-use-policy" },
  { slug: "cookie-policy", route: "/cookie-policy" },
  { slug: "creators-program-policy", route: "/creators-policy" },
  { slug: "privacy-policy", route: "/privacy-policy" },
  { slug: "refund-policy", route: "/refund-policy" },
  { slug: "shipping-delivery-policy", route: "/shipping-delivery-policy" },
  { slug: "terms-and-conditions", route: "/terms-of-service" },
];

/**
 * 🔴 THE ONE THAT MATTERS.
 *
 * The Privacy Policy's Grievance Officer line says, in the document itself,
 * "Do not publish with this placeholder." A human remembering that is not a
 * control. This is.
 */
test("no published policy carries an unresolved placeholder", () => {
  for (const { slug, route } of PUBLISHED) {
    const found = findUnresolvedPlaceholder(loadPolicy(slug));
    assert.equal(
      found,
      null,
      `${route} would publish with the unresolved placeholder ${found} — resolve it or unwire the route`,
    );
  }
});

/*
  🚩 This deliberately does NOT assert that the dates match each other.

  It used to, because a single constant fed every page. The documents publish
  on their own schedules - the Affiliate Policy is held pending a business
  decision - so "all dates are equal" is not a property of a correct pack, and
  asserting it would have to be deleted by whoever publishes next, which is the
  worst moment to be editing a guard.

  What must hold is narrower and permanent: every page that IS live renders a
  real date, and none of them leaks the literal placeholder.
*/
test("every live page renders a real date, and none leaks the literal", () => {
  for (const { slug, route } of PUBLISHED) {
    assert.ok(
      !loadPolicy(slug).includes("[PUBLICATION DATE]"),
      `${route} still prints the literal [PUBLICATION DATE]`,
    );
    assert.match(
      policyPublicationDate(slug),
      /^\d{1,2} [A-Z][a-z]+ \d{4}$/,
      `${route} has no usable publication date`,
    );
  }
});

test("an unpublished document has no date, and says so loudly", () => {
  // The Affiliate Policy is final but held: publishing it starts a 30-day
  // notice obligation to existing affiliates. Until that decision is taken it
  // must have no date, and asking for one must fail rather than invent one.
  assert.throws(
    () => policyPublicationDate("affiliate-program-policy"),
    /not published/,
    "an unpublished document must not silently hand back a date",
  );
  // Asserted against the RAW file, not `loadPolicy` output: the loader strips
  // the whole "Last updated" line, which is the only place the literal lives,
  // so the loaded body never contains it either way and checking there proves
  // nothing. The file still carrying the literal is what proves no date was
  // quietly hand-written into a document that has not shipped.
  const raw = readFileSync(join(CONTENT_DIR, "affiliate-program-policy.md"), "utf8");
  assert.ok(
    raw.includes("[PUBLICATION DATE]"),
    "an unpublished document must keep its literal, not borrow another document's date",
  );
});

test("the title and date are stripped from the body, not duplicated", () => {
  for (const { slug, route } of PUBLISHED) {
    const body = loadPolicy(slug);
    assert.ok(!/^#\s/m.test(body), `${route} still carries its H1 — the page header renders it`);
    assert.ok(
      !/^\*\*Last updated:/m.test(body),
      `${route} still carries its "Last updated" line — the page header renders it`,
    );
  }
});

/*
  `PolicyMarkdown` supports a deliberate subset. A document that starts using
  something outside it renders the raw syntax as text, which is ugly but
  visible. This asserts the subset still covers what the files actually use, so
  that stays a theoretical problem rather than a live one.
*/
test("the renderer covers every construct the pack uses", () => {
  const unsupported: string[] = [];

  // Published documents only. An unwired draft is allowed to carry an editorial
  // banner - the Affiliate Policy's "DECISION PENDING, DO NOT PUBLISH" block is
  // a blockquote, and flagging it here would mean the suite went red for
  // correctly NOT publishing something.
  for (const { slug } of PUBLISHED) {
    const file = `${slug}.md`;
    const raw = readFileSync(join(CONTENT_DIR, file), "utf8");

    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (trimmed === "") continue;
      // Links and images are NOT supported, and the pack currently has none.
      if (/!?\[[^\]]+\]\([^)]+\)/.test(trimmed)) unsupported.push(`${file}: link/image — ${trimmed}`);
      // Nor blockquotes, numbered lists or fenced code.
      if (/^>\s/.test(trimmed)) unsupported.push(`${file}: blockquote — ${trimmed}`);
      if (/^```/.test(trimmed)) unsupported.push(`${file}: fenced code — ${trimmed}`);
    }
  }

  assert.deepEqual(
    unsupported,
    [],
    `PolicyMarkdown would render these as literal text:\n${unsupported.join("\n")}`,
  );
});

test("every published policy parses into real structure", () => {
  for (const { slug, route } of PUBLISHED) {
    const blocks = parsePolicyMarkdown(loadPolicy(slug));
    assert.ok(blocks.length > 3, `${route} parsed into almost nothing — ${blocks.length} blocks`);
    assert.ok(
      blocks.some((b) => b.kind === "heading"),
      `${route} parsed with no headings at all`,
    );
    // A stray pipe row that never became a table is the failure mode that looks
    // fine in a diff and terrible on the page.
    assert.ok(
      !blocks.some((b) => b.kind === "paragraph" && b.text.startsWith("|")),
      `${route} has a table row that did not parse as a table`,
    );
  }
});

test("the tables that exist are rectangular", () => {
  for (const { slug, route } of PUBLISHED) {
    for (const block of parsePolicyMarkdown(loadPolicy(slug))) {
      if (block.kind !== "table") continue;
      for (const row of block.rows) {
        assert.equal(
          row.length,
          block.head.length,
          `${route} has a table row with ${row.length} cells against ${block.head.length} headers`,
        );
      }
    }
  }
});
