"use client";

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site.config";
import { LiffioAvatar } from "@/components/Logo";
import { IPhoneShell } from "@/components/simulation/IPhoneShell";
import { SimulationContent } from "@/components/simulation/SimulationContent";
import { SimulationMobileStage } from "@/components/simulation/SimulationMobileStage";
import { SimulationShell } from "@/components/simulation/SimulationShell";
import { TechBadge } from "@/components/TechBadge";
import Image from "next/image";
import { DEMO_POST_IMAGES } from "@/config/demo-images.config";
import { SimulationAvatar } from "@/components/simulation/SimulationAvatar";

// ─── Typing dots indicator ────────────────────────────────────────────────────
function TypingDots({ gradient, liffio }: { gradient?: string; liffio?: boolean }) {
  return (
    <div className="flex items-end gap-1.5">
      {liffio ? (
        <LiffioAvatar size={5} />
      ) : (
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[7px] font-bold"
          style={{ background: gradient }}
        />
      )}
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1 h-3">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Shared animated step hook ────────────────────────────────────────────────
// Returns { visible: number[], typing: boolean }
// Steps: array of { delay: number; isBot: boolean }
function useStepAnimation(steps: { delay: number; isBot: boolean }[], animKey: number, loop = true) {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible([]);
    setTyping(false);

    steps.forEach((step, i) => {
      // Show typing dots 700ms before a bot reply
      if (step.isBot) {
        const t1 = setTimeout(() => setTyping(true), step.delay - 700);
        timers.current.push(t1);
      }
      const t2 = setTimeout(() => {
        setTyping(false);
        setVisible((prev) => [...prev, i]);
      }, step.delay);
      timers.current.push(t2);
    });

    // Loop
    if (loop) {
      const total = Math.max(...steps.map((s) => s.delay)) + 2800;
      const tLoop = setTimeout(run, total);
      timers.current.push(tLoop);
    }
  };

  useEffect(() => {
    run();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  return { visible, typing };
}

// ─── Avatar (simulation scale) ────────────────────────────────────────────────
function Av({ label, gradient, size = 5 }: { label: string; gradient: string; size?: number }) {
  return <SimulationAvatar name={label} gradient={gradient} size={size} />;
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function Bubble({
  align, avatar, gradient, name, msg, time, cta,
}: {
  align: "left" | "right"; avatar: string; gradient: string;
  name: string; msg: string; time: string; cta?: string;
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${align === "right" ? "items-end" : "items-start"}`}>
      <div className="bg-white rounded-xl px-2 py-2 shadow-sm border border-gray-100 max-w-[92%]">
        <div className="flex items-start gap-1.5">
          <Av label={avatar} gradient={gradient} size={5} />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold text-gray-900">{name}</p>
            <p className="text-[9px] text-gray-700 mt-0.5 leading-snug">{msg}</p>
            {cta && (
              <div className="mt-1 rounded-md px-2 py-0.5 bg-[#4259f0] text-center">
                <p className="text-[8px] text-white font-bold">{cta}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-[8px] text-gray-400 px-1">{time}</p>
    </div>
  );
}

// ─── Phone screens ────────────────────────────────────────────────────────────

export function CommentReplyPhone({ animKey }: { animKey: number }) {
  const botGrad = "linear-gradient(135deg,#f06292,#e91e63)";
  const steps = [
    { delay: 400,  isBot: false },
    { delay: 1500, isBot: true  },
    { delay: 2600, isBot: false },
    { delay: 3700, isBot: true  },
  ];
  const msgs = [
    { align: "left"  as const, av: "JD", grad: "linear-gradient(135deg,#fb923c,#ec4899)", name: "john.deals",      msg: "Fashion 🔥",                              time: "2m ago",         cta: undefined },
    { align: "right" as const, av: "AA", grad: botGrad,                                  name: "art_apparel",     msg: "Hey John! Here's your exclusive link 👇",  time: "Auto-sent", cta: "Open Link" },
    { align: "left"  as const, av: "TS", grad: "linear-gradient(135deg,#22d3ee,#3b82f6)", name: "thesaraofficial", msg: "Fashion 💕",                              time: "Just now",       cta: undefined },
    { align: "right" as const, av: "AA", grad: botGrad,                                  name: "art_apparel",     msg: "Hey Sara! Here's your exclusive link 👇",  time: "Auto-sent", cta: "Open Link" },
  ];
  const { visible, typing } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <div className="flex items-center gap-1.5 flex-1">
            <Av label="AA" gradient={botGrad} size={6} />
            <div><p className="text-[10px] font-bold text-gray-900">art_apparel</p><p className="text-[8px] text-green-500">Active now</p></div>
          </div>
          <div className="flex gap-2 text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 bg-gray-50 px-2.5 py-3 flex flex-col justify-end space-y-2.5 overflow-hidden">
          {msgs.map((m, i) =>
            visible.includes(i) ? (
              <div key={i} className="transition-all duration-500" style={{ opacity: 1, transform: "translateY(0)" }}>
                <Bubble align={m.align} avatar={m.av} gradient={m.grad} name={m.name} msg={m.msg} time={m.time} cta={m.cta} />
              </div>
            ) : null
          )}
          {typing && <TypingDots gradient={botGrad} />}
        </div>
        {/* Input */}
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2 bg-white">
          <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg,#fb923c,#ec4899)" }} />
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[9px] text-gray-400">Message...</div>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function StoryReplyPhone({ animKey }: { animKey: number }) {
  const contacts = [
    { init: "SG", grad: "linear-gradient(135deg,#64748b,#1e293b)", name: "sculpt gym",   sub: "Sent you a message · Ju...", dot: true  },
    { init: "FN", grad: "linear-gradient(135deg,#f472b6,#ef4444)", name: "fitgirl.nina", sub: "Let's workout together! · 3h", dot: false },
    { init: "JD", grad: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "john.deals",   sub: "Nice progress! · 1d",          dot: false },
    { init: "SE", grad: "linear-gradient(135deg,#c084fc,#db2777)", name: "skincare.emma",sub: "Thanks · 2d",                  dot: false },
  ];
  const steps = contacts.map((_, i) => ({ delay: 300 + i * 400, isBot: false }));
  const { visible } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="px-3 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            <span className="text-[10px] font-bold text-gray-900">alex.lifts</span>
          </div>
          <div className="flex gap-3 text-[9px] border-b border-gray-100 pb-2">
            <span className="font-bold text-gray-900 border-b-2 border-gray-900 pb-1">Primary</span>
            <span className="text-gray-400">General</span>
            <span className="text-gray-400">Requests</span>
          </div>
        </div>
        <div className="flex-1 px-3 py-2 space-y-1 overflow-hidden">
          {contacts.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-2 py-1.5 transition-all duration-500"
              style={{ opacity: visible.includes(i) ? 1 : 0, transform: visible.includes(i) ? "translateX(0)" : "translateX(-16px)" }}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ background: c.grad }}>{c.init}</div>
                {c.dot && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-900">{c.name}</p>
                <p className="text-[9px] text-gray-500 truncate">{c.sub}</p>
              </div>
              {c.dot && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
            </div>
          ))}
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function LiveReplyPhone({ animKey }: { animKey: number }) {
  const comments = [
    { name: "mike.wellness", msg: "Love this routine! ✨" },
    { name: "beauty.fan",    msg: "What's the serum? 🌿"  },
    { name: "glowup.sara",   msg: "GLOW ✨"               },
  ];
  const steps = comments.map((_, i) => ({ delay: 600 + i * 700, isBot: false }));
  const { visible } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive statusBarTheme="dark" batteryPercent={72}>
      <SimulationContent className="relative overflow-hidden bg-[#0a0a0a]">
        {/* Live header */}
        <div className="flex items-start justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "linear-gradient(135deg,#c084fc,#db2777)" }}>BC</div>
            <div><p className="text-[9px] text-white font-bold">Beauty Care</p><p className="text-[8px] text-blue-200">Live skincare session</p></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5"><div className="w-1.5 h-1.5 bg-white rounded-full" /><span className="text-[8px] text-white">1.2k</span></div>
            <div className="bg-red-500 rounded-full px-2 py-0.5 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /><span className="text-[8px] text-white font-bold">LIVE</span></div>
          </div>
        </div>
        {/* Live video frame */}
        <div className="absolute inset-x-0 bottom-14 top-12 overflow-hidden">
          <Image
            src={DEMO_POST_IMAGES[3]}
            alt="Live skincare session"
            fill
            sizes="240px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" aria-hidden />
        </div>
        {/* Animated comments */}
        <div className="absolute bottom-16 left-0 right-0 px-3 space-y-1.5">
          {comments.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-1.5 transition-all duration-500"
              style={{ opacity: visible.includes(i) ? 1 : 0, transform: visible.includes(i) ? "translateY(0)" : "translateY(12px)" }}
            >
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[6px] font-bold" style={{ background: "linear-gradient(135deg,#c084fc,#db2777)" }}>{c.name[0].toUpperCase()}</div>
              <span className="text-[9px] text-white font-bold">{c.name}</span>
              <span className="text-[9px] text-white/80">{c.msg}</span>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="flex-1 bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-[9px] text-white/60">Add a comment...</div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#4259f0]/80">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </div>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function DmReplyPhone({ animKey }: { animKey: number }) {
  const botGrad = "linear-gradient(135deg,#fb923c,#f59e0b)";
  const steps = [
    { delay: 500,  isBot: false },
    { delay: 1600, isBot: true  },
  ];
  const { visible, typing } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <div className="flex items-center gap-1.5 flex-1">
            <Av label="PS" gradient={botGrad} size={6} />
            <div>
              <div className="flex items-center gap-1"><p className="text-[10px] font-bold text-gray-900">The Plated St...</p><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/></div>
              <p className="text-[8px] text-green-500">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 px-3 py-3 flex flex-col justify-end space-y-2 overflow-hidden">
          <p className="text-[8px] text-gray-400 text-center">Today 2:41 PM</p>
          {visible.includes(0) && (
            <div className="flex justify-end transition-all duration-500" style={{ opacity: 1, transform: "translateY(0)" }}>
              <div className="bg-[#4259f0] rounded-2xl rounded-br-sm px-3 py-1.5">
                <p className="text-[10px] text-white font-semibold">MENU</p>
              </div>
            </div>
          )}
          {typing && <TypingDots gradient={botGrad} />}
          {visible.includes(1) && (
            <div className="flex justify-start transition-all duration-500" style={{ opacity: 1, transform: "translateY(0)" }}>
              <div className="flex items-end gap-1.5">
                <Av label="PS" gradient={botGrad} size={5} />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                  <p className="text-[9px] text-gray-800">Hey! Here&apos;s our menu and order link.</p>
                  <div className="mt-1.5 bg-[#4259f0] rounded-lg px-2 py-1 text-center">
                    <p className="text-[9px] text-white font-bold">View Menu</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2 bg-white">
          <div className="w-5 h-5 rounded-full bg-gray-200"/>
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[9px] text-gray-400">Message...</div>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function AskFollowPhone({ animKey }: { animKey: number }) {
  const botGrad = "linear-gradient(135deg,#f06292,#9333ea)";
  const steps = [
    { delay: 400,  isBot: false }, // profile card
    { delay: 900,  isBot: true  }, // bot message
    { delay: 2100, isBot: true  }, // follow card
  ];
  const { visible, typing } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <div className="flex items-center gap-1.5 flex-1">
            <Av label="AA" gradient={botGrad} size={6} />
            <div><p className="text-[10px] font-bold text-gray-900">art_apparel</p><p className="text-[8px] text-green-500">Active now</p></div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 px-3 py-3 space-y-2 overflow-hidden flex flex-col justify-end">
          {/* Profile card */}
          {visible.includes(0) && (
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center transition-all duration-500">
              <Av label="AA" gradient={botGrad} size={10} />
              <p className="text-[10px] font-bold text-gray-900 mt-1">art_apparel <span className="text-blue-500">●</span></p>
              <p className="text-[8px] text-gray-500">120K followers · 342 posts</p>
              <p className="text-[8px] text-gray-400 mt-0.5">You don't follow each other</p>
            </div>
          )}
          {/* Bot message */}
          {typing && <TypingDots gradient={botGrad} />}
          {visible.includes(1) && (
            <div className="flex items-end gap-1.5 transition-all duration-500">
              <Av label="AA" gradient={botGrad} size={5} />
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                <p className="text-[9px] text-gray-800">Hey! 👋 Follow us to get your exclusive discount code</p>
              </div>
            </div>
          )}
          {/* Follow card */}
          {visible.includes(2) && (
            <div className="flex items-end gap-1.5 transition-all duration-500">
              <Av label="AA" gradient={botGrad} size={5} />
              <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm flex items-center gap-2 flex-1">
                <Av label="AA" gradient={botGrad} size={6} />
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-gray-900">art_apparel</p>
                  <p className="text-[8px] text-gray-500">120K followers</p>
                </div>
                <div className="bg-[#4259f0] rounded-md px-2 py-0.5">
                  <p className="text-[8px] text-white font-bold">Following</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2 bg-white">
          <div className="w-5 h-5 rounded-full bg-gray-200"/>
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[9px] text-gray-400">Message...</div>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function ReengagePhone({ animKey }: { animKey: number }) {
  const rows = [
    { init: "JD", grad: "linear-gradient(135deg,#60a5fa,#2563eb)", name: "john.deals",      msg: "started following you. 2m",   action: "Follow",     highlight: true  },
    { init: "TS", grad: "linear-gradient(135deg,#f472b6,#ef4444)", name: "thesaraofficial", msg: "liked your post. 15m",         action: null,         highlight: false },
    { init: "AL", grad: "linear-gradient(135deg,#94a3b8,#475569)", name: "alex.lifts",      msg: "commented: \"Fire! 🔥\" · 32m",action: null,         highlight: false },
    { init: "SE", grad: "linear-gradient(135deg,#c084fc,#db2777)", name: "skincare.emma",   msg: "started following you. 2d",    action: "Following",  highlight: false },
    { init: "SA", grad: "linear-gradient(135deg,#fb923c,#f59e0b)", name: "sara.eats",       msg: "liked your reel. 3d",          action: null,         highlight: false },
  ];
  const steps = rows.map((_, i) => ({ delay: 300 + i * 350, isBot: false }));
  const { visible } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="px-3 pt-3 pb-2 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-900">Activity</p>
        </div>
        <div className="flex-1 px-3 py-2 overflow-hidden">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Today</p>
          {rows.slice(0, 3).map((c, i) => (
            <div key={c.name} className="flex items-center gap-2 py-1.5 transition-all duration-500"
              style={{ opacity: visible.includes(i) ? 1 : 0, transform: visible.includes(i) ? "translateX(0)" : "translateX(16px)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ background: c.grad }}>{c.init}</div>
              <p className="text-[9px] text-gray-700 flex-1 leading-tight"><span className="font-bold">{c.name}</span> {c.msg}</p>
              {c.action ? (
                <div className={`rounded-md px-2 py-0.5 flex-shrink-0 ${c.highlight ? "bg-[#4259f0]" : "border border-gray-300"}`}>
                  <p className={`text-[8px] font-bold ${c.highlight ? "text-white" : "text-gray-700"}`}>{c.action}</p>
                </div>
              ) : <div className="w-7 h-7 rounded-md bg-gray-100 flex-shrink-0" />}
            </div>
          ))}
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mt-2 mb-1">This Week</p>
          {rows.slice(3).map((c, i) => (
            <div key={c.name} className="flex items-center gap-2 py-1.5 transition-all duration-500"
              style={{ opacity: visible.includes(i + 3) ? 1 : 0, transform: visible.includes(i + 3) ? "translateX(0)" : "translateX(16px)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" style={{ background: c.grad }}>{c.init}</div>
              <p className="text-[9px] text-gray-700 flex-1 leading-tight"><span className="font-bold">{c.name}</span> {c.msg}</p>
              {c.action ? (
                <div className="border border-gray-300 rounded-md px-2 py-0.5 flex-shrink-0">
                  <p className="text-[8px] font-bold text-gray-700">{c.action}</p>
                </div>
              ) : <div className="w-7 h-7 rounded-md bg-gray-100 flex-shrink-0" />}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-around">
          {["🏠", "🔍", "❤️", "👤"].map((ic, i) => <span key={i} className="text-sm">{ic}</span>)}
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function CollectDataPhone({ animKey }: { animKey: number }) {
  const steps = [
    { delay: 400,  isBot: true  }, // ask email
    { delay: 1400, isBot: false }, // user replies email
    { delay: 2200, isBot: true  }, // ask name
    { delay: 3200, isBot: false }, // user replies name
    { delay: 4000, isBot: true  }, // final reply with CTA
  ];
  const { visible, typing } = useStepAnimation(steps, animKey);

  const items = [
    { left: true,  name: "Liffio", msg: "Hey! 👋 To send you the free guide, what's your email?", cta: undefined },
    { left: false, grad: "linear-gradient(135deg,#60a5fa,#2563eb)", av: "JD", name: "you", msg: "john@example.com", cta: undefined },
    { left: true,  name: "Liffio", msg: "Perfect! ✅ And your name?", cta: undefined },
    { left: false, grad: "linear-gradient(135deg,#60a5fa,#2563eb)", av: "JD", name: "you", msg: "John", cta: undefined },
    { left: true,  name: "Liffio", msg: "Thanks John! 🎉 Here's your free guide 👇", cta: "Download Guide" },
  ];

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <div className="flex items-center gap-1.5 flex-1">
            <LiffioAvatar size={6} />
            <div><p className="text-[10px] font-bold text-gray-900">Liffio</p><p className="text-[8px] text-green-500">Active now</p></div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 px-2.5 py-3 space-y-2 flex flex-col justify-end overflow-hidden">
          {items.map((m, i) =>
            visible.includes(i) ? (
              <div key={i} className={`flex items-end gap-1.5 transition-all duration-500 ${!m.left ? "justify-end" : ""}`}>
                {m.left && <LiffioAvatar size={5} />}
                {m.left ? (
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm max-w-[80%]">
                    <p className="text-[9px] text-gray-800">{m.msg}</p>
                    {m.cta && <div className="mt-1.5 bg-[#4259f0] rounded-lg px-2 py-1 text-center"><p className="text-[9px] text-white font-bold">{m.cta}</p></div>}
                  </div>
                ) : (
                  <div className="bg-[#4259f0] rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[70%]">
                    <p className="text-[9px] text-white">{m.msg}</p>
                  </div>
                )}
              </div>
            ) : null
          )}
          {typing && <TypingDots liffio />}
        </div>
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2 bg-white">
          <div className="w-5 h-5 rounded-full bg-gray-200"/>
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[9px] text-gray-400">Message...</div>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

export function WelcomeFollowersPhone({ animKey }: { animKey: number }) {
  const steps = [
    { delay: 400,  isBot: true  },
    { delay: 1500, isBot: true  },
    { delay: 2800, isBot: false },
  ];
  const { visible, typing } = useStepAnimation(steps, animKey);

  return (
    <IPhoneShell responsive>
      <SimulationContent className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          <div className="flex items-center gap-1.5 flex-1">
            <LiffioAvatar size={6} />
            <div><p className="text-[10px] font-bold text-gray-900">Liffio ✓</p><p className="text-[8px] text-green-500">Active now</p></div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 px-3 py-3 space-y-2 flex flex-col justify-end overflow-hidden">
          <p className="text-[8px] text-gray-400 text-center">Today</p>
          {typing && <TypingDots liffio />}
          {visible.includes(0) && (
            <div className="flex items-end gap-1.5 transition-all duration-500">
              <LiffioAvatar size={5} />
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm max-w-[85%]">
                <p className="text-[9px] text-gray-800">Hey! 👋 Welcome to Liffio - so glad you&apos;re here!</p>
              </div>
            </div>
          )}
          {visible.includes(1) && (
            <div className="flex items-end gap-1.5 transition-all duration-500">
              <LiffioAvatar size={5} />
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm max-w-[85%]">
                <p className="text-[9px] text-gray-800">🎁 As a new follower, here's an exclusive 20% off code just for you:</p>
                <div className="mt-1.5 bg-[#4259f0] rounded-lg px-2 py-1 text-center"><p className="text-[9px] text-white font-bold">Get Discount</p></div>
              </div>
            </div>
          )}
          {visible.includes(2) && (
            <div className="flex justify-end transition-all duration-500">
              <div className="bg-[#4259f0] rounded-2xl rounded-br-sm px-3 py-1.5"><p className="text-[9px] text-white">Omg thank you! 🙏</p></div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2 bg-white">
          <div className="w-5 h-5 rounded-full bg-gray-200"/>
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[9px] text-gray-400">Message...</div>
        </div>
      </SimulationContent>
    </IPhoneShell>
  );
}

// ─── Feature list ─────────────────────────────────────────────────────────────

const features = [
  {
    id: "auto-comment-reply",
    num: "01",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.18)",
    tag: "Comments → DMs",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>),
    title: "Auto Comment Reply",
    gridLabel: "Comment Reply",
    description: "When a follower comments a keyword on your post or reel, Liffio sends them a personalised DM and a public comment reply on your schedule. Choose a custom delay from 10–60 seconds after the comment for natural, human-like timing.",
    bullets: ["Works on posts, reels, and carousels", "Unlimited keywords per campaign", "Sends public reply + private DM simultaneously"],
    Phone: CommentReplyPhone,
  },
  {
    id: "story-auto-reply",
    num: "02",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.07)",
    border: "rgba(147,51,234,0.18)",
    tag: "Story reactions",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="18" height="18" rx="3" ry="3" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/></svg>),
    title: "Story Auto Reply",
    gridLabel: "Story Reply",
    description: "Your stories get the most engaged viewers. Liffio auto-responds the moment someone reacts, replies to, or mentions your story - capturing leads at their highest point of interest.",
    bullets: ["Triggers on reactions, replies, and @mentions", "Perfect for flash sales and limited-time offers", "Works 24/7, even mid-sleep"],
    Phone: StoryReplyPhone,
  },
  {
    id: "live-auto-reply",
    num: "03",
    color: "#7c5af3",
    bg: "rgba(124,90,243,0.07)",
    border: "rgba(124,90,243,0.18)",
    tag: "Live stream DMs",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>),
    title: "Live Auto Reply",
    gridLabel: "Live Reply",
    description: "Your Instagram Live is a live sales event. Liffio monitors comments in real-time and sends DMs to every viewer who types a keyword - turning a broadcast into a revenue funnel.",
    bullets: ["Monitors keywords during live streams", "Ideal for product launches, Q&As, and webinars", "Sends discount codes, links, and resources automatically"],
    Phone: LiveReplyPhone,
  },
  {
    id: "dm-auto-reply",
    num: "04",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.07)",
    border: "rgba(99,102,241,0.18)",
    tag: "Inbound DM flows",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>),
    title: "DM Auto Reply",
    gridLabel: "DM Reply",
    description: "Build powerful automated flows triggered by incoming DMs. From simple keyword responses to multi-step qualification sequences - Liffio handles every conversation at scale.",
    bullets: ["Keyword-triggered conversation flows", "Multi-step logic with yes/no branching", "Qualify leads without lifting a finger"],
    Phone: DmReplyPhone,
  },
  {
    id: "ask-for-follow",
    num: "05",
    color: "#4259f0",
    bg: "rgba(66,89,240,0.07)",
    border: "rgba(66,89,240,0.18)",
    tag: "Follow gate",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>),
    title: "Ask for Follow",
    gridLabel: "Ask Follow",
    description: "Gate your content behind a follow. Before delivering the promised link or resource, Liffio prompts users to follow your account - dramatically accelerating your follower growth.",
    bullets: ["Optional follow gate before content delivery", "Displays your profile card inside DMs", "Tracks follow conversion rates in analytics"],
    Phone: AskFollowPhone,
  },
  {
    id: "smart-reengage",
    num: "06",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.18)",
    tag: "Win-back sequences",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>),
    title: "Smart Re-engage",
    gridLabel: "Re-engage",
    description: "Warm leads go cold fast. Liffio identifies users who've interacted with you before and automatically sends timed follow-ups - converting browsers into buyers on autopilot.",
    bullets: ["Re-engages previous commenters and DM contacts", "Configurable time-based follow-up sequences", "Personalised message templates per segment"],
    Phone: ReengagePhone,
  },
  {
    id: "collect-user-data",
    num: "07",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.18)",
    tag: "Lead capture",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>),
    title: "Collect User Data",
    gridLabel: "Collect Data",
    description: "Own your audience. Liffio asks followers for their email, phone number, or any custom field right inside a DM conversation - building your list without any external tools.",
    bullets: ["Captures email, phone, and custom data", "Auto-exports to CSV and integrates with CRMs", "Fully GDPR-compliant data handling"],
    Phone: CollectDataPhone,
  },
  {
    id: "welcome-new-followers",
    num: "08",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.18)",
    tag: "New follower DMs",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>),
    title: "Welcome New Followers",
    gridLabel: "Welcome",
    description: "First impressions are everything. When someone follows you, Liffio sends a warm, personalised welcome message on your schedule - starting the relationship before they even see your next post.",
    bullets: ["Fires automatically after a new follow", "Personalised with @username and first name", "Include links, offers, or a simple warm hello"],
    Phone: WelcomeFollowersPhone,
  },
] as const;

// ─── Simulation shell (matches How It Works) ──────────────────────────────────

// ─── Main component ────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [phoneVisible, setPhoneVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToFeature = (idx: number) => {
    if (idx === activeFeature) return;
    setPhoneVisible(false);
    setTimeout(() => {
      setActiveFeature(idx);
      setAnimKey((k) => k + 1);
      setPhoneVisible(true);
    }, 220);
  };

  useEffect(() => {
    autoTimer.current = setTimeout(() => goToFeature((activeFeature + 1) % features.length), 8000);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFeature, animKey]);

  const f = features[activeFeature];
  const PhoneComp = f.Phone;

  return (
    <section id="features" className="section-py relative overflow-hidden bg-white">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }}
      />

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute -top-32 left-1/2 h-72 w-[min(900px,90vw)] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(124,90,243,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - inline split: title + copy left, chips right */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <TechBadge label="Auto DM Features" variant="section" className="mb-4 sm:mb-5" />
            <h2
              className="text-3xl font-extrabold leading-tight text-[#0a0a0a] sm:text-4xl sm:text-[2.75rem]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              8 Auto DM Automations.{" "}
              <span className="gradient-text">One Dashboard.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500 sm:text-lg">
              Auto DMs from comments, stories, live streams & inbox - Liffio is your complete Instagram auto DM tool.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {[
              { label: "Auto DM + Auto Comment", color: "#a855f7" },
              { label: "10–60s human-like delay", color: "#7c5af3" },
              { label: "Unlimited auto DMs", color: "#4259f0" },
            ].map((chip) => (
              <TechBadge key={chip.label} label={chip.label} variant="chip" accent={chip.color} />
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
              Tap a feature to{" "}
              <span className="gradient-text">explore</span>
            </p>

            <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
              {features.map((feat, i) => {
                const isActive = i === activeFeature;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => goToFeature(i)}
                    className="flex flex-col items-center rounded-xl px-0.5 py-1.5 transition-all duration-200 sm:px-1 sm:py-2"
                    style={{
                      background: isActive ? feat.bg : "transparent",
                      border: isActive ? `1px solid ${feat.color}` : "1px solid transparent",
                      boxShadow: isActive ? `0 4px 16px ${feat.bg}` : "none",
                    }}
                    aria-pressed={isActive}
                    aria-label={feat.title}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 sm:h-10 sm:w-10"
                      style={{
                        background: isActive ? feat.color : feat.bg,
                        color: isActive ? "white" : feat.color,
                        border: isActive ? "none" : `1px solid ${feat.border}`,
                      }}
                    >
                      <div className="scale-[0.72] sm:scale-75">{feat.icon}</div>
                    </div>
                    <span
                      className="mt-1.5 max-w-full text-center text-[9px] leading-tight sm:text-[10px]"
                      style={{
                        color: isActive ? feat.color : "#6b7280",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {feat.gridLabel}
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
                opacity: phoneVisible ? 1 : 0,
                transform: phoneVisible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
              }}
            >
              <SimulationShell label={`${f.title} · Live`}>
                <PhoneComp animKey={animKey} />
              </SimulationShell>
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
                border: `1px solid ${f.border}`,
                boxShadow: `0 8px 32px ${f.bg}`,
              }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <TechBadge label={f.tag} variant="inline" format="label" accent={f.color} />
                <span className="text-[10px] font-bold text-gray-400">{f.num} / 08</span>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl"
                  style={{ background: f.color, color: "white" }}
                >
                  <span className="text-[8px] font-black leading-none tracking-wider">{f.num}</span>
                  <div className="scale-75">{f.icon}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0a0a0a]">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {f.bullets.slice(0, 2).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                        <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none">
                          <circle cx="8" cy="8" r="8" fill={f.bg} />
                          <path
                            d="M4.5 8.5l2 2 4.5-5"
                            stroke={f.color}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <p className="mt-3 text-center text-xs text-gray-400">8 automations · one dashboard</p>

            <a
              href={siteConfig.urls.appSignup}
              id="features-cta"
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg,${f.color},#4259f0)`,
                boxShadow: `0 4px 20px ${f.color}40`,
              }}
            >
              Try It Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <div className="mt-4 flex justify-center gap-1.5">
              {features.map((feat, i) => (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => goToFeature(i)}
                  aria-label={`Show ${feat.title}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeFeature ? 18 : 5,
                    height: 5,
                    background:
                      i === activeFeature
                        ? `linear-gradient(90deg,${feat.color},#4259f0)`
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: accordion + sticky simulation */}
        <div className="hidden items-start gap-10 lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left: accordion-style feature cards */}
          <div className="relative">
            <div
              className="absolute left-[23px] top-6 bottom-6 w-px hidden sm:block"
              style={{
                background:
                  "linear-gradient(180deg,rgba(168,85,247,0.35),rgba(124,90,243,0.25),rgba(66,89,240,0.08))",
              }}
            />

            <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
              {features.map((feat, i) => {
                const isActive = i === activeFeature;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => goToFeature(i)}
                    className="relative flex w-full text-left rounded-2xl bg-white transition-all duration-300 group"
                    style={{
                      border: `1px solid ${isActive ? feat.color : feat.border}`,
                      boxShadow: isActive ? `0 8px 32px ${feat.bg}` : "0 2px 12px rgba(124,90,243,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                      padding: isActive ? "20px 20px 20px 16px" : "14px 16px 14px 12px",
                    }}
                  >
                    <div
                      className="absolute left-0 top-1.5 bottom-0 w-1 rounded-l-2xl transition-opacity duration-300 h-auto"
                      style={{
                        background: `linear-gradient(180deg,${feat.color},transparent)`,
                        opacity: isActive ? 1 : 0,
                      }}
                    />

                    <div className="flex items-start gap-3.5 w-full min-w-0">
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className="w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300"
                          style={{
                            background: isActive ? feat.color : feat.bg,
                            color: isActive ? "white" : feat.color,
                          }}
                        >
                          <span className="text-[8px] font-black leading-none tracking-wider">{feat.num}</span>
                          <div className="scale-75">{feat.icon}</div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="font-bold text-[#0a0a0a] leading-snug"
                            style={{ fontSize: isActive ? "1.05rem" : "0.9rem" }}
                          >
                            {feat.title}
                          </h3>
                          {!isActive && (
                            <TechBadge
                              label={feat.tag}
                              variant="inline"
                              format="label"
                              accent={feat.color}
                              className="hidden flex-shrink-0 sm:inline-flex"
                            />
                          )}
                        </div>

                        <div
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            maxHeight: isActive ? 320 : 0,
                            opacity: isActive ? 1 : 0,
                            marginTop: isActive ? 10 : 0,
                          }}
                        >
                          <TechBadge
                            label={feat.tag}
                            variant="inline"
                            format="label"
                            accent={feat.color}
                            className="mb-2.5"
                          />
                          <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
                          <ul className="mt-3 space-y-2">
                            {feat.bullets.map((b) => (
                              <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none">
                                  <circle cx="8" cy="8" r="8" fill={feat.bg} />
                                  <path
                                    d="M4.5 8.5l2 2 4.5-5"
                                    stroke={feat.color}
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {b}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={siteConfig.urls.appSignup}
                            id={i === 0 ? "features-cta" : undefined}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                            style={{
                              background: `linear-gradient(135deg,${feat.color},#4259f0)`,
                              boxShadow: `0 4px 14px ${feat.color}40`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Try It Free
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 pt-4 sm:justify-start sm:pl-14">
              {features.map((feat, i) => (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => goToFeature(i)}
                  aria-label={`Show ${feat.title}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeFeature ? 18 : 5,
                    height: 5,
                    background: i === activeFeature ? `linear-gradient(90deg,${feat.color},#4259f0)` : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: phone simulation in themed shell */}
          <div className="lg:sticky lg:top-24">
            <div className="relative w-full max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
              <div
                className="absolute inset-0 -z-10 pointer-events-none scale-110"
                style={{
                  background: `radial-gradient(ellipse, ${f.bg} 0%, transparent 70%)`,
                  filter: "blur(32px)",
                }}
              />

              {/* Floating stat chip */}
              <div
                className="absolute -top-3 -left-2 z-20 hidden sm:flex items-center gap-2 bg-white rounded-2xl px-3.5 py-2.5 animate-float-slow"
                style={{
                  boxShadow: "0 4px 24px rgba(66,89,240,0.14)",
                  border: `1px solid ${f.border}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: f.color }}
                >
                  {f.num}
                </div>
                <div>
                  <p className="text-[9px] font-medium text-gray-400 leading-none">Automation</p>
                  <p className="text-xs font-bold text-[#0a0a0a] mt-0.5">{f.tag}</p>
                </div>
              </div>

              <div
                className="transition-all duration-300"
                style={{
                  opacity: phoneVisible ? 1 : 0,
                  transform: phoneVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                }}
              >
                <SimulationShell label={`${f.title} · Live`}>
                  <PhoneComp animKey={animKey} />
                </SimulationShell>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-14 h-px max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }}
      />
    </section>
  );
}
