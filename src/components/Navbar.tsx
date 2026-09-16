"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { siteConfig } from "@/config/site.config";
import { useSession } from "@/lib/auth/session";
const ANNOUNCEMENT_MESSAGES = [
  "Liffio sends your first automated DM in under 5 minutes - Get Started Free",
  "New: Post Scheduler now live - schedule Instagram feed posts from Liffio",
] as const;

/*
  The links, in order, on desktop and in the mobile menu. ONE array feeds both,
  so the two cannot drift apart or fall out of order.

  Home is a real nav item, not only the logo. /features and /pricing used to
  carry a "Home / Features" breadcrumb for the way back; those are gone, so the
  way back lives here instead, where it is on every page rather than on two.

  Support points at /help, which is the site's support page: the contact form,
  the help FAQ and the support email all live there, and the footer already
  calls it "Help Center".
*/
const navLinks: { href: string; label: string; navKey?: "features" | "pricing" }[] = [
  { href: "/", label: "Home" },
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

/*
  The CTA slot, and why it is a one-cell grid rather than a ternary.

  🚩 Every variant of the CTA block is rendered into the SAME grid cell, all the
  time, and only VISIBILITY is switched. `visibility: hidden` keeps an element
  in layout, so the slot is permanently as wide as its widest variant and the
  header cannot shift when the answer arrives. A ternary that swapped "Log in +
  Get Started Free" for one "Go to Dashboard" would change the slot's width, and
  on desktop the nav is `flex-1 justify-center` BETWEEN the logo and this slot,
  so every nav link would visibly jump. A hard-coded min-width would work until
  a font or a label changed; this cannot drift.

  `visibility: hidden` also removes the inactive variants from the tab order and
  the accessibility tree, so a keyboard or screen reader user is never offered a
  "Log in" that is not on screen.

  🚩 The cost of rendering every variant is that the app.liffio.com link is in
  the prerendered HTML of every public page, whether or not it is on screen.
  Hence `rel="nofollow"` on it: app.liffio.com is a signed-in destination, not
  something the marketing site is voting for, and the brief is explicit that
  none of this may change indexing behaviour.
*/
const CELL = { gridArea: "1 / 1" } as const;

/*
  🚩 NO TRANSITION ON THE SWAP, deliberately, and this was a bug before it was a
  rule. With `transition-opacity` on these layers, which CTA is on screen became
  dependent on a transition actually running to completion: in a throttled tab
  (backgrounded, or under CDP automation) the browser pauses transitions, the
  layer keeps `opacity: 0` despite computing to `opacity-100`, and the header is
  left showing NO call to action at all. A fade is decoration; which button a
  signed-in customer sees is not. The swap is now a single instantaneous style
  change that cannot be interrupted, paused or left half-applied.

  Same reason the controls inside these layers avoid `transition-all`:
  `visibility` is inherited AND animatable, so `transition-all` on a child makes
  an inherited visibility flip a discrete transition that lands halfway through
  the duration rather than immediately.
*/
const layerClass = (shown: boolean) =>
  `flex items-center ${shown ? "visible" : "invisible"}`;

/*
  While the session answer is in flight the slot shows neutral pills, never a
  guess. Each is narrower than the real control it stands in for, so the
  skeleton can never be the variant that decides the slot's width.
*/
function CtaSkeleton({ shown, sizes }: { shown: boolean; sizes: string[] }) {
  return (
    <div style={CELL} aria-hidden="true" className={`${layerClass(shown)} gap-2`}>
      {sizes.map((size) => (
        <div key={size} className={`${size} animate-pulse rounded-lg bg-gray-100`} />
      ))}
    </div>
  );
}

/**
 * Is this link the page being viewed?
 *
 * 🚩 `startsWith` on a path segment boundary, not a bare `startsWith`. A bare
 * one would mark /features active on a hypothetical /features-comparison, and
 * an exact match alone would drop the highlight on any child route a section
 * grows later. Trailing slashes are normalised because a link written without
 * one and a pathname served with one are the same page.
 *
 * 🚩 "/" is EXACT MATCH ONLY. It is a prefix of every path on the site, so the
 * segment-boundary rule below would light Home up on all of them.
 */
function isCurrent(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (href === "/") return path === "/";
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

  /*
    One call, for the whole site. Navbar is the only consumer, and the store
    behind this hook collapses concurrent callers into one request, so adding
    more consumers later costs no extra traffic. See src/lib/auth/session.ts.

    🚩 This picks a button. It is NOT authorization and must never gate content,
    copy or any action: it can be stale the moment it is read, because the
    visitor may have signed out in another tab. Real authorization happens in
    the app, against the cookie, on the server.

    'error' is deliberately folded in with 'unauthenticated' here and nowhere
    else: if the API is down or the answer is unreadable, the marketing site
    shows its ordinary signed-out CTAs and carries on. It never blocks, never
    shows an error, and never offers a Dashboard it cannot vouch for.

    `session.user` (id, name, email) is available for a "Hi <name>" greeting.
    It is deliberately not used: a name is arbitrary-width and would either
    reintroduce the layout shift the slot below exists to prevent, or need
    truncation rules of its own. The data is one line away when it is wanted.
  */
  const session = useSession();
  const authed = session.status === "authenticated";
  const checking = session.status === "loading";
  const signedOut = !authed && !checking;

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

            <div className="hidden flex-shrink-0 grid-cols-1 items-center justify-items-end lg:grid">
              <div style={CELL} className={`${layerClass(signedOut)} gap-2`}>
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
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-[opacity,box-shadow,transform] duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #f5184c, #b20d8f)",
                    boxShadow: "0 2px 12px rgba(178, 13, 143,0.28)",
                  }}
                >
                  Get Started Free
                </a>
              </div>

              <div style={CELL} className={layerClass(authed)}>
                <a
                  href={siteConfig.urls.appBase}
                  data-cta="navbar_dashboard"
                  rel="nofollow"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-[opacity,box-shadow,transform] duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #f5184c, #b20d8f)",
                    boxShadow: "0 2px 12px rgba(178, 13, 143,0.28)",
                  }}
                >
                  Go to Dashboard
                </a>
              </div>

              <CtaSkeleton shown={checking} sizes={["h-9 w-14", "h-10 w-32"]} />
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 lg:hidden">
              {/* Same one-cell grid as desktop, so the hamburger never moves. */}
              <div className="grid grid-cols-1 items-center justify-items-end">
                <div style={CELL} className={`${layerClass(signedOut)} gap-0.5 sm:gap-1`}>
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
                </div>

                <div style={CELL} className={layerClass(authed)}>
                  <a
                    href={siteConfig.urls.appBase}
                    data-cta="navbar_dashboard"
                    rel="nofollow"
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-white sm:text-sm"
                    style={{ background: "linear-gradient(135deg, #f5184c, #b20d8f)" }}
                  >
                    Dashboard
                  </a>
                </div>

                <CtaSkeleton shown={checking} sizes={["h-8 w-16"]} />
              </div>
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
            {/*
              The drawer needs no placeholder: it can only be opened by a tap,
              which is long after hydration, so the session answer is in hand by
              then. A plain conditional is honest here and keeps the markup flat.
            */}
            {authed ? (
              <a
                href={siteConfig.urls.appBase}
                data-cta="navbar_dashboard"
                rel="nofollow"
                className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #f5184c, #b20d8f)" }}
              >
                Go to Dashboard →
              </a>
            ) : (
              <a
                href={siteConfig.urls.appSignup}
                data-cta="navbar_signup"
                data-signup-cta="true"
                className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #f5184c, #b20d8f)" }}
              >
                Get Started Free →
              </a>
            )}
          </div>
        ) : null}
      </header>
    </div>
  );
}
