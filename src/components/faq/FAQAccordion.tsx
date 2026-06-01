"use client";

import { useId, useState } from "react";
import type { FaqCategory, FaqItem } from "@/config/faq.config";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-brand-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition-colors duration-200 ${
        open ? "border-brand-200" : "border-brand-100/80"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
        >
          <span className="text-sm font-semibold leading-snug text-[#0a0a0a] sm:text-[0.9375rem]">{item.question}</span>
          <Chevron open={open} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-brand-50 px-4 pb-4 pt-3 text-sm leading-relaxed text-gray-600 sm:px-5 sm:pb-5">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

type FAQAccordionProps = {
  categories: FaqCategory[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
};

export function FAQAccordion({
  categories,
  allowMultiple = false,
  defaultOpenId = "connect-instagram",
  className = "",
}: FAQAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() =>
    defaultOpenId ? new Set([defaultOpenId]) : new Set(),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (!allowMultiple) return new Set([id]);
      next.add(id);
      return next;
    });
  };

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      {categories.map((category) => (
        <div key={category.id}>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-brand-600">{category.label}</p>
          <div className="space-y-2">
            {category.items.map((item) => (
              <AccordionRow
                key={item.id}
                item={item}
                open={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
