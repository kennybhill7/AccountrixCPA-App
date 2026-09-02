import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    globals: true,
    // Run only the maintained unit suite. This deliberately excludes:
    //  - _salvage/** (legacy salvaged code),
    //  - Playwright e2e specs (*.spec.ts under tests/e2e — run via Playwright, not Vitest),
    //  - legacy construction-SaaS component tests (e.g. ChartOfAccountsBuilder.test.tsx)
    //    whose selectors are ambiguous and are not part of the Academy app.
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
