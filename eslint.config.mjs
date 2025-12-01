// eslint.config.mjs

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.commonjs,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },

    rules: {
      // TypeScript handles undefined checks, so disable `no-undef` to avoid false positives
      "no-undef": "off",
      // The TypeScript-aware rule should handle unused vars; disable the base ESLint one
      "no-unused-vars": "off",
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      // Turn off this rule because we're using the new JSX transform (React 17+)
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  // Ignored files
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
    ],
  },
];
