import express from "express";

import { authService } from "./service.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);
    res.json(user);
  } catch (error) {
    res
      .status(401)
      .json({ error: error instanceof Error ? error.message : "Error de autenticación" });
  }
});

export { router as authRouter };
