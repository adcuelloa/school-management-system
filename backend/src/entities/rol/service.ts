import { createRolSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { rolInCore } from "../../db/schema.js";

import type { CreateRol, Rol } from "@academic/common";

export class RolService {
  async list(): Promise<Rol[]> {
    const rows = await db.select().from(rolInCore).where(eq(rolInCore.estado, true));
    return rows as Rol[];
  }

  async create(data: unknown): Promise<Rol> {
    const parsed = createRolSchema.parse(data) as CreateRol;
    try {
      const [row] = await db.insert(rolInCore).values(parsed).returning();
      return row as Rol;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar rol");
    }
  }
}

export const rolService = new RolService();
