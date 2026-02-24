
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
      "@ig/prisma-utils/test-utils": path.resolve(__dirname, "../../../ig-lib/ig-be-lib/ig-prisma-utils/test/test-index.ts"),
    },
  },
});
