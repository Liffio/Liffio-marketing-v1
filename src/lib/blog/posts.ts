import { FEATURE_STORY_REACTIONS, FEATURE_WELCOME_DM } from "@/config/feature-flags";

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  gradient: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq?: { question: string; answer: string }[];
  references?: { label: string; url: string }[];
};

/*
 * 🔴 COMPETITOR PRICING RULE, REVISED 2026-11-13 (owner-authorized, see
 * DECISIONS.md D1). The previous rule banned naming a competitor's price
 * outright. That ban is RETIRED. Posts may now name competitor prices, under
 * conditions that address the defect the ban existed to prevent, which was a
 * stale or unverified number published about a named company:
 *
 *   1. The price must be read from the competitor's own live pricing page
 *      before it is written. Never from memory, never from another article.
 *   2. The visible copy must carry "as of November 2026" (or the month it was
 *      actually checked).
 *   3. The visible copy must link to the source pricing page.
 *   4. A code comment above the value must record where and when it was
 *      verified, so the next refresh is a lookup and not an investigation.
 *   5. If a price is behind a login, geo-blocked or absent, the cell reads
 *      "not publicly listed". Never a guess, never a blank, never a dash.
 *   6. A bot wall is NOT the same thing as an unlisted price. Some vendors
 *      (manychat.com is one) block automated fetching while publishing their
 *      prices openly to anyone with a browser: curl, WebFetch and headless
 *      engines get HTTP 403, a real browser gets the page. Read it in a real
 *      browser and publish the figures; do not file a published price under
 *      "not publicly listed" because a fetch tool was refused.
 *   7. 🔴 VENDOR PRICING PAGES GEO-LOCALIZE, so currency and regional claims
 *      must be read in a browser located in the relevant region. A curl result
 *      shows the vendor's DEFAULT or US view and is not evidence about what an
 *      Indian customer sees. "This vendor publishes no rupee price" is a claim
 *      about what an Indian browser session renders, and nothing else can
 *      source it. senddm.ai is the worked example: read with curl it looks
 *      dollar-only, and an earlier pass published exactly that across roughly
 *      fourteen places. Loaded in India it shows a full rupee rate card.
 *      Where a vendor has two rate cards, print BOTH with the region named,
 *      never the one that flatters Liffio. Format: "₹399/month in India, or
 *      $9/month internationally, both on annual billing, as of November 2026".
 *
 * A number that cannot satisfy all seven does not get published. Describing the
 * pricing MODEL (flat, per-contact, per-message plus add-ons) is still the
 * better move whenever the exact figure is not the point.
 *
 * Liffio's own figures come from src/config/pricing.config.ts and must not be
 * retyped from memory when they move.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "instagram-dm-automation-pricing-india",
    category: "Pricing",
    title: "Instagram DM Automation Pricing in India (2026)",
    excerpt:
      "What Instagram DM automation actually costs in India, which tools discount for India rather than just converting, what GST and a tax invoice change about the comparison, and why the sticker price is rarely what you pay.",
    readTime: "12 min read",
    date: "October 21, 2026",
    author: "Liffio Team",
    publishedAt: "2026-10-21",
    /*
      Competitor prices in this post were read from each vendor's own live
      pricing page on 2026-11-13. See the per-figure comments below for the
      exact source URL against each number, and the `references` list for the
      links the post renders under its Sources heading.
    */
    updatedAt: "2026-11-13",
    gradient: "from-orange-500 to-rose-600",
    sections: [
      {
        heading: "The sticker price is not the price",
        paragraphs: [
          "Shopping for Instagram DM automation in India is confusing for a reason that has nothing to do with the rupee amount on the pricing page. Three pricing models are competing in this market, and they produce wildly different bills from similar-looking headline numbers.",
          "The first is flat monthly pricing: you pay a fixed amount and the usage is included. The second is per-contact pricing, where the bill is driven by how many unique people your automations messaged that month. The third, common among platforms that sell Instagram alongside WhatsApp, is a base plan plus per-message charges plus paid add-ons. Only the first lets you know in advance what you will pay. The other two are priced on things you want more of, which is an odd thing to agree to when the point of the tool is handling more conversations.",
          "Everything priced below was read from the vendor's own pricing page on 13 November 2026, and every one of those pages is linked under Sources at the end. Nothing is copied from another comparison article. Where a vendor does not publish a price, this post says so instead of guessing.",
        ],
      },
      {
        heading: "A rupee price is not the differentiator",
        paragraphs: [
          /* 🔴 Read rule 7 at the top of this file before touching this section.
             Vendor pricing pages geo-localize. An earlier version of this post
             said four of twelve publish rupees, because senddm.ai and
             instantdm.com were read with curl. Both publish full rupee rate
             cards when loaded in an India-geolocated browser. The real count,
             verified 2026-11-13, is SIX of twelve. Do not revert it. */
          "Twelve Instagram DM automation tools were checked on 13 November 2026. Six publish a price in rupees: Liffio, SendDM, InstantDM, ReplyRush, SuperProfile and Zorcha. That is half the market, so if you came here expecting \"has an INR price\" to narrow the field down to one or two tools, it does not. It is table stakes now.",
          "There is a catch worth knowing before you read any of those numbers, because it caught us. These pricing pages geo-localize. Fetch senddm.ai/pricing from a server outside India and it serves dollars; load it on a connection in India and it serves a full rupee rate card with the same tier names. So a currency claim is only as good as where the browser was sitting. Every rupee figure below was read on an Indian connection, and every dollar figure alongside it was read on the international view of the same page.",
          /* https://instantdm.com/pricing, verified 2026-11-13 in BOTH views:
             curl for the international card, an India-geolocated browser for the
             rupee card. An earlier pass claimed the INR selector showed no INR
             prices. False: there is a full rupee card.
             India: Free ₹0 (500 DM automations/mo), Legend Pro ₹833/mo billed
             yearly, Trendsetter ₹1,666/mo billed yearly, Trendsetter Pro
             ₹4,165/mo billed yearly, Multi Pro ₹667 per account per month or
             ₹79,999/yr for 10 accounts. Multi Starter not captured in INR.
             International: Free $0, Legend Pro $9.99/mo billed yearly,
             Trendsetter $24.99, Trendsetter Pro $49.99, Multi Pro $990/yr for
             10 accounts, Multi Starter $160/yr for 3 accounts. */
          "InstantDM is one of the two we had wrong. Its pricing page does carry a USD and INR selector, and switched to INR on an Indian connection it prints real amounts as of November 2026 (instantdm.com/pricing): Free at ₹0 with 500 DM automations a month, Legend Pro at ₹833 a month billed yearly, Trendsetter at ₹1,666, Trendsetter Pro at ₹4,165, and Multi Pro at ₹667 per account per month or ₹79,999 a year for ten accounts. Internationally the same ladder is $0, $9.99, $24.99 and $49.99 a month billed yearly, with Multi Pro at $990 a year for ten accounts and a Multi Starter at $160 a year for three.",
          /* https://senddm.ai/pricing, verified 2026-11-13 in BOTH views: curl
             for the international card, an India-geolocated browser for the
             rupee card. Tier names identical in both regions.
             India, annual per month / monthly / billed yearly: Free ₹0;
             Creator ₹399/₹499/₹4,790; Growth ₹719/₹899/₹8,630; Scale
             ₹1,439/₹1,799/₹17,270; Custom quote.
             International: Free $0; Creator $9/$11/$105.60; Growth
             $16/$20/$192; Scale $31/$39/$374; Custom quote.
             Free caps at 300 DMs/month; every PAID tier is unlimited. */
          "SendDM is the other, and it is the one that matters most here, because it is a direct comment-to-DM rival rather than an adjacent product. Its rupee card as of November 2026 (senddm.ai/pricing) runs Free at ₹0, Creator at ₹399 a month on annual billing, Growth at ₹719 and Scale at ₹1,439, with the same tiers at $9, $16 and $31 internationally. Its free plan caps at 300 automated DMs a month; every paid tier is unlimited.",
          /* chatfuel.com/pricing, linkdm.com/pricing, creatorflow.so/pricing, metricool.com/pricing, inro.social/pricing: all verified 2026-11-13, no INR on any. */
          "Everyone else quotes dollars or euros. Chatfuel is USD only (chatfuel.com/pricing), as are LinkDM (linkdm.com/pricing) and CreatorFlow (creatorflow.so/pricing). Metricool quotes dollars and euros (metricool.com/pricing). Inro quotes euros (inro.social/pricing). All as of November 2026.",
          /* https://manychat.com/pricing, verified 2026-11-13 in a real browser. manychat.com blocks automated fetching (domain-wide Cloudflare bot check: HTTP 403 to curl, WebFetch and headless engines; the interstitial clears after ~8s in a real browser), so refresh these figures in a real browser, never with curl. Ladder: Free $0 / 25 active contacts, Essential $14/mo ($168/yr), Pro $29/mo ($348/yr), Business $69/mo ($828/yr), Advanced $139/mo ($1,668/yr), capped at 250 / 2,500 / 7,500 / 25,000 active contacts. https://manychat.com/pricing?country=IN still rendered $29/mo with no rupee symbol: USD only, no INR published. Do NOT write "bills Indian users in USD"; the page does not say that. */
          "ManyChat is the clearest case of the gap, because it publishes a full price ladder and not one rupee in it. As of November 2026 its pricing page lists Free at $0 for 25 active contacts, Essential at $14 a month for 250, Pro at $29 for 2,500, Business at $69 for 7,500 and Advanced at $139 for 25,000, with annual billing at $168, $348, $828 and $1,668 (manychat.com/pricing). Loading that page with the billing country set to India changes nothing: it still shows $29 a month, with no rupee symbol anywhere on it. So the page shows US dollars only and publishes no rupee price, which is exactly the problem this post is about. The bill is also indexed to contacts rather than fixed, so it moves with your reach.",
          "So where does that leave the India argument? Not on currency. Two of the six rupee publishers are Indian companies: Zorcha is Zorcha Software Pvt Ltd, and Liffio is Liffio Private Limited, registered in Vadodara. That matters less for the price itself than for the invoice, which is a section of its own below. And there is a sharper distinction than \"prices in rupees\", covered further down: whether the rupee price is a genuine discount for this market or just the dollar price run through a converter. Those are different decisions by a vendor, and only some of them make the second one.",
        ],
      },
      {
        heading: "The six rupee price lists, side by side",
        paragraphs: [
          "One row per tool that publishes in rupees, with its international price alongside so you can see which vendors set a separate India price and which just converted. Every figure was read from the vendor's own pricing page on 13 November 2026, the rupee ones on an Indian connection, and every page is linked under Sources.",
          /* src/config/pricing.config.ts indiaPricingPlans and pricingPlans,
             read 2026-11-13. GST-inclusive per Terms 7.3. Do not retype. */
          "Liffio: Free ₹0, Starter ₹499, Growth ₹1,499, Business ₹2,499, Agency ₹22,999 a month in India, GST included, against $0, $9, $29, $59 and $549 internationally, as of November 2026. Flat rate: automated DMs and contacts are not metered on any tier, Free included. Annual billing charges ten months instead of twelve.",
          /* https://senddm.ai/pricing, verified 2026-11-13 in both regional
             views. Annual per month, then monthly. Free caps at 300 DMs/month;
             paid tiers UNLIMITED. Accounts: 1 free, then 5 / 10 / 20. */
          "SendDM: Free ₹0, Creator ₹399, Growth ₹719, Scale ₹1,439 a month on annual billing in India, or ₹499, ₹899 and ₹1,799 month to month, against $0, $9, $16 and $31 annual and $11, $20 and $39 monthly internationally, as of November 2026. Above Scale is a custom quote. Free caps at 300 automated DMs a month with one Instagram account; the paid tiers are unlimited on DMs and cover 5, 10 and 20 accounts. It also meters AI credits at 2,000, 10,000 and 25,000 a month.",
          /* https://instantdm.com/pricing, verified 2026-11-13 in both regional
             views. Annual billing only on the paid tiers. Multi Starter was not
             captured in INR, so it is quoted in USD only. */
          "InstantDM: Free ₹0 with 500 DM automations a month, Legend Pro ₹833 a month billed yearly, Trendsetter ₹1,666, Trendsetter Pro ₹4,165, and Multi Pro ₹667 per account per month or ₹79,999 a year for ten accounts, against $0, $9.99, $24.99, $49.99 and $990 a year for ten accounts internationally, all as of November 2026. A Multi Starter at $160 a year for three accounts appears on the international card; we did not capture a rupee figure for it.",
          /* zorcha.com/in/pricing/ and zorcha.com/pricing/, verified 2026-11-13. */
          "Zorcha: Free ₹0, Pro ₹1,199, Ultimate ₹2,999, Business ₹8,999 a month in India, or ₹799, ₹1,999 and ₹5,999 a month on annual billing, against $0, $14.99, $39.99 and $109.99 monthly internationally, as of November 2026. Automations, DMs and contacts are unlimited on every tier including Free. What it meters instead is AI: credits of 15K, 150K, 1.5M and 7.5M by tier, and AI FAQs capped at 20, 40, 80 and 80.",
          /* replyrush.com/pricing, verified 2026-11-13. Monthly billing only, no
             annual option published. Both currencies print on ONE page. */
          "ReplyRush: Free ₹0, Lite ₹900, Boost ₹2,100, MAX ₹8,400 a month, against $0, $10, $25 and $100, monthly billing only, as of November 2026. It prints both currencies on the same page rather than geo-switching. The axis here is DM caps: 1,500, 7,500, 40,000 and 400,000 a month, with 1, 1, 3 and 5 Instagram accounts. No AI chatbot.",
          /* superprofile.bio/in/pricing and superprofile.bio/pricing, verified 2026-11-13. Annual pricing not published on either. */
          "SuperProfile: Starter free, Creator ₹99 for the first month and then ₹499, Pro on request, against a free Starter and a global Creator at $4.99 for the first month and then $29 a month, as of November 2026. Annual prices are not listed on either page. It is a real comment-to-DM tool, with story replies, Live comment triggers and keyword matching the vendor says handles typos and Hinglish, wrapped inside an all-in-one creator storefront. There is no chatbot layer: the DM is triggered, not conversational.",
          "The other six: ManyChat, Chatfuel, Metricool, LinkDM, CreatorFlow and Inro publish no rupee price, each re-checked in an Indian browser on 13 November 2026. To compare those honestly, convert at your card's actual rate and add your issuer's cross-border markup, rather than comparing against the dollar sticker.",
        ],
      },
      {
        heading: "Why per-contact pricing behaves badly for creators",
        paragraphs: [
          "Per-contact billing counts unique people reached, usually resetting monthly. That sounds proportionate until you notice what it is indexed to: reach. The best thing that can happen to a creator is a Reel that finds twenty thousand people who have never heard of them. Under per-contact pricing, that is also the thing that moves the invoice.",
          "The practical result is a decision nobody should have to make. A post performs, the comments arrive, and instead of serving the people asking you are working out which tier you are about to cross. Some people turn the automation off halfway through a campaign, which means switching off the thing answering their customers because answering them costs money.",
          /* inro.social/pricing, verified 2026-11-13: Free is 100 activated contacts/month; Pro bills on contacts activated that month. */
          /* manychat.com/pricing, verified 2026-11-13 in a real browser; see the source comment in the rupee-price section above for the full ladder and the fetch-blocking note. */
          "Two tools here are openly on that model, and both publish the caps. ManyChat prices by Active Contact, which it defines as one real person your automations interacted with during a monthly billing period, counted once for that month: 25 of them on the free plan, 250 on Essential at $14 a month, 2,500 on Pro at $29, 7,500 on Business at $69 and 25,000 on Advanced at $139, all as of November 2026 (manychat.com/pricing). Crossing a cap does not switch your automations off, it adds a small overage fee for each extra Active Contact, and annual plans still count contacts monthly and bill the overage monthly. Inro is on the same model: its free tier allows 100 activated contacts a month, and Pro, from EUR 12.99 a month as of November 2026 (inro.social/pricing), bills on the contacts you activate that month.",
          "So ask one question of every tool: does the price change if a post does ten times better than planned? That single answer separates the models faster than any feature table.",
        ],
      },
      {
        heading: "The add-on trap on base-plus-usage plans",
        paragraphs: [
          "The third model catches Indian buyers most often, because the headline number genuinely is low. A base plan looks affordable, then keyword automation turns out to be a separate paid module, the AI assistant is another line, extra seats are priced per user, and messages are billed per delivery on top.",
          /* metricool.com/pricing/ (note: /prices/ 404s), verified 2026-11-13. Flows add-on $12/EUR 10 per month for 2,500 executions; Flows absent from the Free plan's feature list. */
          "Metricool is the cleanest illustration, and not because it is doing anything underhand. Starter is $20 a month on annual billing or $25 monthly for up to 5 brands, and Advanced is $53 annual or $67 monthly for 15 brands, as of November 2026 (metricool.com/pricing). But comment-to-DM lives in the Flows add-on, an extra $12 or EUR 10 a month for 2,500 executions, and Flows is not available on the Free plan at all. Comparing Metricool's $20 against another tool's $20 overstates the parity by exactly the price of the add-on you came for.",
          /* chatfuel.com/pricing, verified 2026-11-13: no free plan, trial only; per-bot plus metered credits; unused credits do not roll over. */
          "Chatfuel is the metered-credit version of the same shape. Business S is US$18 a month billed yearly, US$216 a year, or US$20 monthly, as of November 2026 (chatfuel.com/pricing). There is no free plan, only a trial. AI replies, WhatsApp templates and lead events all draw down credits, and unused credits do not roll over.",
          "There is nothing dishonest about any of that, as long as you add it up before you commit. The mistake is comparing a base plan against an all-in plan and concluding the base plan is cheaper. Write down the four numbers you will actually pay each month: base, the add-on that unlocks the automation you came for, seats, and expected volume. If basic keyword automation is not in the plan you are quoting, you are not quoting the price of the product you want.",
        ],
      },
      {
        heading: "What Liffio costs in India",
        paragraphs: [
          /* src/config/pricing.config.ts indiaPricingPlans, read 2026-11-13. Do not retype these from memory. */
          "Liffio prices flat, in rupees, through Razorpay. Free is ₹0, Starter ₹499 a month, Growth ₹1,499, Business ₹2,499, and Agency ₹22,999. Annual billing charges ten months instead of twelve, so two months are free.",
          "Automated DMs are not metered on any of those plans, Free included, and there is no per-contact fee. What the plan decides is how many automation workflows you can run at once: 3 on Free, 50 on Starter, and unlimited on Growth, Business and Agency. Free also includes 2 live chatbots. Liffio is a Verified Meta Tech Provider with its App Review submission approved, and connects through Instagram Login, so you authorise on Instagram's own consent screen and never hand over a password.",
          "Rupee prices include GST, so the amount shown is the amount charged, and a GST tax invoice is issued for every payment.",
          "Two honest caveats, because unmetered DMs are the main reason Indian buyers pick Liffio and the claim is not unique. Zorcha gives unlimited DMs on every tier including its free one, and publishes rupee prices, so against Zorcha it is a straight tie. SendDM gives unlimited DMs on every paid tier too, and publishes rupee prices, so against SendDM the only DM-volume difference is the free plan, where SendDM stops at 300 a month and Liffio stops nowhere. Anyone telling you that unlimited DMs is what separates Liffio from SendDM has not read SendDM's pricing page.",
          "What does separate them, in India specifically, is the combination rather than any single line: a rupee price list, a GST tax invoice from an Indian entity, no DM ceiling on any plan including Free, and chatbots as their own module. The decision against Zorcha and SendDM moves to AI metering, the chatbot layer, workflow limits, the invoice and support, not to scarcity.",
        ],
      },
      {
        heading: "GST, tax invoices and what your CA will ask for",
        paragraphs: [
          "Two different things get called GST in a pricing conversation, and only one of them is about the price.",
          "The first is whether the rupee figure on the page is the figure that leaves your account. On Liffio, rupee prices include GST, so ₹499 is ₹499. That is not universal: some platforms quote rupees excluding GST and add it at checkout, which means a ₹900 plan bills at more than ₹900. Read the line under the price, not just the price.",
          "The second is the invoice, and this is the part that costs people money later. A GST tax invoice from an Indian supplier, carrying a GSTIN, is what your accountant needs in order to claim input tax credit on the subscription. Liffio issues one for every payment. A tool that bills you in dollars from abroad does not.",
          "For a GST-registered business, buying software from a foreign vendor is an import of service and is treated differently from a domestic invoice: in most cases the liability sits with you under the reverse charge mechanism and has to be reported as such. That is not impossible, it is paperwork, and it is paperwork you pay someone to do. Confirm the treatment with your CA rather than with a blog post, including this one.",
          "If you are an unregistered individual creator, none of that reaches you and you can go back to comparing numbers. If you have a GSTIN, the invoice is part of the price, and a ₹499 domestic plan with a tax invoice is not the same purchase as a $9 foreign one at a similar converted cost.",
        ],
      },
      {
        heading: "Paying in dollars versus paying in rupees",
        paragraphs: [
          "Plenty of good tools in this category only bill in USD. If you are an individual creator that is mostly a nuisance: your card issuer adds a cross-border markup, the amount moves with the exchange rate, and you cannot predict the rupee figure that hits the statement. Indian cards also handle recurring international charges badly, because auto-debit runs through an e-mandate and renewals on foreign subscriptions fail more often than domestic ones, usually at the least convenient moment.",
          /* superprofile.bio/in/pricing and superprofile.bio/pricing, both verified 2026-11-13. The two Creator prices are not conversions of each other. */
          "There is one more reason to care, and SuperProfile illustrates it cleanly. Its Indian Creator plan is ₹99 for the first month and then ₹499, while its global Creator plan is $4.99 for the first month and then $29 a month, both as of November 2026. Those two numbers are not conversions of each other. A vendor that prices India separately has made a decision about this market. A vendor that bills one global dollar price is charging Indian creators a price that was set for American ones.",
          /* 🔴 This is the sharper claim that replaced the old "only four tools
             publish rupees" framing. Both figures verified 2026-11-13:
             senddm.ai/pricing (₹399 vs $9, roughly $4.75 equivalent) and
             instantdm.com/pricing (₹833 vs $9.99, roughly $9.90 equivalent).
             "Prices in rupees" and "is actually cheaper in India" are different
             claims. Keep them separate. */
          "And this is the distinction that actually survives scrutiny, now that half the market prints rupees. Publishing a rupee price and discounting for India are two different decisions. SendDM genuinely discounts: its Creator tier is ₹399 a month in India against $9 internationally, which works out to roughly $4.75, so an Indian buyer pays about half. InstantDM is close to a straight conversion: ₹833 against $9.99 is roughly $9.90, the same price in different clothes. Both publish in rupees. Only one of them priced this market.",
          "So ask the two questions separately. Is there a rupee price, and is that rupee price actually lower than the dollar one? A tool can answer yes to the first and no to the second, and plenty do. Liffio's own answer, for what it is worth: ₹499 against $9 is close to a conversion, and what Liffio prices for India is the invoice and the entity rather than a discount on the sticker.",
          "None of this makes INR billing a better product. Chatfuel, LinkDM, CreatorFlow, Metricool and Inro are all real tools and some do things the rupee-priced ones do not. It makes the comparison not like for like, and the rupee figure you should compare against is the one including the markup, not the converted sticker.",
        ],
      },
      {
        heading: "What this costs a creator, a shop and an agency",
        paragraphs: [
          "Run the numbers on the month you hope for, not the month you expect. A Reel that reaches 200,000 people and turns 2 percent of them into trigger comments is 4,000 comments and 4,000 DMs in a few days. On a tool capped at 1,500 DMs a month you stopped answering buyers before lunch on day one. On a per-contact plan you crossed a tier. On a flat plan with unmetered DMs nothing happened to the bill. Same Reel, three different invoices.",
          "For a shop doing 30 to 50 price comments a day, every free tier in this market is enough on raw volume. What will bite is how many automation workflows you can keep running at once, because a shop wants one keyword per product, not one keyword per shop. On Liffio that is 3 at a time on Free and 50 on Starter at ₹499 a month.",
          "For an agency the cost driver is accounts, not messages. Price the number of Instagram accounts you must connect before you look at a single feature, and be ready for the answers to be far apart. As of November 2026: SendDM's Scale tier covers 20 accounts at ₹1,439 a month on annual billing, InstantDM's Multi Pro covers ten at ₹79,999 a year, ReplyRush covers 5 accounts at ₹8,400 a month, LinkDM covers 10 at $99 a month, and Liffio's Agency plan is 20 workspaces at ₹22,999 a month. On headline price per account SendDM wins that list outright, and we are not going to pretend otherwise. What differs is what an account gets you: a Liffio workspace is a full Business workspace with chatbots, isolated per client, on one GST invoice. Price the shape you need, not the row that looks cheapest.",
          "One requirement is specific to India and almost no pricing page mentions it: people comment in Hinglish and they misspell. Price, priice, prize, kitna, price kya hai. If keyword matching is exact-match only you will miss real buyers who raised their hand. Liffio matches on contains, so GUIDE also catches \"guide please\", though contains matching does not fix a misspelling. SuperProfile states that its keyword intent matching handles typos and Hinglish. Ask any other vendor directly, because the pricing page will not tell you.",
        ],
      },
      {
        heading: "A short checklist before you pay anyone",
        paragraphs: [
          "Is keyword comment-to-DM in the plan you are pricing, or is it a paid add-on?",
          "Does the bill change with reach, with messages sent, or not at all?",
          "Are seats included, and how many do you actually need?",
          "Is the price in rupees, and does it include GST with a tax invoice carrying a GSTIN?",
          "If it is in rupees, is that rupee price actually lower than the dollar one, or is it the same price converted? Load the pricing page on an Indian connection and compare it against the international view before you decide.",
          "If it is in dollars or euros, what is the real converted cost including your card's cross-border markup, and who handles the reverse charge paperwork?",
          "How many Instagram accounts does the plan cover, and what does the next one cost?",
          "Is there a free plan you can run in production, or only a trial that expires?",
          "Does the tool connect through Instagram's own consent screen, or does it ask for your password? That last one is a safety question rather than a pricing question, and it is the one worth checking first.",
        ],
      },
    ],
    faq: [
      {
        question: "How much does Instagram DM automation cost in India?",
        answer:
          "It ranges from free to tens of thousands of rupees a month, and the spread is mostly about the pricing model rather than the feature set. Among the six tools that publish rupee prices, as of November 2026, paid plans start at ₹399 a month on SendDM's Creator tier on annual billing, ₹499 on Liffio, ₹499 on SuperProfile after a ₹99 first month, ₹833 on InstantDM billed yearly, ₹900 on ReplyRush and ₹1,199 on Zorcha. Tools that bill per contact or per message can start lower and end much higher, because the bill moves with volume. Liffio's Indian plans are ₹0, ₹499, ₹1,499, ₹2,499 and ₹22,999 a month, GST included, against $0, $9, $29, $59 and $549 internationally, with automated DMs not metered on any of them.",
      },
      {
        question: "Which Instagram DM automation tools publish INR pricing?",
        answer:
          "Six of the twelve checked on 13 November 2026: Liffio, SendDM, InstantDM, ReplyRush, SuperProfile and Zorcha. That is half the market, so a rupee price is no longer a differentiator. Worth knowing that several of these pages geo-localize, so a fetch from outside India shows dollars even when a rupee card exists; SendDM and InstantDM both look dollar-only until you load them on an Indian connection. The six that publish no rupee price, re-checked in an Indian browser on the same date: ManyChat, Chatfuel, LinkDM and CreatorFlow in USD, Metricool in USD and EUR, Inro in EUR. ManyChat's ladder runs from $0 to $139 a month as of November 2026 and shows no rupee price even with the billing country set to India (manychat.com/pricing). The sharper question is whether a rupee price is a real India discount or a conversion: SendDM's ₹399 is about $4.75 against its own $9, while InstantDM's ₹833 is about $9.90 against $9.99.",
      },
      {
        question: "Is there a free Instagram comment-to-DM tool in India?",
        answer:
          "Yes, several, though what is free varies a lot. Check whether the free plan includes keyword comment-to-DM at all, whether it is capped by contacts or messages, and whether it expires. As of November 2026, Metricool's free plan excludes the Flows add-on that contains comment-to-DM, Chatfuel has no free plan at all, ReplyRush's free tier allows 1,500 DMs a month and Inro's allows 100 activated contacts. Liffio's free plan includes keyword triggers on posts and Reels, public comment auto-replies and unmetered automated DMs, limited to 3 automation workflows at a time and 2 live chatbots, with no card and no expiry.",
      },
      {
        question: "Do Indian prices include GST?",
        answer:
          "On Liffio, yes: rupee prices are GST-inclusive, the amount shown is the amount charged, and a GST tax invoice is issued for every payment. This is not universal, so check. Some platforms quote rupee prices excluding GST and add it at checkout, and some only mention GST in the context of KYC rather than invoicing.",
      },
      {
        question: "Can I claim GST input credit on an Instagram automation subscription?",
        answer:
          "If you are GST-registered and the supplier is Indian, a tax invoice carrying a GSTIN is what your accountant needs, and Liffio issues one for every payment. A dollar subscription from a foreign vendor is an import of service and is treated differently: in most cases the liability sits with you under the reverse charge mechanism and has to be reported in your returns. Confirm the treatment with your CA, not with a blog post.",
      },
      {
        question: "Is it cheaper to pay annually?",
        answer:
          "On Liffio, annual billing charges ten months instead of twelve, so two months are free. Elsewhere it varies: Zorcha's annual pricing works out to ₹799, ₹1,999 and ₹5,999 a month against ₹1,199, ₹2,999 and ₹8,999 monthly as of November 2026, while ReplyRush publishes monthly billing only and SuperProfile lists no annual price at all. Whether a discount is worth it depends on how settled you are: an annual commitment on a tool you have used for a week is a worse deal than a monthly plan on a tool you have used for a quarter.",
      },
    ],
    references: [
      {
        label: "Liffio pricing, including Indian rupee plans",
        url: "https://liffio.com/pricing",
      },
      {
        label: "SendDM pricing page, rupee card read on an Indian connection (checked 13 November 2026)",
        url: "https://senddm.ai/pricing",
      },
      {
        label: "Zorcha India pricing page (checked 13 November 2026)",
        url: "https://zorcha.com/in/pricing/",
      },
      {
        label: "Zorcha international pricing page (checked 13 November 2026)",
        url: "https://zorcha.com/pricing/",
      },
      {
        label: "ReplyRush pricing page, both currencies on one page (checked 13 November 2026)",
        url: "https://www.replyrush.com/pricing",
      },
      {
        label: "SuperProfile India pricing page (checked 13 November 2026)",
        url: "https://superprofile.bio/in/pricing",
      },
      {
        label: "SuperProfile global pricing page (checked 13 November 2026)",
        url: "https://superprofile.bio/pricing",
      },
      {
        label: "InstantDM pricing page, rupee card read on an Indian connection (checked 13 November 2026)",
        url: "https://instantdm.com/pricing",
      },
      {
        label: "Chatfuel pricing page (checked 13 November 2026)",
        url: "https://chatfuel.com/pricing",
      },
      {
        label: "Metricool pricing page (checked 13 November 2026)",
        url: "https://metricool.com/pricing/",
      },
      {
        label: "LinkDM pricing page (checked 13 November 2026)",
        url: "https://www.linkdm.com/pricing",
      },
      {
        label: "CreatorFlow pricing page (checked 13 November 2026)",
        url: "https://creatorflow.so/pricing",
      },
      {
        label: "Inro pricing page (checked 13 November 2026)",
        url: "https://inro.social/pricing",
      },
      {
        label: "ManyChat pricing page (blocks automated requests; read in a real browser on 13 November 2026)",
        url: "https://manychat.com/pricing",
      },
      {
        label: "ManyChat alternatives for Instagram: twelve tools compared",
        url: "/blog/manychat-alternatives",
      },
      {
        label: "Instagram Messaging API: Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
    ],
  },
  {
    slug: "comment-to-dm-for-online-stores",
    category: "Use Cases",
    title: "Comment-to-DM for Online Stores: Send Prices and Links Automatically",
    excerpt:
      "How small shops use one keyword per product to answer the price question at scale, what belongs in the DM, and the mistakes that cost sales.",
    readTime: "4 min read",
    date: "October 21, 2026",
    author: "Liffio Team",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-21",
    gradient: "from-rose-500 to-pink-500",
    sections: [
      {
        heading: "The price question is the whole problem",
        paragraphs: [
          "If you sell anything on Instagram, you already know the comment. Price? How much? DM me. It arrives on every post, dozens of times, and each one is a person who has told you plainly that they are considering buying.",
          "Answering them by hand works until it does not. A post that reaches well produces more of those comments in an evening than you can reply to between other jobs, and the ones you answer at noon the next day are answering someone whose moment has passed. Meanwhile the comment sits there publicly unanswered, which reads to the next reader as a shop that does not reply.",
          "Comment-to-DM is the fix because it matches the shape of the problem exactly. The question is always the same, the answer is always the same, and the person asking has already raised their hand.",
        ],
      },
      {
        heading: "One keyword per product, not one keyword per shop",
        paragraphs: [
          "The instinct is to set up PRICE as a single trigger across everything. It works, but it wastes the opportunity, because then the DM has to be generic and you are back to a conversation.",
          "Better: name the keyword after the product and put it in the caption and the video. SHIRT, HOODIE, SET01, whatever matches how you already refer to it. The DM can then carry the actual price, the actual link, and the actual sizes for that one item, which is an answer rather than an invitation to ask again.",
          "Keep the words short and spellable on a phone. If the product has a name people mistype, use the shorter half of it. And say the word out loud in the Reel: people comment what they heard, not what is written in the caption they did not read.",
        ],
      },
      {
        heading: "What belongs in the DM",
        paragraphs: [
          "Three lines, in this order. Name the thing they asked about. Give the price. Give the link, on its own line or as a tappable button.",
          "That is it. Resist adding the other four products, the shipping policy and a discount code, because a DM with one job gets acted on and a DM with five gets read and closed. If you sell variants, one short line asking which size is better than a list of all of them.",
          "Turn on the public reply as well. Something as plain as sent you a DM with the price does two jobs: it tells that commenter to check their inbox, and it shows the next reader that this shop answers. Use reply variants so the comment section does not read as the same sentence forty times.",
        ],
      },
      {
        heading: "What this looks like in practice",
        paragraphs: [
          "A clothing shop posts a Reel of a new drop and says comment SET01 for the price. Someone does, and about twenty seconds later they have the price, the sizes in stock and a link straight to that product page, while the comment underneath the Reel says a DM is on its way.",
          "The difference is not that the shop replied faster. It is that the shop replied to everyone, including the people who commented at one in the morning, and nobody had to decide which comments were worth the effort.",
          "You can see three real accounts running this on the Liffio homepage, including a clothing store using it exactly this way.",
        ],
      },
      {
        heading: "Mistakes that cost sales",
        paragraphs: [
          "Promising a price and sending a sales pitch. People who asked for a number and got a paragraph block you, and they are the warmest audience you had.",
          "Linking to the homepage instead of the product. Making someone search your catalogue after they told you which item they wanted is the opposite of helpful.",
          "A link that breaks on mobile. Everyone who reads this DM is on a phone. Test it on a phone.",
          "Not testing at all before promoting the post. Comment from a second account first and check three things: the DM lands, the link opens, and the public reply reads the way you meant it.",
          "Letting the keyword outlive the product. When the item sells out, either update the DM to say so with an alternative, or turn the automation off. A DM confidently selling something you no longer have is worse than silence.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I use a different keyword for every product?",
        answer:
          "Yes, and for a shop it is usually the better setup. Each automation watches one post for one keyword, so a keyword per product lets each DM carry that product's real price and link. How many you can have at once depends on the plan: 3 on Liffio's free plan, 50 on Starter, and unlimited on Growth, Business and Agency.",
      },
      {
        question: "Should I put the price in the DM or just the link?",
        answer:
          "Put the price in. The reason the comment exists is that the price was not in the caption, so a DM containing only a link is asking them to go and find the thing they already asked you for. Price, then link, in that order.",
      },
      {
        question: "What if someone replies to the automated DM?",
        answer:
          "Then you have a conversation, which is the point. The automation gets them the number; a person takes it from there. If the same follow-up questions keep arriving, a chatbot can handle the first round of them, which is a separate module from comment-to-DM.",
      },
      {
        question: "Does this work on Reels as well as feed posts?",
        answer:
          "Yes, and Reels are usually where the volume is, because a Reel reaches people who do not follow you yet. The behaviour is the same on both.",
      },
    ],
    references: [
      {
        label: "How to turn Instagram comments into DMs automatically",
        url: "https://liffio.com/blog/how-to-turn-instagram-comments-into-dms",
      },
      {
        label: "Instagram comment-to-DM automation on Liffio",
        url: "https://liffio.com/instagram-comment-to-dm",
      },
    ],
  },
  {
    slug: "how-to-turn-instagram-comments-into-dms",
    category: "Automation",
    title: "How to Turn Instagram Comments Into DMs Automatically",
    excerpt:
      "A practical walkthrough for comment-to-DM setup: picking keywords, writing messages people actually open, and testing before a post goes viral.",
    readTime: "4 min read",
    date: "May 15, 2026",
    author: "Liffio Team",
    publishedAt: "2026-05-15",
    updatedAt: "2026-10-21",
    gradient: "from-orange-500 to-rose-600",
    sections: [
      {
        heading: "What comment-to-DM actually does",
        paragraphs: [
          "You post a Reel or carousel and tell people to comment a word if they want the link, guide, or discount code. When Instagram sees that comment, a tool sends them a DM with whatever you promised. You are not sitting in your inbox copying the same message four hundred times.",
          "The setup is simple on paper: one trigger word, one DM template, one delay so replies arrive at a conversational pace. The hard part is choosing a keyword your audience already understands and writing a DM that sounds like you, not like a blast from a marketing bot.",
          "Most creators who do this well treat the comment as the handshake and the DM as the conversation. The comment is public proof that someone raised their hand. The DM is where you deliver the thing and, if it fits, ask a follow-up question.",
        ],
      },
      {
        heading: "Pick a keyword people will actually type",
        paragraphs: [
          "Short words win. LINK, GUIDE, PRICE, and YES work because they are easy to spell on a phone and easy to remember from a five-second Reel hook.",
          "Match the word to what you said in the video. If you say \"comment MENU for the meal plan,\" do not set the trigger to DOWNLOAD. People comment what they heard, not what is in your head.",
          "One post, one keyword is a good rule when you are starting. You can always clone the automation for the next post once you know the open rate and click rate on the link.",
        ],
      },
      {
        heading: "Set it up in Liffio (about five minutes)",
        paragraphs: [
          "Connect Instagram through Instagram Login so you are on the official API, not a grey-market login that risks the account.",
          "Create a Comment automation, choose the post or Reel, and type the trigger exactly as you want it matched. Most teams use \"contains\" matching so GUIDE also catches \"guide please\".",
          "Write the DM in two or three short lines. Put the link on its own line or use a DM button. Set the delay to something between 15 and 45 seconds. Instant DMs can feel abrupt; a short pause gives the reply a natural conversational rhythm.",
          "Turn on a public reply if you want social proof under the comment. Something like \"Sent you a DM with the link\" stops the same person from commenting twelve times because they think it broke.",
          "Before you promote the post, comment from a second account and confirm the DM lands, the link opens on mobile, and the public reply looks right.",
        ],
      },
      {
        heading: "DM copy that gets opened",
        paragraphs: [
          "Line one should name what they asked for. \"Here is the free preset pack you commented for\" beats \"Thanks for engaging with our brand.\"",
          "Line two is the link or the next step. No three links. One job per DM.",
          "Line three is optional: a single question if you sell high-touch services. \"Are you editing on mobile or desktop?\" gives you a reply thread without sounding like a survey.",
          "Read it out loud once. If you would not send it to a friend, rewrite it.",
        ],
      },
      {
        heading: "When manual replies stop scaling",
        paragraphs: [
          "Past roughly fifty comments in an hour, you will miss people. Missed comments mean missed sales and annoyed followers who think you are ignoring them.",
          "Automation does not replace a real conversation when someone has a specific problem. It replaces the repetitive \"here is the link\" work so you can spend inbox time on people who are ready to buy or need support.",
          "Track two numbers per post: how many trigger comments you got and how many unique clicks the DM link got. If comments are high and clicks are low, the DM copy or the offer is the bottleneck, not the tool.",
        ],
      },
    ],
    faq: [
      {
        question: "Does this work on Reels?",
        answer: "Yes. The same keyword trigger works on feed posts and Reels as long as comments are enabled on that piece of content.",
      },
      {
        question: "Will Instagram punish automated DMs?",
        answer:
          "Tools that use Meta's official messaging APIs are built for this use case. Keep your copy useful and varied, and avoid third-party apps that ask for your password.",
      },
      {
        question: "Can I use more than one keyword on the same post?",
        answer:
          "You can run separate automations per keyword, or use trigger blocks on Starter and up if you want different messages for LINK vs PRICE on one post.",
      },
    ],
    references: [
      {
        label: "Instagram Messaging API: Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
      {
        label: "Instagram Platform Policy: Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
    ],
  },
  {
    slug: "manychat-alternatives",
    category: "Strategy",
    title: "ManyChat Alternatives for Instagram: 12 Tools Compared (2026)",
    excerpt:
      "Twelve Instagram DM automation tools, with prices read from their own pricing pages in November 2026, an honest best-for line on each, and a section on who should not buy Liffio.",
    readTime: "15 min read",
    date: "November 13, 2026",
    author: "Liffio Team",
    publishedAt: "2026-11-13",
    /*
      Every competitor figure below was read from the vendor's own live pricing
      page on 2026-11-13. Each price carries a code comment recording the source
      URL and that date, per the competitor pricing rule at the top of this
      file. The same URLs render as links in the `references` list.
    */
    updatedAt: "2026-11-13",
    gradient: "from-rose-500 to-rose-600",
    sections: [
      {
        heading: "Why this list is not a ranking",
        paragraphs: [
          "Most ManyChat alternatives lists are a sales page wearing a listicle's clothes, and the tool at number one is the tool that wrote the post. So, disclosure first: we build Liffio. It is one of the twelve tools below, it sits in its alphabetical slot rather than at the top, and there is a section near the end about who should buy something else.",
          "Every price here was read off the vendor's own pricing page on 13 November 2026, and every page is linked under Sources. Nothing is copied from another comparison article and nothing is written from memory. Where a vendor does not publish a readable price, the entry says so instead of guessing.",
          "There is no best overall, because the answer turns on three things nobody can decide for you. Do you need a chatbot or just a trigger. Do you bill in rupees. And should a Reel that does ten times better than planned be allowed to raise your invoice. Prices also move, so treat these figures as the shape of the thing and click through: models change far more slowly than numbers.",
        ],
      },
      {
        heading: "What actually separates these tools",
        paragraphs: [
          "Does the bill move with volume? Three models are in play here. Flat rate, where usage is included. Per contact, where you pay for the unique people reached that month. Metered, where the plan buys a DM allowance or a pile of credits and you buy more when it runs out.",
          "Is there a chatbot, or only a trigger? Comment-to-DM is a reflex: keyword in, message out. A chatbot answers the follow-up question. Several tools here do only the reflex, and for a lot of creators that is the whole job.",
          "How many Instagram accounts, and what does the next one cost? For anyone running more than their own account, that is the biggest price difference on this list. Which currency, and does the invoice work where you file? In India that is not a detail, and it has a post of its own.",
          "One more question, and it is not about money. Any tool that wants your Instagram password instead of sending you to Instagram's own consent screen is a different category of risk, whatever it charges.",
        ],
      },
      {
        heading: "ManyChat, the one you are comparing against",
        paragraphs: [
          "The default, and for good reason: Instagram, Messenger, WhatsApp and SMS in one flow builder, the longest track record in the category, and still the obvious choice if you run ads into a Messenger bot. It describes itself as an official Meta-approved partner and an Official Meta Business Partner, which is its own claim and not something verified here.",
          /* https://manychat.com/pricing, verified 2026-11-13 in a real browser. manychat.com blocks automated fetching: a domain-wide Cloudflare bot check returns HTTP 403 to curl, WebFetch and headless engines, and the interstitial clears after about 8 seconds in a real signed-in Chrome. Refresh in a REAL browser, never with curl, and do not swap these figures back for "not publicly listed" because an automated fetch failed. Monthly / annual / active contacts: Free $0, 25; Essential $14, $168/yr (18% off), 250; Pro $29, $348/yr (25% off), 2,500; Business $69, $828/yr (30% off), 7,500; Advanced $139, $1,668/yr, 25,000. Channels 2/2/3/unlimited/unlimited, users 1/2/3/5/10. Prices exclude tax and depend on billing country. USD only: /pricing?country=IN still showed $29/mo with no rupee symbol. */
          "Free is $0 with 25 active contacts, 2 channels and 1 user. Essential is $14 a month, or $168 for the year at 18 percent off, with 250 active contacts. Pro is $29 a month, $348 a year at 25 percent off, with 2,500. Business is $69 a month, $828 a year at 30 percent off, with 7,500 contacts and unlimited channels. Advanced is $139 a month, $1,668 a year, with 25,000. All as of November 2026 (manychat.com/pricing). Prices exclude tax and depend on your billing country, and the page lists dollars only: loading it with the billing country set to India still shows $29 a month and no rupee price.",
          "The unit is the Active Contact: one real person your automations interacted with during a monthly billing period, counted once for that month. Crossing the cap does not switch your automations off, it adds a small overage fee for each additional Active Contact, and an annual plan still counts contacts monthly and bills the overage monthly. Free needs no card but carries Manychat branding and allows up to 4 live triggers; Essential and above drop the branding, and there is a 14-day trial on Essential or Pro.",
          "Read those caps against the thing you actually want to happen. For an Instagram-only creator the best possible month is a Reel finding twenty thousand strangers, and 25 contacts on Free or 250 on the $14 plan is one afternoon of a post that works. A bill indexed to reach points the wrong way, whatever the sticker says.",
          "Best for: multi-channel teams who need Messenger, WhatsApp and Instagram in one builder, and who can forecast their monthly contact count.",
        ],
      },
      {
        heading: "Chatfuel",
        paragraphs: [
          /* chatfuel.com/pricing, verified 2026-11-13. Trial length (7 days) is stated on /instagram, not on /pricing. */
          "The other general-purpose chatbot platform here, priced like business software rather than creator software. Business S is US$18 a month billed yearly, US$216 a year, or US$20 monthly, as of November 2026 (chatfuel.com/pricing). Agency S is US$90 a month yearly, US$1,080 a year, and the ladder runs up to Business XXL at US$366.67 a month and Agency XXL at US$1,845.",
          "No free plan, only a trial, and its length is stated on the Instagram landing page rather than on the pricing page. The model is per bot plus metered credits: AI replies, WhatsApp templates and lead events all draw them down, and unused credits do not roll over. No contact cap is stated anywhere, which is unusual and in your favour. USD only.",
          "It does Instagram comment-to-DM, and the site states it uses Meta's official Graph API. That is the vendor's own description of its integration, not something verified here.",
          "Best for: businesses running one chatbot platform across Instagram and WhatsApp who will actually burn the AI credits. Overkill for a keyword and a link.",
        ],
      },
      {
        heading: "CreatorFlow",
        paragraphs: [
          /* creatorflow.so/pricing, verified 2026-11-13. Flat rate, no per-contact fees; DM top-up packs $5/1,000 up to $19/5,000. */
          "Flat rate, creator shaped. Free is $0 with one account and 500 DMs a month. Pro is $15 a month, or $12 billed annually, $144 a year. Growth is $30, or $24 annually, $288 a year. Agency is a custom quote. All as of November 2026 (creatorflow.so/pricing).",
          "The thing to notice is the absence of per-contact fees: DMs are capped rather than billed by the person reached, and you top up with packs running from $5 per 1,000 DMs to $19 per 5,000, so you can work out your worst case on paper. The pricing page displays a Meta Tech Provider badge, which is the vendor's own claim and is not explained there.",
          "Best for: creators who want flat, forecastable pricing on one or two accounts and will stay inside the DM cap most months.",
        ],
      },
      {
        heading: "Inro",
        paragraphs: [
          /* inro.social/pricing, verified 2026-11-13. Per-contact-activated model stated on the page. EUR only. */
          "Inro bills per contact and says so on the page, which is more than most manage. Free is EUR 0 with 100 activated contacts a month and 3 automations. Pro starts at EUR 12.99 a month and bills on the contacts you activate that month. Annual Pro is EUR 1,249 a year, and a managed plan starts from EUR 249 a month. All as of November 2026 (inro.social/pricing).",
          "It is fuller than the single-trigger tools: an AI agent, a CRM where stored contacts are not billed, campaigns and folders. The page states that all plans run on Meta's official API and shows a Meta Tech Provider badge, both the vendor's own claims. Euros only, which is a second conversion problem for anyone outside the eurozone.",
          "Best for: businesses with steady, predictable contact volume that want a CRM and an AI agent on one subscription and are comfortable with a bill that tracks reach.",
        ],
      },
      {
        heading: "InstaChamp, now inside Customers.ai",
        paragraphs: [
          "A cautionary entry rather than a recommendation. InstaChamp was one of the first Instagram comment-to-DM tools. instachamp.com is now a dead domain that redirects to a GoDaddy for-sale parking page, and the product lives inside Customers.ai, formerly MobileMonkey.",
          /* customers.ai/instachamp, verified 2026-11-13: Platinum shown at $19/mo AND $9.95/mo simultaneously under a rotating weekly promo banner. customers.ai/pricing publishes no priced plans. Contact tiers plus metered sends. */
          "Prices are shown, but not stably enough to quote as one number, so here is exactly what the page shows. As of November 2026 the InstaChamp page displays the Platinum plan at $19 a month and at $9.95 a month in the same view, the lower figure under a rotating \"this week\" promo banner (customers.ai/instachamp). Contacts are capped by tier, 250 on the VIP edition and 1,000 on Platinum, with extra contacts at $10 per 500 and extra branding-free sends at $5 per 1,000. Meanwhile customers.ai/pricing publishes no priced plans at all.",
          "One more thing, because the name circulates in roundups: there is no product called DMChamp. A comparison post that lists one is generating entries rather than checking them.",
          "Best for: existing Customers.ai customers who want the Instagram piece of a suite they already pay for. For anyone else, the dead domain and the two simultaneous prices are themselves the information.",
        ],
      },
      {
        heading: "InstantDM",
        paragraphs: [
          /* https://instantdm.com/pricing, verified 2026-11-13 in BOTH views:
             curl for the international card, an India-geolocated browser for the
             rupee card. All headline prices billed yearly; monthly-billing
             figures absent despite a monthly toggle.
             🔴 An earlier pass claimed the INR selector showed no INR prices.
             That was read with curl and it was false: there is a full rupee
             card. India: Free ₹0, Legend Pro ₹833/mo, Trendsetter ₹1,666,
             Trendsetter Pro ₹4,165, Multi Pro ₹667 per account per month or
             ₹79,999/yr for 10 accounts. Multi Starter not captured in INR. */
          "Free is ₹0 or $0 forever, with 500 DM automations a month, one Instagram account and 3 trigger words, which is a usable tier rather than a demo. Legend Pro is ₹833 a month in India, or $9.99 internationally; Trendsetter is ₹1,666 or $24.99; Trendsetter Pro is ₹4,165 or $49.99. All are billed yearly, as of November 2026 (instantdm.com/pricing). Multi-account plans are quoted per year: Multi Pro at ₹79,999 or $990 for 10 accounts, or ₹667 per account per month, and a Multi Starter at $160 for 3 accounts on the international card.",
          "Monthly-billing prices are not listed. The page has a monthly toggle but shows no monthly figures, so if you do not want an annual commitment you will have to ask. There is a visual flow builder and an AI agent, so it does more than the single-trigger tools for less than the chatbot platforms. One note for Indian readers: the rupee card is real, but it is close to a straight conversion rather than a discount. ₹833 against $9.99 is roughly $9.90, so you are paying the international price in local currency.",
          "Best for: creators who want a flow builder and an AI agent cheaply and will pay for a year up front.",
        ],
      },
      {
        heading: "Liffio",
        paragraphs: [
          /* src/config/pricing.config.ts, read 2026-11-13. Never retype these from memory. */
          "Ours, so weigh this entry accordingly. Free is $0 or ₹0, Starter $9 or ₹499, Growth $29 or ₹1,499, Business $59 or ₹2,499, and Agency $549 or ₹22,999, per month. Annual billing charges ten months instead of twelve.",
          "Automated DMs are not metered on any plan, Free included, and there is no per-contact fee. What the plan decides is how many automation workflows run at once, 3 on Free, and how many live chatbots, 2 on Free. Comment keyword triggers, public replies, story replies, story mentions, a leads list, a bio link and short links are all in the free tier. Liffio is a Verified Meta Tech Provider with its App Review submission approved, and connects through Instagram Login on Instagram's own consent screen.",
          "Now the caveat, because unmetered DMs are the main reason people pick us and the claim is not unique. Zorcha also gives unlimited DMs on every tier including its free one, and also publishes rupee prices. Against the other ten tools here the claim holds; against Zorcha it is a tie, and the decision moves to AI metering, the chatbot layer and workflow limits.",
          "Best for: Instagram-only creators and small businesses who want DM volume off the bill entirely, and Indian buyers who need rupee billing with a GST invoice.",
        ],
      },
      {
        heading: "LinkDM",
        paragraphs: [
          /* linkdm.com/pricing, verified 2026-11-13. NOTE: linkdm.com/features is a 404, do not link it. */
          "Free is $0, Pro $19 a month or $182 a year, and Platinum+ $99 a month or $832 a year, as of November 2026 (linkdm.com/pricing). The limits are generous: 1 account and 1,000 DMs a month on Free, 3 accounts and 25,000 on Pro, 10 accounts and 300,000 on Platinum+.",
          "It is deliberately narrow and honest about it: no AI chatbot, and explicitly no link-in-bio. It delivers DMs and reports click analytics, and stops there. The vendor claims to have been a certified Meta Business Partner since 2021, which is its own claim and a different programme from Tech Provider status.",
          "Best for: people who need high DM ceilings across several accounts and have their link-in-bio, scheduling and chatbot needs covered elsewhere.",
        ],
      },
      {
        heading: "Metricool",
        paragraphs: [
          /* metricool.com/pricing/, verified 2026-11-13. NOTE: /prices/ 404s. Flows add-on $12/EUR 10 per month for 2,500 executions; Flows absent from the Free plan. */
          "A social media management suite that happens to do comment-to-DM, and its price needs a footnote more than a headline. Free is $0, Starter is $20 a month on annual billing or $25 monthly for up to 5 brands, and Advanced is $53 annual or $67 monthly for 15 brands, as of November 2026 (metricool.com/pricing).",
          "The footnote: comment-to-DM lives in the Flows add-on, which costs an extra $12 or EUR 10 a month for 2,500 executions, and Flows is not available on the Free plan at all. Comparing Metricool's $20 against another tool's $20 overstates the parity by exactly the price of the add-on you came for.",
          "Metricool does not claim the official API on its own site, and its help documentation describes Meta Messaging API constraints. So the accurate statement is: official API not stated on-site, documented behaviour matches Meta's official Messaging API constraints. Euros and dollars only, excluding VAT.",
          "Best for: teams already running scheduling and analytics in Metricool who want DM flows inside a tool they pay for anyway.",
        ],
      },
      {
        heading: "ReplyRush",
        paragraphs: [
          /* replyrush.com/pricing, verified 2026-11-13. Monthly billing only; publishes INR alongside USD. */
          "Monthly billing only, no annual discount published, and it prints rupees next to dollars. Free is $0 or ₹0, Lite $10 or ₹900, Boost $25 or ₹2,100, and MAX $100 or ₹8,400, as of November 2026 (replyrush.com/pricing).",
          "DM caps are the whole axis: 1,500 a month on Free, 7,500 on Lite, 40,000 on Boost and 400,000 on MAX. Instagram accounts run 1, 1, 3 and 5, so the jump from Lite to Boost is really one account to three. There is no AI chatbot. The vendor claims to be an Official Meta Business Partner, again its own claim.",
          "Best for: creators who want a rupee price and a legible DM allowance, and who do not need a chatbot or a flow builder.",
        ],
      },
      {
        heading: "SuperProfile",
        paragraphs: [
          /* superprofile.bio/in/pricing and superprofile.bio/pricing, both verified 2026-11-13. Annual prices not published on either. */
          "An all-in-one creator platform, link-in-bio and digital product checkout, with real comment-to-DM rather than a bolted-on version. India: Starter free, Creator ₹99 for the first month and then ₹499, Pro on request. Global: Starter free, Creator $4.99 for the first month and then $29 a month, Pro on request. Annual prices are not listed in either region. All as of November 2026.",
          "The automation is better than the all-in-one framing suggests: story replies, Live comment triggers, and keyword intent matching the vendor says handles typos and Hinglish, which almost nothing else here even mentions. What it lacks is a chatbot layer, so the DM is triggered rather than conversational. Worth noticing too that the Indian and global Creator prices are not conversions of each other.",
          "Best for: Indian creators selling digital products who would rather have the storefront and the automation on one invoice than run two subscriptions.",
        ],
      },
      {
        heading: "Zorcha",
        paragraphs: [
          /* zorcha.com/pricing/ and zorcha.com/in/pricing/, both verified 2026-11-13. Zorcha Software Pvt Ltd. */
          "An Indian company, Zorcha Software Pvt Ltd, and the one tool here that competes with Liffio on precisely the thing Liffio leads with, so read this entry with that in mind.",
          "Rupees, monthly: Free ₹0, Pro ₹1,199, Ultimate ₹2,999, Business ₹8,999. On annual billing those work out to ₹799, ₹1,999 and ₹5,999 a month. In dollars: Free $0, Pro $14.99, Ultimate $39.99, Business $109.99. All as of November 2026 (zorcha.com/pricing and zorcha.com/in/pricing).",
          "Automations, DMs and contacts are unlimited on every tier, Free included. What it meters instead is AI: credits of 15K, 150K, 1.5M and 7.5M by tier, and AI FAQs capped at 20, 40, 80 and 80. There is a link-in-bio and a flow builder on the paid tiers, plus a digital product fee that falls from 8 percent to 1 percent as you move up.",
          "Best for: Indian creators and agencies who want unmetered DMs with rupee billing and will use the AI FAQ layer. If you are deciding between Zorcha and Liffio, the unlimited-DM question is a tie: compare AI metering, the chatbot layer, workflow limits and support hours, and run both free tiers for a week.",
        ],
      },
      {
        heading: "The prices, side by side",
        paragraphs: [
          "One row per tool: cheapest paid entry point, the pricing model, the free tier, and whether rupees are published. Every figure was read from the vendor's own pricing page on 13 November 2026, the rupee ones on an Indian connection, and every page is linked under Sources below.",
          /*
            Every row below RESTATES a figure already carried, with its source
            URL and verification date, in the per-tool comment above it in this
            same post. All verified 2026-11-13. Update a price in both places or
            in neither: the tool section is the authority, this is the summary.

            🔴 "No INR" on a row is a claim about what an INDIAN BROWSER renders,
            not about what curl returned. These pages geo-localize. Every "No
            INR" below was re-checked in an Indian browser on 2026-11-13, and
            InstantDM's row was corrected from "INR selector only, no prices",
            which was a curl artefact.
          */
          "ManyChat: from $14 a month, $168 a year, for 250 active contacts. Per Active Contact, with overage per extra contact above the cap. Free tier 25 active contacts, 4 live triggers, Manychat branding. No INR.",
          "Chatfuel: from US$18 a month billed yearly, US$216 a year. Per bot plus metered credits that do not roll over. No free plan, trial only. No INR.",
          "CreatorFlow: from $12 a month billed annually, $144 a year, or $15 monthly. Flat with DM caps and top-up packs. Free tier 500 DMs. No INR.",
          "Inro: from EUR 12.99 a month. Per contact activated that month. Free tier 100 activated contacts. No INR.",
          "InstaChamp (Customers.ai): Platinum shown at both $19 and $9.95 a month in the same view. Contact tiers plus metered sends. Free tier not listed. No INR.",
          "InstantDM: from ₹833 a month in India, or $9.99 internationally, billed yearly; monthly prices not listed. Flat with DM automation caps. Free tier 500 automations. INR published, though ₹833 against $9.99 is a conversion rather than an India discount.",
          "Liffio: from ₹499 a month in India, or $9 internationally. Flat, DMs and contacts not metered on any tier. Free tier unmetered DMs, 3 workflows. INR published, GST inclusive with a tax invoice.",
          "LinkDM: from $19 a month, $182 a year. Flat with DM caps. Free tier 1,000 DMs. No INR.",
          "Metricool: from $20 a month annual, plus $12 a month for the Flows add-on that contains comment-to-DM. Flat per brand count plus metered executions. Free tier excludes Flows. No INR.",
          "ReplyRush: from ₹900 a month in India, or $10 internationally, monthly billing only. Flat with DM caps. Free tier 1,500 DMs. INR published, both currencies on one page.",
          "SuperProfile: Creator at ₹99 first month then ₹499 in India, $4.99 then $29 globally. Flat, annual not published. Free tier yes. INR published.",
          "Zorcha: from ₹1,199 a month in India, or $14.99 internationally. Flat, DMs and contacts unlimited, AI credits metered. Free tier unlimited DMs. INR published on a separate India URL.",
        ],
      },
      {
        heading: "When Liffio is the wrong choice",
        paragraphs: [
          "This is the section a shill skips, so here it is.",
          "If you automate Messenger, WhatsApp or SMS alongside Instagram, Liffio does not do those channels. ManyChat and Chatfuel do, and one tool covering both beats ours plus a second subscription.",
          "If you need branching, conditional flows, we do not have them. A Liffio trigger block is one keyword to one DM plus an optional public reply, with no conditional step evaluation. A real flow builder is a legitimate reason to look at Chatfuel, InstantDM or Zorcha instead.",
          "If you want a DM to fire when someone new follows you, Liffio does not do that today. Meta grants follow-to-DM through a limited partner beta we are not in.",
          "If you need CRM integrations or outbound webhooks into HubSpot, Salesforce or a Zap, we have no integrations directory. There is an external API with per-plan limits, which is a different thing and a worse fit if you wanted a connector.",
          "If you need revenue attribution, we track comment to DM to click, not purchases. If sale tracking is the requirement, make every vendor show you the report rather than the feature name.",
          "And if follow gating is central to your funnel, ask every vendor on this list, ours included, to state in writing what their follow check actually verifies before you build a campaign on it. This is where marketing copy and API capability diverge most.",
        ],
      },
      {
        heading: "How to choose in twenty minutes",
        paragraphs: [
          "Write down how many Instagram accounts you need to connect. That number alone eliminates roughly half this list on price, faster than any feature comparison.",
          "Decide whether you need a conversation or a reflex. If a keyword and a link is the entire job, do not buy a chatbot platform and do not pay for AI credits you will never spend.",
          "Price your best month, not your average one: the Reel that does ten times what you expected, on each shortlisted tool. Per-contact and metered plans are where that hurts, and this is the only way to see it beforehand rather than after.",
          "If you bill in rupees, cut straight to the four tools that publish a rupee price, then price the rest at your card's real converted cost including the cross-border markup, not at the dollar sticker.",
          "Then run the free tier of your top two for a week on a small post. Comment from a second account, check the DM lands, the link opens on a phone, and the public reply reads the way you meant it. Then pay for one of them.",
          "Last checked 13 November 2026. Every price above was read from the vendor's own pricing page that day, and all the pages are linked below so you can see whether anything moved.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the best ManyChat alternative for Instagram?",
        answer:
          "There is no single best one, and a roundup that names one is usually selling it. The answer turns on whether you need a chatbot or just a keyword trigger, which currency you bill in, and whether your price should rise when a post performs. If you want flat pricing with unmetered DMs, Liffio and Zorcha both offer that. If you need Messenger and WhatsApp too, ManyChat and Chatfuel are the real options. If you want high DM ceilings across several accounts and nothing else, LinkDM is cheaper than either.",
      },
      {
        question: "How much does ManyChat cost?",
        answer:
          "As of November 2026, Free is $0 for 25 active contacts, Essential $14 a month for 250, Pro $29 for 2,500, Business $69 for 7,500 and Advanced $139 for 25,000, with annual billing at $168, $348, $828 and $1,668 (manychat.com/pricing). The unit is the Active Contact, one real person interacted with in a monthly billing period, and going over the cap adds a small overage fee per extra contact rather than stopping your automations. Prices exclude tax, depend on your billing country, and are listed in US dollars only. Check the live page before you budget, and do not trust a ManyChat number quoted in a comparison article, including one quoted about us.",
      },
      {
        question: "Which ManyChat alternatives publish Indian rupee pricing?",
        answer:
          "Five of the twelve on this list, as of 13 November 2026: Liffio, InstantDM, ReplyRush, SuperProfile and Zorcha. SendDM publishes rupees too, and it is a direct comment-to-DM rival even though it is not one of the twelve profiled above, so count it six across the wider field. The ones that publish no rupee price are ManyChat, Chatfuel, LinkDM and CreatorFlow in USD, Metricool in USD and EUR, and Inro in EUR, while InstaChamp publishes no pricing at all. One warning that cost us a correction: several of these pages geo-localize, so a fetch from outside India shows dollars even where a rupee card exists. SendDM and InstantDM both look dollar-only until you load them on an Indian connection. With roughly half the field printing rupees, the currency alone decides little: for a GST-registered Indian business the invoice matters as much, because a dollar subscription from a foreign vendor is an import of service rather than a domestic tax invoice.",
      },
      {
        question: "Is there a free ManyChat alternative for Instagram?",
        answer:
          "Several, with very different definitions of free as of November 2026. CreatorFlow allows 500 DMs a month on one account, InstantDM 500 DM automations with 3 trigger words, LinkDM 1,000 DMs, ReplyRush 1,500, and Inro 100 activated contacts. Liffio and Zorcha do not meter DMs at all on their free tiers. Chatfuel has no free plan, only a trial. Metricool has one, but comment-to-DM sits in a paid add-on the free plan cannot access.",
      },
      {
        question: "Do I need a chatbot or just comment-to-DM?",
        answer:
          "Comment-to-DM handles a question that is always the same: the price, the link, the code. A chatbot earns its cost when people reply to that DM with follow-ups you would otherwise answer by hand. If your inbox after a campaign is mostly one-line requests, a trigger tool like ReplyRush or LinkDM is enough and cheaper. If it is mostly conversations, look at the tools with an AI layer: Chatfuel, Inro, InstantDM, Zorcha or Liffio.",
      },
      {
        question: "Will switching tools put my Instagram account at risk?",
        answer:
          "Not if you switch between tools that connect through Instagram's own consent screen rather than asking for your password. Several vendors here describe themselves as Meta Tech Providers or Meta Business Partners; those are the vendors' own claims about different programmes, so read them as marketing and check what the connection flow actually does. When you migrate, revoke the old tool's access in your Instagram settings, and avoid running two tools on the same post, because duplicate DMs confuse people quickly.",
      },
    ],
    references: [
      {
        label: "ManyChat pricing page (blocks automated requests; read in a real browser on 13 November 2026)",
        url: "https://manychat.com/pricing",
      },
      {
        label: "Chatfuel pricing page (checked 13 November 2026)",
        url: "https://chatfuel.com/pricing",
      },
      {
        label: "CreatorFlow pricing page (checked 13 November 2026)",
        url: "https://creatorflow.so/pricing",
      },
      {
        label: "Inro pricing page (checked 13 November 2026)",
        url: "https://inro.social/pricing",
      },
      {
        label: "InstaChamp inside Customers.ai (checked 13 November 2026)",
        url: "https://customers.ai/instachamp",
      },
      {
        label: "Customers.ai pricing page, no priced plans listed (checked 13 November 2026)",
        url: "https://customers.ai/pricing",
      },
      {
        label: "InstantDM pricing page, rupee card read on an Indian connection (checked 13 November 2026)",
        url: "https://instantdm.com/pricing",
      },
      {
        label: "Liffio pricing, including Indian rupee plans",
        url: "https://liffio.com/pricing",
      },
      {
        label: "LinkDM pricing page (checked 13 November 2026)",
        url: "https://www.linkdm.com/pricing",
      },
      {
        label: "Metricool pricing page (checked 13 November 2026)",
        url: "https://metricool.com/pricing/",
      },
      {
        label: "ReplyRush pricing page (checked 13 November 2026)",
        url: "https://www.replyrush.com/pricing",
      },
      {
        label: "SuperProfile India pricing page (checked 13 November 2026)",
        url: "https://superprofile.bio/in/pricing",
      },
      {
        label: "SuperProfile global pricing page (checked 13 November 2026)",
        url: "https://superprofile.bio/pricing",
      },
      {
        label: "Zorcha pricing page (checked 13 November 2026)",
        url: "https://zorcha.com/pricing/",
      },
      {
        label: "Zorcha India pricing page (checked 13 November 2026)",
        url: "https://zorcha.com/in/pricing/",
      },
      {
        label: "Instagram DM automation pricing in India, including GST and rupee plans",
        url: "/blog/instagram-dm-automation-pricing-india",
      },
      {
        label: "ManyChat vs Liffio: should you switch?",
        url: "/manychat-alternative",
      },
      {
        label: "Instagram Messaging API: Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
    ],
  },
  {
    slug: "instagram-story-automation-guide",
    category: "Growth",
    title: "Instagram Story Automation That Does Not Feel Spammy",
    excerpt:
      "Story replies are high intent. Here is how to auto-respond without burning trust, plus example triggers and message templates.",
    readTime: "2 min read",
    date: "May 10, 2026",
    author: "Liffio Team",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-10",
    gradient: "from-rose-500 to-pink-500",
    sections: [
      {
        heading: "Why story replies are different from comment floods",
        paragraphs: [
          "A story reply means someone tapped your face, typed something, and sent it to you directly. They were already in a private channel with you. That is warmer than a public comment on a viral Reel.",
          "Because the context is personal, your automated reply should sound personal too. One sentence plus a link is enough. Paragraph essays feel out of place in a story reply thread.",
          "The best use cases are simple: send the coupon code, send the calendar link, send the replay link, answer \"where did you get that\" with a product link.",
        ],
      },
      {
        heading: "Triggers that work in practice",
        paragraphs: [
          "Any reply: good for launch weeks when every story is a CTA and you want one thank-you DM with the link.",
          "Keyword in the reply: useful when you ask \"reply STORY for the checklist\" on a sticker poll.",
          ...(FEATURE_STORY_REACTIONS
            ? ["Emoji reactions: treat carefully. A fire emoji might mean hype, not \"send me the sales page.\" Many creators only auto-DM on text replies for that reason."]
            : []),
        ],
      },
      {
        heading: "Setup in Liffio",
        paragraphs: [
          "Open Story Reply automation and connect it to the account that posted the story.",
          "Choose whether you want any text reply or a keyword match. Keyword match reduces accidental sends when someone replies \"lol\" to a meme story.",
          "Write a DM that references the story topic, not a generic \"Thanks for your reply.\" If the story was about a workshop, say \"Here is the workshop page you asked about from today's story.\"",
          "Keep delays similar to comment automations. Fifteen to thirty seconds is enough.",
        ],
      },
      {
        heading: "Three templates you can steal",
        paragraphs: [
          "Product ask: \"You asked about the serum from my story. Here is the exact link I use: [link]. Reply if you want the sensitive-skin version instead.\"",
          "Lead magnet: \"Here is the PDF from today's story. If you want the video walkthrough too, reply WALK and I will send it.\"",
          "Event: \"Here is the registration link for the live session I mentioned. It starts 7pm IST. Pin this DM so you do not lose it.\"",
        ],
      },
      {
        heading: "What to avoid",
        paragraphs: [
          "Do not auto-DM people who only react with an emoji unless your story explicitly told them to react for a link.",
          "Do not send the same sales pitch on every story for a week. People who watch daily will notice.",
          "Pause automations when you post something personal or sensitive. Automation should follow your content calendar, not run blind forever.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I auto-reply to story mentions?",
        answer:
          "Yes, if your plan includes story mention triggers. Test with a friend account because mention notifications and DM delivery can differ from plain text replies.",
      },
      {
        question: "Will followers know the DM is automated?",
        answer:
          "Assume some will, and that is fine when the DM is useful. Use plain language, reasonable delays, and turn off automations on posts that are not offers.",
      },
    ],
  },
  {
    slug: "instagram-dm-scripts-that-convert",
    category: "Strategy",
    title: "10 Instagram DM Scripts That Actually Get Replies",
    excerpt:
      "Real templates for coaches, shops, and creators: the opener, the link handoff, the gentle follow-up, and when not to send another message.",
    readTime: "2 min read",
    date: "May 5, 2026",
    author: "Liffio Team",
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    gradient: "from-emerald-500 to-teal-600",
    sections: [
      {
        heading: "Structure before clever writing",
        paragraphs: [
          "Every strong script has three beats: confirm what they wanted, deliver it, optional next step. Skip the brand manifesto.",
          "Use their comment word in line one so they know this is tied to the post they just engaged with.",
          "One link. If you need two assets, send the second after they reply.",
        ],
      },
      {
        heading: "Scripts 1 to 4: digital products and links",
        paragraphs: [
          "1) \"Here is the Notion template you commented for: [link]. If anything does not duplicate right, reply DUPLICATE and I will help.\"",
          "2) \"Preset pack is here: [link]. Works on Lightroom mobile and desktop. Reply MOBILE if you only edit on your phone and I will send the phone-specific install clip.\"",
          "3) \"Coupon is INSIDE10 at checkout: [link]. It expires Sunday night IST.\"",
          "4) \"Full replay is here: [link]. Timestamps are in the first comment on the video if you only want the Q&A section.\"",
        ],
      },
      {
        heading: "Scripts 5 to 7: services and bookings",
        paragraphs: [
          "5) \"Here is my calendar for a 20-minute fit call: [link]. Pick any slot that says Intro. If you are in US time zones, reply US and I will send EST-friendly slots.\"",
          "6) \"Thanks for asking about pricing on the post. Guide is here: [link]. Reply BUDGET if you want the starter package breakdown only.\"",
          "7) \"I saw you asked about the wedding package. Portfolio + prices: [link]. Reply DATE with your month and I will tell you if I am open.\"",
        ],
      },
      {
        heading: "Scripts 8 to 10: follow-ups and boundaries",
        paragraphs: [
          "8) Follow-up later the same day, only once: \"Still want the guide from yesterday's Reel? Here it is again: [link]. Reply STOP if you are good.\"",
          "9) Soft qualify: \"Got your comment. Are you looking for the free checklist or the paid course? Reply FREE or COURSE and I will send the right link.\"",
          "10) Close the loop after purchase: \"If you already grabbed it, ignore this. If not, here is the link again: [link].\"",
        ],
      },
      {
        heading: "When a script is doing poorly",
        paragraphs: [
          "Low opens usually mean the first line is vague or the reply landed too abruptly.",
          "Low clicks mean the offer is unclear or the landing page is slow on mobile data.",
          "High unsubscribes or angry replies mean you followed up too many times or the DM did not match the post promise.",
          "Change one variable per post, not all four at once, or you will not know what fixed it.",
        ],
      },
    ],
  },
  {
    slug: "first-comment-keyword-trigger",
    category: "Tutorial",
    title: "Your First Comment Keyword Trigger on Instagram",
    excerpt:
      "First-time setup guide: choosing a post, testing triggers, public replies, and the checklist we use before turning an automation live.",
    readTime: "2 min read",
    date: "April 28, 2026",
    author: "Liffio Team",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    gradient: "from-orange-500 to-amber-500",
    sections: [
      {
        heading: "Start with the right post",
        paragraphs: [
          "Do not test on a dead post from six months ago. Pick something recent with normal comment activity, or post fresh content this week with a clear CTA in the caption and video.",
          "Pin a comment from your own account that shows the keyword in writing. Example: \"Comment LINK and I will DM you the shop list.\"",
          "Turn off the automation on old posts when the offer expires. Nothing confuses people faster than \"here is the Black Friday link\" in March.",
        ],
      },
      {
        heading: "Create the trigger",
        paragraphs: [
          "In Liffio, go to Automations, choose Comment, select the post, and set the keyword to LINK in all caps if that is what you say on camera.",
          "Decide case sensitivity. Usually you want insensitive matching so Link and link both work.",
          "Set the public reply to something short. Creators often use \"Check your DMs\" or \"Sent.\" Keep it friendly, not corporate.",
        ],
      },
      {
        heading: "Test like you are a follower",
        paragraphs: [
          "Use a second Instagram account or ask a teammate. Comment LINK on the post.",
          "Wait the full delay you configured. Do not assume it failed at five seconds.",
          "Confirm the DM arrived, the link opens on mobile Safari or Chrome, and the public reply appeared under the comment.",
          "Delete the test comment if you want a clean comment section before ads or boosts go live.",
        ],
      },
      {
        heading: "Go live checklist",
        paragraphs: [
          "Caption mentions the keyword verbally and in text.",
          "Offer in the DM matches the offer in the video.",
          "Link works while logged out.",
          "Delay is at least 10 seconds.",
          "You have inbox notifications on so real questions get human answers the same day.",
        ],
      },
    ],
    faq: [
      {
        question: "What if someone comments the wrong word?",
        answer: "They will not get the automation. Reply manually if it is a close typo, or add a second keyword trigger for the common misspelling.",
      },
      {
        question: "Can I change the keyword after posting?",
        answer: "Yes. Update the automation, then edit the pinned comment and the spoken CTA in the video caption so everything matches.",
      },
    ],
    references: [
      {
        label: "Instagram Messaging API: Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
      {
        label: "Instagram Platform Policy: Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
    ],
  },  {
    slug: "instagram-automation-mistakes",
    category: "Tips",
    title: "5 Instagram Automation Mistakes That Cost You Followers",
    excerpt:
      "Instant DMs, keyword bait, mismatched offers, and set-and-forget flows: fix these before your next Reel goes viral.",
    readTime: "2 min read",
    date: "April 14, 2026",
    author: "Liffio Team",
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    gradient: "from-teal-500 to-cyan-600",
    sections: [
      {
        heading: "1) Zero delay on every message",
        paragraphs: [
          "If the DM lands the same second as the comment, it reads as abrupt. Use at least 10 seconds, and many accounts do better in the 20 to 45 second range.",
          "Pick a delay that fits the conversation you want: a quick reply for time-sensitive offers, a longer pause for casual content.",
        ],
      },
      {
        heading: "2) Bait keywords with no delivery",
        paragraphs: [
          "Promising a free guide and sending a sales page is how you collect blocks, not customers. Match the DM to the comment promise every time.",
          "If the freebie ran out, update the automation text the same day you update the caption.",
        ],
      },
      {
        heading: "3) Same DM for every post for a month",
        paragraphs: [
          "People who follow you will get the same pitch on unrelated content. Tie each automation to a specific post or turn it off when the offer ends.",
        ],
      },
      {
        heading: "4) Ignoring the public comment thread",
        paragraphs: [
          "Other users read the comments. If hundreds say LINK and nobody sees a reply, it looks broken even when DMs work fine. Use a short public auto-reply or pin a clarifying comment.",
        ],
      },
      {
        heading: "5) No human inbox time",
        paragraphs: [
          "Automation handles the repetitive yes. It does not handle \"my payment failed\" or \"do you ship to Kochi.\" Leave notifications on and assign one person during launch days.",
          "A good rule: automate the first message, not the entire relationship.",
        ],
      },
    ],
    faq: [
      {
        question: "How many follow-up DMs are too many?",
        answer:
          "For cold commenters, one follow-up within 24 hours is plenty. More than that and block rates climb on fashion and coaching accounts we have seen.",
      },
      ...(FEATURE_WELCOME_DM ? [{
        question: "Should I automate welcome DMs to new followers?",
        answer:
          "Only if the message is genuinely useful and infrequent. Generic \"thanks for following\" pitches annoy people who never asked to hear from you.",
      }] : []),
    ],
    references: [
      {
        label: "Instagram Platform Policy: Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
      {
        label: "Meta's Messaging Policy: Messenger Platform",
        url: "https://developers.facebook.com/docs/messenger-platform/policy",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
