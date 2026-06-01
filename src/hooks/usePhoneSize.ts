"use client";

import { useEffect, useState } from "react";
import {
  CONTENT_MIN_HEIGHT,
  deriveMobileFrameMetrics,
  FRAME_WIDTH,
  SCREEN_MIN_HEIGHT,
  type IPhoneSize,
} from "@/components/simulation/iphone-metrics";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type SimulationLayout = {
  size: IPhoneSize;
  frameWidth: number;
  screenMinHeight: number;
  contentMinHeight: number;
  isMobile: boolean;
};

/** Shared sizing for hero, features, and how-it-works coded simulations. */
export function useSimulationLayout(): SimulationLayout {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const [viewportWidth, setViewportWidth] = useState(390);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isLg) {
    return {
      size: "lg",
      frameWidth: FRAME_WIDTH.lg,
      screenMinHeight: SCREEN_MIN_HEIGHT.lg,
      contentMinHeight: CONTENT_MIN_HEIGHT.lg,
      isMobile: false,
    };
  }

  if (isMd) {
    return {
      size: "md",
      frameWidth: FRAME_WIDTH.md,
      screenMinHeight: SCREEN_MIN_HEIGHT.md,
      contentMinHeight: CONTENT_MIN_HEIGHT.md,
      isMobile: false,
    };
  }

  const mobile = deriveMobileFrameMetrics(viewportWidth);
  return {
    size: "sm",
    frameWidth: mobile.frameWidth,
    screenMinHeight: mobile.screenMinHeight,
    contentMinHeight: mobile.contentMinHeight,
    isMobile: true,
  };
}

/** @deprecated Use useSimulationLayout */
export function useFeaturePhoneSize(): IPhoneSize {
  return useSimulationLayout().size;
}

/** @deprecated Use useSimulationLayout */
export function useHeroPhoneSize(): IPhoneSize {
  return useSimulationLayout().size;
}

/** @deprecated Use useSimulationLayout().screenMinHeight */
export function useHeroScreenMinHeight(): number {
  return useSimulationLayout().screenMinHeight;
}
