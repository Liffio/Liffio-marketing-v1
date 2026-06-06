"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import { siteConfig } from "@/config/site.config";
const ANNOUNCEMENT_MESSAGES = [
  "⚡ Liffio sends your first automated DM in under 5 minutes — Get Started Free",
  "🚀 Join 800+ creators automating their Instagram DMs with Liffio",
  "✨ New: Post Scheduler now live — schedule Instagram feed posts from Liffio",
] as const;

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/creators-program", label: "Creators" },
  { href: "/help", label: "Support" },
];

const navLinkClass =
  "px-4 py-2 text-sm font-medium text-gray-500 rounded-lg transition-all duration-150 hover:text-[#0a0a0a] hover:bg-[#faf8ff]";

const mobileNavLinkClass =
  "px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-[#faf8ff] hover:text-[#7c5af3] transition-colors";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div
        className="px-3 py-2 text-center text-[11px] font-medium leading-snug text-white sm:px-4 sm:text-sm"
        style={{ background: "linear-gradient(135deg, #7c5af3 0%, #4259f0 100%)" }}
      >
        <span>
          {ANNOUNCEMENT_MESSAGES[announcementIndex]}{" "}
          <a href={siteConfig.urls.appSignup} className="font-bold underline hover:no-underline">
            Get Started Free →
          </a>
        </span>
      </div>

      <header
        className="bg-white/95 backdrop-blur-md transition-all duration-200"
        style={{
          borderBottom: scrolled ? "1px solid rgba(124,90,243,0.12)" : "1px solid rgba(124,90,243,0.06)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-8 py-3">
            <Logo />

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className={navLinkClass}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
              <a
                href={siteConfig.urls.appLogin}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0a0a0a]"
              >
                Log in
              </a>
              <a
                href={siteConfig.urls.appSignup}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #7c5af3, #4259f0)",
                  boxShadow: "0 2px 12px rgba(66,89,240,0.28)",
                }}
              >
                Get Started Free
              </a>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 lg:hidden">
              <a
                href={siteConfig.urls.appSignup}
                className="hidden min-[400px]:inline-flex rounded-lg px-3 py-2 text-xs font-semibold text-white sm:text-sm"
                style={{ background: "linear-gradient(135deg, #7c5af3, #4259f0)" }}
              >
                Sign up
              </a>
              <a
                href={siteConfig.urls.appLogin}
                className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 sm:px-3 sm:text-sm"
              >
                Log in
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t bg-white px-4 py-4 lg:hidden" style={{ borderColor: "rgba(124,90,243,0.08)" }}>
            <nav className="mb-4 flex flex-col gap-0.5">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={mobileNavLinkClass}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href={siteConfig.urls.appSignup}
              className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c5af3, #4259f0)" }}
            >
              Get Started Free →
            </a>
          </div>
        ) : null}
      </header>
    </div>
  );
}
