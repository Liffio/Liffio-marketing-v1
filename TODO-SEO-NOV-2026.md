# TODO: items needing your input

From the autonomous SEO pass on 2026-11-13, branch `seo/ctr-fixes-nov-2026`.
Ordered by what blocks the most value. See DECISIONS.md for why each exists.

---

## 1. RESOLVED: ManyChat pricing is verified

Opened `manychat.com/pricing` in your Chrome on 2026-11-13. The Cloudflare interstitial cleared
after about 8 seconds and the page read normally.

| Plan | Monthly | Annual | Active contacts |
|---|---|---|---|
| Free | $0 | n/a | 25 |
| Essential | $14/mo | $168/yr, 18% off | 250 |
| Pro | $29/mo | $348/yr, 25% off | 2,500 |
| Business | $69/mo | $828/yr, 30% off | 7,500 |
| Advanced | $139/mo | $1,668/yr, 30% off | 25,000 |

Per-contact model confirmed in their words: an Active Contact is "a real person you interact
with during a monthly billing period", with "a small overage fee for each additional Active
Contact". 14-day trial on Essential and Pro. No card for Free. No rupee pricing, confirmed on
their India view.

The figures the earlier part of this pass removed as unverifiable turned out to be correct, and
they are restored with a source and a date.

**Nothing needed from you on this one.** Left here for the record.

---

## 1b. Original note, now historical

`manychat.com` returns **HTTP 403** behind a domain-wide Cloudflare bot wall to every automated
request, including through a real browser engine and including the help centre. Not a login wall,
not geo-blocking. I did not attempt to defeat it.

Every ManyChat price cell on the site now reads "Not publicly listed as of November 2026" and
links to their pricing page.

**What I need from you:** open `https://manychat.com/pricing` in your own browser and paste what
you see. Plan names, prices, the contact tiers, and the free-plan cap. I will restore real
figures with a verification date in about ten minutes of work.

**Why it matters:** ManyChat is the competitor the entire roundup is built around, and its
per-contact pricing is the core of Liffio's flat-pricing argument. The argument survives without
the numbers, because it is about the model. It lands harder with them.

**Previously published and now removed:** "$14/month + per-contact fees" and "free tier caps you
at 25 contacts a month". Both may still be correct. Neither could be re-verified, so under the
rule you authorized they do not ship.

---

## 2. Product screenshots

Every answer page currently has exactly two images and both are the logo. The GEO audit scored
multi-modal **33/100**, the lowest of its five dimensions, and this is most of that score.

Every place a screenshot belongs is marked in the code in a greppable form, with descriptive alt
text already written:

```bash
grep -rn "TODO:SCREENSHOT" src/
```

Drop the images in, replace the marker with a real `<Image>`, and keep the alt text that is
already there. It was written to describe the specific thing the shot should show.

---

## 3. YouTube: the channel needs real product videos

`youtube.com/@liffio` is live and is now in the Organization `sameAs`, which was the part that
mattered for entity resolution.

But it holds only two videos: a 10-second Short with an empty description and a grammar error in
its title ("How influencers **uses** Liffio"), and a seasonal Halloween Short. I deliberately
embedded neither. See DECISIONS.md D11.

**What would help:** two or three genuine product videos, such as a comment-to-DM setup
walkthrough, the chatbot builder, and an agency workspace tour. Those fix the media deficit on
every answer page at once, and embedding them with `VideoObject` afterwards is a small job.

Also worth 30 seconds: fix the title typo on `fTIrhVqmoak`.

---

## 4. `/vs/superprofile`: I did not redirect it, and you should confirm

The brief said to 301 it to `/compare` because "SuperProfile is a storefront, not a DM
automation competitor". **That is not true**, and I verified it:
SuperProfile does comment-to-DM, story replies, Live comment triggers and keyword intent
matching that handles typos and Hinglish, on Meta's official messaging API, with up to 5
Instagram accounts on its Creator plan.

It also competes directly in Liffio's best market: ₹99 first month then ₹499, against Liffio
Starter at ₹499.

So I kept the page and rewrote it like the other four. **If you still want the redirect**, it is
one entry in `next.config.ts` plus removing the entry from `comparisons.config.ts`. Your call,
and it stays easy either way.

---

## 5. Agency contact route

The agency page CTA should not be "Get Started Free", because nobody evaluating a 20-account
₹22,999 plan converts on a free-tier button. There is no sales or demo route in the codebase to
point at.

