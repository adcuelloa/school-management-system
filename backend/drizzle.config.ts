import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const dbUrl = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  schemaFilter: ["public", "auth", "core", "academy", "budget"],
  casing: "snake_case",
  dbCredentials: {
    url: dbUrl,
  },
});
