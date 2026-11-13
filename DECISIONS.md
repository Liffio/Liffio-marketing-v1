# DECISIONS.md

Judgment calls made during the autonomous SEO implementation pass, 2026-11-13, on branch
`seo/ctr-fixes-nov-2026`. Every item here is a place where the brief, the codebase and the
evidence did not line up, and I had to choose without being able to ask.

---

## D1. The codebase forbids naming competitor prices. The brief requires it.

**Conflict.** `src/lib/blog/posts.ts` carries an explicit editorial rule at the top:

> NEITHER NAMES A COMPETITOR'S PRICE. The India post describes pricing MODELS and never
> attaches a number to a named rival, because a price scraped today is wrong next quarter and a
> wrong price published about a named company is the same defect that put a false negative in
> the Zorcha comparison row. Describe the shape, let the reader check the vendor.

The brief says the opposite: "Every competitor cell in every table must have a real value or an
explicit 'not publicly listed'", and "verify current competitor pricing from their actual
pricing pages".

**Decision: override the rule. Explicitly authorized by the owner on 2026-11-13**, after I
raised the conflict:

> "Override the editorial rule against competitor prices. Include verified competitor pricing in
> comparison pages and the roundup post. Every price must show 'as of November 2026' and link to
> the source pricing page. Add a code comment above each price noting where it was verified
> from, so future updates are easy."

The rule exists to stop *stale and unverified* prices, not prices as such. Four mitigations, the
last three specified by the owner, replace what the blanket ban was doing:

1. Every competitor price is stamped with the date it was checked.
2. Every price carries "as of November 2026" in the visible copy.
3. Every price links to the competitor's own pricing page as its source.
4. A code comment above each price records where it was verified from, so the next refresh is a
   lookup rather than an investigation.
5. Anything that could not be verified reads "not publicly listed", never a guess and never a
   blank.

**The old rule is now stale and should be rewritten, not silently contradicted.** The comment at
the top of `src/lib/blog/posts.ts` still states the ban. I have updated it to describe the new
regime so the next person does not follow a rule the owner has retired.

**Reversible.** The prices live in `src/config/comparisons.config.ts` and the roundup post, not
scattered through page copy, so a future refresh touches a small number of known places.

---

## D2. `/redeem` was deliberately indexable. The brief says noindex it.

**Conflict.** `src/app/redeem/page.tsx` carried a note: *"Indexable, unlike /claim/*: it is the
address on cards, posts and 'Got a code? Redeem' links"* (SPEC 9.4). The audit flagged it as a
High issue: indexable, no H1, thin, and in the sitemap. The brief says noindex it and drop it
from the sitemap.

**Decision: follow the brief.** Set `robots: { index: false, follow: true }` and removed it from
`sitemap.config.ts`.

**Why this is safe:** noindex does not break the URL. Anyone typing `liffio.com/redeem` from a
card or a post still lands on a working page. The only thing lost is discovery through search,
which was never the point of a code-entry box.

**What you lose:** someone searching "liffio redeem code" will not find it. If that traffic
matters, revert the `robots` line and restore the sitemap entry, and give the page a real H1 and
some content instead.

---

## D3. `/register` is now crawlable but not indexable

The agentic audit found `robots.txt` disallowed `/register`, which Claude-User and other
well-behaved agents honour, so an AI agent researching Liffio could not reach sign-up.

**Decision:** removed `/register` from the `robots.txt` disallow list and added
`robots: { index: false, follow: true }` to the page itself. Agents can now reach it; search
engines still will not list it. This is what the brief asked for and it is strictly better than
blocking at the crawler level, which blocks agents and indexing together.

---

## D4. The www duplication needed no code change

The brief asked me to check whether the `www` 308 redirect works and to strengthen it if
possible. `next.config.ts` already enforces it:

```
has: [{ type: "host", value: "www.liffio.com" }]  →  permanent redirect to the apex
```

Combined with absolute self-canonicals on every page, that is already the strongest signal
available in Next.js. The `www` rows in Search Console are historical index entries that will
age out; they are not evidence of a live misconfiguration.

**Decision: no code change.** Documented rather than invented work.

---

## D5. The "Story Auto Reply" feature question is resolved, not open

> **CONFIRMED BY OWNER 2026-11-13.** The backend enum and code support `STORY_REPLY` and
> `STORY_MENTION` triggers. They are defined and functional, just not yet used by customers.
> The marketing claims are accurate and stay.

