import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // MUST be first
  {
    ignores: ['.coverage_output/**', "node_modules/**", "tsconfig.json", "dist"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  tseslint.configs.recommended,

  pluginReact.configs.flat.recommended,

  // 4️Override to disable react-in-jsx-scope for all files
  {
    files: ['**/*.{jsx,tsx,js,ts}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off', // disable prop-types for TS
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // ensure sorted keys for translations
  {
    files: ["**/CommonTranslationKeys.ts", "**/GamesTranslationKeys.ts"],
    rules: {
      "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
    },
  },
]);
