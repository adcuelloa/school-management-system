/**
 * Configuración de Prettier - Panel de Administración (React)
 * Hereda la configuración base y añade configuraciones específicas de React
 * @type {import("prettier").Config}
 */
import baseConfig from "../../prettier.config.js";

export default {
  ...baseConfig,

  // === Configuraciones específicas de React ===

  // Sensibilidad de espacios en blanco para JSX (importante para React)
  htmlWhitespaceSensitivity: "css",
};
