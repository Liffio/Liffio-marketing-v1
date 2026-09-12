import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { TechBadge } from "@/components/TechBadge";
import type { FaqCategory } from "@/config/faq.config";

type SiteFaqSectionProps = {
  categories: FaqCategory[];
  title?: string;
  subtitle?: string;
  /** Mono kicker above the title, so the section reads like the others on a V4 page. */
  eyebrow?: string;
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
  /**
   * `paper` draws no background of its own, for pages that already paint one
   * (the V4 pricing page sits on #FBF9F5 end to end).
   */
  variant?: "default" | "plain" | "paper";
};

const SECTION_BACKGROUND: Record<NonNullable<SiteFaqSectionProps["variant"]>, string> = {
  default: "bg-gray-50",
  plain: "bg-white",
  paper: "",
};

export function SiteFaqSection({
  categories,
  title = "Frequently Asked Questions",
  subtitle,
  eyebrow,
  allowMultiple = true,
  defaultOpenId = "connect-instagram",
  className = "",
  variant = "default",
}: SiteFaqSectionProps) {
  const isPaper = variant === "paper";

  return (
    <section
      className={`${isPaper ? "" : "py-16 sm:py-20"} ${SECTION_BACKGROUND[variant]} ${className}`.trim()}
    >
      <div className={isPaper ? "" : "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"}>
        <div className={isPaper ? "mb-8" : "mb-10 text-center sm:mb-12"}>
          {eyebrow ? (
            <TechBadge label={eyebrow} variant="section" accent="#F5184C" className="mb-4" />
          ) : null}
          <h2
            className={
              isPaper
                ? "text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold leading-[1.09] tracking-[-0.03em] text-[#17131A]"
                : "text-2xl font-extrabold text-[#0a0a0a] sm:text-3xl"
            }
            style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className={
                isPaper
                  ? "mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-[#4A4350]"
                  : "mx-auto mt-3 max-w-3xl text-sm text-gray-500 sm:text-base"
              }
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        <FAQAccordion
          categories={categories}
          allowMultiple={allowMultiple}
          defaultOpenId={defaultOpenId}
        />
      </div>
    </section>
  );
}
