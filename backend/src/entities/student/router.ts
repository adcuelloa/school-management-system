import express from "express";

import { studentService } from "./service.js";

const router = express.Router();

// GET /api/students - List all students
router.get("/", async (_req, res) => {
  try {
    const students = await studentService.list();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

export { router as studentRouter };
