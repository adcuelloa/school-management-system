/**
 * ESLint Flat Config - @ges2l/common
 * Paquete compartido de tipos, esquemas y constantes.
 */

import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import pluginImportX from "eslint-plugin-import-x";
import globals from "globals";

import baseConfig from "../../eslint.config.js";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // 1. Heredamos las reglas de orden e imports del root
  ...baseConfig,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "import-x": pluginImportX,
    },
    settings: {
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.eslint.json"],
        },
      },
    },
    rules: {
      // Reglas recomendadas de TS
      ...typescriptPlugin.configs.recommended.rules,

      // Validación de resolución interna
      "import-x/no-unresolved": "error",
      "import-x/extensions": [
        "error",
        "always",
        {
          js: "always",
          ts: "never",
        },
      ],
      "import-x/no-cycle": "error", // En common no queremos ciclos NUNCA
      "import-x/no-duplicates": "error",

      // Limpieza de código (Strict para evitar basura en las apps)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  {
    // Ignores locales del paquete
    ignores: ["dist/**", "node_modules/**", "temp/**"],
  },
];

export default config;
