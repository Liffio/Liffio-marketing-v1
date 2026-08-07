"use client";

import { useCallback, useRef, useState } from "react";
import { TechBadge } from "@/components/TechBadge";

function initialsOf(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const testimonials = [  {
    name: "R. C.",
    role: "Beta Tester",
    quote:
      "I get a ton of comments asking for my program link every time I post. Had to set a reminder to reply before bed and still missed loads. Set up the keyword trigger and it just runs now.",
    gradient: "linear-gradient(135deg,#10b981,#b20d8f)",
  },  {
    name: "S. M.",
    role: "Beta Tester",
    quote:
      "Was sceptical because tools like this always felt spammy. The delay and tone of the DM matched my brand voice. First automation went live on a collab post and handled everything overnight.",
    gradient: "linear-gradient(135deg,#b20d8f,#ff7c49)",
  },  {
    name: "A. A.",
    role: "Beta Tester",
    quote:
      "Comment-to-DM for product drops is exactly what I needed. Launch posts used to need someone monitoring comments for hours. This handles the link delivery automatically.",
    gradient: "linear-gradient(135deg,#f97316,#b20d8f)",
  },
  {
    name: "L. P.",
    role: "Beta Tester",
    quote:
      "Was spending 2–3 hours every evening just replying to DMs from comments. This takes care of all of that automatically. Massive time saver.",
    gradient: "linear-gradient(135deg,#ff7c49,#b20d8f)",
  },
  {
    name: "J. T.",
    role: "Beta Tester",
    quote:
      "Managing comment automations across five client accounts manually was killing us. Moved the first two to Liffio and it's working cleanly. Will be moving the others this week.",
    gradient: "linear-gradient(135deg,#14b8a6,#b20d8f)",
  },
  {
    name: "D.",
    role: "Beta Tester",
    quote:
      "Set up the LINK trigger and tested it myself - got the DM in under a minute. Simple but actually works.",
    gradient: "linear-gradient(135deg,#f97316,#f5184c)",
  },  {
    name: "D. T.",
    role: "Beta Tester",
    quote:
      "The delay feature is what sold me - the 30-second pause makes the conversation feel natural. Followers actually reply back.",
    gradient: "linear-gradient(135deg,#10b981,#f97316)",
  },] as const;

const track = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <article className="flex w-[min(100vw-2rem,340px)] shrink-0 flex-col rounded-2xl border border-border bg-white p-5 shadow-sm sm:w-[340px]">
      <blockquote className="text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</blockquote>
      <footer className="mt-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: t.gradient }}
        >
          {initialsOf(t.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0a0a0a]">{t.name}</p>
          <p className="text-xs text-gray-400">{t.role}</p>
        </div>
      </footer>
    </article>
  );
}

export default function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseBriefly = useCallback(() => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), 3500);
  }, []);

  return (
    <section className="overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <TechBadge label="Testimonials" variant="section" className="mb-4" />
          <h2
            className="text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            What Our Beta Testers Say
          </h2>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={pauseBriefly}
        onPointerDown={pauseBriefly}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20"
          aria-hidden
        />

        <div className="overflow-hidden">
          <div
            className={`testimonials-marquee flex w-max gap-4 pl-4 sm:gap-5 sm:pl-6${paused ? " testimonials-marquee--paused" : ""}`}
            aria-live="off"
          >
            {track.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
