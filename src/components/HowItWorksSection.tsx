"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site.config";
import { LiffioLogoMark } from "@/components/Logo";
import { IPhoneShell } from "@/components/simulation/IPhoneShell";
import { SimulationContent } from "@/components/simulation/SimulationContent";
import { SimulationMobileStage } from "@/components/simulation/SimulationMobileStage";
import { SimulationShell } from "@/components/simulation/SimulationShell";
import { TechBadge } from "@/components/TechBadge";
import { SimulationAvatar } from "@/components/simulation/SimulationAvatar";
import { SimulationPostImage } from "@/components/simulation/SimulationPostImage";
import { DEMO_POST_IMAGES } from "@/config/demo-images.config";
import { metaCopy } from "@/config/meta-copy";

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    shortTitle: "Sign up",
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
    shortTitle: "Connect",
    color: "#7c5af3",
    bg: "rgba(124,90,243,0.07)",
    border: "rgba(124,90,243,0.18)",
    title: "Connect Your Instagram",
    detail: metaCopy.connectStepDetail,
    note: metaCopy.connectStepNote,
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
    shortTitle: "Go live",
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
  return <SimulationAvatar name={label} gradient={gradient} size={size} />;
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
    <SimulationShell label="Step 1 · Sign Up">
      <IPhoneShell responsive>
        <SimulationContent className="flex flex-col p-4">
          <div className="text-center mb-4">
            <div className="mx-auto mb-2 flex items-center justify-center">
              <LiffioLogoMark theme="light" size="small" className="!h-8" />
            </div>
            <p className="text-[11px] font-bold text-gray-900">Create your free account</p>
            <p className="text-[9px] text-gray-400 mt-0.5">No credit card required</p>
          </div>

          <div className="space-y-2.5 flex-1">
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
        </SimulationContent>
      </IPhoneShell>
    </SimulationShell>
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
    <SimulationShell label="Step 2 · Connect">
      <IPhoneShell responsive>
        <SimulationContent className="flex flex-col overflow-y-auto p-3.5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <LiffioLogoMark theme="light" size="xs" className="!h-5" />
              <p className="text-[10px] font-bold text-gray-900">Connected Accounts</p>
            </div>
            <span className="text-[8px] text-gray-400">Dashboard</span>
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
              {metaCopy.connectSimButton}
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
            <p className="text-[10px] font-bold text-[#0064e0]">{metaCopy.connectSimLoginTitle}</p>
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
              <p className="text-[9px] font-semibold text-green-700">{metaCopy.connectSimConnected}</p>
            </div>
          )}
        </div>
        </SimulationContent>
      </IPhoneShell>
    </SimulationShell>
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

  const showLive = phase >= 3;

  return (
    <SimulationShell label="Step 3 · Go Live">
      <IPhoneShell responsive>
        <SimulationContent className="relative flex flex-col overflow-hidden">
          {/* Setup screen */}
          <div
            className="absolute inset-0 flex flex-col p-3.5 transition-all duration-500"
            style={{
              opacity: showLive ? 0 : 1,
              transform: showLive ? "translateX(-20px)" : "translateX(0)",
              pointerEvents: showLive ? "none" : "auto",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <LiffioLogoMark theme="light" size="xs" className="!h-4" />
              <p className="text-[10px] font-bold text-gray-900">New Automation</p>
            </div>

            <label className="text-[8px] font-semibold text-gray-400 uppercase">Trigger keyword</label>
            <div
              className="mt-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold text-[#7c5af3] mb-2 transition-all duration-300"
              style={{ borderColor: phase >= 1 ? "#7c5af3" : "#e5e7eb", background: "rgba(124,90,243,0.04)" }}
            >
              {keyword || <span className="text-gray-300 font-normal">Enter keyword…</span>}
              {phase === 1 && <span className="inline-block w-0.5 h-3 bg-[#7c5af3] animate-pulse ml-0.5 align-middle" />}
            </div>

            <label className="text-[8px] font-semibold text-gray-400 uppercase">DM message</label>
            <div className="mt-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[9px] text-gray-600 leading-snug mb-2 bg-gray-50">
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

          {/* Live Instagram flow */}
          <div
            className="absolute inset-0 flex flex-col overflow-y-auto p-2.5 gap-2 transition-all duration-500"
            style={{
              opacity: showLive ? 1 : 0,
              transform: showLive ? "translateX(0)" : "translateX(20px)",
              pointerEvents: showLive ? "auto" : "none",
            }}
          >
            {/* Mini post */}
            <div className="rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-50">
                <Av label="AA" gradient="linear-gradient(135deg,#f06292,#e91e63)" size={5} />
                <span className="text-[9px] font-bold text-gray-800">art_apparel</span>
              </div>
              <div className="relative">
                <SimulationPostImage src={DEMO_POST_IMAGES[0]} alt="Fashion post" height={80} />
                <span className="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-2 py-0.5 text-[7px] font-bold text-white">
                  Comment &ldquo;FASHION&rdquo;
                </span>
              </div>
            </div>

            <div
              className="rounded-xl px-2.5 py-2 transition-all duration-500 bg-gray-50 border border-gray-100"
              style={{
                opacity: commentVisible ? 1 : 0,
                transform: commentVisible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <div className="flex items-start gap-1.5">
                <Av label="JD" gradient="linear-gradient(135deg,#94a3b8,#475569)" size={5} />
                <div>
                  <p className="text-[9px] font-bold text-gray-800">john.deals</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">FASHION</p>
                </div>
              </div>
              <p className="text-[8px] text-gray-400 mt-1">Comment · Just now</p>
            </div>

            <div
              className="flex items-center justify-center gap-1 py-0.5 transition-all duration-300"
              style={{ opacity: dmVisible ? 1 : 0 }}
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#7c5af3]/30" />
              <span className="text-[7px] font-bold text-[#7c5af3] uppercase tracking-wider">Auto DM · 1.2s</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#7c5af3]/30" />
            </div>

            {/* DM thread */}
            <div className="flex items-center gap-1.5 px-1 pb-1 border-b border-gray-100">
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <Av label="AA" gradient="linear-gradient(135deg,#f06292,#e91e63)" size={5} />
              <div>
                <p className="text-[9px] font-bold text-gray-900">art_apparel</p>
                <p className="text-[7px] text-green-500">Active now</p>
              </div>
            </div>

            <div
              className="flex-1 flex flex-col justify-end gap-1.5 min-h-[100px]"
              style={{ opacity: dmVisible ? 1 : 0, transition: "opacity 0.5s" }}
            >
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-2xl rounded-br-sm px-2.5 py-1.5 max-w-[75%]">
                  <p className="text-[9px] text-gray-800">Fashion 🔥</p>
                </div>
              </div>
              <div className="flex items-end gap-1">
                <Av label="AA" gradient="linear-gradient(135deg,#f06292,#e91e63)" size={5} />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-2.5 py-1.5 shadow-sm max-w-[80%]">
                  <p className="text-[9px] text-gray-800">Hey John! Here&apos;s your link 👇</p>
                  <div className="mt-1 rounded-md px-2 py-0.5 text-center" style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}>
                    <span className="text-[8px] text-white font-bold">Open Link</span>
                  </div>
                </div>
              </div>
              <p className="text-[8px] text-green-500 font-semibold pl-1">Auto-sent ✓</p>
            </div>

            <div
              className="rounded-xl px-3 py-2 text-center transition-all duration-500 flex-shrink-0"
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
        </SimulationContent>
      </IPhoneShell>
    </SimulationShell>
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
  const step = steps[activeStep];

  return (
    <section
      id="how-it-works"
      className="section-py relative overflow-hidden border-y border-brand-100/80 bg-gradient-to-b from-brand-50 via-[#f4f0ff] to-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: "radial-gradient(rgba(124,90,243,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 68%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(66,89,240,0.1) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — inline split (mirrors Features, tinted section differentiates) */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <TechBadge label="How it works" variant="section" className="mb-4 sm:mb-5" />
            <h2
              className="text-3xl font-extrabold leading-tight text-[#0a0a0a] sm:text-4xl sm:text-[2.75rem]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              From zero to fully automated{" "}
              <span className="gradient-text">in minutes.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
              No developer, no tech skills, no complicated setup — if you can send a DM, you can automate one.
            </p>
            <p className="mt-4 text-sm font-medium text-brand-700/80" aria-live="polite">
              {steps.map((step, i) => (
                <span key={step.num}>
                  {i > 0 && <span className="text-brand-300/80"> · </span>}
                  <span style={{ color: i === activeStep ? step.color : "#9ca3af" }}>
                    {step.num} {step.shortTitle}
                  </span>
                </span>
              ))}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {steps.map((step) => (
              <TechBadge key={step.num} label={step.note} variant="chip" accent={step.color} />
            ))}
          </div>
        </div>

        {/* Mobile: buttons → demo → info */}
        <div className="space-y-5 lg:hidden">
          <div
            className="card-base p-4 sm:p-5"
            style={{
              background: "linear-gradient(155deg, #faf8ff 0%, #ffffff 55%, #f8f5ff 100%)",
            }}
          >
            <p
              className="mb-4 text-center text-sm font-bold text-[#0a0a0a] sm:text-base"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Tap a step to{" "}
              <span className="gradient-text">explore</span>
            </p>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {steps.map((s, i) => {
                const isActive = i === activeStep;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => goToStep(i)}
                    className="flex flex-col items-center rounded-xl px-1 py-2 transition-all duration-200 sm:py-2.5"
                    style={{
                      background: isActive ? s.bg : "transparent",
                      border: isActive ? `1px solid ${s.color}` : "1px solid transparent",
                      boxShadow: isActive ? `0 4px 16px ${s.bg}` : "none",
                    }}
                    aria-pressed={isActive}
                    aria-label={s.title}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 sm:h-11 sm:w-11"
                      style={{
                        background: isActive ? s.color : s.bg,
                        color: isActive ? "white" : s.color,
                        border: isActive ? "none" : `1px solid ${s.border}`,
                      }}
                    >
                      <div className="scale-[0.65] sm:scale-75">{s.icon}</div>
                    </div>
                    <span
                      className="mt-1.5 max-w-full text-center text-[10px] leading-tight sm:text-[11px]"
                      style={{
                        color: isActive ? s.color : "#6b7280",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {s.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <SimulationMobileStage>
            <div
              className="w-full transition-all duration-300"
              style={{
                opacity: simVisible ? 1 : 0,
                transform: simVisible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
              }}
            >
              <SimComp animKey={animKey} />
            </div>
          </SimulationMobileStage>

          <div
            className="card-base p-4 sm:p-5"
            style={{
              background: "linear-gradient(155deg, #faf8ff 0%, #ffffff 55%, #f8f5ff 100%)",
            }}
          >
            <article
              className="rounded-2xl bg-white p-4 transition-all duration-300"
              style={{
                border: `1px solid ${step.border}`,
                boxShadow: `0 8px 32px ${step.bg}`,
              }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <TechBadge label={step.note} variant="inline" format="label" accent={step.color} />
                <span className="text-[10px] font-bold text-gray-400">{step.num} / 03</span>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl"
                  style={{ background: step.color, color: "white" }}
                >
                  <span className="text-[8px] font-black leading-none tracking-wider">{step.num}</span>
                  <div className="scale-75">{step.icon}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0a0a0a]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{step.detail}</p>
                </div>
              </div>
            </article>

            <p className="mt-3 text-center text-xs text-gray-400">3 steps · live in minutes</p>

            <a
              href={siteConfig.urls.appSignup}
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg,${step.color},#4259f0)`,
                boxShadow: `0 4px 20px ${step.color}40`,
              }}
            >
              Get Started Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <div className="mt-4 flex justify-center gap-1.5">
              {steps.map((s, i) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => goToStep(i)}
                  aria-label={`Go to step ${s.num}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeStep ? 18 : 5,
                    height: 5,
                    background:
                      i === activeStep
                        ? `linear-gradient(90deg,${s.color},#4259f0)`
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: phone left, steps right — mirrored vs Features */}
        <div className="hidden items-center gap-6 lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="flex max-md:justify-center">
            <div className="relative w-full max-w-[440px]">
              <div
                className="pointer-events-none absolute inset-0 -z-10 scale-110"
                style={{
                  background: "radial-gradient(ellipse, rgba(124,90,243,0.12) 0%, transparent 70%)",
                  filter: "blur(32px)",
                }}
                aria-hidden
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

          <div className="relative space-y-4">
            <div
              className="absolute left-[27px] top-8 bottom-8 hidden w-px sm:block"
              style={{
                background:
                  "linear-gradient(180deg,rgba(168,85,247,0.3),rgba(124,90,243,0.3),rgba(66,89,240,0.1))",
              }}
            />

            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => goToStep(i)}
                  className="group relative flex w-full items-start gap-5 rounded-2xl bg-white/90 p-6 text-left backdrop-blur-sm transition-all duration-300"
                  style={{
                    border: `1px solid ${isActive ? step.color : step.border}`,
                    boxShadow: isActive ? `0 8px 32px ${step.bg}` : "0 2px 16px rgba(124,90,243,0.05)",
                    transform: isActive ? "translateY(-2px)" : "none",
                  }}
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-300"
                      style={{
                        background: isActive ? step.color : step.bg,
                        color: isActive ? "white" : step.color,
                      }}
                    >
                      <span className="text-[10px] font-black leading-none tracking-wider">{step.num}</span>
                      <div className="scale-90">{step.icon}</div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-start justify-between gap-3 md:gap-0">
                      <h3 className="text-lg font-bold text-[#0a0a0a]">{step.title}</h3>
                      
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{step.detail}</p>
                  </div>

                  <div
                    className="absolute inset-y-1 left-0 h-auto w-1 rounded-l-2xl transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(180deg,${step.color},transparent)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}

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
                    background: i === activeStep ? "linear-gradient(90deg,#7c5af3,#4259f0)" : "#d4d0e8",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
