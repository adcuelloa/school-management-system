import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import AppRoutes from "./app.routes.js";
import { checkConnection } from "./config/drizzle.js";
import logger from "./config/logger.js";

// Verificar conexión a la base de datos antes de iniciar
await checkConnection();

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`Solicitud entrante: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  next();
});

// Rutas de la aplicación
app.use(AppRoutes);

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error("Error no manejado:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Algo salió mal",
  });
});

export default app;
