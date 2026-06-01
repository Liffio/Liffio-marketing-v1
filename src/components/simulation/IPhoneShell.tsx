"use client";

import type { ReactNode } from "react";
import {
  FRAME_WIDTH,
  getDisplayWidth,
  getHardwareButtonLayout,
  getIPhoneMetrics,
  SCREEN_MIN_HEIGHT,
  type IPhoneSize,
} from "@/components/simulation/iphone-metrics";
import { IPhoneStatusBar } from "@/components/simulation/IPhoneStatusBar";
import { useSimulationLayout } from "@/hooks/usePhoneSize";

export type { IPhoneSize };

type IPhoneShellProps = {
  children: ReactNode;
  size?: IPhoneSize;
  /** Uses shared viewport sizing when true (feature / how-it-works demos). */
  responsive?: boolean;
  screenMinHeight?: number;
  className?: string;
  screenClassName?: string;
  /** Status glyphs on the display — use `dark` for live / dark full-screen sims. */
  statusBarTheme?: "light" | "dark";
  statusTime?: string;
  batteryPercent?: number;
};

/** iPhone 14/15 Pro frame — Dynamic Island on the display with iOS status bar layout. */
export function IPhoneShell({
  children,
  size = "md",
  responsive = false,
  screenMinHeight,
  className = "",
  screenClassName = "",
  statusBarTheme = "light",
  statusTime = "9:41",
  batteryPercent = 100,
}: IPhoneShellProps) {
  const layout = useSimulationLayout();
  const resolvedSize = responsive ? layout.size : size;
  const width = responsive ? layout.frameWidth : FRAME_WIDTH[resolvedSize];
  const displayWidth = getDisplayWidth(width);
  const minH =
    screenMinHeight ??
    (responsive ? layout.screenMinHeight : SCREEN_MIN_HEIGHT[resolvedSize]);
  const metrics = getIPhoneMetrics(displayWidth);
  const hw = getHardwareButtonLayout(width);
  const isCompact = resolvedSize === "xs" || (responsive && layout.isMobile);
  const bezelRound = isCompact ? "rounded-[2.35rem]" : "rounded-[2.85rem]";
  const screenRound = isCompact ? "rounded-[1.75rem]" : "rounded-[2.15rem]";
  const bezelPad = isCompact ? "p-[7px]" : "p-[10px]";

  return (
    <div
      className={`relative mx-auto w-full max-w-full ${className}`}
      style={{ width, maxWidth: "100%" }}
    >
      <div
        className={`relative overflow-hidden bg-[#1c1c1e] ${bezelRound} ${bezelPad}`}
        style={{
          paddingBottom: isCompact ? 9 : 12,
          boxShadow: isCompact
            ? "0 16px 48px rgba(0,0,0,0.35), 0 6px 18px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 32px 80px rgba(0,0,0,0.42), 0 10px 28px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {hw.show && (
          <>
            <div
              className="absolute -left-[2px] w-[3px] rounded-l-sm bg-[#3a3a3c]"
              style={{ top: hw.volUp.top, height: hw.volUp.height }}
              aria-hidden
            />
            <div
              className="absolute -left-[2px] w-[3px] rounded-l-sm bg-[#3a3a3c]"
              style={{ top: hw.volDown.top, height: hw.volDown.height }}
              aria-hidden
            />
            <div
              className="absolute -right-[2px] w-[3px] rounded-r-sm bg-[#3a3a3c]"
              style={{ top: hw.power.top, height: hw.power.height }}
              aria-hidden
            />
          </>
        )}

        <div
          className={`relative flex flex-col overflow-hidden bg-white ${screenRound} ${screenClassName}`}
          style={{ minHeight: minH }}
        >
          <IPhoneStatusBar
            shellWidth={displayWidth}
            theme={statusBarTheme}
            time={statusTime}
            batteryPercent={batteryPercent}
          />

          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

          <div className="flex shrink-0 justify-center pb-2 pt-1.5">
            <div
              className="rounded-full bg-black"
              style={{
                width: metrics.homeBarWidth,
                height: metrics.homeBarHeight,
                opacity: 0.22,
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
