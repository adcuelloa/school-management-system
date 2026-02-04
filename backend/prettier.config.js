/**
 * Configuración de Prettier - Backend API (Node.js)
 * Hereda la configuración base del monorepo
 * @type {import("prettier").Config}
 */
import baseConfig from "../prettier.config.js";

export default {
  ...baseConfig,

  // === Configuraciones específicas del Backend ===
  // (Actualmente usa la configuración base sin modificaciones)

  // Nota: Las configuraciones JSX se heredan pero no afectan archivos .js del backend
  // Solo se aplicarán si se usan archivos .jsx en el futuro
};
