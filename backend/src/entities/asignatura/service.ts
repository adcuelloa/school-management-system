import { createAsignaturaSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { asignaturaInCore } from "../../db/schema.js";

import type { Asignatura, CreateAsignatura } from "@academic/common";

export class AsignaturaService {
  async list(): Promise<Asignatura[]> {
    const rows = await db.select().from(asignaturaInCore).where(eq(asignaturaInCore.estado, true));
    return rows as Asignatura[];
  }

  async create(data: unknown): Promise<Asignatura> {
    const parsed = createAsignaturaSchema.parse(data) as CreateAsignatura;
    try {
      const [row] = await db.insert(asignaturaInCore).values(parsed).returning();
      return row as Asignatura;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar asignatura");
    }
  }
}

export const asignaturaService = new AsignaturaService();
