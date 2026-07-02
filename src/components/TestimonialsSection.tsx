"use client";

import { useCallback, useRef, useState } from "react";
import { TechBadge } from "@/components/TechBadge";

const testimonials = [
  {
    name: "Om Bhesania",
    role: "Beta Tester",
    quote:
      "Set it up on a Reel at midnight and woke up to 80 DMs sent automatically. Would've taken hours to do that manually.",
    avatar: "OB",
    gradient: "linear-gradient(135deg,#f5184c,#b20d8f)",
  },
  {
    name: "Ryan Callahan",
    role: "Beta Tester",
    quote:
      "I get a ton of comments asking for my program link every time I post. Had to set a reminder to reply before bed and still missed loads. Set up the keyword trigger and it just runs now.",
    avatar: "RC",
    gradient: "linear-gradient(135deg,#10b981,#b20d8f)",
  },
  {
    name: "Shivam Thakkar",
    role: "Beta Tester",
    quote:
      "Used to wake up every morning and manually reply to everyone who commented overnight. First automation run, all of them got replies automatically while I slept.",
    avatar: "ST",
    gradient: "linear-gradient(135deg,#ff7c49,#f5184c)",
  },
  {
    name: "Sophie Mercer",
    role: "Beta Tester",
    quote:
      "Was sceptical because tools like this always felt spammy. The delay and tone of the DM actually felt like me. First automation went live on a collab post and handled everything overnight.",
    avatar: "SM",
    gradient: "linear-gradient(135deg,#b20d8f,#ff7c49)",
  },
  {
    name: "Vishal Motimani",
    role: "Beta Tester",
    quote:
      "Connected Instagram in 2 minutes and the first keyword trigger worked on the first try. Haven't touched the inbox for that post since.",
    avatar: "VM",
    gradient: "linear-gradient(135deg,#b20d8f,#f97316)",
  },
  {
    name: "Aisha Al-Farsi",
    role: "Beta Tester",
    quote:
      "Comment-to-DM for product drops is exactly what I needed. Launch posts used to need someone monitoring comments for hours. This handles the link delivery automatically.",
    avatar: "AF",
    gradient: "linear-gradient(135deg,#f97316,#b20d8f)",
  },
  {
    name: "Lippi Patel",
    role: "Beta Tester",
    quote:
      "Was spending 2–3 hours every evening just replying to DMs from comments. This takes care of all of that automatically. Massive time saver.",
    avatar: "LP",
    gradient: "linear-gradient(135deg,#ff7c49,#b20d8f)",
  },
  {
    name: "Jake Thornton",
    role: "Beta Tester",
    quote:
      "Managing comment automations across five client accounts manually was killing us. Moved the first two to Liffio and it's working cleanly. Will be moving the others this week.",
    avatar: "JT",
    gradient: "linear-gradient(135deg,#14b8a6,#b20d8f)",
  },
  {
    name: "Dhanraj",
    role: "Beta Tester",
    quote:
      "Set up the LINK trigger and tested it myself - got the DM in under a minute. Simple but actually works.",
    avatar: "DH",
    gradient: "linear-gradient(135deg,#f97316,#f5184c)",
  },
  {
    name: "Pratham Panchal",
    role: "Beta Tester",
    quote:
      "The INR pricing alone is a win for Indian creators. Finally something built for us that isn't priced in USD.",
    avatar: "PP",
    gradient: "linear-gradient(135deg,#b20d8f,#f5184c)",
  },
  {
    name: "Dhairya Thumar",
    role: "Beta Tester",
    quote:
      "The delay feature is what sold me - doesn't feel like a bot when the DM arrives 30 seconds later. Followers actually reply back.",
    avatar: "DT",
    gradient: "linear-gradient(135deg,#10b981,#f97316)",
  },
  {
    name: "Shlok Patel",
    role: "Beta Tester",
    quote:
      "Tested on a small post first and the public reply + DM both landed correctly. Setup took maybe 5 mins. Works exactly as described.",
    avatar: "SP",
    gradient: "linear-gradient(135deg,#f5184c,#ff7c49)",
  },
] as const;

const track = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <article className="flex w-[min(100vw-2rem,340px)] shrink-0 flex-col rounded-2xl border border-brand-100/80 bg-white p-5 shadow-[0_2px_12px_rgba(245, 24, 76,0.06)] sm:w-[340px]">
      <blockquote className="text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</blockquote>
      <footer className="mt-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: t.gradient }}
        >
          {t.avatar}
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
            Loved by Creators and Brands
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
