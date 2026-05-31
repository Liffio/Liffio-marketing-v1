"use client";

import { useEffect, useState, useRef } from "react";
import { siteConfig } from "@/config/site.config";

// ─── Icons & badges ───────────────────────────────────────────────────────────

const MetaLogo = () => (
  <svg viewBox="0 0 512 512" className="h-4 w-4 flex-shrink-0">
    <defs>
      <linearGradient id="mlg" x1="0%" x2="100%">
        <stop offset="0%" stopColor="#0064e0" /><stop offset="100%" stopColor="#0080f9" />
      </linearGradient>
    </defs>
    <path fill="url(#mlg)" d="m149.4 89.4c-81.6 0-144.1 106.2-144.1 218.5 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111l36.9-65.2 31.2-52.8c26.5-40.9 48.4-61.3 74.4-61.3 54 0 97.2 79.5 97.2 177.2 0 37.2-12.2 58.8-37.5 58.8-24.2 0-35.8-16-81.8-90l-42.3 36.9c47.9 80.2 74.6 107.4 123 107.4 55.5 0 86.4-45.1 86.4-116.9 0-117.7-63.9-216.5-141.6-216.5-41.1 0-73.3 31-102.4 70.3l-32.3 47.4c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165z"/>
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0" fill="none">
    <circle cx="8" cy="8" r="8" fill="url(#ckg)" />
    <defs>
      <linearGradient id="ckg" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" /><stop offset="1" stopColor="#4259f0" />
      </linearGradient>
    </defs>
    <path d="M4.5 8.5l2 2 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Demo data ────────────────────────────────────────────────────────────────

const postGradients = [
  "linear-gradient(150deg,#e91e8c,#c2185b 50%,#880e4f)",
  "linear-gradient(150deg,#1a1a2e,#16213e 50%,#0f3460)",
  "linear-gradient(150deg,#3d1a0f,#8b4513 50%,#d2691e)",
  "linear-gradient(150deg,#1b5e20,#388e3c 50%,#66bb6a)",
];
const postIcons = ["👗", "🏋️", "🍽️", "💄"];

const demos = [
  {
    account: "art_apparel", accountInit: "AA",
    accountGradient: "linear-gradient(135deg,#f06292,#e91e63)",
    keyword: "FASHION",
    caption: 'art_apparel Comment "FASHION" below\nand I\'ll DM you the link! 🔥',
    steps: [
      { user: "john.deals",      msg: "Fashion 🔥",                             time: "2m ago",         isReply: false },
      { user: "art_apparel",     msg: "Hey John! Here's your exclusive link 👇", time: "Sent instantly", isReply: true,  cta: "Open Link" },
      { user: "thesaraofficial", msg: "Fashion 💕",                             time: "Just now",       isReply: false },
      { user: "art_apparel",     msg: "Hey Sara! Here's your link 👇",           time: "Sent instantly", isReply: true,  cta: "Open Link" },
    ],
  },
  {
    account: "sculpt_gym", accountInit: "SG",
    accountGradient: "linear-gradient(135deg,#607d8b,#263238)",
    keyword: "FIT",
    caption: 'sculpt_gym Comment "FIT" to get\nyour free workout plan 💪',
    steps: [
      { user: "alex.lifts",   msg: "FIT 💪",                                    time: "3m ago",         isReply: false },
      { user: "sculpt gym",   msg: "Hey Alex! Free workout plan inside 👇",      time: "Sent instantly", isReply: true,  cta: "Get Plan" },
      { user: "fitgirl.nina", msg: "FIT 🏆",                                    time: "Just now",       isReply: false },
      { user: "sculpt gym",   msg: "Hey Nina! Free workout plan inside 👇",      time: "Sent instantly", isReply: true,  cta: "Get Plan" },
    ],
  },
  {
    account: "the_plated_story", accountInit: "PS",
    accountGradient: "linear-gradient(135deg,#bf8040,#7c4f1e)",
    keyword: "ORDER",
    caption: 'the_plated_story Comment "ORDER" to get\nour menu & delivery link 🍽️',
    steps: [
      { user: "foodie.raj",       msg: "ORDER 😍",                               time: "1m ago",         isReply: false },
      { user: "The Plated Story", msg: "Hey! Here's our menu & order link 👇",   time: "Sent instantly", isReply: true,  cta: "Order Now" },
      { user: "sara.eats",        msg: "ORDER 🙌",                               time: "Just now",       isReply: false },
      { user: "The Plated Story", msg: "Hey Sara! Menu & order link below 👇",   time: "Sent instantly", isReply: true,  cta: "Order Now" },
    ],
  },
  {
    account: "glowskin.co", accountInit: "GS",
    accountGradient: "linear-gradient(135deg,#ce93d8,#7b1fa2)",
    keyword: "GLOW",
    caption: 'glowskin.co Comment "GLOW" to get\nyour personalised skincare kit! ✨',
    steps: [
      { user: "beauty.olivia", msg: "GLOW ✨",                                  time: "2m ago",         isReply: false },
      { user: "glowskin.co",   msg: "Hey Olivia! Your exclusive kit below 👇",  time: "Sent instantly", isReply: true,  cta: "Get Kit" },
      { user: "skincare.nina", msg: "GLOW 🌟",                                  time: "Just now",       isReply: false },
      { user: "glowskin.co",   msg: "Hey Nina! Your skincare kit is here 👇",    time: "Sent instantly", isReply: true,  cta: "Get Kit" },
    ],
  },
];

function Av({ name, gradient, size = 7 }: { name: string; gradient: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size * 4, height: size * 4, fontSize: size <= 7 ? 9 : 11, background: gradient, minWidth: size * 4, minHeight: size * 4 }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const stepTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const demo = demos[activeSlide];

  const animateSteps = () => {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
    setVisibleSteps([]);
    [400, 1300, 2400, 3200].forEach((d, i) => {
      stepTimers.current.push(setTimeout(() => setVisibleSteps(p => [...p, i]), d));
    });
  };

  const goToSlide = (idx: number) => {
    if (idx === activeSlide) return;
    setTransitioning(true);
    setTimeout(() => { setActiveSlide(idx); setTransitioning(false); }, 280);
  };

  useEffect(() => { animateSteps(); }, [activeSlide]);
  useEffect(() => {
    slideTimer.current = setTimeout(() => goToSlide((activeSlide + 1) % demos.length), 5800);
    return () => { if (slideTimer.current) clearTimeout(slideTimer.current); };
  }, [activeSlide]);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[640px] h-[640px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 -left-32 w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(66,89,240,0.05) 0%, transparent 60%)" }} />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.018 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hg" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#7c5af3" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-18 lg:pt-20 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div className="max-w-xl">

            {/* Meta badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-7"
              style={{ background: "rgba(0,100,224,0.07)", border: "1px solid rgba(0,128,249,0.2)" }}>
              <MetaLogo />
              <span className="text-xs font-bold text-[#0064e0] tracking-wide">Official Meta Tech Provider</span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-[#0a0a0a] leading-[1.06] tracking-tight"
              style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2.6rem,5vw,4.5rem)" }}>
              Turn Instagram<br />
              Comments Into{" "}
              <span style={{ background: "linear-gradient(130deg,#a855f7 0%,#7c5af3 40%,#4259f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Automated DMs
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg">
              Liffio is the #1 Instagram DM automation platform. Auto-reply to every comment, story, live stream, and DM — share links, capture leads, and grow your audience 24/7 while you sleep.
            </p>

            {/* Feature bullets */}
            {/* <ul className="mt-6 space-y-2.5">
              {[
                "Replies sent in under 2 seconds, around the clock",
                "Works on comments, stories, live streams & DMs",
                "Multi-step AI-powered conversation sequences",
                "100% Meta-compliant — officially verified partner",
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check /><span>{b}</span>
                </li>
              ))}
            </ul> */}

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={siteConfig.urls.appSignup}
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)", boxShadow: "0 6px 24px rgba(66,89,240,0.35)" }}>
                Get Started Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold text-gray-700 bg-white transition-all duration-200 hover:border-[#c4b8f5] hover:text-[#7c5af3] hover:shadow-md"
                style={{ borderColor: "#e5e0f8" }}>
                <svg className="h-4 w-4 text-[#7c5af3]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  "linear-gradient(135deg,#a855f7,#7c5af3)",
                  "linear-gradient(135deg,#4259f0,#7c5af3)",
                  "linear-gradient(135deg,#ec4899,#a855f7)",
                  "linear-gradient(135deg,#10b981,#4259f0)",
                  "linear-gradient(135deg,#f97316,#ec4899)",
                ].map((g, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: g }}>
                    {["SC","MJ","ER","DP","LT"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500"><strong className="text-gray-700">2,000+</strong> creators growing on autopilot</p>
              </div>
            </div>
          </div>

          {/* ── Right: animated demo ──────────────────────────────────── */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating card: speed */}
            <div className="absolute -top-4 left-0 z-20 hidden lg:flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 animate-float"
              style={{ boxShadow: "0 4px 24px rgba(66,89,240,0.14)", border: "1px solid rgba(124,90,243,0.12)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: "rgba(66,89,240,0.08)" }}>⚡</div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 leading-none">Avg. response time</p>
                <p className="text-sm font-bold text-[#0a0a0a] mt-0.5">1.2 seconds</p>
              </div>
            </div>

            {/* Floating card: activity */}
            <div className="absolute -bottom-4 right-0 z-20 hidden lg:flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 animate-float-slow"
              style={{ boxShadow: "0 4px 24px rgba(66,89,240,0.14)", border: "1px solid rgba(124,90,243,0.12)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: "rgba(168,85,247,0.08)" }}>💬</div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 leading-none">DMs sent today</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-bold text-[#0a0a0a]">+247</p>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">↑ 18%</span>
                </div>
              </div>
            </div>

            {/* Demo card */}
            <div className="relative rounded-[28px] p-4 overflow-hidden"
              style={{
                background: "linear-gradient(145deg,#f5f0ff,#ede8fe 55%,#f8f5ff)",
                border: "1px solid rgba(124,90,243,0.16)",
                boxShadow: "0 20px 60px rgba(66,89,240,0.13), 0 4px 16px rgba(124,90,243,0.08)",
              }}>

              {/* Live indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white rounded-full px-3 py-1"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid rgba(124,90,243,0.12)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Live Demo</span>
              </div>

              <div className="flex gap-3 items-start mt-2"
                style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.28s ease" }}>

                {/* Instagram post */}
                <div className="bg-white rounded-2xl overflow-hidden flex-shrink-0"
                  style={{ width: 280, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>

                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Av name={demo.accountInit} gradient={demo.accountGradient} size={8} />
                      <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">{demo.account}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" />
                    </svg>
                  </div>

                  <div className="relative overflow-hidden" style={{ height: 200, background: postGradients[activeSlide] }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ fontSize: 58, opacity: 0.3 }}>{postIcons[activeSlide]}</span>
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <span className="bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                        Comment &ldquo;<span className="text-[#c084fc]">{demo.keyword}</span>&rdquo;
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-2 flex items-center gap-3 border-b border-gray-50">
                    <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-line">{demo.caption}</p>
                  </div>

                  <div className="flex justify-center gap-1.5 pb-3">
                    {demos.map((_, i) => (
                      <button key={i} onClick={() => goToSlide(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === activeSlide ? 16 : 6, height: 6, background: i === activeSlide ? "linear-gradient(90deg,#7c5af3,#4259f0)" : "#e5e7eb" }} />
                    ))}
                  </div>
                </div>

                {/* DM panel */}
                <div className="flex flex-col gap-2 pt-8 flex-shrink-0" style={{ width: 185 }}>
                  {demo.steps.map((step, i) => {
                    const visible = visibleSteps.includes(i);
                    return (
                      <div key={`${activeSlide}-${i}`}
                        className="transition-all duration-500"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", pointerEvents: visible ? "auto" : "none" }}>
                        <div className="bg-white rounded-xl px-2.5 py-2"
                          style={{ boxShadow: "0 2px 10px rgba(66,89,240,0.09)", border: "1px solid rgba(124,90,243,0.09)" }}>
                          <div className="flex items-start gap-1.5">
                            <Av name={step.isReply ? demo.accountInit : step.user}
                              gradient={step.isReply ? demo.accountGradient : "linear-gradient(135deg,#94a3b8,#475569)"} size={6} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-bold text-gray-800 truncate">{step.user}</p>
                              <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">{step.msg}</p>
                              {step.cta && (
                                <div className="mt-1 rounded-md px-2 py-0.5 text-center"
                                  style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}>
                                  <span className="text-[8px] text-white font-bold">{step.cta}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-[8px] text-gray-400 px-1 mt-0.5">{step.time}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="h-px mx-6 rounded-full" style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }} />
    </section>
  );
}
