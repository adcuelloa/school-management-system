import { createEstudianteSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { estudianteInCore } from "../../db/schema.js";

import type { CreateEstudiante, Estudiante } from "@academic/common";

export class StudentService {
  async list(): Promise<Estudiante[]> {
    const rows = await db.select().from(estudianteInCore).where(eq(estudianteInCore.estado, true));

    return rows as Estudiante[];
  }

  async create(data: unknown): Promise<Estudiante> {
    const parsed = createEstudianteSchema.parse(data) as CreateEstudiante;

    try {
      const [student] = await db.insert(estudianteInCore).values(parsed).returning();
      return student as Estudiante;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al insertar estudiante";
      throw new Error(message);
    }
  }
}

export const studentService = new StudentService();
