"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const stats = [
  { id: "api", value: "Official", label: "Instagram API" },
  { id: "compliant", value: "100%", label: "Meta-compliant" },
  { id: "delay", value: "10–60s", label: "Human-like DM delay" },
  { id: "free", value: "Free", label: "No credit card required" },
] as const;

function StatValue({ stat, visible, delayMs }: { stat: (typeof stats)[number]; visible: boolean; delayMs: number }) {
  return (
    <div
      className="stats-figure relative flex min-w-0 flex-1 flex-col items-center justify-center py-1"
      style={{ transitionDelay: `${delayMs}ms` }}
      data-visible={visible ? "true" : "false"}
      aria-label={`${stat.value} — ${stat.label}`}
    >
      <span
        className="stats-figure__ghost pointer-events-none absolute inset-0 flex items-center justify-center select-none whitespace-nowrap text-[clamp(2.5rem,7vw,4.75rem)] font-black leading-none text-brand-500/[0.07]"
        style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
        aria-hidden
      >
        {stat.value}
      </span>
      <div className="relative z-[1] flex flex-col items-center gap-2">
        <p
          className="stats-figure__value whitespace-nowrap text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold leading-none tracking-tight gradient-text"
          style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
        >
          {stat.value}
        </p>
        <p className="text-center text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">{stat.label}</p>
      </div>
    </div>
  );
}

function StatSeparator() {
  return (
    <div
      className="hidden h-10 w-px shrink-0 sm:block"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(124,90,243,0.35), transparent)",
      }}
      aria-hidden
    />
  );
}

export default function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="stats-band relative overflow-hidden border-y border-brand-100/50"
      aria-label="Platform trust signals"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f3f0ff]/90 via-white to-white"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(124,90,243,0.04) 1px, transparent 1px), linear-gradient(rgba(124,90,243,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 items-stretch gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-5 lg:gap-6">
          {stats.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 ? <StatSeparator /> : null}
              <StatValue stat={s} visible={visible} delayMs={i * 120} />
            </Fragment>
          ))}
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(640px,80%)] -translate-x-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(124,90,243,0.25), transparent)",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
