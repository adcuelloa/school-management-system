import { createCalificacionSchema } from "@academic/common";

import { db } from "../../config/drizzle.js";
import { calificacionInCore } from "../../db/schema.js";

import type { Calificacion, CreateCalificacion } from "@academic/common";

export class CalificacionService {
  async list(): Promise<Calificacion[]> {
    const rows = await db.select().from(calificacionInCore);
    return rows as Calificacion[];
  }

  async create(data: unknown): Promise<Calificacion> {
    const parsed = createCalificacionSchema.parse(data) as CreateCalificacion;
    try {
      const [row] = await db.insert(calificacionInCore).values(parsed).returning();
      return row as Calificacion;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar calificación");
    }
  }
}

export const calificacionService = new CalificacionService();
