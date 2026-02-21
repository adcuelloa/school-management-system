import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { rolInCore, usuarioInCore } from "../../db/schema.js";

export class AuthService {
  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const [user] = await db
      .select()
      .from(usuarioInCore)
      .where(eq(usuarioInCore.username, username));

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Comparación directa (sin hash por ahora)
    if (user?.password !== password) {
      throw new Error("Credenciales inválidas");
    }

    if (!user.estado) {
      throw new Error("Usuario deshabilitado");
    }

    // Obtener el rol
    const [rol] = await db.select().from(rolInCore).where(eq(rolInCore.id, user.idRol));

    return {
      id: user.id,
      username: user.username,
      nombres: user.nombres,
      apellidos: user.apellidos,
      rol: rol ? { id: rol.id, nombre: rol.nombre } : null,
    };
  }
}

export const authService = new AuthService();
