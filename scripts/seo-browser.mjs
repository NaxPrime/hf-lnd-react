import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export function loadChromium() {
  const candidates = [
    "playwright",
    "C:/Users/Manish/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate).chromium;
    } catch {
      // Try the bundled Codex runtime when Playwright is not a project dependency.
    }
  }
  throw new Error("Playwright is unavailable. Install it or configure the bundled Codex runtime.");
}
