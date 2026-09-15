#!/usr/bin/env node
/**
 * Fails the build if an em dash or en dash reaches a source file.
 *
 * Em dashes read as AI-written copy, so none may ship: not in page copy, not in
 * metadata, JSON-LD, alt text or button labels, not in config files that hold
 * copy, and not in code comments either (a comment is one copy-paste away from
 * being a string).
 *
 * Caught, in every git-tracked text file:
 *   - U+2014 EM DASH and U+2013 EN DASH, literal
 *   - the HTML entities for both, named (mdash, ndash) and numeric
 *   - the JS/TS escapes for both, in \uXXXX, \u{XXXX} and \xXX{...} spellings
 *
 * Ranges keep a plain hyphen ("5-7 days") or read as words ("5 to 7 days").
 * A genuine need to normalise dash input in code uses the Unicode property
 * escape \p{Pd} instead of writing a dash out: see TechBadge's toSlug().
 *
 * Deliberately NOT caught: a double hyphen (`--`). It collides with CLI flags,
 * CSS custom properties and BEM modifiers, so it is reviewed by eye, not here.
 *
 * This file is excluded from its own scan. A rule that names the characters it
 * forbids cannot also be its own input, so the patterns below are written as
 * escapes and the file skips itself.
 *
 * Usage: npm run check:dashes
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts",
  ".css", ".scss", ".md", ".mdx", ".json", ".txt", ".html", ".yml", ".yaml",
]);

const PATTERNS = [
  { label: "em dash (U+2014)", re: /\u2014/g },
  { label: "en dash (U+2013)", re: /\u2013/g },
  { label: "dash HTML entity", re: /&(?:mdash|ndash);|&#(?:8212|8211);|&#x(?:2014|2013);/gi },
  { label: "dash escape sequence", re: new RegExp("\\\\(?:u|x)\\{?(?:2014|2013)\\}?", "g") },
];

const repoRoot = path.resolve(import.meta.dirname, "..");
const selfPath = path.resolve(import.meta.filename);

const tracked = execFileSync("git", ["ls-files", "-z"], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
})
  .split("\0")
  .filter(Boolean)
  .filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()))
  .filter((file) => path.resolve(repoRoot, file) !== selfPath);

const findings = [];

for (const file of tracked) {
  let contents;
  try {
    contents = readFileSync(path.join(repoRoot, file), "utf8");
  } catch {
    continue; // deleted from the working tree but still in the index
  }
  if (!PATTERNS.some(({ re }) => (re.lastIndex = 0, re.test(contents)))) continue;

  contents.split(/\r?\n/).forEach((line, i) => {
    for (const { label, re } of PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(line)) !== null) {
        findings.push({ file, line: i + 1, column: match.index + 1, label, text: line.trim() });
      }
    }
  });
}

if (findings.length === 0) {
  console.log(`check:dashes PASS: 0 matches in ${tracked.length} tracked text files.`);
  process.exit(0);
}

console.error(`check:dashes FAIL: ${findings.length} match${findings.length === 1 ? "" : "es"}.\n`);
for (const { file, line, column, label, text } of findings) {
  console.error(`  ${file}:${line}:${column}  ${label}`);
  console.error(`    ${text.length > 160 ? `${text.slice(0, 157)}...` : text}\n`);
}
console.error('Rewrite each sentence so it reads naturally: a comma, a full stop, a colon or');
console.error('brackets. For ranges use a plain hyphen or the word "to". Do not swap in a');
console.error("spaced hyphen.\n");
process.exit(1);
