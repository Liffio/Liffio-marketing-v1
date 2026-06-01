"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import { siteConfig } from "@/config/site.config";
import { isMetaVerified } from "@/lib/meta-verification";
import { metaCopy } from "@/config/meta-copy";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/creators-program", label: "Creators" },
  // { href: "/blog", label: "Blog" },
  { href: "/help", label: "Support" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div
        className="px-3 py-2 text-center text-[11px] font-medium leading-snug text-white sm:px-4 sm:text-sm"
        style={{ background: "linear-gradient(135deg, #7c5af3 0%, #4259f0 100%)" }}
      >
        <span className="sm:hidden">
          {isMetaVerified ? (
            <>
              <strong>{metaCopy.navbarMobileLead}</strong>
              {" · "}
            </>
          ) : null}
          <Link href={siteConfig.urls.preregister} className="font-bold underline hover:no-underline">
            {isMetaVerified ? "50% off →" : "Pre-register for 50% off →"}
          </Link>
        </span>
        <span className="hidden sm:inline">
          🚀{" "}
          {isMetaVerified ? (
            <>
              Liffio is now an <strong>{metaCopy.navbarDesktopLead}</strong>
              {" — "}
            </>
          ) : (
            <>Join the {metaCopy.navbarDesktopLead} — </>
          )}
          <Link href={siteConfig.urls.preregister} className="font-bold underline hover:no-underline">
            Pre-register for 50% off →
          </Link>
        </span>
      </div>

      {/* Nav */}
      <header
        className="bg-white/95 backdrop-blur-md transition-all duration-200"
        style={{
          borderBottom: scrolled ? "1px solid rgba(124,90,243,0.12)" : "1px solid rgba(124,90,243,0.06)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-8 py-3">
            {/* Logo */}
            <Logo />
            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg transition-all duration-150 hover:text-[#0a0a0a] hover:bg-[#faf8ff]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <a
                href={siteConfig.urls.appLogin}
                className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg transition-colors hover:text-[#0a0a0a] hover:bg-gray-50"
              >
                Log in
              </a>
              <a
                href={siteConfig.urls.appSignup}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #7c5af3, #4259f0)",
                  boxShadow: "0 2px 12px rgba(66,89,240,0.28)",
                }}
              >
                Get Started Free
              </a>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-0.5 sm:gap-1">
              <a
                href={siteConfig.urls.appSignup}
                className="hidden min-[400px]:inline-flex rounded-lg px-3 py-2 text-xs font-semibold text-white sm:text-sm"
                style={{ background: "linear-gradient(135deg, #7c5af3, #4259f0)" }}
              >
                Sign up
              </a>
              <a href={siteConfig.urls.appLogin} className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 sm:px-3 sm:text-sm">
                Log in
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-4" style={{ borderColor: "rgba(124,90,243,0.08)" }}>
            <nav className="flex flex-col gap-0.5 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-[#faf8ff] hover:text-[#7c5af3] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href={siteConfig.urls.appSignup}
              className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c5af3, #4259f0)" }}
            >
              Get Started Free →
            </a>
          </div>
        )}
      </header>
    </div>
  );
}
