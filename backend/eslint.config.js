/**
 * ESLint Flat Config - Backend API (Ges2l)
 * Hereda de la base y añade capas de seguridad y promesas.
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import pluginImportX from "eslint-plugin-import-x";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import globals from "globals";

import baseConfig from "../eslint.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = [...baseConfig];

// ============================================================================
// 1. CONFIGURACIÓN DEL RESOLVER (Específica del Backend)
// ============================================================================
config.push({
  settings: {
    "import-x/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    // Configuración unificada del resolver
    "import-x/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.eslint.json"],
      },
      node: {
        extensions: [".js", ".mjs", ".cjs", ".ts", ".tsx", ".json"],
        moduleDirectory: ["node_modules", "src"],
      },
      // Soporte explícito para alias
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".json", ".ts", ".tsx"],
      },
    },
  },
});

// ============================================================================
// 2. PLUGINS DE SEGURIDAD Y ASINCRONÍA
// ============================================================================
config.push({
  plugins: {
    promise: promisePlugin,
    security: securityPlugin,
  },
  rules: {
    // --- Promise Rules ---
    "promise/always-return": "warn",
    "promise/catch-or-return": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn",
    "promise/avoid-new": "off",
    "promise/no-new-statics": "error",
    "promise/valid-params": "error",

    // --- Security Rules ---
    "security/detect-unsafe-regex": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-object-injection": "off",
    "security/detect-possible-timing-attacks": "warn",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
  },
});

// ============================================================================
// 3. JS FILES (Node Environment)
// ============================================================================
config.push({
  files: ["**/*.js", "**/*.mjs"],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    "no-process-exit": "off",
    "import-x/extensions": [
      "error",
      "ignorePackages",
      {
        js: "always",
        ts: "never",
      },
    ],
  },
});

// ============================================================================
// 4. ARCHIVOS TYPESCRIPT (El núcleo: Drizzle, Services, Auth)
// ============================================================================
config.push({
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    globals: { ...globals.node },
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: "./tsconfig.eslint.json",
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    "@typescript-eslint": typescriptPlugin,
    "import-x": pluginImportX,
  },
  rules: {
    "import-x/no-unresolved": "error",
    "import-x/named": "error",
    "import-x/extensions": [
      "error",
      "ignorePackages",
      {
        js: "always",
        ts: "never",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
});

// ============================================================================
// 4. EXCEPCIONES PARA BASE DE DATOS (Drizzle ORM)
// ============================================================================
config.push({
  files: ["src/db/schema.ts", "src/db/relations.ts", "**/schema.ts"],
  rules: {
    "@typescript-eslint/no-use-before-define": "off", // Tablas circulares
    "no-loss-of-precision": "off",
  },
});

export default config;
