"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IPhoneShell } from "@/components/simulation/IPhoneShell";
import { SimulationContent } from "@/components/simulation/SimulationContent";
import { SimulationMobileStage } from "@/components/simulation/SimulationMobileStage";
import { SimulationShell } from "@/components/simulation/SimulationShell";
import { useSimulationLayout } from "@/hooks/usePhoneSize";
import { SimulationAvatar } from "@/components/simulation/SimulationAvatar";
import { SimulationPostImage } from "@/components/simulation/SimulationPostImage";
import { HERO_DEMOS } from "@/components/hero/hero-demo-data";

const SLIDE_MS = 6800;
const STEP_DELAYS = [400, 1300, 2400, 3400];

function TypingBubble() {
  return (
    <div className="flex items-end gap-1.5">
      <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-3 py-2.5 shadow-sm">
        <span className="hero-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
        <span className="hero-typing-dot hero-typing-dot-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
        <span className="hero-typing-dot hero-typing-dot-3 h-1.5 w-1.5 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

function FlowStep({
  active,
  done,
  label,
  onClick,
}: {
  active: boolean;
  done: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all duration-300 ${
        active
          ? "bg-white text-[#f5184c] shadow-md ring-1 ring-[#f5184c]/25"
          : done
            ? "bg-white/60 text-[#f5184c]/80"
            : "bg-white/40 text-gray-500 hover:bg-white/70"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
          done ? "bg-[#f5184c] text-white" : active ? "bg-[#f5184c]/15 text-[#f5184c]" : "bg-gray-200 text-gray-500"
        }`}
      >
        {done ? "✓" : label[0]}
      </span>
      {label}
    </button>
  );
}

export default function HeroInteractiveDemo() {
  const { size: phoneSize } = useSimulationLayout();
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [forceScreen, setForceScreen] = useState<"post" | "dm" | null>(null);
  const [dmFlash, setDmFlash] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const stepTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<number | null>(null);
  const demoAreaRef = useRef<HTMLDivElement>(null);

  const demo = HERO_DEMOS[activeSlide];
  const autoShowDm = visibleSteps.some((i) => i >= 1);
  const showDm = forceScreen === "dm" || (forceScreen === null && autoShowDm);
  const showPost = forceScreen === "post" || (forceScreen === null && !autoShowDm);

  const resetAnimation = useCallback(() => {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
    setVisibleSteps([]);
    setTyping(false);
    setProgress(0);

    STEP_DELAYS.forEach((d, i) => {
      const step = HERO_DEMOS[activeSlide].steps[i];
      if (step?.isReply) {
        stepTimers.current.push(setTimeout(() => setTyping(true), d - 550));
      }
      stepTimers.current.push(
        setTimeout(() => {
          setTyping(false);
          setVisibleSteps((p) => [...p, i]);
          if (i === 1) {
            setDmFlash(true);
            setTimeout(() => setDmFlash(false), 900);
          }
        }, d),
      );
    });
  }, [activeSlide]);

  const goToSlide = useCallback((idx: number) => {
    if (idx === activeSlide) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setTransitioning(false);
    }, 300);
  }, [activeSlide]);

  useEffect(() => {
    setForceScreen(null);
    resetAnimation();
  }, [activeSlide, resetAnimation]);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / SLIDE_MS) * 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [activeSlide]);

  useEffect(() => {
    slideTimer.current = setTimeout(
      () => goToSlide((activeSlide + 1) % HERO_DEMOS.length),
      SLIDE_MS,
    );
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, [activeSlide, goToSlide]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = demoAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -6 });
  };

  return (
    <div
      ref={demoAreaRef}
      className="relative mx-auto w-full lg:mx-0 lg:ml-auto lg:max-w-[400px]"
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onMouseMove={handleMouseMove}
    >
      {/* Accent glow behind phone */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700"
        style={{ background: demo.accentGlow }}
        aria-hidden
      />

      {/* Floating stat - response time */}
      <div
        className="hero-float-card absolute -top-1 -left-40 z-20 hidden lg:flex"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5184c]/15 to-[#b20d8f]/10">
            <svg className="h-5 w-5 text-[#b20d8f]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400">Avg. response time</p>
            <p className="text-lg font-bold tabular-nums text-[#0a0a0a]">
              1.2<span className="text-sm font-semibold text-gray-500">s</span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating stat - DMs */}
      <div
        className="hero-float-card absolute -right-45 bottom-5 z-20 hidden lg:flex"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7c49]/15 to-[#ec4899]/10">
            <svg className="h-5 w-5 text-[#f5184c]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400">DMs sent today</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold tabular-nums text-[#0a0a0a]">+247</p>
              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                ↑ 18%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-DM flash connector */}
      {dmFlash && (
        <div className="pointer-events-none absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2">
          <div className="hero-dm-flash flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-xl ring-2 ring-[#f5184c]/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5184c] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5184c]" />
            </span>
            <span className="text-[11px] font-bold text-[#f5184c]">Auto DM · 1.2s</span>
          </div>
        </div>
      )}

      <div
        className="transition-opacity duration-300"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: "opacity 0.3s ease, transform 0.15s ease-out",
        }}
      >
        <SimulationMobileStage className="sm:max-w-[360px] lg:max-w-none">
        <SimulationShell label="Liffio" variant="hero" className="w-full">
          <IPhoneShell responsive batteryPercent={72}>
            <SimulationContent className="relative h-full w-full">
              {/* Post */}
              <div
                className={`absolute inset-0 flex flex-col bg-white transition-all duration-500 ease-out ${
                  showPost ? "z-10" : "z-0"
                }`}
                style={{
                  opacity: showPost ? 1 : 0,
                  transform: showPost ? "translateX(0) scale(1)" : "translateX(-12px) scale(0.98)",
                  pointerEvents: showPost ? "auto" : "none",
                }}
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <SimulationAvatar name={demo.accountInit} gradient={demo.accountGradient} photoUrl={demo.accountPhoto} size={7} />
                    <span className="truncate text-[11px] font-bold text-gray-800">{demo.account}</span>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <SimulationPostImage
                    src={demo.postImage}
                    alt={demo.postAlt}
                    height={phoneSize === "lg" ? 168 : phoneSize === "md" ? 150 : 132}
                    priority={activeSlide === 0}
                  />
                  <div className="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2">
                    <span
                      className="hero-keyword-pulse whitespace-nowrap rounded-full border border-white/25 px-3 py-1 text-[9px] font-bold text-white backdrop-blur-md"
                      style={{ background: "rgba(0,0,0,0.55)" }}
                    >
                      Comment &ldquo;<span style={{ color: demo.accent }}>{demo.keyword}</span>&rdquo;
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-b border-gray-50 px-3 py-2 text-gray-500">
                  <svg className="h-5 w-5 fill-red-500 text-red-500" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="line-clamp-2 px-3 py-2 text-[10px] leading-relaxed text-gray-600">{demo.caption}</p>
                {visibleSteps.includes(0) && (
                  <div className="hero-message-pop mx-3 mb-2 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-2.5 py-2">
                    <SimulationAvatar name={demo.steps[0].user} photoUrl={demo.steps[0].photoUrl} size={6} />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-800">{demo.steps[0].user}</p>
                      <p className="text-[9px] text-gray-600">{demo.steps[0].msg}</p>
                    </div>
                  </div>
                )}
                <div className="mt-auto flex justify-center gap-1.5 pb-2">
                  {HERO_DEMOS.map((d, i) => (
                    <button
                      key={d.account}
                      type="button"
                      onClick={() => goToSlide(i)}
                      className="group relative h-2 overflow-hidden rounded-full bg-gray-200 transition-all duration-300"
                      style={{ width: i === activeSlide ? 20 : 8 }}
                      aria-label={`Preview ${d.account}`}
                      aria-current={i === activeSlide}
                    >
                      <span
                        className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ background: d.accent }}
                      />
                      {i === activeSlide && (
                        <span
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%`, background: `linear-gradient(90deg,${d.accent},#f5184c)` }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DM */}
              <div
                className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out ${
                  showDm ? "z-10" : "z-0"
                }`}
                style={{
                  opacity: showDm ? 1 : 0,
                  transform: showDm ? "translateX(0) scale(1)" : "translateX(12px) scale(0.98)",
                  pointerEvents: showDm ? "auto" : "none",
                }}
              >
                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f4f5f7]">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    <Image src={demo.postImage} alt="" fill sizes="300px" className="scale-110 object-cover opacity-[0.09] blur-lg" />
                  </div>
                  <div className="relative z-10 flex items-center gap-2 border-b border-gray-200/80 bg-white/95 px-3 py-2.5 backdrop-blur-sm">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <SimulationAvatar name={demo.accountInit} gradient={demo.accountGradient} photoUrl={demo.accountPhoto} size={7} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-gray-900">{demo.account}</p>
                      <p className="flex items-center gap-1 text-[8px] text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active now
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-2.5 py-2">
                    {demo.steps.map((step, i) => {
                      if (!visibleSteps.includes(i)) return null;
                      const isOut = !step.isReply;
                      return (
                        <div
                          key={`${activeSlide}-${i}`}
                          className={`hero-message-pop flex ${isOut ? "justify-end" : "items-end justify-start gap-1.5"}`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          {!isOut && (
                            <SimulationAvatar name={demo.accountInit} gradient={demo.accountGradient} photoUrl={demo.accountPhoto} size={6} />
                          )}
                          <div
                            className={`max-w-[84%] rounded-2xl px-3 py-2 shadow-sm ${
                              isOut ? "rounded-br-md bg-[#b20d8f] text-white" : "rounded-bl-md border border-gray-100 bg-white"
                            }`}
                          >
                            <p className={`text-[10px] leading-snug ${isOut ? "text-white" : "text-gray-800"}`}>{step.msg}</p>
                            {step.cta && (
                              <button
                                type="button"
                                className="mt-1.5 w-full rounded-lg px-2 py-1.5 text-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg,#f5184c,#b20d8f)" }}
                              >
                                <span className="text-[9px] font-bold text-white">{step.cta}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {typing && showDm && <TypingBubble />}
                  </div>
                  {visibleSteps.some((i) => demo.steps[i]?.isReply) && (
                    <p className="hero-sent-flash relative z-10 flex items-center justify-center gap-1 pb-1 text-[9px] font-semibold text-emerald-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Auto-sent
                    </p>
                  )}
                  <div className="relative z-10 flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
                    <div className="flex-1 rounded-full bg-gray-100 px-3 py-1.5 text-[9px] text-gray-400">Message...</div>
                  </div>
                </div>
              </div>
            </SimulationContent>
          </IPhoneShell>
        </SimulationShell>
        </SimulationMobileStage>
      </div>

      {/* Interactive flow controls */}
      <div className="mt-4 flex flex-col items-center gap-2 sm:mt-5 sm:gap-3">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#f5184c]/15 bg-white/70 p-1 shadow-sm backdrop-blur-sm sm:gap-2">
          <FlowStep
            active={showPost}
            done={autoShowDm}
            label="Post & comment"
            onClick={() => setForceScreen("post")}
          />
          <svg className="h-3.5 w-3.5 text-[#f5184c]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <FlowStep
            active={showDm}
            done={false}
            label="Auto DM"
            onClick={() => setForceScreen("dm")}
          />
        </div>
        <p className="hidden text-[10px] text-gray-400 sm:block">Tap steps to explore</p>
      </div>
    </div>
  );
}
