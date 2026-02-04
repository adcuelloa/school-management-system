import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import baseConfig from './eslint.config.js';

/**
 * Configuración compartida para aplicaciones React del monorepo ges2l
 * Incluye: React, React Hooks, React Refresh y JSX A11y.
 * @type {import("eslint").Linter.Config[]}
 */
const config = [...baseConfig];

// ============================================================================
// REACT PLUGIN - Core React rules
// ============================================================================
config.push({
  plugins: { react: pluginReact },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    ...pluginReact.configs.recommended.rules,
    // React 17+ ya no necesita importar React en scope
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    // TypeScript se encarga de los tipos
    'react/prop-types': 'off',
    'react/jsx-uses-vars': 'error',
    // Seguridad
    'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
    // Clean Code
    'react/jsx-no-useless-fragment': 'error',
  },
});

// ============================================================================
// JSX ACCESSIBILITY (jsx-a11y)
// ============================================================================
config.push({
  plugins: { 'jsx-a11y': pluginJsxA11y },
  rules: {
    ...pluginJsxA11y.configs.recommended.rules,
    // Adaptación a React Router (Link)
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    // Relajar reglas estrictas para desarrollo rápido pero consciente
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],
  },
});

// ============================================================================
// JAVASCRIPT/JSX/TS/TSX FILES & HOOKS
// ============================================================================
config.push({
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    'react-hooks': pluginReactHooks,
    'react-refresh': pluginReactRefresh,
  },
  rules: {
    ...pluginReactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // Vite maneja las extensiones automáticamente
    'import/extensions': 'off',
  },
});

export default config;
