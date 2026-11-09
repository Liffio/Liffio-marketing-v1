import assert from "node:assert/strict";
import test from "node:test";

import {
  BOX_ERRORS,
  claimUrlFor,
  codeFromHash,
  codeHash,
  codeInput,
  codeOutcome,
  codeReady,
  discountLabel,
  durationLabel,
  isHoldId,
  linkNotice,
  normalizeCode,
  noticeFor,
  offerCopy,
  partnerClaimPath,
  programNotice,
  safeBrandColor,
  safeLogoUrl,
  stripHashOnLoad,
  takesCodes,
  takesLinks,
  tokenFromHash,
  type PartnerBranding,
  type PublicOffer,
  type PublicPartner,
} from "@/lib/partner-claim";

/*
  liffio.com/redeem, /claim and /claim/:slug (partner rewards SPEC 9.4). The token and the code
  only ever come from the fragment, the code box takes any partner's code, the offer's words
  never promise a charge, and every state picks its copy from the design.
*/

const starter = { key: "starter", name: "Starter", monthlyPriceInrPaise: 49900, monthlyPriceUsdCents: 900 };
const freeMonth: PublicOffer = { label: "Starter, 1 month free", offerType: "free", plan: starter, duration: { value: 1, unit: "months" }, discount: null };
const twentyOff = { kind: "percent" as const, percentBps: 2000, amountMinor: null, currency: null };
const discountOnly: PublicOffer = { label: "Starter, 20% off the first payment", offerType: "discount", plan: starter, duration: null, discount: twentyOff };
const both: PublicOffer = {
  label: "Starter, 1 month free, then 20% off the first payment",
  offerType: "both",
  plan: starter,
  duration: { value: 1, unit: "months" },
  discount: twentyOff,
};

const branding = (over: Partial<PartnerBranding> = {}): PartnerBranding => ({
  slug: "your-partner-slug",
  name: "Your partner name",
  logoUrl: null,
  brandColor: "#475569",
  customHeadline: null,
  website: null,
  methods: ["unique", "shared"],
  codePrefix: null,
  linkExpiryDays: 7,
  ...over,
});
const partner = (over: Partial<PublicPartner> = {}): PublicPartner => ({ ...branding(), offer: freeMonth, programState: "active", ...over });

test("the token is read from #t= only", () => {
  assert.equal(tokenFromHash("#t=abc.def.ghi"), "abc.def.ghi");
  assert.equal(tokenFromHash("#x=1&t=tok"), "tok");
  assert.equal(tokenFromHash(""), null);
  assert.equal(tokenFromHash("#t="), null);
});

test("#code= is read from the fragment only, never from ?code=", () => {
  assert.equal(codeFromHash("#code=LF-JS-7K2Q-M9XD"), "LF-JS-7K2Q-M9XD");
  assert.equal(codeFromHash("#x=1&code=boost-blog"), "boost-blog");
  assert.equal(codeFromHash("#code="), null);
  assert.equal(codeFromHash(""), null);
  // The page only ever passes location.hash, which is empty for a ?code= link.
  assert.equal(codeFromHash(new URL("https://liffio.com/claim/js?code=LF-JS-7K2Q-M9XD").hash), null);
});

test("#code= and #t= both stay in the address bar on load", () => {
  assert.equal(stripHashOnLoad("#code=LF-JS-7K2Q-M9XD"), false);
  assert.equal(stripHashOnLoad("#code=boost-blog"), false);
  // In-app browsers hand the current URL to "Open in browser", so the token must survive too.
  assert.equal(stripHashOnLoad("#t=abc.def.ghi"), false);
  // Both together: the whole fragment is kept.
  assert.equal(stripHashOnLoad("#code=boost-blog&t=abc.def.ghi"), false);
  assert.equal(stripHashOnLoad("#t=abc.def.ghi&code=boost-blog"), false);
  // Kept means still readable on the next load, e.g. the same URL opened in a fresh browser.
  assert.equal(tokenFromHash("#code=boost-blog&t=abc.def.ghi"), "abc.def.ghi");
  assert.equal(codeFromHash("#code=boost-blog&t=abc.def.ghi"), "boost-blog");
  // Anything else in the fragment is cleaned as before.
  assert.equal(stripHashOnLoad("#x=1"), true);
  assert.equal(stripHashOnLoad("#code="), true);
  assert.equal(stripHashOnLoad(""), false);
});

