/**
 * Configuración estándar de Prettier para todo el monorepo
 * Basada en Airbnb JavaScript Style Guide + convenciones modernas
 * @type {import("prettier").Config}
 */
export default {
  // Longitud máxima de línea (estándar moderno)
  printWidth: 100,

  // Indentación: 2 espacios
  tabWidth: 2,
  useTabs: false,

  // Punto y coma siempre (evita problemas de ASI)
  semi: true,

  // Comillas dobles en JavaScript (consistencia con JSON)
  singleQuote: false,

  // Comillas en propiedades: solo cuando sea necesario
  quoteProps: 'as-needed',

  // JSX: comillas dobles (convención React)
  jsxSingleQuote: false,

  // Comas finales ES5 (objetos y arrays)
  trailingComma: 'es5',

  // Espacios en llaves: { foo }
  bracketSpacing: true,

  // JSX bracket en nueva línea (mejor legibilidad)
  bracketSameLine: false,

  // Arrow functions: siempre paréntesis
  arrowParens: 'always',

  // Finales de línea Unix (LF)
  endOfLine: 'lf',

  // Formatear código embebido
  embeddedLanguageFormatting: 'auto',

  // JSX: atributos flexibles
  singleAttributePerLine: false,
};
