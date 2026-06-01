import { readFileSync } from "fs";
import { join } from "path";

import { normalizePolicyContent } from "@/lib/legal/normalize-policy";

export function loadCreatorsPolicyContent(): string {
  const filePath = join(process.cwd(), "src/content/legal/creators-program-policy.txt");
  let text = readFileSync(filePath, "utf8").trim();
  const lines = text.split("\n");

  if (lines[0] === "Reactova" && lines[1]?.includes("Creators Program Policy")) {
    text = lines.slice(4).join("\n").trim();
  }

  text = text.replace(/\nReactova — April 2026\s*$/i, "").trim();

  return normalizePolicyContent(text);
}
