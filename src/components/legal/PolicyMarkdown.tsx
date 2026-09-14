import type { ReactNode } from "react";

import { parsePolicyMarkdown } from "@/lib/legal/parse-policy-markdown";

/**
 * The Markdown subset the policy pack actually uses, rendered as React elements.
 *
 * 🔴 WHY A RENDERER AND NOT A STRING SPLIT. The previous LegalPage split the
 * content on newlines and guessed which lines were headings from their shape
 * (`/^\d+(\.\d+)?\.\s/`, or short and capitalised). The policy pack is real
 * Markdown - `##` and `###` levels, `**bold**`, `` `code` ``, bullet lists and
 * 40 table rows across Privacy and Cookies - so that renderer would have
 * printed `## 1. What are cookies?` with the hashes showing and every table as
 * a row of raw pipes.
 *
 * 🚩 React ELEMENTS, never `dangerouslySetInnerHTML`. The content is
 * first-party today, but a policy renderer that interprets HTML is one paste
 * away from being an injection sink, and nothing here needs it. Everything
 * below builds elements, so React escapes the text for us by construction.
 *
 * 🚩 This deliberately supports only what the eight documents contain. It is
 * not a Markdown library and should not grow into one: if a policy starts
 * using a construct that is not here, it renders as literal text, which is
 * visible immediately rather than silently wrong. The test suite asserts the
 * supported set against the real files.
 */

/** `**bold**` and `` `code` ``, the only inline marks the pack uses. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#0a0a0a]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-[#0a0a0a]"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

const HEADING_CLASS: Record<2 | 3 | 4, string> = {
  2: "!mt-10 text-base font-bold text-[#0a0a0a] first:!mt-0 sm:text-lg",
  3: "!mt-7 text-[0.95rem] font-bold text-[#0a0a0a] first:!mt-0 sm:text-base",
  4: "!mt-5 text-[0.9rem] font-semibold text-[#2a2a2a] first:!mt-0",
};

export default function PolicyMarkdown({ source }: { source: string }) {
  const blocks = parsePolicyMarkdown(source);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-[0.9375rem]">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          const Tag = (`h${block.level}` as const) satisfies "h2" | "h3" | "h4";
          return (
            <Tag
              key={index}
              className={HEADING_CLASS[block.level]}
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {inline(block.text)}
            </Tag>
          );
        }

        if (block.kind === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={`!mt-3 space-y-1.5 pl-5 marker:text-[#F5184C] ${
                block.ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inline(item)}</li>
              ))}
            </ListTag>
          );
        }

        if (block.kind === "table") {
          // 🚩 The scroller is REQUIRED, not defensive. Privacy 3 and the Cookie
          // tables are four columns of prose; at 390px they cannot fit, and
          // without this the page itself scrolls sideways.
          return (
            <div key={index} className="!mt-4 -mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[0.8125rem]">
                <thead>
                  <tr>
                    {block.head.map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        scope="col"
                        className="border-b border-gray-200 bg-gray-50 px-3 py-2 align-top font-semibold text-[#0a0a0a]"
                      >
                        {inline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="align-top">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border-b border-gray-100 px-3 py-2">
                          {inline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
