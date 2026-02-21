import { createGrupoSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { grupoInCore } from "../../db/schema.js";

import type { CreateGrupo, Grupo } from "@academic/common";

export class GrupoService {
  async list(): Promise<Grupo[]> {
    const rows = await db.select().from(grupoInCore).where(eq(grupoInCore.estado, true));
    return rows as Grupo[];
  }

  async create(data: unknown): Promise<Grupo> {
    const parsed = createGrupoSchema.parse(data) as CreateGrupo;
    try {
      const [row] = await db.insert(grupoInCore).values(parsed).returning();
      return row as Grupo;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar grupo");
    }
  }
}

export const grupoService = new GrupoService();
