"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { siteConfig } from "@/config/site.config";
const ANNOUNCEMENT_MESSAGES = [
  "Liffio sends your first automated DM in under 5 minutes - Get Started Free",
  "New: Post Scheduler now live - schedule Instagram feed posts from Liffio",
] as const;

/*
  The four links, in order, on desktop and in the mobile menu. ONE array feeds
  both, so the two cannot drift apart or fall out of order.

  Support points at /help, which is the site's support page: the contact form,
  the help FAQ and the support email all live there, and the footer already
  calls it "Help Center".
*/
const navLinks: { href: string; label: string; navKey?: "features" | "pricing" }[] = [
  { href: "/features", label: "Features", navKey: "features" },
  { href: "/pricing", label: "Pricing", navKey: "pricing" },
  { href: "/creators-program", label: "Creators" },
  { href: "/help", label: "Support" },
];

/*
  The active state reuses the hover treatment rather than introducing a new
  one: on desktop the same near-black on the same pink wash, with the weight
  lifted to semibold so it reads as current when the pointer is elsewhere.
  `aria-current="page"` is what actually announces it, and it carries whether
  or not the colour does.
*/
const navLinkClass =
  "px-4 py-2 text-sm font-medium text-gray-500 rounded-lg transition-all duration-150 hover:text-[#0a0a0a] hover:bg-[#fff7f7]";

const navLinkActiveClass =
  "px-4 py-2 text-sm font-semibold text-[#0a0a0a] bg-[#fff7f7] rounded-lg transition-all duration-150";

const mobileNavLinkClass =
  "px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-[#fff7f7] hover:text-[#f5184c] transition-colors";

const mobileNavLinkActiveClass =
  "px-4 py-3 text-sm font-semibold text-[#f5184c] bg-[#fff7f7] rounded-xl transition-colors";

/**
 * Is this link the page being viewed?
 *
 * 🚩 `startsWith` on a path segment boundary, not a bare `startsWith`. A bare
 * one would mark /features active on a hypothetical /features-comparison, and
 * an exact match alone would drop the highlight on any child route a section
 * grows later. Trailing slashes are normalised because a link written without
 * one and a pathname served with one are the same page.
 */
function isCurrent(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return path === href || path.startsWith(`${href}/`);
}

/*
  🚩 `usePathname()` is read during render, and the highlight is therefore in
  the server HTML, with no post-hydration flash.

  next/navigation's reference warns that with rewrites in next.config or a
  Proxy file the value "may not match the actual browser pathname after
  routing", and this repo has a Proxy at src/proxy.ts. The warning does not
  bite here: proxy.ts only ADDS request headers, and next.config's only entry
  is a www redirect, so no path is ever rewritten and the server's pathname is
  the browser's. If a rewrite is ever added, this is the thing that breaks, and
  the documented fix is to gate the highlight behind a mount check.
*/

export default function Navbar() {
  const pathname = usePathname();
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
        style={{ background: "linear-gradient(135deg, #f5184c 0%, #b20d8f 100%)" }}
      >
        <span>
          {ANNOUNCEMENT_MESSAGES[announcementIndex]}{" "}
          <a
            href={siteConfig.urls.appSignup}
            data-cta="navbar_signup"
            data-signup-cta="true"
            className="font-bold underline hover:no-underline"
          >
            Get Started Free →
          </a>
        </span>
      </div>

      <header
        className="bg-white/95 backdrop-blur-md transition-all duration-200"
        style={{
          borderBottom: scrolled ? "1px solid rgba(245, 24, 76,0.12)" : "1px solid rgba(245, 24, 76,0.06)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-8 py-3">
            <Logo priority />

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {navLinks.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={current ? navLinkActiveClass : navLinkClass}
                    {...(item.navKey ? { "data-nav": item.navKey } : {})}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
              <a
                href={siteConfig.urls.appLogin}
                data-cta="navbar_login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#0a0a0a]"
              >
                Log in
              </a>
              <a
                href={siteConfig.urls.appSignup}
                data-cta="navbar_signup"
                data-signup-cta="true"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #f5184c, #b20d8f)",
                  boxShadow: "0 2px 12px rgba(178, 13, 143,0.28)",
                }}
              >
                Get Started Free
              </a>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 lg:hidden">
              <a
                href={siteConfig.urls.appSignup}
                data-cta="navbar_signup"
                data-signup-cta="true"
                className="hidden min-[400px]:inline-flex rounded-lg px-3 py-2 text-xs font-semibold text-white sm:text-sm"
                style={{ background: "linear-gradient(135deg, #f5184c, #b20d8f)" }}
              >
                Sign up
              </a>
              <a
                href={siteConfig.urls.appLogin}
                data-cta="navbar_login"
                className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 sm:px-3 sm:text-sm"
              >
                Log in
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t bg-white px-4 py-4 lg:hidden" style={{ borderColor: "rgba(245, 24, 76,0.08)" }}>
            <nav className="mb-4 flex flex-col gap-0.5">
              {navLinks.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={current ? mobileNavLinkActiveClass : mobileNavLinkClass}
                    {...(item.navKey ? { "data-nav": item.navKey } : {})}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <a
              href={siteConfig.urls.appSignup}
              data-cta="navbar_signup"
              data-signup-cta="true"
              className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #f5184c, #b20d8f)" }}
            >
              Get Started Free →
            </a>
          </div>
        ) : null}
      </header>
    </div>
  );
}
