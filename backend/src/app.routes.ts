/**
 * @module app.routes
 * @summary Router principal de la aplicación
 */

import express, { type Request, type Response } from "express";

import logger from "./config/logger.js";
import { studentRouter } from "./entities/student/router.js";

const router = express.Router();

/**
 * Middleware de logging de peticiones
 */
router.use((req: Request, _res: Response, next) => {
  logger.http(`Solicitud entrante: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  next();
});

/**
 * API Routes
 */
router.use("/api/students", studentRouter);

/**
 * Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "school-management-system",
  });
});

/**
 * Manejo de rutas no encontradas
 */
router.use((req: Request, res: Response) => {
  logger.warn("Ruta no encontrada", {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

export default router;