The audit left this flagged as VERIFY: comparison tables claim story reply automation, and a
code check three months ago found no handler.

**It is resolved by `src/config/feature-flags.ts`, which is explicit:**

> NOTE: story REPLIES and story MENTIONS do ship and are NOT gated.

Only story *reactions* (emoji reactions) are gated, behind `FEATURE_STORY_REACTIONS`, because
`message_reactions` is not subscribed on the backend. The homepage "Story Auto Reply" block and
the "Story reply automation" comparison row are therefore accurate as written.

**Decision: no copy change, and removed from the TODO list.** The flag file is a better source
than a three-month-old audit note.

---

## D6. I did NOT 301 `/vs/superprofile`. The brief's stated reason is factually wrong.

> **CONFIRMED BY OWNER 2026-11-13:** keep `/vs/superprofile`, do not redirect it. SuperProfile
> is a real competitor doing comment-to-DM at ₹499. This decision stands and the TODO is closed.

**The brief says:** "301 redirect /vs/superprofile to /compare. It has zero impressions in 180
days and SuperProfile is a storefront, not a DM automation competitor."

**The second half is not true.** Verified from https://superprofile.bio/instagram-dm-automation
on 2026-11-13, SuperProfile ships:

- comment-to-DM, described step by step ("someone comments LINK on your Reel")
- Meta's official messaging API, and it warns against tools that ask for your password
- story replies, Live comments and inbound DMs as triggers
- keyword triggers with intent matching that fires on typos and Hinglish
- up to 5 Instagram accounts on the Creator plan

It is an all-in-one creator platform *and* a real DM automation tool. The DM product is
first-class, not a bolt-on. It has no chatbot layer, which is a genuine Liffio advantage, but
that is a difference, not a disqualification.

