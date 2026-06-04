"use client";

import { useEffect, useState } from "react";
import CreatorsForm from "@/components/CreatorsForm";
import { TechBadge } from "@/components/TechBadge";
import { siteConfig } from "@/config/site.config";

const STATIC_BENEFITS = [
  {
    icon: "📊",
    title: "Advanced Analytics",
    description:
      "Full conversion tracking: comment → DM → click → sale. See exactly what's driving your revenue at every step of the funnel.",
    tag: "Full attribution",
  },
  {
    icon: "🔗",
    title: "Smart Link System",
    description:
      "Branded short links with click tracking and UTM attribution built in. Every link delivered inside your DMs is tracked end-to-end.",
    tag: "Click-level tracking",
  },
  {
    icon: "👥",
    title: "Team Members",
    description:
      "Invite your VA, manager, or team to collaborate on your workspace. Full role-based access included at no extra cost.",
    tag: "Up to 5 seats",
  },
  {
    icon: "⚡",
    title: "Priority Support",
    description:
      "Skip the queue. Direct access to our core team for onboarding, strategy calls, and technical help — whenever you need it.",
    tag: "Direct team access",
  },
];

function getBenefits(businessPlanValue: string) {
  return [
    {
      icon: "💎",
      title: "Free Business Plan",
      description: `Full, unrestricted access to our ${businessPlanValue} Business plan — at zero cost. Every feature, every workflow, every integration unlocked from day one.`,
      tag: `Worth ${businessPlanValue}`,
    },
    {
      icon: "♾️",
      title: "Unlimited Automations",
      description:
        "Create unlimited comment-to-DM workflows across all your posts. No caps, no throttling, no hidden limits on campaigns or keywords.",
      tag: "Unlimited workflows",
    },
    ...STATIC_BENEFITS,
  ];
}

const QUALIFICATIONS = [
  "5,000 – 100,000 Instagram followers",
  "Engagement rate above 3%",
  "Posts content at least once per week",
  "Business, marketing, fitness, or creator niche",
  "Already drives comment engagement on posts",
  "Actively sells products, courses, or services",
];

const REQUIREMENTS = [
  {
    label: "Volume",
    text: "Send at least 300 automated DMs per month via Liffio",
  },
  {
    label: "Activity",
    text: "Keep at least 2 active automation campaigns running every 30 days",
  },
  {
    label: "Branding",
    text: 'Keep the "⚡ Powered by @Liffio" tag in your bio link page footer',
  },
];

const HOW_STEPS = [
  {
    num: "1",
    title: "Apply in 2 Minutes",
    desc: "Fill out the form below with your profile details. Tell us about your content and how you engage your audience.",
  },
  {
    num: "2",
    title: "Manual Review",
    desc: "Our team reviews every application personally — no automated filters. You'll hear back with a decision within 48–72 hours.",
  },
  {
    num: "3",
    title: "Start for Free",
    desc: "Accepted creators get immediate full Business plan access — zero cost, every feature, from day one.",
  },
];

