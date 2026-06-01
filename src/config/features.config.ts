export type FeatureDefinition = {
  id: string;
  num: string;
  color: string;
  bg: string;
  border: string;
  tag: string;
  title: string;
  gridLabel: string;
  description: string;
  bullets: readonly string[];
  highlight: string;
};

export const FEATURE_CATEGORIES = [
  { id: "engage", label: "Engage & capture", featureIds: ["auto-comment-reply", "story-auto-reply", "live-auto-reply", "dm-auto-reply"] },
  { id: "grow", label: "Grow & convert", featureIds: ["ask-for-follow", "smart-reengage", "collect-user-data", "welcome-new-followers"] },
] as const;

export const FEATURES: readonly FeatureDefinition[] = [
  {
    id: "auto-comment-reply",
    num: "01",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.18)",
    tag: "Comments → DMs",
    title: "Auto Comment Reply",
    gridLabel: "Comment Reply",
    highlight: "Turn every comment into a private DM — on your schedule.",
    description:
      "When a follower comments a keyword on your post or reel, Liffio sends them a personalised DM and a public comment reply. Choose a custom delay from 10–60 seconds after the comment for natural, human-like timing.",
    bullets: [
      "Works on posts, reels, and carousels",
      "Unlimited keywords per campaign",
      "Sends public reply + private DM simultaneously",
    ],
  },
  {
    id: "story-auto-reply",
    num: "02",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.07)",
    border: "rgba(147,51,234,0.18)",
    tag: "Story reactions",
    title: "Story Auto Reply",
    gridLabel: "Story Reply",
    highlight: "Capture story viewers at peak interest.",
    description:
      "Liffio auto-responds the moment someone reacts, replies to, or mentions your story — capturing leads when engagement is highest.",
    bullets: [
      "Triggers on reactions, replies, and @mentions",
      "Perfect for flash sales and limited-time offers",
      "Works 24/7, even while you sleep",
    ],
  },
  {
    id: "live-auto-reply",
    num: "03",
    color: "#7c5af3",
    bg: "rgba(124,90,243,0.07)",
    border: "rgba(124,90,243,0.18)",
    tag: "Live stream DMs",
    title: "Live Auto Reply",
    gridLabel: "Live Reply",
    highlight: "Turn live streams into a revenue funnel.",
    description:
      "Monitor comments in real time and send DMs to every viewer who types a keyword — ideal for launches, Q&As, and webinars.",
    bullets: [
      "Monitors keywords during live streams",
      "Sends discount codes, links, and resources automatically",
      "Ideal for product launches and flash offers",
    ],
  },
  {
    id: "dm-auto-reply",
    num: "04",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.07)",
    border: "rgba(99,102,241,0.18)",
    tag: "Inbound DM flows",
    title: "DM Auto Reply",
    gridLabel: "DM Reply",
    highlight: "Qualify leads inside the DM thread.",
    description:
      "Build automated flows triggered by incoming DMs — from simple keyword responses to multi-step sequences with branching logic.",
    bullets: [
      "Keyword-triggered conversation flows",
      "Multi-step logic with yes/no branching",
      "Qualify leads without lifting a finger",
    ],
  },
  {
    id: "ask-for-follow",
    num: "05",
    color: "#4259f0",
    bg: "rgba(66,89,240,0.07)",
    border: "rgba(66,89,240,0.18)",
    tag: "Follow gate",
    title: "Ask for Follow",
    gridLabel: "Ask Follow",
    highlight: "Grow followers before delivering the link.",
    description:
      "Gate your content behind a follow. Before delivering the promised link or resource, Liffio prompts users to follow your account.",
    bullets: [
      "Optional follow gate before content delivery",
      "Displays your profile card inside DMs",
      "Tracks follow conversion rates in analytics",
    ],
  },
  {
    id: "smart-reengage",
    num: "06",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.18)",
    tag: "Win-back sequences",
    title: "Smart Re-engage",
    gridLabel: "Re-engage",
    highlight: "Win back warm leads automatically.",
    description:
      "Identify users who've interacted before and send timed follow-ups — converting browsers into buyers on autopilot.",
    bullets: [
      "Re-engages previous commenters and DM contacts",
      "Configurable time-based follow-up sequences",
      "Personalised message templates per segment",
    ],
  },
  {
    id: "collect-user-data",
    num: "07",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.18)",
    tag: "Lead capture",
    title: "Collect User Data",
    gridLabel: "Collect Data",
    highlight: "Build your list inside Instagram DMs.",
    description:
      "Ask followers for email, phone, or custom fields right inside a DM conversation — no external forms required.",
    bullets: [
      "Captures email, phone, and custom data",
      "Auto-exports to CSV and integrates with CRMs",
      "GDPR-compliant data handling",
    ],
  },
  {
    id: "welcome-new-followers",
    num: "08",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.18)",
    tag: "New follower DMs",
    title: "Welcome New Followers",
    gridLabel: "Welcome",
    highlight: "Make a great first impression on autopilot.",
    description:
      "When someone follows you, Liffio sends a warm, personalised welcome message on your schedule — before they see your next post.",
    bullets: [
      "Fires automatically after a new follow",
      "Personalised with @username and first name",
      "Include links, offers, or a simple hello",
    ],
  },
];

export const PLATFORM_EXTRAS = [
  { title: "Bio link pages", desc: "Branded pages with click tracking at bio.liffio.com." },
  { title: "Smart short links", desc: "Track every link delivered in DMs with UTM attribution." },
  { title: "Conversion analytics", desc: "Comment → DM → click → sale in one dashboard." },
  { title: "Team workspaces", desc: "Collaborate with VAs and managers on Pro and above." },
] as const;
