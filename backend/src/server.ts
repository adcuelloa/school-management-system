import "dotenv/config";

import app from "./app.js";
import logger from "./config/logger.js";

const PORT: number = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 School Management API running on port ${PORT}`);
  logger.info(`📡 API endpoints: http://localhost:${PORT}/api`);
});

/**
 * Graceful shutdown handling
 */
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received: starting graceful shutdown...`);

  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    logger.error("Could not close gracefully, forcing termination...");
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("💥 Unhandled Rejection:", {
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  logger.error("☢️ Uncaught Exception:", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Escuchar señales de interrupción y terminación (Ctrl+C, PM2, Docker)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("💥 Error: Unhandled Rejection:", {
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });

  // Intentamos cerrar el servidor antes de fallar
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  logger.error("☢️ Error: Uncaught Exception:", {
    message: err.message,
    stack: err.stack,
  });

  // Salida inmediata por estado incierto
  process.exit(1);
});
