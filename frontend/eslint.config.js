/**
 * ESLint Flat Config - Panel Frontend (React 19 + Vite 7 + Tailwind 4)
 * Hereda de la base React y optimiza la resolución de TS local.
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

import tsParser from "@typescript-eslint/parser";
import pluginImportX from "eslint-plugin-import-x";
import globals from "globals";

// Importamos la configuración compartida de React
import reactConfig from "../eslint.config.react.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = [...reactConfig];

// ============================================================================
// 1. SETTINGS Y RESOLVER (Unificado y rápido)
// ============================================================================
config.push({
  settings: {
    "import-x/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import-x/resolver": {
      typescript: {
        alwaysTryTypes: true,
        // Al apuntar aquí, ESLint ya sabe leer tus alias '@/' del tsconfig
        project: ["./tsconfig.eslint.json"],
      },
      node: true,
    },
  },
});

// ============================================================================
// 2. REGLAS PARA ARCHIVOS JS/JSX
// ============================================================================
config.push({
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    globals: { ...globals.browser },
  },
  rules: {
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
});

// ============================================================================
// 3. REGLAS PARA ARCHIVOS TS/TSX (Type-aware)
// ============================================================================
config.push({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: ["./tsconfig.eslint.json"],
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    "import-x": pluginImportX,
  },
  rules: {
    "import-x/no-unresolved": "error",
    "@typescript-eslint/no-explicit-any": "warn",
  },
});

// ============================================================================
// 4. TEST FILES (Vitest)
// ============================================================================
config.push({
  files: [
    "src/**/*.test.{js,jsx,ts,tsx}",
    "src/**/*.spec.{js,jsx,ts,tsx}",
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.vitest, // Cambiado de jest a vitest para Vite 7
    },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "import-x/no-extraneous-dependencies": "off",
  },
});

// ============================================================================
// 5. CONFIG FILES
// ============================================================================
config.push({
  files: ["*.config.{js,ts}", "eslint.config.js", "vite.config.*", "tailwind.config.*"],
  rules: {
    "import-x/no-unresolved": "off",
    "import-x/extensions": "off",
  },
});

export default config;
