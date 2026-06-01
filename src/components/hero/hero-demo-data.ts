import {
  DEMO_ACCOUNT_PHOTOS,
  DEMO_POST_IMAGES,
  DEMO_USER_PHOTOS,
  type DemoSlideIndex,
} from "@/config/demo-images.config";

export type DemoStep = {
  user: string;
  msg: string;
  time: string;
  isReply: boolean;
  cta?: string;
  photoUrl?: string;
};

export type HeroDemo = {
  slide: DemoSlideIndex;
  account: string;
  accountInit: string;
  accountGradient: string;
  accountPhoto: string;
  postImage: string;
  postAlt: string;
  keyword: string;
  caption: string;
  accent: string;
  accentGlow: string;
  steps: DemoStep[];
};

export const HERO_DEMOS: HeroDemo[] = [
  {
    slide: 0,
    account: "art_apparel",
    accountInit: "AA",
    accountGradient: "linear-gradient(135deg,#f06292,#e91e63)",
    accountPhoto: DEMO_ACCOUNT_PHOTOS[0],
    postImage: DEMO_POST_IMAGES[0],
    postAlt: "Fashion apparel flat lay",
    keyword: "FASHION",
    caption: 'art_apparel Comment "FASHION" below and I\'ll DM you the link.',
    accent: "#e91e63",
    accentGlow: "rgba(233,30,99,0.35)",
    steps: [
      { user: "john.deals", msg: "FASHION", time: "2m ago", isReply: false, photoUrl: DEMO_USER_PHOTOS["john.deals"] },
      { user: "art_apparel", msg: "Hey John! Here's your exclusive link.", time: "Auto-sent", isReply: true, cta: "Open Link" },
      { user: "thesaraofficial", msg: "FASHION", time: "Just now", isReply: false, photoUrl: DEMO_USER_PHOTOS["thesaraofficial"] },
      { user: "art_apparel", msg: "Hey Sara! Here's your link.", time: "Auto-sent", isReply: true, cta: "Open Link" },
    ],
  },
  {
    slide: 1,
    account: "sculpt_gym",
    accountInit: "SG",
    accountGradient: "linear-gradient(135deg,#607d8b,#263238)",
    accountPhoto: DEMO_ACCOUNT_PHOTOS[1],
    postImage: DEMO_POST_IMAGES[1],
    postAlt: "Gym workout session",
    keyword: "FIT",
    caption: 'sculpt_gym Comment "FIT" to get your free workout plan.',
    accent: "#546e7a",
    accentGlow: "rgba(84,110,122,0.35)",
    steps: [
      { user: "alex.lifts", msg: "FIT", time: "3m ago", isReply: false, photoUrl: DEMO_USER_PHOTOS["alex.lifts"] },
      { user: "sculpt gym", msg: "Hey Alex! Free workout plan inside.", time: "Auto-sent", isReply: true, cta: "Get Plan" },
      { user: "fitgirl.nina", msg: "FIT", time: "Just now", isReply: false, photoUrl: DEMO_USER_PHOTOS["fitgirl.nina"] },
      { user: "sculpt gym", msg: "Hey Nina! Free workout plan inside.", time: "Auto-sent", isReply: true, cta: "Get Plan" },
    ],
  },
  {
    slide: 2,
    account: "the_plated_story",
    accountInit: "PS",
    accountGradient: "linear-gradient(135deg,#bf8040,#7c4f1e)",
    accountPhoto: DEMO_ACCOUNT_PHOTOS[2],
    postImage: DEMO_POST_IMAGES[2],
    postAlt: "Restaurant food spread",
    keyword: "ORDER",
    caption: 'the_plated_story Comment "ORDER" to get our menu and delivery link.',
    accent: "#bf8040",
    accentGlow: "rgba(191,128,64,0.35)",
    steps: [
      { user: "foodie.raj", msg: "ORDER", time: "1m ago", isReply: false, photoUrl: DEMO_USER_PHOTOS["foodie.raj"] },
      { user: "The Plated Story", msg: "Hey! Here's our menu and order link.", time: "Auto-sent", isReply: true, cta: "Order Now" },
      { user: "sara.eats", msg: "ORDER", time: "Just now", isReply: false, photoUrl: DEMO_USER_PHOTOS["sara.eats"] },
      { user: "The Plated Story", msg: "Hey Sara! Menu and order link below.", time: "Auto-sent", isReply: true, cta: "Order Now" },
    ],
  },
  {
    slide: 3,
    account: "glowskin.co",
    accountInit: "GS",
    accountGradient: "linear-gradient(135deg,#ce93d8,#7b1fa2)",
    accountPhoto: DEMO_ACCOUNT_PHOTOS[3],
    postImage: DEMO_POST_IMAGES[3],
    postAlt: "Skincare products",
    keyword: "GLOW",
    caption: 'glowskin.co Comment "GLOW" to get your personalised skincare kit.',
    accent: "#9c27b0",
    accentGlow: "rgba(156,39,176,0.35)",
    steps: [
      { user: "beauty.olivia", msg: "GLOW", time: "2m ago", isReply: false, photoUrl: DEMO_USER_PHOTOS["beauty.olivia"] },
      { user: "glowskin.co", msg: "Hey Olivia! Your exclusive kit below.", time: "Auto-sent", isReply: true, cta: "Get Kit" },
      { user: "skincare.nina", msg: "GLOW", time: "Just now", isReply: false, photoUrl: DEMO_USER_PHOTOS["skincare.nina"] },
      { user: "glowskin.co", msg: "Hey Nina! Your skincare kit is here.", time: "Auto-sent", isReply: true, cta: "Get Kit" },
    ],
  },
];

export const CREATOR_AVATAR_PHOTOS = [
  DEMO_USER_PHOTOS["thesaraofficial"],
  DEMO_USER_PHOTOS["alex.lifts"],
  DEMO_USER_PHOTOS["foodie.raj"],
  DEMO_USER_PHOTOS["beauty.olivia"],
  DEMO_USER_PHOTOS["skincare.nina"],
];