test("the code box writes back to #code=, and clearing it drops the fragment", () => {
  assert.equal(codeHash("LF-JS-7K2Q-M9XD"), "#code=LF-JS-7K2Q-M9XD");
  assert.equal(codeHash("BOOST BLOG"), "#code=BOOST%20BLOG");
  assert.equal(codeHash(""), "");
  assert.equal(codeHash("   "), "");
  // What is written is read back the same, so a reopened URL fills the box again.
  assert.equal(codeFromHash(codeHash("LF-JS-7K2Q-M9XD")), "LF-JS-7K2Q-M9XD");
});

test("the hold goes to the app's attach route, and only a uuid counts", () => {
  const id = "0b9d8e2a-4c1f-4e5b-9a7d-2f3c4b5a6e7d";
  assert.equal(partnerClaimPath(id), `/partner-claim?hold=${id}`);
  assert.equal(isHoldId(id), true);
  assert.equal(isHoldId("../../evil"), false);
  assert.equal(isHoldId(null), false);
});

test("the code box takes any partner's code: uppercase, letters, numbers and dashes, ready at 4", () => {
  assert.equal(codeInput("boost30"), "BOOST30");
  assert.equal(codeInput("lf-bd-4h7k-qx2m"), "LF-BD-4H7K-QX2M");
  assert.equal(codeInput("lf 7kq2 m9xd!"), "LF7KQ2M9XD");
  // No longer auto-formatted to one partner's prefix: what is typed is what is shown.
  assert.equal(codeInput("LFBD4H7KQX2M"), "LFBD4H7KQX2M");
  assert.equal(codeReady("ABC"), false);
  assert.equal(codeReady("ABCD"), true);
  assert.equal(codeReady("A-B-C"), false, "dashes don't count");
  assert.equal(codeReady("LF-7KQ2-M9XD-4H2P"), true);
  assert.equal(codeReady("X".repeat(24)), true);
  assert.equal(codeReady("X".repeat(25)), false);
  assert.equal(normalizeCode("lf-bd-4h7k qx2m"), "LFBD4H7KQX2M");
});

test("a found code moves the address to /claim/<slug>#code=<CODE>", () => {
  assert.equal(claimUrlFor("your-partner-slug", "BOOST30"), "/claim/your-partner-slug#code=BOOST30");
  assert.equal(codeFromHash(new URL(`https://liffio.com${claimUrlFor("your-partner-slug", "LFBD4H7KQX2M")}`).hash), "LFBD4H7KQX2M");
});

test("methods replace method: codes when unique or shared is on, links only when signed is", () => {
  assert.equal(takesCodes(["unique"]), true);
  assert.equal(takesCodes(["shared"]), true);
  assert.equal(takesCodes(["signed"]), false);
  assert.equal(takesLinks(["signed", "shared"]), true);
  assert.equal(takesLinks(["unique", "shared"]), false);
});

test("discount words match the server's offer label", () => {
  assert.equal(discountLabel(twentyOff), "20% off");
  assert.equal(discountLabel({ kind: "percent", percentBps: 1250, amountMinor: null, currency: null }), "12.5% off");
  assert.equal(discountLabel({ kind: "amount", percentBps: null, amountMinor: 50000, currency: "INR" }), "₹500 off");
  assert.equal(discountLabel({ kind: "amount", percentBps: null, amountMinor: 500, currency: "USD" }), "$5 off");
  assert.equal(discountLabel(null), "");
});

test("a free offer: Claim 1 month free, and it just stops", () => {
  const c = offerCopy(freeMonth, "Your partner name");
  assert.equal(c.button, "Claim 1 month free");
  assert.deepEqual(c.headline, ["Your ", "free month", " of Liffio is ready."]);
  assert.match(c.lede, /^Your partner name is giving you Liffio Starter free for 1 month\./);
  assert.match(c.lede, /connect your Instagram in the app/);
  assert.equal(c.cardNote, "No card needed. When the month ends, it just stops.");
  const two = offerCopy({ ...freeMonth, duration: { value: 2, unit: "months" } }, "P");
  assert.equal(two.button, "Claim 2 months free");
  assert.deepEqual(two.headline, ["Your ", "2 free months", " of Liffio are ready."]);
  assert.equal(two.cardNote, "No card needed. When the 2 months end, it just stops.");
  assert.equal(offerCopy({ ...freeMonth, duration: { value: 14, unit: "days" } }, "P").button, "Claim 14 days free");
});

test("a discount-only offer: Claim 20% off, on the first payment, only if they pay", () => {
  const c = offerCopy(discountOnly, "Your partner name");
  assert.equal(c.kind, "discount");
  assert.equal(c.button, "Claim 20% off");
  assert.deepEqual(c.headline, ["", "20% off", " your first Liffio payment."]);
  assert.match(c.cardNote, /if you choose to pay/);
});

