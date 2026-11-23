"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * One collapsible footer column.
 *
 * Collapsed on mobile, where 29 links across four columns made the footer about
 * a screen and a half tall. Always expanded from lg up.
 *
 * ⚠️ Why this is a client component and not <details>: a <details> per column
 * was tried on 2026-11-23 and reverted the same day. Chrome hides a closed
 * details' content with `content-visibility`, which a `display: block` override
 * does not defeat, so every column rendered as a heading with nothing under it
 * on desktop. Worse, it measured fine: getComputedStyle reported `display:
 * block` and getBoundingClientRect reported a height, because the style WAS
 * applied; it just never painted.
 *
 * Here the open state drives a plain `hidden` / `block` class and `lg:block`
 * wins on desktop. Display toggling has none of that behaviour. Verify any
 * future change with element.checkVisibility(), not getComputedStyle: it is the
 * API that accounts for content-visibility, and it is what caught the bug.
 *
 * Every link stays in the DOM in both states, so nothing is hidden from a
 * crawler.
 */
export function FooterLinkColumn({
  category,
  children,
}: {
  category: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="border-b border-gray-800 pb-3 last:border-0 lg:border-0 lg:pb-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={listId}
          className="flex w-full items-center justify-between text-left uppercase tracking-wider lg:pointer-events-none"
        >
          {category}
          <span
            aria-hidden
            className={`text-gray-500 transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
          >
            &#9662;
          </span>
        </button>
      </h3>
      <ul
        id={listId}
        className={`${open ? "block" : "hidden"} space-y-2 pb-2 sm:space-y-2.5 lg:block lg:pb-0`}
      >
        {children}
      </ul>
    </div>
  );
}
