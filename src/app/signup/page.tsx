import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Get Started Free — Liffio",
  description:
    "Sign up for Liffio and automate your Instagram DMs for free. No credit card required. Auto-reply to every comment, story, and DM.",
};

const WHY_PILLS = [
  { icon: "⚡", text: "Replies in under 2 seconds" },
  { icon: "🔒", text: "Meta-verified & fully compliant" },
  { icon: "🚀", text: "No coding, no setup complexity" },
  { icon: "🎯", text: "Works 24/7 on complete autopilot" },
];

const FEATURES = [
  {
    icon: "💬",
    title: "Comment → DM Automation",
    description:
      "Someone comments a keyword on your post → Liffio instantly sends them a personalised DM. Turn every commenter into a lead within 2 seconds, around the clock.",
    tag: "Core engine",
  },
  {
    icon: "📊",
    title: "Full Conversion Analytics",
    description:
      "Track every step: comment → DM → click → sale. Know exactly which posts, keywords, and flows are driving revenue — not just DM volume.",
    tag: "Advanced",
  },
  {
    icon: "🔗",
    title: "Smart Link Delivery",
    description:
      "Branded short links with click tracking and UTM attribution built into every automated DM. Every URL delivered is fully measurable end-to-end.",
    tag: "Built in",
  },
];

const QUICK_STATS = [
  { num: "2K+", label: "Active creators" },
  { num: "100K+", label: "DMs / month" },
  { num: "Free", label: "Starter plan" },
  { num: "<2s", label: "Response time" },
];

const BENEFITS = [
  "Auto-reply to every comment with a keyword trigger",
  "Story mentions & reactions handled automatically",
  "Live stream comment-to-DM flows",
  "Multi-step DM sequences with conditional logic",
  "Welcome new followers with a personalised message",
  "Collect emails and data directly inside DM chats",
  "Smart re-engagement for warm leads",
  "Full analytics: comment → DM → click → sale",
];

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(124,90,243,0.12)" />
      <path d="M4.5 8.5l2 2 4.5-5" stroke="#7c5af3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* ── Hero: 2-col split ──────────────────────────────────── */}
        <section
          className="py-14 sm:py-20 px-4"
          style={{ background: "linear-gradient(155deg,#f8f5ff 0%,#f0ebff 50%,#faf5ff 100%)" }}
        >
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left: copy */}
            <div>
              {/* Meta badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6"
                style={{ background: "rgba(0,100,224,0.07)", border: "1px solid rgba(0,128,249,0.2)" }}
              >
                <svg viewBox="0 0 512 512" className="h-4 w-4">
                  <defs>
                    <linearGradient id="mlg2" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#0064e0" />
                      <stop offset="100%" stopColor="#0080f9" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#mlg2)"
                    d="m149.4 89.4c-81.6 0-144.1 106.2-144.1 218.5 0 70.3 34 114.7 91 114.7 41 0 70.5-19.3 123-111l36.9-65.2 31.2-52.8c26.5-40.9 48.4-61.3 74.4-61.3 54 0 97.2 79.5 97.2 177.2 0 37.2-12.2 58.8-37.5 58.8-24.2 0-35.8-16-81.8-90l-42.3 36.9c47.9 80.2 74.6 107.4 123 107.4 55.5 0 86.4-45.1 86.4-116.9 0-117.7-63.9-216.5-141.6-216.5-41.1 0-73.3 31-102.4 70.3l-32.3 47.4c-31.9 49-51.3 79.7-51.3 79.7-42.5 66.7-57.2 81.6-80.9 81.6-24.4 0-38.8-21.4-38.8-59.5 0-81.6 40.7-165 89.2-165z"
                  />
                </svg>
                <span className="text-xs font-bold text-[#0064e0] tracking-wide">
                  Official Meta Business Partner
                </span>
              </div>

              <h1
                className="font-extrabold text-[#0a0a0a] leading-[1.06] tracking-tight mb-4"
                style={{
                  fontFamily: "var(--font-outfit,sans-serif)",
                  fontSize: "clamp(2.2rem,4.5vw,3.5rem)",
                }}
              >
                Grow on Instagram,{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(130deg,#a855f7 0%,#7c5af3 45%,#4259f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  completely on autopilot.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-7 max-w-lg">
                Liffio turns every Instagram comment, story reply, and DM into an automated
                conversion. Set it up once — it runs forever.
              </p>

              {/* Why pills */}
              <div className="flex flex-wrap gap-2 mb-7">
                {WHY_PILLS.map((p) => (
                  <div
                    key={p.text}
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium"
                    style={{
                      background: "white",
                      border: "1px solid rgba(124,90,243,0.15)",
                      color: "#3f3f46",
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-3 mb-7 max-w-sm">
                {QUICK_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl px-3 py-3 text-center"
                    style={{ background: "white", border: "1px solid rgba(124,90,243,0.1)" }}
                  >
                    <div
                      className="text-lg font-extrabold text-[#0a0a0a]"
                      style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                    >
                      {s.num}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Benefits list */}
              <ul className="space-y-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: sticky form card */}
            <div className="lg:sticky lg:top-28">
              <div
                className="rounded-3xl p-7 sm:p-8 bg-white"
                style={{
                  border: "1px solid rgba(124,90,243,0.14)",
                  boxShadow:
                    "0 8px 40px rgba(124,90,243,0.12), 0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold text-[#0a0a0a] mb-1"
                    style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                  >
                    Get started for free
                  </h2>
                  <p className="text-sm text-gray-400">
                    1,000 automated DMs/month free — upgrade anytime.
                  </p>
                </div>

                <SignupForm />

                {/* Trust row */}
                <div
                  className="mt-5 pt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
                  style={{ borderTop: "1px solid rgba(124,90,243,0.08)" }}
                >
                  {["No credit card required", "Meta-verified", "Cancel anytime"].map((t) => (
                    <span key={t} className="flex items-center gap-1 text-[11px] text-gray-400">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features strip ──────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#7c5af3] mb-8">
              What&apos;s included on every plan
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl p-6 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    border: "1px solid rgba(124,90,243,0.1)",
                    boxShadow: "0 2px 12px rgba(124,90,243,0.05)",
                  }}
                >
                  <div className="text-2xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-bold text-[#0a0a0a] mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.description}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7c5af3] rounded-full px-3 py-1"
                    style={{
                      background: "rgba(124,90,243,0.07)",
                      border: "1px solid rgba(124,90,243,0.15)",
                    }}
                  >
                    {f.tag} →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Creators Program CTA ──────────────────────────────── */}
        <section className="py-12 px-4" style={{ background: "#faf8ff" }}>
          <div
            className="mx-auto max-w-3xl rounded-3xl p-8 sm:p-10 text-center"
            style={{
              background: "white",
              border: "1px solid rgba(124,90,243,0.14)",
              boxShadow: "0 4px 24px rgba(124,90,243,0.08)",
            }}
          >
            <div className="text-3xl mb-4">🎯</div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] mb-3"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              Content creator with 5K+ followers?
            </h2>
            <p className="text-gray-500 mb-6 max-w-xl mx-auto leading-relaxed">
              Apply to the Liffio Creators Program and get our full Business plan ($79/month) for
              completely free — in exchange for active usage.
            </p>
            <Link
              href="/creators-program"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg,#7c5af3,#4259f0)",
                boxShadow: "0 4px 20px rgba(66,89,240,0.28)",
              }}
            >
              Apply to Creators Program →
            </Link>
            <p className="mt-3 text-xs text-gray-400">
              Only 50 spots · Takes 2 minutes · Reviewed within 48 hours
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
