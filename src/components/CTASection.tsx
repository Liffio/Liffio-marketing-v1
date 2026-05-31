import Link from "next/link";
import { siteConfig } from "@/config/site.config";

const metrics = [
  { value: "2,000+", label: "Active workspaces" },
  { value: "<2s", label: "Average response time" },
  { value: "100K+", label: "DMs automated monthly" },
];

const capabilities = [
  {
    title: "Real-time comment-to-DM delivery",
    description: "Webhook-driven automation sends personalized DMs the moment a keyword is detected.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-7.5 10.5 7.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 9.75v7.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "Meta-verified API integration",
    description: "Built on official Instagram Business APIs with HMAC-verified webhooks and full compliance.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "End-to-end conversion tracking",
    description: "Measure comment → DM → click → sale with workspace-level analytics and attribution.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Free tier to evaluate the platform",
    description: "1,000 automated DMs per month on Starter — no credit card required to create an account.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

export default function CTASection() {
  return (
    <section className="relative bg-[#0a0a12] border-t border-white/[0.06]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,90,243,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">

          {/* Primary content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7c5af3]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Official Meta Business Partner
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.12] tracking-tight"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Turn Instagram engagement into a{" "}
              <span className="text-[#a78bfa]">measurable conversion pipeline</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
              Liffio automates comment-to-DM workflows, tracks every step of the funnel, and runs
              around the clock — so your team can focus on content and growth instead of inbox management.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.urls.appSignup}
                id="bottom-cta-primary"
                className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7c5af3,#4259f0)" }}
              >
                Create free account
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-gray-200 transition-colors duration-200 hover:bg-white/[0.06] hover:border-white/25"
              >
                View pricing
              </Link>
              <Link
                href="/creators-program"
                className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
              >
                Creators Program →
              </Link>
            </div>

            <p className="mt-5 text-xs text-gray-600">
              No credit card required · Cancel anytime · Setup in under 2 minutes
            </p>

            {/* Metrics strip */}
            <div className="mt-12 pt-10 border-t border-white/[0.08] grid grid-cols-3 gap-6 sm:gap-10">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div
                    className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight"
                    style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-gray-500 leading-snug">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Capability list */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
                Platform capabilities
              </h3>
              <ul className="space-y-6">
                {capabilities.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#a78bfa]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-100 leading-snug">{item.title}</p>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.description}</p>
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
