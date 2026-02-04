import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import logger from "./logger.js";
import * as relations from "../db/relations.js";
import * as schema from "../db/schema.js";

import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 10, // Máximo 10 conexiones por cada instancia de PM2
  idleTimeoutMillis: 30000, // Cierra conexiones inactivas tras 30s
  connectionTimeoutMillis: 2000, // Si no conecta en 2s, da error (mejor que esperar infinito)
});

export const db = drizzle(pool, {
  schema: { ...schema, ...relations },
  casing: "snake_case",
});

export const checkConnection = async () => {
  try {
    logger.debug("CheckConnection: Attempting to connect...");
    const client = await pool.connect();
    logger.debug("CheckConnection: Connected!");
    logger.info("✅ Drizzle - Conexión a PostgreSQL confirmada");
    client.release();
  } catch (err) {
    logger.error("CheckConnection: Error", err);
    logger.error("❌ Drizzle - Error conectando a la base de datos:", err);
    process.exit(1);
  }
};
