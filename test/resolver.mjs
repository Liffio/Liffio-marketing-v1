/**
 * Minimal module resolver so `node --test` can load the app's TypeScript
 * config modules directly, with no test-framework dependency.
 *
 * Handles the two things Node's ESM resolver does not do on its own:
 *   1. the `@/*` path alias from tsconfig.json  ->  `src/*`
 *   2. extensionless imports (`./site.config`)  ->  `./site.config.ts`
 *
 * Type stripping itself comes from `--experimental-strip-types`.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";

const SRC = path.resolve(process.cwd(), "src");
const EXTENSIONS = [".ts", ".tsx", "/index.ts"];

export async function resolve(specifier, context, next) {
  const spec = specifier.startsWith("@/")
    ? pathToFileURL(path.join(SRC, specifier.slice(2))).href
    : specifier;

  try {
    return await next(spec, context);
  } catch (error) {
    for (const extension of EXTENSIONS) {
      try {
        return await next(spec + extension, context);
      } catch {
        // try the next candidate extension
      }
    }
    throw error;
  }
}
