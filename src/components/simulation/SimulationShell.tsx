import type { ReactNode } from "react";
import { LiffioLogoMark } from "@/components/Logo";

type SimulationShellProps = {
  label: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero";
};

/** Purple gradient wrapper with live badge - wraps iPhone (or other) demos. */
export function SimulationShell({
  label,
  children,
  className = "",
  variant = "default",
}: SimulationShellProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`relative w-full overflow-hidden ${isHero ? "rounded-2xl p-3 sm:rounded-[32px] sm:p-6 md:p-7" : "rounded-2xl p-2.5 sm:rounded-[28px] sm:p-5"} ${className}`}
      style={
        isHero
          ? {
              background:
                "linear-gradient(145deg, rgba(245,240,255,0.95) 0%, rgba(237,232,254,0.9) 45%, rgba(248,245,255,0.95) 100%)",
              border: "1px solid rgba(124,90,243,0.2)",
              boxShadow:
                "0 24px 80px rgba(66,89,240,0.18), 0 8px 32px rgba(124,90,243,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
            }
          : {
              background: "linear-gradient(145deg,#f5f0ff,#ffe4e6 55%,#f8f5ff)",
              border: "1px solid rgba(124,90,243,0.16)",
              boxShadow: "0 20px 60px rgba(66,89,240,0.13), 0 4px 16px rgba(124,90,243,0.08)",
            }
      }
    >
      {isHero && (
        <>
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl hero-orb-a"
            style={{ background: "rgba(168,85,247,0.25)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full opacity-50 blur-3xl hero-orb-b"
            style={{ background: "rgba(66,89,240,0.2)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] hero-shimmer"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
            }}
            aria-hidden
          />
        </>
      )}

      <div
        className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 backdrop-blur-md ${
          isHero ? "top-5 shadow-lg ring-1 ring-[#f5184c]/15" : "top-4 shadow-sm"
        }`}
        style={{ border: "1px solid rgba(124,90,243,0.12)" }}
      >
        <LiffioLogoMark theme="light" size="xs" className="!h-3.5" />
        
      </div>

      <div className={`flex w-full justify-center ${isHero ? "mt-7 sm:mt-10" : "mt-6 sm:mt-8"}`}>
        <div className="w-full max-w-full">{children}</div>
      </div>
    </div>
  );
}
