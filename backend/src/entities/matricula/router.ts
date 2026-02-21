import express from "express";

import { matriculaService } from "./service.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await matriculaService.list();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener matrículas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const row = await matriculaService.create(req.body);
    res.status(201).json(row);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al crear" });
  }
});

export { router as matriculaRouter };
