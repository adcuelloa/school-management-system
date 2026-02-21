import { createAcudienteSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { acudienteInCore } from "../../db/schema.js";

import type { Acudiente, CreateAcudiente } from "@academic/common";

export class AcudienteService {
  async list(): Promise<Acudiente[]> {
    const rows = await db.select().from(acudienteInCore).where(eq(acudienteInCore.estado, true));
    return rows as Acudiente[];
  }

  async create(data: unknown): Promise<Acudiente> {
    const parsed = createAcudienteSchema.parse(data) as CreateAcudiente;
    try {
      const [row] = await db.insert(acudienteInCore).values(parsed).returning();
      return row as Acudiente;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar acudiente");
    }
  }
}

export const acudienteService = new AcudienteService();