test("free then discount: the free time first, then the discount on the first payment", () => {
  const c = offerCopy(both, "Your partner name");
  assert.equal(c.kind, "both");
  assert.equal(c.button, "Claim 1 month free");
  assert.match(c.lede, /free for 1 month, then 20% off the first payment if you choose to pay/);
  assert.match(c.cardNote, /When the month ends, it just stops\. Choose to pay after that and you get 20% off the first payment\./);
});

test("no offer copy promises a charge, a price after the free time, or Instagram sign-in", () => {
  for (const o of [freeMonth, discountOnly, both, { ...freeMonth, duration: { value: 3, unit: "days" as const } }]) {
    const c = offerCopy(o, "Your partner name");
    const text = [c.headline.join(""), c.lede, c.cardNote, c.button, ...c.ticks].join(" ");
    assert.doesNotMatch(text, /will be charged|then pay|per month|\/mo|₹\d|\$\d/i, o.label);
    assert.doesNotMatch(text, /sign in with Instagram|log in with Instagram|@Liffio/i, o.label);
    assert.match(text, /[Nn]o card/, o.label);
  }
});

test("a partner logo only from an https URL, a brand colour only as #rrggbb", () => {
  assert.equal(safeLogoUrl("https://files.example/partner-logos/a.png"), "https://files.example/partner-logos/a.png");
  assert.equal(safeLogoUrl("http://files.example/a.png"), null);
  assert.equal(safeLogoUrl("javascript:alert(1)"), null);
  assert.equal(safeLogoUrl(null), null);
  assert.equal(safeBrandColor("#3B3FD8"), "#3B3FD8");
  assert.equal(safeBrandColor("red;background:url(x)"), null);
});

test("a typed code: not found, used, full, closed, expired, each in its place", () => {
  const p = branding();
  assert.deepEqual(codeOutcome({ state: "found" }, p), { kind: "found" });
  assert.deepEqual(codeOutcome({ state: "invalid" }, p), { kind: "box", message: BOX_ERRORS.invalid });
  assert.deepEqual(codeOutcome({ state: "already_claimed" }, p), { kind: "box", message: BOX_ERRORS.used });
  assert.deepEqual(codeOutcome({ state: "ended", reason: "code_limit" }, p), { kind: "box", message: BOX_ERRORS.limit });
  const ended = codeOutcome({ state: "ended" }, p);
  assert.equal(ended.kind === "notice" && ended.notice.title, "This offer is no longer active");
  const expired = codeOutcome({ state: "expired" }, p);
  assert.equal(expired.kind === "notice" && expired.notice.title, "This code has expired");
  const paid = codeOutcome({ state: "already_paid" }, p);
  assert.equal(paid.kind === "notice" && paid.notice.title, "You're already on a paid Liffio plan");
  assert.equal(BOX_ERRORS.invalid, "We couldn't find that code. Check the letters and try again.");
  assert.equal(BOX_ERRORS.tooMany, "Too many tries from this network. Please wait 15 minutes and try again.");
});

test("a signed link's answer: valid shows the offer, the rest a card with the design's copy", () => {
  const p = partner({ methods: ["signed"] });
  assert.equal(linkNotice({ state: "valid", holdId: "x" }, p), null);
  assert.equal(linkNotice({ state: "invalid" }, p)?.title, "This link isn't valid");
  assert.equal(linkNotice({ state: "ended" }, p)?.title, "This offer link is no longer active");
  const expired = linkNotice({ state: "expired" }, p);
  assert.equal(expired?.title, "This link has expired");
  assert.equal(expired?.body, "Links from Your partner name last up to 7 days. Ask them for a new one, or enter a code if you have one.");
  assert.equal(linkNotice({ state: "already_claimed" }, p)?.kind, "claimed");
  assert.equal(linkNotice({ state: "already_paid" }, p)?.kind, "paid");
});

test("a partner page with no link or code: open, paused, full, not started, unknown", () => {
  assert.equal(programNotice(partner()), null);
  assert.equal(programNotice(null)?.title, "We couldn't find this offer");
  assert.equal(programNotice(partner({ programState: "paused" }))?.body, "Your partner name has paused this offer. You can still try another code or sign up normally.");
  assert.equal(programNotice(partner({ programState: "cap_reached" }))?.title, "This offer is no longer active");
  assert.equal(programNotice(partner({ programState: "not_started" }))?.kind, "not_started");
  assert.equal(noticeFor("paid", null).body, "So this offer isn't for you. Your plan keeps running as it is.");
});

test("copy helpers", () => {
  assert.equal(durationLabel({ value: 1, unit: "months" }), "1 month");
  assert.equal(durationLabel({ value: 14, unit: "days" }), "14 days");
});
