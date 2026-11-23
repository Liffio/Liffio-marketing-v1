import Logo from "./Logo";
import { siteConfig } from "@/config/site.config";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { FooterLinkColumn } from "@/components/FooterLinkColumn";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    // Partner rewards SPEC 9.5: any partner's code, one page.
    { label: "Got a code? Redeem", href: "/redeem" },
    // Added 2026-10-21 with the three new landing pages. The footer is the only
    // site-wide internal link they get, and a route that appears in the sitemap
    // but nowhere in the nav or footer has no internal weight pointing at it.
    { label: "Comment to DM", href: "/instagram-comment-to-dm" },
    { label: "Unlimited DMs", href: "/unlimited-instagram-dms" },
    { label: "Is DM automation safe?", href: "/is-instagram-dm-automation-safe" },
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Creators Program", href: "/creators-program" },
    { label: "Affiliate Program", href: "/affiliate" },
    { label: "Contact", href: "/help#contact" },
  ],
  Compare: [
    { label: "Liffio vs ManyChat", href: "/manychat-alternative" },
    { label: "Liffio vs SendDM", href: "/senddm-alternative" },
    { label: "Liffio vs Chatfuel", href: "/chatfuel-alternative" },
    { label: "Liffio vs ReplyRush", href: "/vs/replyrush" },
    { label: "Liffio vs LinkDM", href: "/vs/linkdm" },
    { label: "Liffio vs SuperProfile", href: "/vs/superprofile" },
    { label: "Liffio vs Zorcha", href: "/vs/zorcha" },
    { label: "Liffio vs InstaChamp", href: "/vs/instachamp" },
    { label: "See all comparisons", href: "/compare" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Acceptable Use", href: "/acceptable-use-policy" },
    { label: "Creators Program Policy", href: "/creators-policy" },
    { label: "Affiliate Program Policy", href: "/affiliate-policy" },
    // The eighth document. Razorpay requires a shipping and delivery page on
    // every merchant site, and the go-live checklist requires the footer to
    // link all eight.
    { label: "Shipping & Delivery", href: "/shipping-delivery-policy" },
  ],
};

/*
  🚩 X/Twitter is deliberately NOT here. Removed 2026-11-23 at the owner's
  request: only Instagram and LinkedIn are linked from the footer.

  `siteConfig.social.twitter` is left in place because the Organization
  JSON-LD still lists it under `sameAs` (lib/seo/json-ld.tsx). That is an
  entity-resolution signal for search engines, not a link anyone clicks, and
  dropping it is a separate decision from dropping the icon.
*/
const socials = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/*
          🔴 ONE COLUMN UNTIL lg, AND THAT IS NOT A STYLE PREFERENCE. The link
          columns are accordions (FooterLinkColumn), and an accordion only works
          in a stack. This grid was grid-cols-2 sm:grid-cols-3, which put two
          accordions side by side below lg, and both failures a tester hit on
          2026-11-23 came straight out of that:

            1. Grid rows are as tall as their tallest item, so opening PRODUCT
               stretched COMPANY's row and left a column-high hole under a
               closed header.
            2. `last:border-0` in FooterLinkColumn means "last in the stack". In
               a 2-up grid the last child is whichever column lands bottom-right,
               so LEGAL lost its rule while COMPARE beside it kept one.

          Stacked, both are correct by construction rather than by patch. The
          desktop six-column layout is unchanged.
        */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-10">
          <div className="lg:col-span-2">
            <Logo theme="dark" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              The smartest way to automate your Instagram DMs. Grow your audience and convert followers into
              customers on autopilot.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-200 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/*
            Plain divs, deliberately. A <details> per column was tried on
            2026-11-23 to shorten the footer on mobile and REVERTED the same day:
            Chrome hides a closed details' content with content-visibility, which
            a `display: block` override does not defeat, so every column rendered
            as a heading with nothing under it on desktop. A devtools check
            reported the computed display and a height and missed it; the bug was
            only visible in a real browser.

            If the mobile height is worth attacking again, do it by hiding
            individual <li> items under a breakpoint, where display toggling is
            reliable, or with a client component. Not with <details>.
          */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <FooterLinkColumn key={category} category={category}>
              <>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {/*
                  Cookie Policy 4 promises the choice can be changed "at any
                  time from the cookie settings on our website". It sits under
                  Legal, next to the Cookie Policy it acts on, and the footer is
                  on every page, so the promise holds on every page.
                */}
                {category === "Legal" ? (
                  <li>
                    <CookieSettingsLink className="text-left text-sm text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400" />
                  </li>
                ) : null}
              </>
            </FooterLinkColumn>
          ))}
        </div>

        {/*
          🚩 No top margin below lg. Stacked, Legal is the last accordion row
          and `last:border-0` leaves it without a rule, so a 40px margin here
          put 52px of nothing under the word LEGAL while the three rows above it
          closed with a rule 12px under their text. That asymmetry is what read
          as "Legal has more space". At mt-0 this border IS Legal's rule, in the
          same place as the others, and `pt-6` keeps the copyright clear of it.
          Desktop keeps the 40px, where all four columns are open and the rule
          genuinely separates two blocks.
        */}
        <div className="border-t border-gray-800 pt-6 lg:mt-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/*
              The registered office address that used to sit here was removed on
              2026-11-23. It is still carried in the privacy, terms and shipping
              policies and in the Organization JSON-LD, which is where a reader
              or a regulator looks for it; repeating it on every page only cost
              footer height. CIN and GSTIN stay, because an Indian company has to
              show them where it transacts.
            */}
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Liffio Private Limited. All rights reserved. · CIN:
              U58200GJ2026PTC181271 · GSTIN: 24AAHCL0028K1ZP
            </p>
            {/*
              text-gray-600 on bg-gray-950 was close to invisible, about 2:1
              contrast. gray-400 matches the rest of the footer body text and
              clears WCAG AA at this size.

              The heart and globe are emoji because those render everywhere.
              If a country flag is ever added here, use a flagcdn <img> the way
              AboutSection, pricing/CountryFlag and auth/countries all do, never
              the emoji: Windows has no glyph for regional-indicator pairs, so
              an emoji flag renders as the bare letters (the India flag showed
              as "IN") and reads as a typo.
            */}
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Made with</span>
              <span aria-hidden>&#10084;&#65039;</span>
              <span>for Instagram creators worldwide</span>
              <span aria-hidden>&#127758;</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
