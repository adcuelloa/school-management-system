import express from "express";

import { studentService } from "./service.js";

const router = express.Router();

// GET /api/estudiantes - Listar todos los estudiantes
router.get("/", async (_req, res) => {
  try {
    const students = await studentService.list();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los estudiantes" });
  }
});

// POST /api/estudiantes - Crear un nuevo estudiante
router.post("/", async (req, res) => {
  try {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al crear el estudiante" });
    }
  }
});

export { router as studentRouter };
