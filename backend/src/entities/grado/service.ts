import { createGradoSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { gradoInCore } from "../../db/schema.js";

import type { CreateGrado, Grado } from "@academic/common";

export class GradoService {
  async list(): Promise<Grado[]> {
    const rows = await db.select().from(gradoInCore).where(eq(gradoInCore.estado, true));
    return rows as Grado[];
  }

  async create(data: unknown): Promise<Grado> {
    const parsed = createGradoSchema.parse(data) as CreateGrado;
    try {
      const [row] = await db.insert(gradoInCore).values(parsed).returning();
      return row as Grado;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar grado");
    }
  }
}

export const gradoService = new GradoService();
