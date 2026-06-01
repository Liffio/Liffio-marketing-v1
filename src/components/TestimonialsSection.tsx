"use client";

import { useCallback, useRef, useState } from "react";
import { TechBadge } from "@/components/TechBadge";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fashion Influencer, 250K Followers",
    quote:
      "Liffio has completely transformed how I handle my DMs. I went from spending 3 hours a day responding to messages to having everything automated. My engagement rate has doubled.",
    avatar: "SC",
    gradient: "linear-gradient(135deg,#a855f7,#7c5af3)",
  },
  {
    name: "Marcus Johnson",
    role: "E-commerce Brand Owner",
    quote:
      "We integrated Liffio with our comment-to-DM campaigns and saw a 340% increase in conversions. The keyword triggers are incredibly powerful for driving sales.",
    avatar: "MJ",
    gradient: "linear-gradient(135deg,#4259f0,#7c5af3)",
  },
  {
    name: "Elena Rodriguez",
    role: "Digital Marketing Agency CEO",
    quote:
      "Managing DMs for 15+ client accounts used to be a nightmare. With Liffio, our team saves over 40 hours per week. The analytics make our reports look amazing too.",
    avatar: "ER",
    gradient: "linear-gradient(135deg,#ec4899,#a855f7)",
  },
  {
    name: "David Park",
    role: "Fitness Coach, 180K Followers",
    quote:
      "The keyword trigger feature alone has generated over $50K in course sales. Setting up comment-to-DM flows took minutes and the results were immediate.",
    avatar: "DP",
    gradient: "linear-gradient(135deg,#10b981,#4259f0)",
  },
  {
    name: "Lisa Thompson",
    role: "Beauty Brand Founder",
    quote:
      "We moved from manual DM outreach to fully automated workflows. Our team saves 30+ hours weekly and response rates have tripled since using Liffio.",
    avatar: "LT",
    gradient: "linear-gradient(135deg,#f97316,#ec4899)",
  },
  {
    name: "James Wilson",
    role: "Real Estate Entrepreneur",
    quote:
      "Liffio helped us build a lead pipeline through Instagram that we never thought possible. The contact management features are game-changing for follow-ups.",
    avatar: "JW",
    gradient: "linear-gradient(135deg,#14b8a6,#4259f0)",
  },
] as const;

const track = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <article className="flex w-[min(100vw-2rem,340px)] shrink-0 flex-col rounded-2xl border border-brand-100/80 bg-white p-5 shadow-[0_2px_12px_rgba(124,90,243,0.06)] sm:w-[340px]">
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
