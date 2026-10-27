import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/*
  16-SPEC-tracking.md hard constraint: no id that resolves to a person goes to
  analytics. `umami.identify(user.id)` did exactly that, storing raw user UUIDs
  in Umami's session table. This fails the build if any source file calls
  Umami's identify again, by any route.
*/
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(name) ? [path] : [];
  });
}

test("nothing in src calls Umami's identify", () => {
  const offenders = sourceFiles("src").filter((file) => {
    const code = readFileSync(file, "utf8");
    return /umami\??\.identify\s*\(|\bidentifyUser\s*\(|\bsafeIdentify\s*\(/.test(code);
  });
  assert.deepEqual(offenders, []);
});
