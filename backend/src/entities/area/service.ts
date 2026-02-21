import { createAreaSchema } from "@academic/common";
import { eq } from "drizzle-orm";

import { db } from "../../config/drizzle.js";
import { areaInCore } from "../../db/schema.js";

import type { Area, CreateArea } from "@academic/common";

export class AreaService {
  async list(): Promise<Area[]> {
    const rows = await db.select().from(areaInCore).where(eq(areaInCore.estado, true));
    return rows as Area[];
  }

  async create(data: unknown): Promise<Area> {
    const parsed = createAreaSchema.parse(data) as CreateArea;
    try {
      const [row] = await db.insert(areaInCore).values(parsed).returning();
      return row as Area;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al insertar área");
    }
  }
}

export const areaService = new AreaService();
