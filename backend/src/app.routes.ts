/**
 * @module app.routes
 * @summary Router principal de la aplicación
 */

import express, { type Request, type Response } from "express";

import logger from "./config/logger.js";
import { acudienteRouter } from "./entities/acudiente/router.js";
import { acudienteEstudianteRouter } from "./entities/acudiente-estudiante/router.js";
import { areaRouter } from "./entities/area/router.js";
import { asignaturaRouter } from "./entities/asignatura/router.js";
import { calificacionRouter } from "./entities/calificacion/router.js";
import { docenteRouter } from "./entities/docente/router.js";
import { docenteAsignaturaRouter } from "./entities/docente-asignatura/router.js";
import { evaluacionRouter } from "./entities/evaluacion/router.js";
import { gradoRouter } from "./entities/grado/router.js";
import { gradoAsignaturaRouter } from "./entities/grado-asignatura/router.js";
import { grupoRouter } from "./entities/grupo/router.js";
import { matriculaRouter } from "./entities/matricula/router.js";
import { rolRouter } from "./entities/rol/router.js";
import { studentRouter } from "./entities/student/router.js";
import { tipoDocumentoRouter } from "./entities/tipo-documento/router.js";
import { usuarioRouter } from "./entities/usuario/router.js";

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
router.use("/api/estudiantes", studentRouter);
router.use("/api/tipos-documento", tipoDocumentoRouter);
router.use("/api/roles", rolRouter);
router.use("/api/areas", areaRouter);
router.use("/api/usuarios", usuarioRouter);
router.use("/api/acudientes", acudienteRouter);
router.use("/api/docentes", docenteRouter);
router.use("/api/asignaturas", asignaturaRouter);
router.use("/api/grados", gradoRouter);
router.use("/api/grupos", grupoRouter);
router.use("/api/matriculas", matriculaRouter);
router.use("/api/evaluaciones", evaluacionRouter);
router.use("/api/calificaciones", calificacionRouter);
router.use("/api/grado-asignaturas", gradoAsignaturaRouter);
router.use("/api/docente-asignaturas", docenteAsignaturaRouter);
router.use("/api/acudiente-estudiantes", acudienteEstudianteRouter);

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
