import { createDocenteSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { docenteInCore } from "../../db/schema.js";

import type { CreateDocente, Docente } from "@academic/common";

export class DocenteService {
  async list(): Promise<Docente[]> {
    const rows = await db.select().from(docenteInCore).where(eq(docenteInCore.estado, true));
    return rows as Docente[];
  }

  async create(data: unknown): Promise<Docente> {
    const parsed = createDocenteSchema.parse(data) as CreateDocente;
    try {
      const [row] = await db.insert(docenteInCore).values(parsed).returning();
      return row as Docente;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar docente");
    }
  }
}

export const docenteService = new DocenteService();
