
import { baseViteUserConfig } from '@ig/vitest';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...baseViteUserConfig,
  test: {
    ...baseViteUserConfig.test,
    passWithNoTests: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
