
import { baseViteUserConfig } from '@ig/vitest';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...baseViteUserConfig,
  test: {
    ...baseViteUserConfig.test,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ig/auth-models/test-utils": path.resolve(__dirname, "../ig-auth-models/test/test-index.ts"),
    },
  },
});
