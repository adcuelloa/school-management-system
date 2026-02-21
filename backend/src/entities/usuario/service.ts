import { createUsuarioSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { usuarioInCore } from "../../db/schema.js";

import type { CreateUsuario, Usuario } from "@academic/common";

export class UsuarioService {
  async list(): Promise<Usuario[]> {
    const rows = await db.select().from(usuarioInCore).where(eq(usuarioInCore.estado, true));
    return rows as Usuario[];
  }

  async create(data: unknown): Promise<Usuario> {
    const parsed = createUsuarioSchema.parse(data) as CreateUsuario;
    try {
      const [row] = await db.insert(usuarioInCore).values(parsed).returning();
      return row as Usuario;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar usuario");
    }
  }
}

export const usuarioService = new UsuarioService();