function Check({ green }: { green?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none">
      <circle cx="8" cy="8" r="8" fill={green ? "rgba(16,185,129,0.1)" : "rgba(124,90,243,0.1)"} />
      <path d="M4.5 8.5l2 2 4.5-5" stroke={green ? "#10b981" : "#7c5af3"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreatorsProgramContent({ businessPlanValue }: { businessPlanValue: string }) {
  const benefits = getBenefits(businessPlanValue);
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null);
  const [spotsCap, setSpotsCap] = useState(50);
  const [showFab, setShowFab] = useState(true);

  useEffect(() => {
    fetch("/api/creators", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        const cap = typeof data?.spotsCap === "number" && data.spotsCap > 0 ? data.spotsCap : 50;
        const remaining = typeof data?.spotsRemaining === "number"
          ? Math.max(0, Math.min(cap, data.spotsRemaining)) : cap;
        setSpotsCap(cap);
        setSpotsRemaining(remaining);
      })
      .catch(() => {
        setSpotsCap(siteConfig.creatorsProgram.spotsCap);
        setSpotsRemaining(siteConfig.creatorsProgram.spotsRemainingFallback);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFab(!entry.isIntersecting),
      { threshold: 0.1, rootMargin: "100px 0px 0px 0px" }
    );
    const target = document.getElementById("apply");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onUpdate(e: Event) {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") setSpotsRemaining(Math.max(0, detail));
    }
    window.addEventListener("creators-spots-remaining", onUpdate as EventListener);
    return () => window.removeEventListener("creators-spots-remaining", onUpdate as EventListener);
  }, []);

  return (
    <>
      {/* Sticky "Apply Now" FAB */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${showFab ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"}`}>
        <button
          onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)", boxShadow: "0 10px 40px rgba(66,89,240,0.45)" }}>
          Apply Now ↓
        </button>
      </div>

      {/* Hero */}
      <section className="py-14 sm:py-20 px-4 text-center"
        style={{ background: "linear-gradient(155deg,#f8f5ff 0%,#f0ebff 50%,#faf5ff 100%)" }}>
        <div className="mx-auto max-w-3xl">
          <TechBadge
            className="mb-6"
            label={`Creators program · only ${spotsCap} spots`}
            variant="section"
          />

          <h1 className="font-extrabold text-[#0a0a0a] leading-tight mb-5"
            style={{ fontFamily: "var(--font-outfit,sans-serif)", fontSize: "clamp(2.2rem,5vw,3.75rem)" }}>
            Get{" "}
            <span style={{ background: "linear-gradient(130deg,#a855f7,#7c5af3,#4259f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Business Plan
            </span>
            {" "}access —{" "}
            <br className="hidden sm:block" />
            completely free.
          </h1>

          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-7">
            We&apos;re selecting <strong className="text-[#0a0a0a]">{spotsCap} Instagram creators</strong> who already drive comment engagement to use Liffio&apos;s full Business plan at zero cost — in exchange for real, active usage that helps us grow organically.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            {["Free forever for approved creators", "Reviewed within 48–72 hours", "No credit card required"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "white", borderTop: "1px solid rgba(124,90,243,0.08)", borderBottom: "1px solid rgba(124,90,243,0.08)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-0">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: spotsRemaining !== null ? String(spotsRemaining) : "—",
                label: `Spots remaining out of ${spotsCap}`,
                color: "#7c5af3",
              },
              { num: businessPlanValue, label: "Value — completely free", color: "#a855f7" },
              { num: "48h", label: "Review turnaround", color: "#4259f0" },
              { num: "10+", label: "Countries represented", color: "#6366f1" },
            ].map((s, i) => (
              <div key={s.label}
                className={`px-6 py-7 text-center ${i < 3 ? "border-r border-[#ede9fd]" : ""}`}>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-outfit,sans-serif)", color: s.color }}>
                  {s.num}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7c5af3] mb-2">Getting started</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {HOW_STEPS.map(step => (
              <div key={step.num}
                className="rounded-2xl p-6 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ border: "1px solid rgba(124,90,243,0.12)", boxShadow: "0 2px 12px rgba(124,90,243,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4"
                  style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}>
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#0a0a0a] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-16 sm:py-20 px-4" style={{ background: "#faf8ff" }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7c5af3] mb-2">What you get</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a] mb-3"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}>
              Everything Included. No Strings.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Accepted creators get the full Business plan — not a trial, not limited access. Every feature, every workflow, from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(b => (
              <div key={b.title}
                className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ border: "1px solid rgba(124,90,243,0.1)", boxShadow: "0 2px 12px rgba(124,90,243,0.05)" }}>
                <div className="text-3xl mb-4">{b.icon}</div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-[#0a0a0a]">{b.title}</h3>
                  <span className="flex-shrink-0 text-[10px] font-bold rounded-full px-2.5 py-1"
                    style={{ background: "rgba(124,90,243,0.08)", color: "#7c5af3", border: "1px solid rgba(124,90,243,0.15)" }}>
                    {b.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 sm:mx-12 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.15),transparent)" }} />

      {/* Who qualifies + Requirements */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-2xl p-7 bg-white"
            style={{ border: "1px solid rgba(16,185,129,0.18)", boxShadow: "0 2px 16px rgba(16,185,129,0.05)" }}>
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#0a0a0a] mb-5">
              <span className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-base">✅</span>
              Who Qualifies
            </h3>
            <ul className="space-y-3">
              {QUALIFICATIONS.map(q => (
                <li key={q} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check green />{q}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-7 bg-white"
            style={{ border: "1px solid rgba(124,90,243,0.18)", boxShadow: "0 2px 16px rgba(124,90,243,0.06)" }}>
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#0a0a0a] mb-2">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: "rgba(124,90,243,0.08)" }}>📋</span>
              What We Ask in Return
            </h3>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              The program is free — but it&apos;s not passive. We need creators who actively use the platform.
            </p>
            <ul className="space-y-4">
              {REQUIREMENTS.map((r, i) => (
                <li key={r.label} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}>
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c5af3] block mb-0.5">
                      {r.label}
                    </span>
                    <span className="text-sm text-gray-600">{r.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-16 sm:py-20 px-4"
        style={{ background: "linear-gradient(155deg,#f8f5ff,#f0ebff 60%,#faf5ff)" }}>
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7c5af3] mb-2">Application</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a] mb-3"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}>
              Apply to the Creators Program
            </h2>
            <p className="text-gray-500 text-sm">
              Takes under 2 minutes · Reviewed within 48 hours · No credit card required
            </p>
            {spotsRemaining !== null && (
              <TechBadge
                className="mt-4"
                label={
                  spotsRemaining > 0
                    ? `${spotsRemaining} of ${spotsCap} spots remaining`
                    : "All spots claimed — join waitlist"
                }
                variant="chip"
                accent="#10b981"
                format="label"
              />
            )}
          </div>

          <div className="rounded-3xl bg-white p-7 sm:p-9"
            style={{ border: "1px solid rgba(124,90,243,0.14)", boxShadow: "0 8px 40px rgba(124,90,243,0.12)" }}>
            <CreatorsForm />
          </div>
        </div>
      </section>
    </>
  );
}