**It also competes directly in Liffio's strongest market.** SuperProfile Creator is
"₹99 for first month, then ₹499" (https://superprofile.bio/in/pricing, 2026-11-13). Liffio
Starter is ₹499. That is a direct head-to-head in the India niche the audit identified as
Liffio's most winnable cluster. Redirecting the page away deletes Liffio's only asset aimed at
that competitor.

**Decision: keep the page and rewrite it like the other four**, with real verified content.

The zero-impressions problem is real, but its cause is the thin duplicate template this pass is
already fixing, not the choice of competitor. The clustering analysis also found that for small
competitor brands, single-vendor pages do rank (6 of 10 results for `zorcha alternative` are
vendor-owned). So the page gets the same treatment as the rest.

**If you still want the redirect**, it is one entry in `next.config.ts` and removing the entry
from `comparisons.config.ts`. I have left it trivially addable rather than doing it on a premise
I can show is false. This is on the TODO list for your call.

---

## D7. InstaChamp: the domain is dead and "DMChamp" never existed

`instachamp.com` now 307-redirects to a GoDaddy "for sale" parking page (checked 2026-11-13).
The product survives inside Customers.ai, the ex-MobileMonkey company, at
https://customers.ai/instachamp, branded "InstaChamp by Customers.ai".

The brief asked me to cover "DMChamp" in the roundup. **No such product exists.** The name
appears nowhere on customers.ai or its product pages. I have not invented an entry for it.

**Pricing reads "not publicly listed as of November 2026"**, which is the honest answer, because
the live page shows the same Platinum plan at both "$19 / month" and "$9.95 / month" behind a
rotating "THIS WEEK!" promo banner, and `customers.ai/pricing` publishes no priced plans at all.

**`/vs/instachamp` stays.** It holds position 8.5 on "champ insta bot" with 55 impressions, and
the page is now more useful than before, since a reader searching for InstaChamp will land on a
dead domain if they go looking themselves.

---

## D8. ManyChat pricing could not be verified, so no ManyChat number is published

**What happened.** `manychat.com/pricing` returns **HTTP 403** to every automated fetch, including
through a real browser engine, which is served a Cloudflare interstitial ("Performing security
verification") that does not clear. The help centre is behind the same wall. This is domain-wide
bot detection, not a login wall and not geo-blocking. I did not attempt to defeat the bot check.

**Decision: publish no ManyChat figure anywhere**, per the brief's own instruction for
unavailable pricing. Every ManyChat price cell now reads "Not publicly listed as of November
2026" and links to `https://manychat.com/pricing` so a reader can check for themselves.

**What I removed, and why it matters.** `/manychat-alternative` was publishing "$14/month +
per-contact fees" and a "free tier caps you at 25 contacts a month" claim, including in its meta
description. Neither could be re-confirmed today. They may well still be correct, but under the
rule you authorized, an unverifiable number about a named company does not ship.

**What I kept.** ManyChat's per-contact pricing MODEL is stated publicly in its own marketing
and in its product UI, and the argument on these pages is about the model rather than the
number. So the pages still explain per-contact billing and why it behaves badly for creators.
That argument never depended on the exact figure.

**TODO for you:** open `manychat.com/pricing` in your own browser, paste what you see, and I will
restore real figures with a verification date. This is the single highest-value gap in the pass.

---

## D9. Three live false claims about competitors, found and fixed

These were already on the site. They are the exact defect class the repo's verification rule was
written to prevent, and they were live while the rule was in force.

1. **`/manychat-alternative` claimed LinkDM has "No free plan".** LinkDM has a permanent free
   plan: 1 Instagram account and 1,000 DMs a month
   (https://www.linkdm.com/pricing, 2026-11-13). This was a false negative published about a
   named competitor.
2. **The same table priced SuperProfile at "From ~$15/month".** Verified pricing is ₹99 for the
   first month then ₹499 in India, and $4.99 then $29/month globally. The figure matched neither
   currency.
3. **`/senddm-alternative` set `publicPricing: false` for LinkDM while printing "From ~$19/month"
   in the same row.** Internally contradictory. LinkDM's pricing is public and Pro is $19/month.

All three are corrected with source URLs and verification dates in code comments above the data.

---

## D10. The `/manychat-alternative` retarget

Per the clustering evidence, this page cannot win "manychat alternative": 0 of roughly 30 top
results are single-vendor pages, and Liffio sits at position 83. It has been retargeted to
switching intent, which is what its `Offer` schema and two-hour migration section were always
built for.

- Title: "Free ManyChat Alternative for Instagram DM Automation | Liffio" becomes
  "ManyChat vs Liffio: Should You Switch? (2026)" (45 characters)
- Meta description now addresses someone who already knows both tools and is deciding.

The roundup format for "manychat alternatives for instagram" lives on
`/blog/manychat-alternatives` instead, which is the SERP Liffio can actually reach.

---

## D11. No YouTube video was embedded, and this is deliberate

> **CONFIRMED BY OWNER 2026-11-13:** skip `VideoObject` schema and video embeds entirely; the
> channel's two short clips are not worth embedding yet. Keep `youtube.com/@liffio` in `sameAs`.
> Verified on the branch: zero `VideoObject` nodes and zero embeds exist, so nothing needed
> removing. The `sameAs` entry is in place.

The brief asked me to embed existing YouTube videos with `VideoObject` schema. The channel
`youtube.com/@liffio` is live (verified 2026-11-13, HTTP 200) and has exactly two videos:

| Video | Verified detail |
|---|---|
| `fTIrhVqmoak` "How influencers uses Liffio" | uploaded 2026-10-27, **10 seconds long**, empty description, and a grammar error in the title |
| `aRhjupugWUA` "5 Things Every Seller Should Ghost This Halloween" | a seasonal Halloween Short, `#shorts #smartphone #tech` |

Neither belongs on an evergreen commercial page. A 10-second Short with a typo in its title,
embedded on the page where someone is deciding whether to trust Liffio with their Instagram
account, costs more credibility than the schema gains. The Halloween Short is off-topic and
expires in relevance every November.

**What I did instead:** added the channel to the Organization `sameAs` array, which is the part
that actually matters for entity resolution. Answer engines can now tie the channel to the
brand, which was the real finding in the GEO audit.

**TODO for you:** two or three genuine product videos (a comment-to-DM setup walkthrough, the
chatbot builder, an agency workspace tour) would fix the media deficit on every answer page at
once. The audit scored multi-modal at 33/100, the lowest of the five GEO dimensions, and that
score is mostly this. When those videos exist, embedding them with `VideoObject` is a small job;
`uploadDate`, `name`, `thumbnailUrl` and `duration` are all retrievable from the watch page.

---

## D12. I got the Private Replies rule wrong, verified it against Meta, and corrected it

I briefed two agents with this claim: "Instagram's Private Replies API allows exactly ONE private
reply per comment, and only within 7 days." Both wrote it into their pages and both flagged that
they could not cross-check it locally. They were right to flag it.

**Verified against Meta's own documentation**
(https://developers.facebook.com/documentation/instagram-platform/private-replies):

- The **7 day window is correct**: "Your app can send this private reply within 7 days of the
  creation time of the comment".
- The one-message limit is real but narrower than I stated: "Only one message can be sent to the
  commenter", which is "to the commenter" rather than "per comment".
- **I omitted the follow-up exception entirely:** "Follow-up messages can only be sent if the
  recipient responds, and must be sent within 24 hours of the response".
- There is also a Live-only rule: private replies to Instagram Live comments can be sent only
  during the broadcast.

**Why this mattered more than a wording slip.** "Exactly one message, full stop" contradicts
Liffio's own product. Follow-up sequences ship and are a paid-plan feature. Published as I
briefed it, the site would have been telling readers that a feature it sells is impossible.

**Fixed in five places** across `/instagram-comment-to-dm` and `/is-instagram-dm-automation-safe`.
Each now states the 7 day private-reply window AND that the conversation reopens when the person
replies, with follow-ups allowed inside 24 hours of that reply.

**Also verified, and it held:** DMs landing in the message requests folder for non-followers is
confirmed by the same docs. "This reply appears in the person's Inbox, if the person follows the
Instagram professional account, or to the Request folder, if they do not." One scope note worth
keeping in mind: the docs describe this for private replies and for conversations a non-follower
starts. They do not describe cold outbound DMs, which the API does not permit anyway.

---

## D13. SendDM: the site had its pricing wrong in both directions

Caught because the Chatfuel agent was honest enough to flag that it had carried the SendDM
figure across from an existing page rather than reading it. I checked https://senddm.ai/pricing
on 2026-11-13.

**What the site said, in many places, dated "as of July 2026":** SendDM prices in INR from
₹399/month, with "India-only billing" and "prices in INR only".

**What the live page actually shows:** no rupee symbol, no "INR", no "rupee" anywhere. USD only.

| Tier | Annual | Monthly |
|---|---|---|
| Free | $0 | $0 |
| (tier above Free) | $9/mo, $105.60 billed yearly | $11/mo |
| Growth | $16/mo, $192 billed yearly | $20/mo |
| (top tier) | $31/mo, $374 billed yearly | $39/mo |

Free plan limits: 300 DMs a month, 100 Ask for Follow, 50 Lead Capture, 5 scheduled posts, 1
Conversation Starter.

**This was wrong in a way that cost Liffio the argument.** The old copy framed "India-only
billing" as a SendDM limitation. In fact SendDM has no rupee pricing at all and Liffio does, so
an Indian buyer pays SendDM in dollars with whatever their card adds. The corrected pages run
that argument the right way round, and lead on the verified 300 DMs a month free cap against
Liffio's unlimited DMs on every plan.

**Not invented:** I could not read the names of SendDM's second and fourth tiers from the
rendered page, so the copy refers to them by price rather than guessing a name.

**The pattern worth noticing.** This is the fourth stale or false competitor fact found in one
pass: LinkDM's "no free plan", SuperProfile's "~$15/month", Chatfuel's entire pricing model, and
now SendDM's currency. Every one was published with confidence and none had a verification date
attached. The date-and-source convention added in this pass is the fix: it makes staleness
visible instead of invisible.

---

## D14. Two configs contradict each other about what chatbots can do. I changed neither.

> **RESOLVED BY OWNER 2026-11-13. This was not a contradiction and not a blocker.** The owner
> checked the backend directly: `package_limits` carries chatbot limits for every plan (Free 2
> bots, Starter 5, Growth 15, Business and Agency unlimited), and `chatbot_trigger_type` supports
> `KEYWORD`, `STORY_REPLY`, `STORY_MENTION`, `DEFAULT_REPLY` and `COMMENT_AUTOMATION`. The
> `feature_flags` table is empty because entitlement runs through `package_limits`, not through
> `feature_flags`. So `pricing-v4.config.ts` and `feature-flags.ts` are two different systems
> rather than two disagreeing ones, and the chatbot marketing claims are accurate. No changes
> required. See D21 for what my conservative reading cost.

`src/config/pricing-v4.config.ts` sells four chatbot capabilities on the pricing page:

| Line | Claim |
|---|---|
| 175 | "**Chatbot lead capture**: answers land straight in your leads list" |
| 176 | "**Webhook step**: send answers to your own system mid chat" |
| 371, 393 | "Conditions" / "Condition rules", 5 on Starter rising to Unlimited |
| 384, 385 | "Lead capture into the leads list", "Webhook step", Business and up |

`src/config/feature-flags.ts` says all three underlying capabilities are missing from the
backend, and gates them off:

- `FEATURE_COLLECT_DATA_PROMPTS`: "no prompting flow exists: email capture is passive extraction
  only, and the Lead entity has an `email` column with no phone or custom-field storage"
- `FEATURE_CRM_INTEGRATION`: "no CRM, no integration provider, and no outbound webhook delivery
  code exists anywhere"
- `FEATURE_BRANCHING_LOGIC`: "There is no step chaining, no conditionals, and no conversation
  state machine"

`pricing-v4.config.ts` contains exactly **one** `FEATURE_` reference in the whole file, so these
rows are not gated by anything.

**Decision: changed neither config, and kept all four claims out of the new pages.**

I am not willing to guess here, in either direction. Deleting rows from the pricing sheet could
remove features that genuinely ship. Repeating them in new marketing copy could advertise
features that do not. So the new pages (agencies, compare, comment-to-DM, safety, the five /vs/
entries) describe chatbots without claiming conditions, webhook steps or in-DM lead capture, and
the existing pricing page is untouched.

**This one needs you, and it is the most consequential open item in the pass.** Either the flags
file is stale and should be updated, or `/pricing` is advertising capabilities that do not ship,
which is a bigger problem than anything else in this report. Two minutes with the backend settles
it.

Note for context: the pricing page was owner-confirmed in October 2026 as the source of truth for
what each plan grants. If that still holds, the flags file is the stale one. I did not assume so,
because the flags file is unusually specific about what is missing and why.

---

## D15. `npm run check:prices` fails, it is pre-existing, and it is worth your attention anyway

> **RESOLVED BY OWNER 2026-11-13: not a real pricing error.** The backend holds Agency yearly
> INR at 22,999,900 paise, which is ₹2,29,999. The roughly ₹9 difference the script reports is a
> rounding artifact of the 17% annual discount arithmetic, not a customer-facing discrepancy. No
> changes required. The script's separate note about `/marketing/plans` now serving "Growth"
> remains a tidy-up, not a defect.

`npm test` passes 117 of 117. The separate `check:prices` guard fails, and I did not cause it:
`src/config/pricing.config.ts` and `src/config/pricing-v4.config.ts` are byte-identical to HEAD.

Every failure is tagged `[rendered]`, which the script itself defines as
`/api/v1/marketing/plans`, served by the backend's `plan_catalog`, with the instruction
"fix it in the Backend". Nothing here is fixable in this repo, so I left it.

**It affects every tier in both currencies, in the same direction:**

| Tier | Rendered annual, per month | Implied year | Catalogue actually charges |
|---|---|---|---|
| Starter | $7 | $84 | $90 |
| Growth | $23 | $276 | $290 |
| Business | $47 | $564 | $590 |
| Agency | $439 | $5,268 | $5,490 |
| Starter INR | ₹399 | ₹4,788 | ₹4,999 |
| Growth INR | ₹1,199 | ₹14,388 | ₹14,999 |
| Business INR | ₹1,999 | ₹23,988 | ₹24,999 |
| Agency INR | ₹18,399 | ₹2,20,788 | ₹2,29,999 |

The waivers on these expired on **2026-09-06**, owner recorded as "backend", so this has been
failing for over two months.

**Why it is worth two minutes of yours.** The site shows an annual per-month figure that, times
twelve, is lower than the amount actually charged. It looks like a rounding convention rather
than anything deliberate, and every row under-quotes rather than over-quotes, so nobody is being
overcharged. But a customer who multiplies the advertised monthly figure and compares it to their
invoice will find a gap, and on Agency INR that gap is ₹9,211.

The script also reports that `/marketing/plans` now serves "Growth", so the static merge that
injects that tier should be removed or it is served twice and checked never.

I am flagging this rather than touching it: it is backend data, outside this pass, and changing a
price without being asked is not a judgment call I should make.

---

## D16. I was wrong about SendDM, and about how vendor pricing pages behave. Reversing D13.

> **ACKNOWLEDGED BY OWNER 2026-11-13:** geo-localized vendor pricing is now a standing rule for
> future verification. No further action on this branch; the corrections are already in.

**D13 said SendDM has no rupee pricing at all. That is false, and I acted on it.**

I read https://senddm.ai/pricing with curl, saw USD, and concluded the site published no INR.
Loading the same URL in a real browser geolocated in India shows rupees:

| Plan | Annual /mo | Monthly | Billed yearly | IG accounts | DM limit |
|---|---|---|---|---|---|
| Free | ₹0 | ₹0 | n/a | 1 | 300/month |
| Creator | ₹399 | ₹499 | ₹4,790 | 5 | Unlimited |
| Growth | ₹719 | ₹899 | ₹8,630 | 10 | Unlimited |
| Scale | ₹1,439 | ₹1,799 | ₹17,270 | 20 | Unlimited |
| Custom | contact sales | | | up to 10 | Custom |

**The site's original "₹399/month" was correct all along.** It is the Creator plan on annual
billing. I removed a true figure and had an agent rewrite roughly fourteen places on a false
premise, including inverting the India argument to say SendDM has no rupee price. That rewrite
has to be undone.

**The root cause is worth more than the individual fix: vendor pricing pages geo-localize, and
every price in this pass before now was read from outside India.** So I re-checked all of them in
the real browser:

| Publishes rupee prices | USD or EUR only |
|---|---|
| Liffio, **SendDM**, **InstantDM**, ReplyRush, SuperProfile, Zorcha | ManyChat, Chatfuel, Metricool, LinkDM, CreatorFlow, Inro |

**Two vendors move, and both were called wrong the same way.** InstantDM was recorded as
"currency selector offers INR but no INR prices are listed". In an Indian browser it shows ₹0,
₹833, ₹1,666 and ₹4,165, plus ₹667 per account per month and ₹79,999 a year for Multi Pro.

**This weakens the India post's central claim.** It currently says 4 of 12 publish rupees. The
real number is 6 of 12, and two of the additions are direct comment-to-DM competitors. Liffio's
India position is still real but it is not scarcity: half this market prices in rupees. The
honest differentiator is the combination of GST invoices, an Indian entity, and flat pricing with
no DM ceiling, not merely "has a rupee price".

**Also corrected:** SendDM's tier names are Free, Creator, Growth, Scale and Custom. Earlier
copy referred to the middle tiers by price because the names could not be read from the
curl-rendered page. And SendDM's paid tiers have **unlimited DMs**, so "unlimited DMs" is not a
Liffio-only differentiator against SendDM either; only its Free tier is capped, at 300 a month.

**Process lesson, recorded so it is not repeated:** curl and headless fetches show the vendor's
default or US view. Any claim about currency, regional pricing or availability has to be read in
a browser in the relevant region. The verification rule should say so.

---

## D17. Dual rate cards: every INR vendor also has an international one, and both now ship

Owner instruction, 2026-11-13: "all also have usd plans like senddm and all so make sure you use
proxy or something too to get international prices as everyone have different prices, 1 indian
and one international, same as we do."

Both views were captured: curl egresses internationally and gives the USD or EUR card, your
Chrome is geolocated in India and gives the rupee card. Verified 2026-11-13.

**SendDM**, tier names identical in both regions:

| Tier | India: annual/mo, monthly, yearly | International: annual/mo, monthly, yearly |
|---|---|---|
| Free | ₹0 | $0 |
| Creator | ₹399, ₹499, ₹4,790 | $9, $11, $105.60 |
| Growth | ₹719, ₹899, ₹8,630 | $16, $20, $192 |
| Scale | ₹1,439, ₹1,799, ₹17,270 | $31, $39, $374 |
| Custom | quote | quote |

**InstantDM**:

| Tier | India | International |
|---|---|---|
| Free | ₹0, 500 DM automations/month | $0 |
| Legend Pro | ₹833/mo billed yearly | $9.99 |
| Trendsetter | ₹1,666/mo billed yearly | $24.99 |
| Trendsetter Pro | ₹4,165/mo billed yearly | $49.99 |
| Multi Pro | ₹667 per account per month, ₹79,999/yr for 10 | $990/yr for 10 |

**A real distinction worth keeping in the copy.** SendDM's rupee price is genuinely cheaper for
India: ₹399 is about $4.75 against its own $9 international rate. InstantDM's is close to a
straight conversion: ₹833 is about $9.90 against $9.99. So "has a rupee price" and "is cheaper in
India" are two different claims, and only the first is true of everyone.

Already dual by design, captured earlier: **ReplyRush** prints both currencies on one page
($0/₹0, $10/₹900, $25/₹2,100, $100/₹8,400). **Zorcha** splits by URL, zorcha.com/pricing for USD
and /in/pricing for INR. **SuperProfile** likewise, /pricing global and /in/pricing for India.

So six of twelve publish rupees and every one of those six also publishes an international card.
Comparison copy should present both rather than picking the currency that flatters Liffio.

---

## D18. I kept three concessions that make Liffio look worse

The last agent flagged these for review rather than shipping them silently. I am keeping all
three, because each one is true and a comparison page that only ever flatters the host is the
kind of page neither Google nor a reader trusts.

1. **SendDM is cheaper per account.** Its Scale tier gives 20 Instagram accounts at ₹1,439 a
   month. Liffio's Agency gives 20 workspaces at ₹22,999. Different products, a per-workspace
   isolation model against a per-account one, but on headline price per account SendDM wins and
   the page now says so.
2. **Unlimited DMs does not separate Liffio from SendDM.** SendDM's paid tiers are unlimited too;
   only its free plan is capped, at 300 a month. The claim survives against ManyChat, Chatfuel,
   LinkDM, CreatorFlow and InstantDM, and it is stated that way now instead of as a blanket
   advantage.
3. **Liffio's own rupee price is close to a conversion, not a discount.** ₹499 against $9 is
   about par, while SendDM's ₹399 against its own $9 is a genuine India discount. The India post
   says this about Liffio directly. What Liffio actually prices for India is the GST invoice and
   the Indian entity, so that is what it now claims.

If you want any of these worded more gently, they are three contained passages. I would not
remove them. The audit found this site publishing four false or stale claims about competitors;
the fastest way to lose the benefit of fixing that is to replace it with selective framing.

## D19. Two rows flipped on the SendDM page, outside the brief

`Bio link pages` and `Post scheduler` were `competitor: false`. SendDM's verified free tier
includes 5 links in bio and 5 scheduled posts a month, so both are now true. This weakens the
page's "narrow scope" argument, which is the correct outcome: the argument was resting on two
false negatives.

## D20. "Webhook step" is still published and still unverified

Related to D14. The phrase appears in a pre-existing comparison row and a Business-plan sentence.
`FEATURE_CRM_INTEGRATION` says no outbound webhook delivery code exists anywhere. I kept the new
copy clear of it and did not touch the existing uses, because removing a sold feature is a
product decision. It belongs in the same two-minute backend check as D14.

---

## D21. Owner resolutions, 2026-11-13, and the one thing they leave on the table

All open questions from this pass were answered by the owner after checking the backend. Recorded
here in full so the branch is self-explaining.

| Item | Resolution |
|---|---|
| Chatbot config "contradiction" (D14) | **Not a contradiction.** `package_limits` drives entitlement; the `feature_flags` table is empty by design. Chatbot claims are accurate. No changes. |
| `check:prices` Agency INR drift (D15) | **Not a pricing error.** Backend holds ₹2,29,999 exactly; the ~₹9 gap is rounding in the 17% annual discount math. No changes. |
| `/vs/superprofile` redirect (D6) | **Confirmed: keep the page.** Do not redirect. SuperProfile is a real comment-to-DM competitor at ₹499. |
| Agency CTA (D-agencies) | **Keep `support@liffio.com`.** No booking or demo page exists yet; swap the CTA when one does. |
| YouTube `VideoObject` (D11) | **Skip embeds and schema.** Two short clips are not worth embedding. Keep `youtube.com/@liffio` in `sameAs`. Verified: zero `VideoObject` nodes and zero embeds on the branch, so nothing needed removing. |
| Geo-localized vendor pricing (D16) | **Noted as a standing rule** for future verification. No action on this branch. |
| `TODO:SCREENSHOT` markers | **Leave in place.** Owner will add real screenshots before deploy. Not blocking. |
| Story reply / story mention (D5) | **Confirmed working.** Backend enum and code support `STORY_REPLY` and `STORY_MENTION`. Claims are accurate and stay. |

### The one thing worth revisiting, which these answers open up

My reading of D14 was conservative, and it had a cost. Believing the chatbot features were
ungated-but-unshipped, I kept three accurate capabilities out of the new pages:

- **Chatbot lead capture**, answers landing in the leads list
- **Webhook step**, sending answers to your own system mid chat
- **Conditions / condition rules**, 5 on Starter rising to unlimited

Now that `package_limits` is confirmed as the real entitlement source, all three are true and
sellable. They are missing from exactly the page that needed them most:
**`/instagram-automation-for-agencies`**, where "send answers to your own system mid chat" is a
direct answer to the agency objection about client reporting, and conditions are what separate a
chatbot from a canned reply.

The owner said no changes needed, so I made none. But this is a real gap I introduced, not a
neutral omission: the highest-value SKU's page under-sells the product by three features. It is a
contained edit to one file whenever you want it. The same applies, less sharply, to `/compare`
and the five `/vs/` entries, whose chatbot rows are honest but thinner than the product.

Logged rather than acted on, because adding feature claims after being told "no changes needed"
is not a call I should make unasked.

---

## D22. The three chatbot features are now on the agency page

Owner authorized this on 2026-11-13 and supplied the backend evidence:

- **Chatbot lead capture**, backed by `chatbot_sessions.lead_id`, a real FK to the leads table
- **Webhook step**, supported by `chatbot_steps` through its `config` jsonb
- **Conditions**, `chatbotConditionRules` in `package_limits`: Starter 5, Growth 15, and no cap
  row for Business or Agency, which is what unlimited means

Added to `/instagram-automation-for-agencies` as a new section, "Chatbots that qualify the lead
before you touch it", placed after client reporting because the webhook step is the piece that
connects to an agency's reporting stack.

**Numbers are read, not typed.** The per-plan table pulls from `V4_FEATURE_CATEGORIES` by row
name, so a plan change moves this page automatically and it cannot drift from the pricing sheet.
I verified the matrix already matches the backend the owner quoted: `Live chatbots` reads
2/5/15/Unlimited/Unlimited and `Condition rules` reads 0/5/15/Unlimited/Unlimited across Free,
Starter, Growth, Business and Agency.

Also added: a `TODO:SCREENSHOT` marker for the chatbot builder showing a condition step with two
branches and a webhook, and an FAQ entry on reaching a CRM mid chat, which feeds the page's
existing FAQ schema. The FAQ interpolates the same config values rather than restating them.

**Framing kept honest.** Lead capture and the webhook step are named as Business and Agency
features rather than implied to be universal, and conditions are credited as starting on Starter,
with Agency removing the ceiling per workspace across all twenty.

---

## D23. Product screenshots: what was captured, and two things I changed

Captured 2026-11-13 from the `thedmguy.ai` test account, which the owner confirmed is safe to
screenshot and publish. Nine images in `public/screenshots/`, wired into all 11 markers (two
images serve two markers each, always on different pages).

**I cropped one image rather than publish a personal email address.** The team settings screen
shows the owner's member row with a real Gmail address. The page it feeds is public and indexed,
so the address would be scraped for spam. `team-roles-and-seats.png` is cropped to 1015x495,
above the members table, keeping the part that matters: invite by email, the role selector,
customize access, and seats used. Nothing about the feature is lost.

**Alt text was rewritten wherever the real screen differed from what the marker assumed**, per
the owner's instruction not to leave blank or broken images:

| Marker assumed | Actually captured |
|---|---|
| Workspace switcher with 20 client workspaces | Workspace settings: name, workspace ID, plan. The test account has one workspace, not twenty. |
| Chatbot builder with a condition step and webhook | The new chatbot template picker. The account has 0 chatbots, so no builder existed to open. |
| Agency branding settings with a hide-branding toggle | Automation delivery settings, which carry the real "Liffio branding" toggle. |
| Instagram's own OAuth authorisation screen | Liffio's Instagram connection panel: connected account, health, token expiry, DM send rate. |
| Keyword field filled with LINK | The live keyword, which is GUIDE. |
| DM composer with a phone preview | The composer as it actually renders: public reply, DM message, button. There is no phone preview. |
| Automation settings with a 30 second delay | The settings that exist: follow gate, branding, chatbot handoff, follow-up sequence. |

**I did not start the Instagram OAuth flow** to capture the authorisation screen. Completing or
abandoning a consent flow on a connected production account risks the token, and the connection
panel is the better screenshot anyway: it shows the account healthy, the token expiry and the
rate limit, which is exactly what the safety page argues.

**One side effect worth knowing:** opening `/automations/new` auto-saved a draft automation
("GUIDE automation", draft saved to cloud). It is a draft on a test account and was never set
live, but it is there if you want it deleted.
