"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 100,
    suffix: "K+",
    label: "DMs automated",
    context: "Sent every month for creators worldwide",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.16)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    value: 2,
    suffix: "K+",
    label: "Active creators",
    context: "From nano-influencers to enterprise brands",
    color: "#7c5af3",
    bg: "rgba(124,90,243,0.08)",
    border: "rgba(124,90,243,0.16)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    value: 98,
    suffix: "%",
    label: "Delivery rate",
    context: "vs. 72% industry average",
    color: "#4259f0",
    bg: "rgba(66,89,240,0.08)",
    border: "rgba(66,89,240,0.16)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: 99,
    suffix: ".9%",
    label: "Platform uptime",
    context: "SLA-backed, monitored 24/7",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.16)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-7.5 10.5 7.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 9.75v7.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
] as const;

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  stat,
  animate,
}: {
  stat: (typeof stats)[number];
  animate: boolean;
}) {
  const count = useCountUp(stat.value, 1600, animate);

  return (
    <article
      className="group relative flex flex-col rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(66,89,240,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(66,89,240,0.1)] sm:p-6"
      style={{ borderColor: stat.border }}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
      />

      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}
      >
        {stat.icon}
      </div>

      <p
        className="text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl"
        style={{ fontFamily: "var(--font-outfit,sans-serif)", color: "#0a0a0a" }}
      >
        {count}
        <span
          style={{
            background: "linear-gradient(130deg,#a855f7,#7c5af3,#4259f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {stat.suffix}
        </span>
      </p>

      <p className="mt-1.5 text-sm font-semibold text-gray-800">{stat.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{stat.context}</p>
    </article>
  );
}

export default function StatsSection() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimate(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div
          className="absolute -top-24 left-1/2 h-64 w-[min(900px,90vw)] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(124,90,243,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-wide uppercase"
            style={{
              color: "#7c5af3",
              borderColor: "rgba(124,90,243,0.2)",
              background: "rgba(124,90,243,0.06)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#a855f7,#4259f0)" }}
            />
            Platform metrics
          </span>
          <p className="mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Built for scale — trusted by creators who automate Instagram at volume.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} animate={animate} />
          ))}
        </div>
      </div>

      <div
        className="mx-auto mt-14 h-px max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)",
        }}
      />
    </section>
  );
}
