import { createEvaluacionSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { evaluacionInCore } from "../../db/schema.js";

import type { CreateEvaluacion, Evaluacion } from "@academic/common";

export class EvaluacionService {
  async list(): Promise<Evaluacion[]> {
    const rows = await db.select().from(evaluacionInCore).where(eq(evaluacionInCore.estado, true));
    return rows as Evaluacion[];
  }

  async create(data: unknown): Promise<Evaluacion> {
    const parsed = createEvaluacionSchema.parse(data) as CreateEvaluacion;
    try {
      const [row] = await db.insert(evaluacionInCore).values(parsed).returning();
      return row as Evaluacion;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar evaluación");
    }
  }
}

export const evaluacionService = new EvaluacionService();
