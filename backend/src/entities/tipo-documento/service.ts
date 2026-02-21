import { createTipoDocumentoSchema } from "@academic/common";


import { db } from "../../config/drizzle.js";
import { tipoDocumentoInCore } from "../../db/schema.js";

import type { CreateTipoDocumento, TipoDocumento } from "@academic/common";

export class TipoDocumentoService {
  async list(): Promise<TipoDocumento[]> {
    const rows = await db.select().from(tipoDocumentoInCore);
    return rows as TipoDocumento[];
  }

  async create(data: unknown): Promise<TipoDocumento> {
    const parsed = createTipoDocumentoSchema.parse(data) as CreateTipoDocumento;
    try {
      const [row] = await db.insert(tipoDocumentoInCore).values(parsed).returning();
      return row as TipoDocumento;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar tipo documento");
    }
  }
}

export const tipoDocumentoService = new TipoDocumentoService();
