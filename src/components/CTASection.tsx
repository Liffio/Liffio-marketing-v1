import AppLink from "@/components/AppLink";
import { siteConfig } from "@/config/site.config";
import { TechBadge } from "@/components/TechBadge";
import { MetaVerifiedOnly } from "@/components/MetaVerifiedOnly";
import { metaCopy } from "@/config/meta-copy";

const metrics = [
  { value: "2,000+", label: "Active workspaces" },
  { value: "10–60s", label: "Custom reply delay" },
  { value: "100K+", label: "DMs automated monthly" },
];

const capabilities = [
  {
    title: "Comment-to-DM automation",
    description: "Trigger personalised DMs from post comments with keywords your audience already uses.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: metaCopy.ctaCapabilityTitle,
    description: metaCopy.ctaCapabilityDescription,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Conversion analytics",
    description: "Track comment → DM → click → sale so you know which content actually drives revenue.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Free tier included",
    description: "Start on the Free plan with unlimited automated DMs. No credit card required.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

export default function CTASection() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden border-t border-brand-100 bg-white"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -right-20 top-0 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,90,243,0.14) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -left-16 bottom-0 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(66,89,240,0.1) 0%, transparent 70%)" }}
        />
      </div>

      <div className="section-py relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <MetaVerifiedOnly>
              <TechBadge
                label={metaCopy.ctaBadge!}
                variant="meta"
                format="label"
                className="mb-6"
              />
            </MetaVerifiedOnly>

            <h2
              className="text-3xl font-bold leading-[1.12] tracking-tight text-[#0a0a0a] sm:text-4xl lg:text-[2.65rem]"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Ready to turn comments into{" "}
              <span className="gradient-text">automated conversions</span>?
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Join creators and brands using Liffio to reply faster, capture leads on autopilot, and measure
              what actually converts - without living in the DMs.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={siteConfig.urls.appSignup} id="bottom-cta-primary" className="btn-primary inline-flex items-center justify-center gap-2">
                Create free account
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <AppLink
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/50"
              >
                View pricing
              </AppLink>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              No credit card required · Cancel anytime · Setup in under 2 minutes
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 sm:gap-8 sm:pt-10">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd
                    className="text-2xl font-bold tabular-nums tracking-tight text-[#0a0a0a] sm:text-3xl"
                    style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                  >
                    {m.value}
                  </dd>
                  <dd className="mt-1 text-xs leading-snug text-gray-500 sm:text-sm">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="card-base rounded-2xl p-6 sm:p-8">
              <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                What you get
              </p>
              <ul className="space-y-5">
                {capabilities.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-snug text-gray-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
