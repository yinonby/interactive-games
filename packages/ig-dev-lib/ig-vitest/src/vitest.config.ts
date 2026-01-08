
import { type ViteUserConfig } from "vitest/config";

export const baseViteUserConfig: ViteUserConfig = {
  test: {
    globals: true,
    watch: false,
    clearMocks: true,
    testTimeout: 5000,
    coverage: {
      provider: "istanbul", // "v8" | "istanbul"
      thresholds: { statements: 100 },
      reporter: ["text", "json"],
      reportsDirectory: ".coverage_output",
      exclude: ["src/types", "test"],
    },
  },
}
