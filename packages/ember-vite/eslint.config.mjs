/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     npx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     npx eslint --inspect-config
 *
 */
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import n from 'eslint-plugin-n';
import globals from 'globals';
import ts from 'typescript-eslint';

const parserOptions = {
  esm: {
    js: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
    },
    ts: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
};

export default ts.config(
  js.configs.recommended,
  eslintConfigPrettier,
  /**
   * Ignores must be in their own object
   * https://eslint.org/docs/latest/use/configure/ignore
   */
  {
    ignores: ['dist/', 'lib/', 'node_modules/', 'coverage/', '!**/.*'],
  },
  /**
   * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
   */
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      parserOptions: parserOptions.esm.js,
      globals: {
        ...globals.node,
      },
    },
  },
  ...ts.configs.recommended.map(config => ({
    ...config,
    files: config.files || ['**/*.ts'],
  })),
  {
    files: ['src/**/*.{js,ts}'],
    rules: {
      // Node.js rules for core package
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'prefer-const': 'error',
      // Allow unist types that are only in @types/unist
      '@typescript-eslint/no-empty-interface': 'off',
      // Allow any types in Vite plugin code for flexibility
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', 'tests/**/*.{js,ts}'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  /**
   * CJS node files
   */
  {
    files: ['**/*.cjs', '.prettierrc.js'],
    plugins: {
      n,
    },
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  }
);
