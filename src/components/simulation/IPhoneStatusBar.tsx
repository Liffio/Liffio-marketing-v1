import { getIPhoneMetrics } from "@/components/simulation/iphone-metrics";

type IPhoneStatusBarProps = {
  /** Visible display width inside the bezel (not outer frame width). */
  shellWidth: number;
  /** Light = dark text (Instagram / light apps). Dark = white text on dark backgrounds. */
  theme?: "light" | "dark";
  time?: string;
  batteryPercent?: number;
};

/** iOS location-services arrow (small, northeast). */
function LocationServicesIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ marginTop: -0.5 }}
    >
      <path
        d="M3.2 8.4 8.4 3.2M8.4 3.2H5.6M8.4 3.2V5.9"
        stroke={color}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CellularIcon({ color, scale }: { color: string; scale: number }) {
  const w = Math.round(17 * scale);
  const h = Math.round(11 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 17 11" fill="none" aria-hidden>
      <rect x="0" y="6" width="3" height="5" rx="0.6" fill={color} />
      <rect x="4.5" y="4" width="3" height="7" rx="0.6" fill={color} />
      <rect x="9" y="2" width="3" height="9" rx="0.6" fill={color} />
      <rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={color} opacity="0.35" />
    </svg>
  );
}

function WifiIcon({ color, scale }: { color: string; scale: number }) {
  const w = Math.round(15 * scale);
  return (
    <svg width={w} height={Math.round(11 * scale)} viewBox="0 0 16 12" fill={color} aria-hidden>
      <path d="M8 10.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
      <path
        d="M8 7.4c1.8 0 3.4-.7 4.6-1.9l1.1 1.1c-1.5 1.5-3.6 2.4-5.7 2.4s-4.2-.9-5.7-2.4l1.1-1.1c1.2 1.2 2.8 1.9 4.6 1.9z"
        opacity="0.75"
      />
      <path
        d="M8 4.6c2.8 0 5.3-1.1 7.2-2.9l1.1 1.1C14 4.7 11.1 6.2 8 6.2S2 4.7.7 2.8l1.1-1.1C3.7 3.5 6.2 4.6 8 4.6z"
        opacity="0.45"
      />
    </svg>
  );
}

function BatteryIcon({
  color,
  percent,
  scale,
}: {
  color: string;
  percent: number;
  scale: number;
}) {
  const w = Math.round(27 * scale);
  const h = Math.round(13 * scale);
  const fontSize = Math.max(8, Math.round(11 * scale * 0.78));
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div className="relative flex items-center" style={{ width: w + 3, height: h }} aria-hidden>
      <div
        className="relative flex items-center justify-center rounded-[4px] border-[1.5px]"
        style={{
          width: w,
          height: h,
          borderColor: color,
          opacity: 0.5,
        }}
      >
        <span
          className="font-bold tabular-nums leading-none"
          style={{ fontSize, color, letterSpacing: "-0.04em" }}
        >
          {pct}
        </span>
      </div>
      <div
        className="rounded-r-[1.5px]"
        style={{
          width: Math.max(2, Math.round(2 * scale)),
          height: Math.round(5 * scale),
          background: color,
          opacity: 0.5,
          marginLeft: 1,
        }}
      />
    </div>
  );
}

/**
 * Status bar on the display (not the bezel): Dynamic Island centered with gap above,
 * time + location left, cellular / Wi‑Fi / battery right — matches iPhone 14/15 Pro.
 */
export function IPhoneStatusBar({
  shellWidth,
  theme = "light",
  time = "9:41",
  batteryPercent = 100,
}: IPhoneStatusBarProps) {
  const m = getIPhoneMetrics(shellWidth);
  const scale = shellWidth / 393;
  const fg = theme === "light" ? "#000000" : "#ffffff";
  const locSize = Math.max(8, Math.round(10 * scale));

  return (
    <div
      className="pointer-events-none relative z-30 w-full shrink-0"
      style={{ height: m.statusHeight }}
      aria-hidden
    >
      {/* Dynamic Island — inset from top of display */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-black"
        style={{
          top: m.islandTop,
          width: m.islandWidth,
          height: m.islandHeight,
          borderRadius: m.islandRadius,
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06) inset",
        }}
      />

      {/* Left: time + location arrow */}
      <div
        className="absolute flex items-center"
        style={{
          left: m.sideInset,
          top: m.clusterOffsetY,
          gap: m.iconGap,
        }}
      >
        <span
          className="font-semibold leading-none tabular-nums"
          style={{
            fontSize: m.timeSize,
            color: fg,
            letterSpacing: "-0.02em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
          }}
        >
          {time}
        </span>
        <LocationServicesIcon size={locSize} color={fg} />
      </div>

      {/* Right: signal, Wi‑Fi, battery % */}
      <div
        className="absolute flex items-center"
        style={{
          right: m.sideInset,
          top: m.clusterOffsetY - 1,
          gap: m.iconGap,
        }}
      >
        <CellularIcon color={fg} scale={scale} />
        <WifiIcon color={fg} scale={scale} />
        <BatteryIcon color={fg} percent={batteryPercent} scale={scale} />
      </div>
    </div>
  );
}
