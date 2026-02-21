import express from "express";

import { asignaturaService } from "./service.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await asignaturaService.list();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener asignaturas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const row = await asignaturaService.create(req.body);
    res.status(201).json(row);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al crear" });
  }
});

export { router as asignaturaRouter };
