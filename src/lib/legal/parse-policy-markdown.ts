/**
 * The policy pack's Markdown, parsed into blocks.
 *
 * 🚩 Kept in a `.ts` file, separate from the component that renders it, for
 * two reasons. The parser is pure and belongs under test on its own; and the
 * test runner strips types from `.ts` only - importing this from a `.tsx`
 * failed with ERR_UNKNOWN_FILE_EXTENSION, so the split is what makes the
 * structural assertions in test/legal.test.ts possible at all.
 *
 * Only the constructs the eight documents actually use are handled. See
 * PolicyMarkdown for why that is deliberate.
 */

export type Block =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^[-*]\s+(.*)$/;
/** `1.` … `9.`: the Affiliate Policy numbers its attribution steps, and the
 *  order is load-bearing there: it is the sequence attribution is resolved in. */
const ORDERED = /^\d+\.\s+(.*)$/;
const TABLE_ROW = /^\|(.*)\|\s*$/;
/**
 * The `|---|---|` separator under a table's header row.
 *
 * 🚩 The character class MUST include `|`. Written as `[\s:-]+` it matches a
 * single-column separator and nothing else: in `|---|---|---|---|` the span
 * between the outer pipes contains three more, so every real four-column
 * separator failed, the header row fell through to the paragraph branch, and
 * the Cookie Policy rendered as eight lines of raw pipes.
 */
const TABLE_RULE = /^\|[\s:|-]+\|\s*$/;

function splitRow(line: string): string[] {
  return line
    .replace(/^\||\|\s*$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parsePolicyMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === "") continue;

    const heading = HEADING.exec(trimmed);
    if (heading) {
      // `#` is the document title, which the page header already renders, so it
      // is dropped rather than repeated. Everything deeper maps to h2/h3/h4 -
      // the page's own <h1> stays the only one, which is what keeps the
      // document outline valid for screen readers and for search.
      const depth = heading[1].length;
      if (depth === 1) continue;
      blocks.push({
        kind: "heading",
        level: depth === 2 ? 2 : depth === 3 ? 3 : 4,
        text: heading[2].trim(),
      });
      continue;
    }

    if (TABLE_ROW.test(trimmed) && TABLE_RULE.test(lines[i + 1]?.trim() ?? "")) {
      const head = splitRow(trimmed);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && TABLE_ROW.test(lines[i].trim())) {
        rows.push(splitRow(lines[i].trim()));
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: "table", head, rows });
      continue;
    }

    const bullet = BULLET.exec(trimmed);
    const ordered = bullet ? null : ORDERED.exec(trimmed);
    if (bullet || ordered) {
      const pattern = bullet ? BULLET : ORDERED;
      const items = [(bullet ?? ordered)![1].trim()];
      while (i + 1 < lines.length) {
        const next = pattern.exec(lines[i + 1].trim());
        if (!next) break;
        items.push(next[1].trim());
        i += 1;
      }
      blocks.push({ kind: "list", ordered: Boolean(ordered), items });
      continue;
    }

    blocks.push({ kind: "paragraph", text: trimmed });
  }

  return blocks;
}
