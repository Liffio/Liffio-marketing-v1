export type IPhoneSize = "xs" | "sm" | "md" | "lg";

export const FRAME_WIDTH: Record<IPhoneSize, number> = {
  xs: 200,
  sm: 248,
  md: 268,
  lg: 300,
};

/** Default display content area min-heights - keep in sync with shell screen min-heights. */
export const SCREEN_MIN_HEIGHT: Record<IPhoneSize, number> = {
  xs: 300,
  sm: 380,
  md: 452,
  lg: 500,
};

export const CONTENT_MIN_HEIGHT: Record<IPhoneSize, number> = {
  xs: 260,
  sm: 300,
  md: 380,
  lg: 440,
};

const BEZEL_PADDING_X = 20;

export function getDisplayWidth(shellOuterWidth: number) {
  return shellOuterWidth - BEZEL_PADDING_X;
}

/** Fluid width for phones on narrow viewports - same aspect ratio everywhere. */
export function deriveMobileFrameMetrics(viewportWidth: number) {
  const frameWidth = Math.min(300, Math.max(248, Math.round((viewportWidth - 40) * 0.82)));
  const screenMinHeight = Math.round(frameWidth * 1.62);
  const contentMinHeight = Math.round(frameWidth * 1.28);
  return { frameWidth, screenMinHeight, contentMinHeight };
}

/** Hardware button positions scaled from the lg (300px) reference frame. */
export function getHardwareButtonLayout(frameWidth: number) {
  const s = frameWidth / FRAME_WIDTH.lg;
  return {
    scale: s,
    show: frameWidth >= 220,
    volUp: { top: Math.round(92 * s), height: Math.round(28 * s) },
    volDown: { top: Math.round(132 * s), height: Math.round(44 * s) },
    power: { top: Math.round(112 * s), height: Math.round(56 * s) },
  };
}

/** Layout derived from iPhone 14/15 Pro (393×852 pt) - scaled to display width. */
export function getIPhoneMetrics(displayWidth: number) {
  const s = displayWidth / 393;
  const islandTop = Math.round(11 * s);
  const islandHeight = Math.round(37 * s);
  const timeSize = Math.max(10, Math.round(15 * s * 0.72));

  return {
    displayWidth,
    statusHeight: Math.round(59 * s),
    islandTop,
    islandWidth: Math.round(126 * s),
    islandHeight,
    islandRadius: Math.round(20 * s),
    sideInset: Math.round(27 * s),
    clusterOffsetY: Math.round(islandTop + islandHeight / 2 - timeSize / 2),
    timeSize,
    iconGap: Math.max(3, Math.round(5 * s)),
    homeBarWidth: Math.round(134 * s),
    homeBarHeight: Math.max(4, Math.round(5 * s)),
  };
}
