import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Student table definition
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  dateOfBirth: timestamp("date_of_birth", { mode: "string" }).notNull(),
  enrollmentDate: timestamp("enrollment_date", { mode: "string" }).notNull(),
  grade: integer("grade").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export type StudentRecord = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
