import { createGradoAsignaturaSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { gradoAsignaturaInCore } from "../../db/schema.js";

import type { CreateGradoAsignatura, GradoAsignatura } from "@academic/common";

export class GradoAsignaturaService {
  async list(): Promise<GradoAsignatura[]> {
    const rows = await db
      .select()
      .from(gradoAsignaturaInCore)
      .where(eq(gradoAsignaturaInCore.estado, true));
    return rows as GradoAsignatura[];
  }

  async create(data: unknown): Promise<GradoAsignatura> {
    const parsed = createGradoAsignaturaSchema.parse(data) as CreateGradoAsignatura;
    try {
      const [row] = await db.insert(gradoAsignaturaInCore).values(parsed).returning();
      return row as GradoAsignatura;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar grado-asignatura");
    }
  }
}

export const gradoAsignaturaService = new GradoAsignaturaService();
