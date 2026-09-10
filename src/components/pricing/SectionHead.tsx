import type { ReactNode } from "react";
import { TechBadge } from "@/components/TechBadge";

/**
 * The V4 section head: a TechBadge kicker, a tight display headline, one line
 * of body. Every section on the pricing page uses it, which is what makes the
 * page read as one document rather than a stack of unrelated cards.
 *
 * The kicker is the site-wide `TechBadge` rather than V4's plain mono label, so
 * the pricing page carries the same `// slug_` chrome with its blinking cursor
 * as Features, FAQ, Affiliate and Creators.
 */
export default function SectionHead({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-7 max-w-[64ch] ${className}`.trim()}>
      <TechBadge label={eyebrow} variant="section" accent="#F5184C" />
      <h2
        className="mt-4 text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold leading-[1.09] tracking-[-0.03em] text-[#17131A]"
        style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
      >
        {title}
      </h2>
      {children ? <p className="mt-3 text-[15.5px] leading-relaxed text-[#4A4350]">{children}</p> : null}
    </div>
  );
}
