/**
 * A bridge for the two policies still served as plain text.
 *
 * ⏳ TEMPORARY. Delete this file when /privacy-policy and /affiliate-policy
 * move to `src/content/legal/*.md` like the other six. Nothing else may use it.
 *
 * 🔴 WHY IT EXISTS. `LegalPage` used to guess which lines were headings from
 * their shape, because its content was one undifferentiated blob. The policy
 * pack is Markdown, so that guesswork was removed, and doing so silently
 * flattened these two pages, which still pass plain text: the Privacy Policy
 * rendered as 28 consecutive paragraphs with no headings at all, and the
 * Affiliate Policy as 78. A legal document with no visible structure is close
 * to unreadable, and nothing in the diff said so.
 *
 * So the guess is kept, but scoped to exactly the two documents that need it
 * and named for what it is, rather than left in the shared renderer where it
 * would quietly apply to real Markdown as well. The heuristic below is the
 * original one, unchanged, so these two pages render exactly as they did
 * before the pack landed.
 */

/** The original `isSectionHeading`, preserved verbatim. */
function looksLikeHeading(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^\d+(\.\d+)?\.\s/.test(trimmed) ||
    (/^[A-Z]/.test(trimmed) && trimmed.length < 72 && !trimmed.endsWith("."))
  );
}

/** Promote the lines the old renderer would have drawn as headings to `##`. */
export function legacyPolicyToMarkdown(content: string): string {
  return content
    .split("\n")
    .map((line) => (line.trim() !== "" && looksLikeHeading(line) ? `## ${line.trim()}` : line))
    .join("\n");
}
