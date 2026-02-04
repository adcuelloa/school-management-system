/**
 * Configuración base de ESLint para todo el monorepo (ges2l)
 * @type {import("eslint").Linter.Config[]}
 */

import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier/flat';
import pluginImportX from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';

const config = [];

// ============================================================================
// 1. BASE CONFIGURATION
// Heredamos las reglas recomendadas de ESLint (standard)
// ============================================================================
config.push(js.configs.recommended);

// ============================================================================
// 2. CONFIGURACIÓN GLOBAL Y AMBIENTES
// Habilitamos tanto Node como Browser para cubrir Backend y Frontend
// ============================================================================
config.push({
  files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
    globals: {
      ...globals.es2024,
      ...globals.browser, // Vital para React
      ...globals.node, // Vital para Backend/Scripts
    },
  },
  // Reglas globales de calidad que aplican a JS y TS
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'warn',
    'no-unused-vars': 'off', // Lo maneja TS o reglas específicas abajo
    eqeqeq: ['error', 'always', { null: 'ignore' }], // Buena práctica universal
  },
});

// ============================================================================
// 3. IMPORT PLUGIN - Orden y validación (Monorepo Optimized)
// ============================================================================
config.push({
  plugins: {
    'import-x': pluginImportX,
  },
  settings: {
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    'import-x/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          'tsconfig.json',
          'backend/tsconfig.json',
          'frontend/*/tsconfig.json',
          'packages/*/tsconfig.json',
        ],
      },
      node: true,
    },
  },
  rules: {
    'import-x/no-unresolved': 'warn',
    'import-x/no-cycle': ['warn', { maxDepth: 3, ignoreExternal: true }], // Profundidad reducida para performance
    'import-x/no-duplicates': 'error',
    'import-x/first': 'error',
    'import-x/no-absolute-path': 'error',

    'import-x/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal', // Aquí entran @ges2l y @/
          ['parent', 'sibling'],
          'index',
          'type',
        ],
        pathGroups: [
          {
            pattern: '@ges2l/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // Orden interno de los miembros { A, B, C }
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
  },
});

// ============================================================================
// 4. TYPESCRIPT FILES - Configuración Estándar
// ============================================================================
config.push({
  files: ['**/*.{ts,tsx,d.ts}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Los workspaces hijos deben definir 'parserOptions.project' si quieren reglas 'type-aware'.
    },
  },
  plugins: {
    '@typescript-eslint': typescriptPlugin,
  },
  // Extendemos las reglas recomendadas del plugin (ESTÁNDAR)
  // Esto reemplaza tu lista manual anterior
  rules: {
    ...typescriptPlugin.configs.recommended.rules,

    // Overrides específicos comunes
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
});

// ============================================================================
// 5. TEST FILES - Entorno de pruebas
// ============================================================================
config.push({
  files: [
    '**/*.test.{js,ts,tsx}',
    '**/*.spec.{js,ts,tsx}',
    '**/__tests__/**/*.{js,ts,tsx}',
    'tests/**/*.{js,ts,tsx}',
  ],
  languageOptions: {
    globals: {
      ...globals.jest, // O globals.mocha si usas eso
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      vi: 'readonly', // Vitest
    },
  },
  rules: {
    'import-x/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // Permitir any en tests a veces es útil
  },
});

// ============================================================================
// 6. CONFIG FILES - Permitir devDependencies y Node features
// ============================================================================
config.push({
  files: [
    '*.config.{js,mjs,ts}',
    '**/eslint.config.{js,mjs}',
    '**/vite.config.{js,ts}',
    '**/tailwind.config.{js,ts}',
  ],
  plugins: { n: nodePlugin },
  rules: {
    'import-x/no-extraneous-dependencies': 'off',
    'n/no-unpublished-import': 'off',
    'n/no-extraneous-import': 'off',
  },
});

// ============================================================================
// 8. PRETTIER - Siempre al final
// Desactiva reglas de estilo que choquen con Prettier
// ============================================================================
config.push(prettierConfig);

// ============================================================================
// 9. IGNORES GLOBALES
// ============================================================================
config.push({
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.docusaurus/**',
    '**/logs/**',
    '**/*.log',
    '**/.env*',
  ],
});

export default config;
