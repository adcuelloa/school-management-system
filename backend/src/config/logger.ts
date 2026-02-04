/**
 * @module config/logger
 * @summary Configuración del logger de la aplicación utilizando Winston (ES Modules).
 * @description Configura diferentes niveles de log y transportes para registrar eventos de la aplicación de manera estructurada. Configuración lazy para evitar dependencias circulares.
 */

import path from "path";
import { fileURLToPath } from "url";

import winston from "winston";

// Recrea __dirname y __filename para ser compatible con Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define los niveles de log personalizados para la aplicación.
// Esto permite un control más granular sobre la severidad de los mensajes.
const levels: Record<string, number> = {
  error: 0, // Errores críticos que detienen la aplicación o requieren atención inmediata.
  warn: 1, // Advertencias sobre posibles problemas o comportamientos inesperados.
  info: 2, // Información general sobre el flujo de la aplicación.
  http: 3, // Solicitudes HTTP (similar a lo que haría Morgan).
  verbose: 4, // Mensajes más detallados, útiles para depuración profunda.
  debug: 5, // Mensajes de depuración muy detallados, solo para desarrollo.
  silly: 6, // Mensajes extremadamente detallados, para propósitos de desarrollo/prueba.
};

// Define los colores asociados a cada nivel de log para la consola.
// Facilita la lectura de los logs en entornos de desarrollo.
const colors: Record<string, string> = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "cyan",
  debug: "blue",
  silly: "grey",
};

// Añade los colores personalizados a Winston.
winston.addColors(colors);

// Formato para archivos: JSON anidado, sin color
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Formato para consola: colores y formato simple
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.simple()
);

// Función para crear los transportes usando config después de la inicialización
/**
 * Crea los transportes de Winston usando la configuración centralizada.
 * @returns Array de transportes configurados
 */
const createTransports = (): winston.transport[] => {
  const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
  const logsDir = path.join(__dirname, "../../logs");

  return [
    new winston.transports.Console({
      level: LOG_LEVEL,
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      handleExceptions: true,
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      level: LOG_LEVEL,
      maxsize: 10485760,
      maxFiles: 10,
      format: fileFormat,
    }),
  ];
};

// Crea la instancia del logger de Winston usando la configuración centralizada
const logger: winston.Logger = winston.createLogger({
  levels,
  transports: createTransports(),
  exitOnError: false,
});

// Exporta el logger para ser utilizado en toda la aplicación.
export default logger;
