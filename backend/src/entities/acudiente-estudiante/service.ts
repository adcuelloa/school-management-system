import { createAcudienteEstudianteSchema } from "@academic/common";

import { db } from "../../config/drizzle.js";
import { acudienteEstudianteInCore } from "../../db/schema.js";

import type { AcudienteEstudiante, CreateAcudienteEstudiante } from "@academic/common";

export class AcudienteEstudianteService {
  async list(): Promise<AcudienteEstudiante[]> {
    const rows = await db.select().from(acudienteEstudianteInCore);
    return rows as AcudienteEstudiante[];
  }

  async create(data: unknown): Promise<AcudienteEstudiante> {
    const parsed = createAcudienteEstudianteSchema.parse(data) as CreateAcudienteEstudiante;
    try {
      const [row] = await db.insert(acudienteEstudianteInCore).values(parsed).returning();
      return row as AcudienteEstudiante;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al insertar acudiente-estudiante"
      );
    }
  }
}

export const acudienteEstudianteService = new AcudienteEstudianteService();
