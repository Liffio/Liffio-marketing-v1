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

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-turn-instagram-comments-into-dms",
    category: "Automation",
    title: "How to Turn Instagram Comments Into DMs Automatically",
    excerpt:
      "A practical walkthrough for comment-to-DM setup: picking keywords, writing messages people actually open, and testing before a post goes viral.",
    readTime: "8 min read",
    date: "May 15, 2026",
    author: "Liffio Team",
    publishedAt: "2026-05-15",
    updatedAt: "2026-05-15",
    gradient: "from-blue-500 to-indigo-600",
    sections: [
      {
        heading: "What comment-to-DM actually does",
        paragraphs: [
          "You post a Reel or carousel and tell people to comment a word if they want the link, guide, or discount code. When Instagram sees that comment, a tool sends them a DM with whatever you promised. You are not sitting in your inbox copying the same message four hundred times.",
          "The setup is simple on paper: one trigger word, one DM template, one delay so it does not feel robotic. The hard part is choosing a keyword your audience already understands and writing a DM that sounds like you, not like a blast from a marketing bot.",
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
          "Connect Instagram through Meta login so you are on the official API, not a grey-market login that risks the account.",
          "Create a Comment automation, choose the post or Reel, and type the trigger exactly as you want it matched. Most teams use \"contains\" matching so GUIDE also catches \"guide please\".",
          "Write the DM in two or three short lines. Put the link on its own line or use a button if you are on a paid plan. Set the delay to something between 15 and 45 seconds. Instant DMs feel fake; a half-minute pause feels like a human grabbed their phone.",
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
          "Tools that use Meta's official messaging APIs and reasonable send delays are built for this use case. Avoid instant blasts, identical spammy copy, and third-party apps that ask for your password.",
      },
      {
        question: "Can I use more than one keyword on the same post?",
        answer:
          "You can run separate automations per keyword, or use multi-step flows on paid plans if you want different messages for LINK vs PRICE on one post.",
      },
    ],
    references: [
      {
        label: "Instagram Messaging API — Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
      {
        label: "Instagram Platform Policy — Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
    ],
  },
  {
    slug: "manychat-alternatives",
    category: "Strategy",
    title: "ManyChat Alternatives for Instagram DM Automation (2026)",
    excerpt:
      "An honest look at ManyChat, SendDM, Zorcha, and Liffio: pricing models, what Instagram features you actually get, and who each tool fits.",
    readTime: "11 min read",
    date: "June 1, 2026",
    author: "Liffio Team",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
    gradient: "from-violet-500 to-purple-600",
    sections: [
      {
        heading: "Why people leave ManyChat for something else",
        paragraphs: [
          "ManyChat is the name everyone knows. It works across Facebook Messenger, Instagram, and more. That breadth is useful if you run ads to a Messenger bot. It is heavier than necessary if Instagram comments and DMs are ninety percent of your workflow.",
          "The complaints we hear most often are not about missing features. They are about contact-based pricing on automations, flow builders that take an afternoon to learn, and Instagram-only creators paying for channels they never open.",
          "If your business is \"comment this word, get a DM,\" you may not need a general chatbot platform. You need reliable comment triggers, sane limits, and clear monthly pricing.",
        ],
      },
      {
        heading: "What to compare before you switch",
        paragraphs: [
          "Check whether automated Instagram DMs are capped per month or per contact. Some tools look cheap until a Reel blows up and you hit an overage.",
          "See if multiple Instagram accounts are included or billed separately. Agencies and creator managers care about this on day one.",
          "Ask whether story replies, live comment triggers, and welcome DMs are native or add-ons.",
          "If you sell in India, confirm INR checkout and GST-friendly invoices. USD-only billing is a real friction point for Indian creators.",
        ],
      },
      {
        heading: "ManyChat vs Liffio for Instagram-only work",
        paragraphs: [
          "Both handle keyword comment-to-DM, story reply automations, and follow-up sequences. ManyChat has a longer track record and a huge template library. Liffio is built around Instagram growth workflows: unlimited automated DMs on every plan, post scheduling, bio links, and short links in the same account.",
          "ManyChat's free tier is workable for experiments but tight for always-on Instagram campaigns. Liffio's free plan is meant to run comment-to-DM in production, not just as a demo.",
          "If you already invested months in ManyChat flows, migration is mostly copy and recreate, not a magic import button. Budget an hour per active automation.",
        ],
      },
      {
        heading: "SendDM, LinkDM, SuperProfile, Zorcha",
        paragraphs: [
          "SendDM and LinkDM are focused products. You get comment-to-DM and related Instagram triggers without much else. That is great if you want minimal UI and you already use separate tools for scheduling and analytics.",
          "SuperProfile leans hard into bio link storefronts. Automation exists, but the product story centers the link-in-bio page. Creators who live in the bio page often start there; creators who live in Reels comments often want the automation product first.",
          "Zorcha is popular with Indian creators and agencies who want local pricing and support hours that match IST. Compare feature parity on live automation and team seats, not just the rupee price on the landing page.",
          "Liffio sits in the middle: Instagram automation is the core, but scheduling, go.liffio.com short links, and lead capture mean you can replace two or three subscriptions over time.",
        ],
      },
      {
        heading: "A sane migration checklist",
        paragraphs: [
          "Screenshot your active ManyChat flows: trigger words, delay settings, DM text, and public comment replies.",
          "Reconnect Instagram inside the new tool with Meta login. Revoke old tokens if you are decommissioning the old account entirely.",
          "Recreate your highest revenue automation first, usually the main LINK comment flow on your best recent Reel.",
          "Run both tools in parallel for five to seven days on a smaller post before you move the big campaign. Watch for duplicate DMs, which confuse people fast.",
          "Tell your audience once if the keyword changed. Silence is fine; unnecessary drama is not.",
        ],
      },
    ],
    faq: [
      {
        question: "Is Liffio really free to start?",
        answer:
          "Yes. You can connect Instagram and run comment-to-DM on the free plan without a card. Paid plans add flows, API access, and team features.",
      },
      {
        question: "Do agencies use Liffio?",
        answer:
          "The Agency plan includes client workspaces and white-label options so one team can manage multiple brands without sharing passwords.",
      },
    ],
    references: [
      {
        label: "Instagram Messaging API — Meta for Developers",
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
    readTime: "9 min read",
    date: "May 10, 2026",
    author: "Liffio Team",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-10",
    gradient: "from-purple-500 to-pink-500",
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
          "Emoji reactions: treat carefully. A fire emoji might mean hype, not \"send me the sales page.\" Many creators only auto-DM on text replies for that reason.",
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
          "Only if you sound robotic. Use plain language, reasonable delays, and turn off automations on posts that are not offers.",
      },
    ],
  },
  {
    slug: "instagram-dm-scripts-that-convert",
    category: "Strategy",
    title: "10 Instagram DM Scripts That Actually Get Replies",
    excerpt:
      "Real templates for coaches, shops, and creators: the opener, the link handoff, the gentle follow-up, and when not to send another message.",
    readTime: "10 min read",
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
          "8) Follow-up 24 hours later, only once: \"Still want the guide from yesterday's Reel? Here it is again: [link]. Reply STOP if you are good.\"",
          "9) Soft qualify: \"Got your comment. Are you looking for the free checklist or the paid course? Reply FREE or COURSE and I will send the right link.\"",
          "10) Close the loop after purchase: \"If you already grabbed it, ignore this. If not, here is the link again: [link].\"",
        ],
      },
      {
        heading: "When a script is doing poorly",
        paragraphs: [
          "Low opens usually mean the first line is vague or the delay was instant and felt bot-like.",
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
    readTime: "6 min read",
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
        label: "Instagram Messaging API — Meta for Developers",
        url: "https://developers.facebook.com/docs/messenger-platform/instagram",
      },
      {
        label: "Instagram Platform Policy — Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
    ],
  },
  {
    slug: "fashion-brand-dm-automation-case-study",
    category: "Case Study",
    title: "How a D2C Fashion Brand Used Comment-to-DM for Launch Week",
    excerpt:
      "A simplified case study from a six-person team: what they posted, which keywords they used, and how DMs fed their Shopify drop without a custom dev build.",
    readTime: "9 min read",
    date: "April 20, 2026",
    author: "Liffio Team",
    publishedAt: "2026-04-20",
    updatedAt: "2026-04-20",
    gradient: "from-pink-500 to-rose-600",
    sections: [
      {
        heading: "The situation going in",
        paragraphs: [
          "The brand sells limited-run streetwear drops on Shopify. Instagram Reels drive waitlist hype, but the team was manually DMing links after each drop teaser. On the last drop, two people handled inbox for nine hours and still missed several hundred comments.",
          "They did not need a complex chatbot. They needed every COMMENT that said DROP to receive the early access link within a minute, while the founders slept before launch morning.",
        ],
      },
      {
        heading: "What they posted",
        paragraphs: [
          "Three Reels in one week. Each ended with the same instruction: comment DROP for the secret cart link.",
          "They pinned their own comment repeating the keyword and showing an example.",
          "Stories pointed back to the latest Reel instead of introducing a second keyword, which kept reporting simple.",
        ],
      },
      {
        heading: "Automation layout",
        paragraphs: [
          "One comment automation per Reel, all using the DROP keyword, same DM body, 30 second delay.",
          "Public reply: \"Sent to your DMs. Check requests if you do not see it.\"",
          "DM copy: \"Early access cart for the drop: [shop link]. Password EARLY works until 10am IST. Reply SIZE if you need the fit guide.\"",
          "A follow-up automation fired only on paid plans when someone replied SIZE, sending a size chart image and link to returns policy.",
        ],
      },
      {
        heading: "Results they tracked",
        paragraphs: [
          "Roughly 4,200 trigger comments across the three Reels.",
          "About 3,100 unique DM conversations started by automation.",
          "Shopify reported 680 orders tagged with the early access UTM in the DM link within 48 hours.",
          "The team still answered about 90 manual threads about shipping to non-serviceable pincodes. Automation did not remove support; it removed copy-paste.",
        ],
      },
      {
        heading: "What they would do differently",
        paragraphs: [
          "They would cap the follow-up SIZE bot to one message instead of two, because a few customers felt nagged.",
          "They would publish the keyword in the Reel caption text, not only spoken audio, after seeing misspellings like DORP.",
          "They would pause the automation two hours after sellout to avoid sending dead links.",
        ],
      },
    ],
  },
  {
    slug: "instagram-automation-mistakes",
    category: "Tips",
    title: "5 Instagram Automation Mistakes That Cost You Followers",
    excerpt:
      "Instant DMs, keyword bait, mismatched offers, and set-and-forget flows: fix these before your next Reel goes viral.",
    readTime: "7 min read",
    date: "April 14, 2026",
    author: "Liffio Team",
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    gradient: "from-teal-500 to-cyan-600",
    sections: [
      {
        heading: "1) Zero delay on every message",
        paragraphs: [
          "If the DM lands the same second as the comment, people assume bot. Use at least 10 seconds, and many accounts do better in the 20 to 45 second range.",
          "Vary delay slightly between campaigns if your tool allows it so the pattern is less mechanical.",
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
          "For cold commenters, one follow-up after 24 hours is plenty. More than that and block rates climb on fashion and coaching accounts we have seen.",
      },
      {
        question: "Should I automate welcome DMs to new followers?",
        answer:
          "Only if the message is genuinely useful and infrequent. Generic \"thanks for following\" pitches annoy people who never asked to hear from you.",
      },
    ],
    references: [
      {
        label: "Instagram Platform Policy — Meta",
        url: "https://developers.facebook.com/docs/instagram-platform/overview",
      },
      {
        label: "Meta's Messaging Policy — Messenger Platform",
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
