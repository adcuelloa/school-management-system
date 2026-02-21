import { createMatriculaSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { matriculaInCore } from "../../db/schema.js";

import type { CreateMatricula, Matricula } from "@academic/common";

export class MatriculaService {
  async list(): Promise<Matricula[]> {
    const rows = await db.select().from(matriculaInCore).where(eq(matriculaInCore.estado, true));
    return rows as Matricula[];
  }

  async create(data: unknown): Promise<Matricula> {
    const parsed = createMatriculaSchema.parse(data) as CreateMatricula;
    try {
      const [row] = await db.insert(matriculaInCore).values(parsed).returning();
      return row as Matricula;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar matrícula");
    }
  }
}

export const matriculaService = new MatriculaService();