**What I need:** either a real route (a booking link, a sales email alias, a contact form) or a
decision to keep pointing at `/pricing` with agency framing. I did not invent a `/demo` route.

---

## 6. Verified but worth your eyes

**Competitor claims are now dated and sourced.** Every competitor price on the site carries "as
of November 2026", links to the vendor's own pricing page, and has a code comment above it
recording where and when it was verified. Refreshing them later is a lookup, not an
investigation.

**Three false claims were live and are now fixed** (DECISIONS.md D9):
- `/manychat-alternative` claimed LinkDM has "No free plan". LinkDM has a permanent free plan.
- The same table priced SuperProfile at "~$15/month", which matched neither its INR nor its USD
  pricing.
- `/senddm-alternative` marked LinkDM's pricing as non-public while printing a price for it.

**Chatfuel's pricing had changed substantially** since the page was written in July 2026. It no
longer has a free plan at all, and the "$49/month AI PRO" tier the page was built around is gone.
Corrected against the live ladder.

**InstaChamp's domain is dead.** `instachamp.com` now redirects to a GoDaddy for-sale parking
page; the product lives inside Customers.ai. "DMChamp", which the brief asked me to cover, does
not exist as a product and I did not invent an entry for it.

---

## 7. Feature claims: nothing is unverified

The brief asked me to mark unverifiable features with `unverified` comments. **There are none to
mark.** `src/config/feature-flags.ts` turned out to be an unusually good source: it gates data
rather than presentation, and documents exactly what ships and what does not.

That also settles the question the audit left open. Story **replies** and story **mentions** ship
and are not gated, so the "Story Auto Reply" copy is accurate. Only story **reactions** are
gated, because `message_reactions` is not subscribed on the backend.

Nothing was written that claims a gated feature: story reactions, welcome DM, comment @mention
triggers, branching logic, in-DM data prompting, CRM integrations, and sale or revenue tracking
all stayed out of the new copy.

---

## 8. URGENT: two configs disagree about chatbot features

`pricing-v4.config.ts` sells **Chatbot lead capture**, **Webhook step** and **Conditions /
Condition rules** on the pricing page. `feature-flags.ts` states that none of the three has
backend support and gates them off. The pricing sheet has exactly one flag reference in the whole
file, so those rows are ungated.

Either the flags file is stale, or `/pricing` is advertising capabilities that do not ship.

I changed neither file and kept all three claims out of every new page. See DECISIONS.md D14.
This is the most consequential open item in the pass and it needs two minutes with the backend.

---

## 9. `check:prices` has been failing since September (backend, pre-existing)

Not caused by this pass; `pricing.config.ts` is unchanged. Every tier in both currencies shows an
annual per-month price that, times twelve, under-quotes what the catalogue charges. On Agency INR
the gap is ₹9,211 a year. Waivers expired 2026-09-06, owner "backend". See DECISIONS.md D15.

Also reported by the same script: `/marketing/plans` now serves "Growth", so the static merge
injecting that tier should be dropped or the tier is served twice and validated never.

---

## 10. Vendor pricing pages geo-localize. Read them in an Indian browser.

The single most useful thing learned in this pass. curl, WebFetch and headless engines all show
a vendor's default or US view. Loading the same URL in your Chrome, geolocated in India, changes
what several of them display.

Verified 2026-11-13 in your browser:

| Publishes rupee prices | USD or EUR only |
|---|---|
| Liffio, **SendDM**, **InstantDM**, ReplyRush, SuperProfile, Zorcha | ManyChat, Chatfuel, Metricool, LinkDM, CreatorFlow, Inro |

**Two consequences you should know about:**

1. **SendDM's "₹399/month" was right all along.** It is the Creator plan on annual billing
   (₹499 monthly). I removed it as unverifiable and inverted the argument around it. That is
   being undone. See DECISIONS.md D16.
2. **The India post's headline claim is too strong.** It says 4 of 12 publish rupees. It is 6 of
   12, and two of the additions are direct comment-to-DM rivals. Liffio's India position is real
   but it is not scarcity. The honest differentiator is GST invoices plus an Indian entity plus
   flat pricing with no DM ceiling, not simply having a rupee price.

**For future refreshes:** any claim about currency, regional pricing or availability has to be
read in a browser in the relevant region. A curl result is not evidence about what an Indian
customer sees.
