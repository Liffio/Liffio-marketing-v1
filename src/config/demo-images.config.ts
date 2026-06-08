/**
 * Unsplash (free license) - used in marketing simulations only.
 * URLs verified via images.unsplash.com (no auto=format - avoids 404s on removed assets).
 * @see https://unsplash.com/license
 */

const q = (w: number) => `w=${w}&q=80`;

export const DEMO_POST_IMAGES = [
  `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?${q(800)}`,
  `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?${q(800)}`,
  `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?${q(800)}`,
  `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?${q(800)}`,
] as const;

export type DemoSlideIndex = 0 | 1 | 2 | 3;

export const DEMO_ACCOUNT_PHOTOS: Record<DemoSlideIndex, string> = {
  0: `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?${q(128)}`,
  1: `https://images.unsplash.com/photo-1574680096145-d05b474e2155?${q(128)}`,
  2: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?${q(128)}`,
  3: `https://images.unsplash.com/photo-1596462502278-27bfdc403348?${q(128)}`,
};

/** Commenter / DM participant portraits */
export const DEMO_USER_PHOTOS: Record<string, string> = {
  "john.deals": `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?${q(128)}`,
  "thesaraofficial": `https://images.unsplash.com/photo-1494790108377-be9c29b29330?${q(128)}`,
  "alex.lifts": `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?${q(128)}`,
  "fitgirl.nina": `https://images.unsplash.com/photo-1517841905240-472988babdf9?${q(128)}`,
  "foodie.raj": `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?${q(128)}`,
  "sara.eats": `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?${q(128)}`,
  "beauty.olivia": `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?${q(128)}`,
  "skincare.nina": `https://images.unsplash.com/photo-1544005313-94ddf0286df2?${q(128)}`,
};
