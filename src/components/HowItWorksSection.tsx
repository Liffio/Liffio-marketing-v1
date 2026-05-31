"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site.config";

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.18)",
    title: "Create Your Free Account",
    detail:
      "Get started in under 60 seconds — no credit card, no complicated onboarding. Your Liffio account is provisioned instantly.",
    note: "Takes less than 60 seconds",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    num: "02",
    color: "#7c5af3",
    bg: "rgba(124,90,243,0.07)",
    border: "rgba(124,90,243,0.18)",
    title: "Connect Your Instagram",
    detail:
      "One-click OAuth via official Meta APIs. As an Official Meta Tech Provider, every connected account stays 100% secure and fully compliant with Instagram's terms of service.",
    note: "Official Meta Tech Provider",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    ),
  },
  {
    num: "03",
    color: "#4259f0",
    bg: "rgba(66,89,240,0.07)",
    border: "rgba(66,89,240,0.18)",
    title: "Launch & Watch It Work",
    detail:
      "Set your keyword triggers, choose your automation type, write your DM template, and go live. Liffio handles the rest — 24 hours a day, 7 days a week. Most users send their first automated DM within 5 minutes.",
    note: "First DM sent in under 5 minutes",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7l-.586.6"
        />
      </svg>
    ),
  },
] as const;

// ─── Animation hook ───────────────────────────────────────────────────────────

function usePhaseAnimation(phases: number[], animKey: number, loop = true) {
  const [phase, setPhase] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase(-1);

    phases.forEach((delay, i) => {
      timers.current.push(setTimeout(() => setPhase(i), delay));
    });

    if (loop) {
      const total = Math.max(...phases) + 3200;
      timers.current.push(setTimeout(run, total));
    }
  };

  useEffect(() => {
    run();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  return phase;
}

function Av({ label, gradient, size = 7 }: { label: string; gradient: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size * 4,
        height: size * 4,
        fontSize: size <= 7 ? 9 : 11,
        background: gradient,
        minWidth: size * 4,
        minHeight: size * 4,
      }}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}

function SimShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-[28px] p-5 overflow-hidden w-full"
      style={{
        background: "linear-gradient(145deg,#f5f0ff,#ede8fe 55%,#f8f5ff)",
        border: "1px solid rgba(124,90,243,0.16)",
        boxShadow: "0 20px 60px rgba(66,89,240,0.13), 0 4px 16px rgba(124,90,243,0.08)",
      }}
    >
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white rounded-full px-3 py-1"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid rgba(124,90,243,0.12)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{label}</span>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

// ─── Step 1: Signup simulation ────────────────────────────────────────────────

function SignupSim({ animKey }: { animKey: number }) {
  const phase = usePhaseAnimation([300, 900, 1500, 2100, 2800], animKey);
  const email = "sara@creator.com";
  const typedEmail = phase >= 1 ? email : "";
  const showPassword = phase >= 2;
  const buttonActive = phase >= 3;
  const success = phase >= 4;

  return (
    <SimShell label="Step 1 · Sign Up">
      <div className="bg-white rounded-2xl p-5 mx-auto max-w-[320px]" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <div className="text-center mb-5">
          <div
            className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-xs font-black"
            style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}
          >
            L
          </div>
          <p className="text-sm font-bold text-gray-900">Create your free account</p>
          <p className="text-[10px] text-gray-400 mt-0.5">No credit card required</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Email</label>
            <div
              className="mt-1 rounded-lg border px-3 py-2 text-[11px] text-gray-800 flex items-center gap-1 transition-all duration-300"
              style={{ borderColor: phase >= 1 ? "#7c5af3" : "#e5e7eb", background: phase >= 1 ? "rgba(124,90,243,0.03)" : "#fafafa" }}
            >
              {typedEmail || <span className="text-gray-300">you@email.com</span>}
              {phase === 1 && <span className="w-0.5 h-3.5 bg-[#7c5af3] animate-pulse ml-0.5" />}
            </div>
          </div>

          <div
            className="transition-all duration-500"
            style={{ opacity: showPassword ? 1 : 0.35, transform: showPassword ? "translateY(0)" : "translateY(4px)" }}
          >
            <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Password</label>
            <div
              className="mt-1 rounded-lg border px-3 py-2 text-[11px] tracking-widest text-gray-600"
              style={{ borderColor: showPassword ? "#7c5af3" : "#e5e7eb", background: showPassword ? "rgba(124,90,243,0.03)" : "#fafafa" }}
            >
              {showPassword ? "••••••••" : ""}
            </div>
          </div>

          <button
            className="w-full rounded-xl py-2.5 text-[11px] font-bold text-white transition-all duration-300"
            style={{
              background: buttonActive ? "linear-gradient(135deg,#7c5af3,#4259f0)" : "#e5e7eb",
              color: buttonActive ? "white" : "#9ca3af",
              boxShadow: buttonActive ? "0 4px 16px rgba(66,89,240,0.35)" : "none",
              transform: phase === 3 ? "scale(0.97)" : "scale(1)",
            }}
          >
            Create Free Account
          </button>
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-500"
          style={{
            opacity: success ? 1 : 0,
            transform: success ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] font-bold text-green-700">Account created in 47 seconds</span>
        </div>
      </div>
    </SimShell>
  );
}

