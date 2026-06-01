import type { ReactNode } from "react";

export type TechBadgeVariant = "section" | "chip" | "meta" | "inline";

type TechBadgeProps = {
  label: string;
  variant?: TechBadgeVariant;
  /** Hex accent for chip / section (default purple). */
  accent?: string;
  className?: string;
  icon?: ReactNode;
  /** Override auto slug formatting (e.g. keep readable Meta copy). */
  format?: "slug" | "label";
};

function toSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_+-]/g, "");
}

const PROMPTS: Record<TechBadgeVariant, string> = {
  section: "//",
  chip: ">",
  meta: "@",
  inline: "~",
};

export function TechBadge({
  label,
  variant = "section",
  accent,
  className = "",
  icon,
  format,
}: TechBadgeProps) {
  const resolvedFormat = format ?? (variant === "meta" ? "label" : "slug");
  const text = resolvedFormat === "slug" ? toSlug(label) : label;
  const prompt = PROMPTS[variant];
  const style = accent ? ({ ["--tech-accent" as string]: accent } as React.CSSProperties) : undefined;

  return (
    <span
      className={`tech-badge tech-badge--${variant} ${className}`.trim()}
      style={style}
    >
      <span className="tech-badge__prompt" aria-hidden>
        {prompt}
      </span>
      {icon ? <span className="tech-badge__icon">{icon}</span> : null}
      <span className="tech-badge__text">{text}</span>
      {variant === "section" ? (
        <span className="tech-badge__cursor" aria-hidden>
          _
        </span>
      ) : null}
    </span>
  );
}

/** @deprecated Prefer TechBadge with variant="section". */
export function SectionBadge({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return <TechBadge label={children} variant="section" className={className} />;
}
