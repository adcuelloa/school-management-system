import { createDocenteAsignaturaSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { docenteAsignaturaInCore } from "../../db/schema.js";

import type { CreateDocenteAsignatura, DocenteAsignatura } from "@academic/common";

export class DocenteAsignaturaService {
  async list(): Promise<DocenteAsignatura[]> {
    const rows = await db
      .select()
      .from(docenteAsignaturaInCore)
      .where(eq(docenteAsignaturaInCore.estado, true));
    return rows as DocenteAsignatura[];
  }

  async create(data: unknown): Promise<DocenteAsignatura> {
    const parsed = createDocenteAsignaturaSchema.parse(data) as CreateDocenteAsignatura;
    try {
      const [row] = await db.insert(docenteAsignaturaInCore).values(parsed).returning();
      return row as DocenteAsignatura;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar docente-asignatura");
    }
  }
}

export const docenteAsignaturaService = new DocenteAsignaturaService();
