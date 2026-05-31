"use client";

import PricingPlansGrid from "@/components/PricingPlansGrid";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.12),transparent)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-badge mb-4">Pricing</div>
          <h2
            className="text-4xl sm:text-[2.75rem] font-extrabold text-[#0a0a0a] leading-tight"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
          >
            Honest pricing.{" "}
            <span
              style={{
                background: "linear-gradient(130deg,#a855f7,#7c5af3,#4259f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              No surprises.
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Start free on Starter, upgrade when you&apos;re ready. Pro and Business available monthly or annually.
          </p>
        </div>

        <PricingPlansGrid compact />
      </div>
    </section>
  );
}