// ─── Step 2: Connect Instagram simulation ─────────────────────────────────────

const MetaLogo = () => (
  <svg viewBox="0 0 512 512" className="h-5 w-5 flex-shrink-0">
    <defs>
      <linearGradient id="hiw-mlg" x1="0%" x2="100%">
        <stop offset="0%" stopColor="#0064e0" />
        <stop offset="100%" stopColor="#0080f9" />
      </linearGradient>
    </defs>
    <path
      fill="url(#hiw-mlg)"
      d="m149.4 89.4c-81.6 0-144.1 106.2-144.1 218.5 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111l36.9-65.2 31.2-52.8c26.5-40.9 48.4-61.3 74.4-61.3 54 0 97.2 79.5 97.2 177.2 0 37.2-12.2 58.8-37.5 58.8-24.2 0-35.8-16-81.8-90l-42.3 36.9c47.9 80.2 74.6 107.4 123 107.4 55.5 0 86.4-45.1 86.4-116.9 0-117.7-63.9-216.5-141.6-216.5-41.1 0-73.3 31-102.4 70.3l-32.3 47.4c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165z"
    />
  </svg>
);

function ConnectSim({ animKey }: { animKey: number }) {
  const phase = usePhaseAnimation([400, 1100, 1900, 2700], animKey);
  const connecting = phase >= 1 && phase < 3;
  const connected = phase >= 3;

  return (
    <SimShell label="Step 2 · Connect">
      <div className="bg-white rounded-2xl p-5 mx-auto max-w-[340px]" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-900">Connected Accounts</p>
          <span className="text-[9px] text-gray-400">Dashboard</span>
        </div>

        {/* Disconnected card */}
        <div
          className="rounded-xl border p-4 transition-all duration-500"
          style={{
            borderColor: connected ? "rgba(16,185,129,0.25)" : "rgba(124,90,243,0.15)",
            background: connected ? "rgba(16,185,129,0.04)" : "rgba(124,90,243,0.03)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
              style={{
                background: connected
                  ? "linear-gradient(135deg,#f06292,#e91e63)"
                  : "linear-gradient(135deg,#f3f4f6,#e5e7eb)",
              }}
            >
              {connected ? (
                <Av label="AA" gradient="linear-gradient(135deg,#f06292,#e91e63)" size={8} />
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-900">
                {connected ? "@art_apparel" : "Instagram not connected"}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">
                {connected ? "Business account · Verified" : "Connect to start automating DMs"}
              </p>
            </div>
            {connected && (
              <div className="flex items-center gap-1 rounded-full px-2 py-0.5 bg-green-50 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[8px] font-bold text-green-700">Live</span>
              </div>
            )}
          </div>

          {!connected && (
            <button
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-bold text-white transition-all duration-300"
              style={{
                background: phase >= 0 ? "linear-gradient(135deg,#0064e0,#0080f9)" : "#e5e7eb",
                boxShadow: phase >= 0 ? "0 4px 14px rgba(0,100,224,0.3)" : "none",
                transform: phase === 0 ? "scale(0.97)" : "scale(1)",
              }}
            >
              <MetaLogo />
              Connect with Meta
            </button>
          )}
        </div>

        {/* OAuth popup */}
        <div
          className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-500"
          style={{
            opacity: connecting || connected ? 1 : 0,
            transform: connecting || connected ? "translateY(0)" : "translateY(12px)",
            pointerEvents: "none",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MetaLogo />
            <p className="text-[10px] font-bold text-[#0064e0]">Meta Secure Login</p>
          </div>
          {connecting && (
            <div className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-[#0064e0] border-t-transparent rounded-full animate-spin" />
              <p className="text-[9px] text-gray-600">Authorizing @art_apparel…</p>
            </div>
          )}
          {connected && (
            <div className="flex items-center gap-2 py-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-[9px] font-semibold text-green-700">100% Meta-compliant · Connected</p>
            </div>
          )}
        </div>
      </div>
    </SimShell>
  );
}

// ─── Step 3: Launch automation simulation ─────────────────────────────────────

function LaunchSim({ animKey }: { animKey: number }) {
  const phase = usePhaseAnimation([300, 900, 1500, 2200, 2900, 3600], animKey);
  const keyword = phase >= 1 ? "FASHION" : "";
  const live = phase >= 2;
  const commentVisible = phase >= 3;
  const dmVisible = phase >= 4;
  const statsVisible = phase >= 5;

  return (
    <SimShell label="Step 3 · Go Live">
      <div className="flex gap-3 items-start justify-center flex-wrap sm:flex-nowrap">
        {/* Builder panel */}
        <div className="bg-white rounded-2xl p-4 flex-shrink-0 w-[200px]" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <p className="text-[10px] font-bold text-gray-900 mb-3">New Automation</p>

          <label className="text-[8px] font-semibold text-gray-400 uppercase">Trigger keyword</label>
          <div
            className="mt-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold text-[#7c5af3] mb-3 transition-all duration-300"
            style={{ borderColor: phase >= 1 ? "#7c5af3" : "#e5e7eb", background: "rgba(124,90,243,0.04)" }}
          >
            {keyword || <span className="text-gray-300 font-normal">Enter keyword…</span>}
            {phase === 1 && <span className="inline-block w-0.5 h-3 bg-[#7c5af3] animate-pulse ml-0.5 align-middle" />}
          </div>

          <label className="text-[8px] font-semibold text-gray-400 uppercase">DM message</label>
          <div className="mt-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[9px] text-gray-600 leading-snug mb-3 bg-gray-50">
            Hey! Here&apos;s your exclusive link 👇
          </div>

          <div className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: live ? "rgba(16,185,129,0.06)" : "#f9fafb" }}>
            <span className="text-[9px] font-semibold text-gray-700">Go Live</span>
            <div
              className="w-9 h-5 rounded-full relative transition-all duration-300"
              style={{ background: live ? "#10b981" : "#d1d5db" }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: live ? 18 : 2 }}
              />
            </div>
          </div>

          {live && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-bold text-green-600">Automation active</span>
            </div>
          )}
        </div>

        {/* Live result */}
        <div className="flex flex-col gap-2 pt-2 flex-shrink-0 w-[175px]">
          <div
            className="bg-white rounded-xl px-2.5 py-2 transition-all duration-500"
            style={{
              opacity: commentVisible ? 1 : 0,
              transform: commentVisible ? "translateY(0)" : "translateY(10px)",
              boxShadow: "0 2px 10px rgba(66,89,240,0.09)",
              border: "1px solid rgba(124,90,243,0.09)",
            }}
          >
            <div className="flex items-start gap-1.5">
              <Av label="JD" gradient="linear-gradient(135deg,#94a3b8,#475569)" size={6} />
              <div>
                <p className="text-[9px] font-bold text-gray-800">john.deals</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Fashion 🔥</p>
              </div>
            </div>
            <p className="text-[8px] text-gray-400 mt-1 ml-1">Comment · Just now</p>
          </div>

          <div
            className="flex items-center justify-center gap-1 py-1 transition-all duration-300"
            style={{ opacity: dmVisible ? 1 : 0 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#7c5af3]/30" />
            <span className="text-[7px] font-bold text-[#7c5af3] uppercase tracking-wider">Auto DM · 1.2s</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#7c5af3]/30" />
          </div>

          <div
            className="bg-white rounded-xl px-2.5 py-2 transition-all duration-500"
            style={{
              opacity: dmVisible ? 1 : 0,
              transform: dmVisible ? "translateY(0)" : "translateY(10px)",
              boxShadow: "0 2px 10px rgba(66,89,240,0.09)",
              border: "1px solid rgba(124,90,243,0.09)",
            }}
          >
            <div className="flex items-start gap-1.5">
              <Av label="AA" gradient="linear-gradient(135deg,#f06292,#e91e63)" size={6} />
              <div>
                <p className="text-[9px] font-bold text-gray-800">art_apparel</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Hey John! Here&apos;s your link 👇</p>
                <div className="mt-1 rounded-md px-2 py-0.5 text-center" style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}>
                  <span className="text-[8px] text-white font-bold">Open Link</span>
                </div>
              </div>
            </div>
            <p className="text-[8px] text-green-500 font-semibold mt-1 ml-1">Sent instantly ✓</p>
          </div>

          <div
            className="rounded-xl px-3 py-2 text-center transition-all duration-500"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? "scale(1)" : "scale(0.95)",
              background: "rgba(66,89,240,0.06)",
              border: "1px solid rgba(66,89,240,0.12)",
            }}
          >
            <p className="text-[8px] text-gray-500">First automated DM</p>
            <p className="text-sm font-black text-[#4259f0]" style={{ fontFamily: "var(--font-outfit,sans-serif)" }}>
              4 min 12 sec
            </p>
          </div>
        </div>
      </div>
    </SimShell>
  );
}

const simulations = [SignupSim, ConnectSim, LaunchSim];

// ─── Main component ───────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [simVisible, setSimVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToStep = (idx: number) => {
    if (idx === activeStep) return;
    setSimVisible(false);
    setTimeout(() => {
      setActiveStep(idx);
      setAnimKey((k) => k + 1);
      setSimVisible(true);
    }, 220);
  };

  useEffect(() => {
    autoTimer.current = setTimeout(() => goToStep((activeStep + 1) % steps.length), 7000);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [activeStep, animKey]);

  const SimComp = simulations[activeStep];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-16">
          <div>
            <div className="section-badge mb-5">How It Works</div>
            <h2
              className="text-4xl sm:text-[2.75rem] font-extrabold text-[#0a0a0a] leading-tight"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              From zero to fully automated{" "}
              <span
                style={{
                  background: "linear-gradient(130deg,#a855f7,#7c5af3,#4259f0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                in minutes.
              </span>
            </h2>
          </div>
          <div>
            <p className="text-lg text-gray-500 leading-relaxed">
              No developer, no tech skills, no complicated setup. Liffio is built for creators — if you can send a DM, you
              can automate one.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href={siteConfig.urls.appSignup}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)", boxShadow: "0 4px 16px rgba(66,89,240,0.28)" }}
              >
                Get Started Free →
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-[#c4b8f5] hover:text-[#7c5af3]"
                style={{ borderColor: "#e5e0f8" }}
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>

        {/* Steps + simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Step cards */}
          <div className="relative space-y-4">
            <div
              className="absolute left-[27px] top-8 bottom-8 w-px hidden sm:block"
              style={{ background: "linear-gradient(180deg,rgba(168,85,247,0.3),rgba(124,90,243,0.3),rgba(66,89,240,0.1))" }}
            />

            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => goToStep(i)}
                  className="relative flex items-start gap-5 rounded-2xl bg-white p-6 w-full text-left transition-all duration-300 group"
                  style={{
                    border: `1px solid ${isActive ? step.color : step.border}`,
                    boxShadow: isActive ? `0 8px 32px ${step.bg}` : "0 2px 16px rgba(124,90,243,0.05)",
                    transform: isActive ? "translateY(-2px)" : "none",
                  }}
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300"
                      style={{
                        background: isActive ? step.color : step.bg,
                        color: isActive ? "white" : step.color,
                      }}
                    >
                      <span className="text-[10px] font-black leading-none tracking-wider">{step.num}</span>
                      <div className="scale-90">{step.icon}</div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1.5">
                      <h3 className="text-lg font-bold text-[#0a0a0a]">{step.title}</h3>
                      <span
                        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold flex-shrink-0"
                        style={{ background: step.bg, color: step.color }}
                      >
                        ✓ {step.note}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.detail}</p>
                  </div>

                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(180deg,${step.color},transparent)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}

            {/* Step dots */}
            <div className="flex justify-center gap-2 pt-2 sm:justify-start sm:pl-20">
              {steps.map((step, i) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => goToStep(i)}
                  aria-label={`Go to step ${step.num}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeStep ? 20 : 6,
                    height: 6,
                    background: i === activeStep ? "linear-gradient(90deg,#7c5af3,#4259f0)" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Simulation panel */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px]">
              <div
                className="absolute inset-0 -z-10 pointer-events-none scale-110"
                style={{
                  background: "radial-gradient(ellipse, rgba(124,90,243,0.1) 0%, transparent 70%)",
                  filter: "blur(32px)",
                }}
              />
              <div
                className="transition-all duration-300"
                style={{
                  opacity: simVisible ? 1 : 0,
                  transform: simVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                }}
              >
                <SimComp animKey={animKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
