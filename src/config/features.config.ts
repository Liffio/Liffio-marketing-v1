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
  { id: "engage", label: "Engage & capture", featureIds: ["auto-comment-reply", "story-auto-reply", "dm-auto-reply"] },
  { id: "grow", label: "Grow & convert", featureIds: ["ask-for-follow", "smart-reengage", "collect-user-data", "welcome-new-followers"] },
] as const;

export const FEATURES: readonly FeatureDefinition[] = [
  {
    id: "auto-comment-reply",
    num: "01",
    color: "#ff7c49",
    bg: "rgba(255, 124, 73,0.07)",
    border: "rgba(255, 124, 73,0.18)",
    tag: "Auto DM + Auto Comment",
    title: "Auto Comment Reply",
    gridLabel: "Auto Comment",
    highlight: "The signature auto DM tool feature - comment to DM automation.",
    description:
      "When a follower comments a keyword on your post or reel, Liffio sends them an auto DM and a public auto comment reply. This comment-to-DM automation is the core feature of any Instagram auto DM tool - with configurable 10–60 second reply delays.",
    bullets: [
      "Auto DM + auto comment reply in one workflow",
      "Unlimited keyword triggers per campaign",
      "Works on posts, reels, and carousels",
    ],
  },
  {
    id: "story-auto-reply",
    num: "02",
    color: "#0f74c5",
    bg: "rgba(15,116,197,0.07)",
    border: "rgba(15,116,197,0.18)",
    tag: "Story Auto DM",
    title: "Story Auto Reply",
    gridLabel: "Story Auto DM",
    highlight: "Auto DMs from story reactions and mentions.",
    description:
      "Liffio sends auto DMs the moment someone reacts, replies to, or mentions your story - capturing leads at peak interest. Story auto reply is a must-have feature for any Instagram auto DM tool.",
    bullets: [
      "Auto DM on reactions, replies, and @mentions",
      "Perfect for flash sales and limited-time offers",
      "Auto DMs work 24/7, even while you sleep",
    ],
  },
  {
    id: "dm-auto-reply",
    num: "03",
    color: "#2ea957",
    bg: "rgba(46,169,87,0.07)",
    border: "rgba(46,169,87,0.18)",
    tag: "Inbound Auto DM",
    title: "DM Auto Reply",
    gridLabel: "DM Auto Reply",
    highlight: "Auto DM flows for inbound messages.",
    description:
      "Build automated DM flows triggered by incoming messages - from simple keyword auto replies to multi-step sequences with branching logic. This DM automation tool feature qualifies leads inside the thread.",
    bullets: [
      "Keyword-triggered auto DM flows",
      "Multi-step DM automation with branching",
      "Qualify leads without lifting a finger",
    ],
  },
  {
    id: "ask-for-follow",
    num: "04",
    color: "#b20d8f",
    bg: "rgba(178, 13, 143,0.07)",
    border: "rgba(178, 13, 143,0.18)",
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
    num: "05",
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.07)",
    border: "rgba(20,184,166,0.18)",
    tag: "Follow-up sequences",
    title: "Follow-up Sequences",
    gridLabel: "Follow-ups",
    highlight: "Timed follow-ups inside active conversations.",
    description:
      "Send timed follow-up messages inside an active DM conversation - a reminder, a second link, or the next step in your flow.",
    bullets: [
      "Timed follow-ups within an active DM conversation",
      "Configurable delay per step",
      "Personalised message templates per flow",
    ],
  },
  {
    id: "collect-user-data",
    num: "06",
    color: "#ee7a1f",
    bg: "rgba(238,122,31,0.07)",
    border: "rgba(238,122,31,0.18)",
    tag: "Lead capture",
    title: "Collect User Data",
    gridLabel: "Collect Data",
    highlight: "Build your list inside Instagram DMs.",
    description:
      "Ask followers for email, phone, or custom fields right inside a DM conversation - no external forms required.",
    bullets: [
      "Captures email, phone, and custom data",
      "Auto-exports to CSV and integrates with CRMs",
      "GDPR-compliant data handling",
    ],
  },
  {
    id: "welcome-new-followers",
    num: "07",
    color: "#ad36a7",
    bg: "rgba(173,54,167,0.07)",
    border: "rgba(173,54,167,0.18)",
    tag: "New follower DMs",
    title: "Welcome New Followers",
    gridLabel: "Welcome",
    highlight: "Make a great first impression on autopilot.",
    description:
      "When someone follows you, Liffio sends a warm, personalised welcome message on your schedule - before they see your next post.",
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
  { title: "Team workspaces", desc: "Collaborate with VAs and managers on Starter and above." },
] as const;
