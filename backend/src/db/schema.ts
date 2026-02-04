import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  numeric,
  pgSchema,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const core = pgSchema("core");

export const areaInCore = core.table("area", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "core.area_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  nombre: varchar({ length: 50 }).notNull(),
  descripcion: varchar({ length: 50 }),
  estado: boolean().default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const acudienteInCore = core.table(
  "acudiente",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.acudiente_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idTipoDocumento: integer("id_tipo_documento").notNull(),
    numeroDocumento: varchar("numero_documento", { length: 10 }).notNull(),
    genero: varchar({ length: 20 }).notNull(),
    nombres: varchar({ length: 50 }).notNull(),
    apellidos: varchar({ length: 50 }).notNull(),
    telefono: varchar({ length: 15 }),
    correo: varchar({ length: 30 }),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("idx_acudiente_id_tipo_documento").using(
      "btree",
      table.idTipoDocumento.asc().nullsLast().op("int4_ops")
    ),
    uniqueIndex("idx_unique_acudiente_documento_active")
      .using("btree", table.numeroDocumento.asc().nullsLast().op("text_ops"))
      .where(sql`(estado IS TRUE)`),
    foreignKey({
      columns: [table.idTipoDocumento],
      foreignColumns: [tipoDocumentoInCore.id],
      name: "acudiente_id_tipo_documento_fkey",
    }).onDelete("restrict"),
  ]
);

export const docenteInCore = core.table(
  "docente",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.docente_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idUsuario: integer("id_usuario"),
    idTipoDocumento: integer("id_tipo_documento").notNull(),
    numeroDocumento: varchar("numero_documento", { length: 10 }).notNull(),
    nombres: varchar({ length: 50 }).notNull(),
    apellidos: varchar({ length: 50 }).notNull(),
    telefono: varchar({ length: 15 }),
    correo: varchar({ length: 50 }),
    fechaNacimiento: date("fecha_nacimiento"),
    genero: varchar({ length: 20 }),
    fechaContratacion: date("fecha_contratacion").notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_docente_id_usuario").using(
      "btree",
      table.idUsuario.asc().nullsLast().op("int4_ops")
    ),
    index("idx_docente_num_documento").using(
      "btree",
      table.numeroDocumento.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.idTipoDocumento],
      foreignColumns: [tipoDocumentoInCore.id],
      name: "docente_id_tipo_documento_fkey",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuarioInCore.id],
      name: "docente_id_usuario_fkey",
    }).onDelete("set null"),
  ]
);

export const rolInCore = core.table(
  "rol",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.rol_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    nombre: varchar({ length: 20 }).notNull(),
    descripcion: varchar({ length: 100 }),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("rol_nombre_key").on(table.nombre)]
);

export const usuarioInCore = core.table(
  "usuario",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.usuario_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    username: varchar({ length: 20 }).notNull(),
    password: varchar({ length: 100 }).notNull(),
    nombres: varchar({ length: 50 }).notNull(),
    apellidos: varchar({ length: 50 }).notNull(),
    idRol: integer("id_rol").notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_unique_usuario_username_ci").using("btree", sql`lower((username)::text)`),
    foreignKey({
      columns: [table.idRol],
      foreignColumns: [rolInCore.id],
      name: "usuario_id_rol_fkey",
    }).onDelete("restrict"),
    unique("usuario_username_key").on(table.username),
  ]
);

export const acudienteEstudianteInCore = core.table(
  "acudiente_estudiante",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.acudiente_estudiante_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idAcudiente: integer("id_acudiente").notNull(),
    idEstudiante: integer("id_estudiante").notNull(),
    parentesco: varchar({ length: 30 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idAcudiente],
      foreignColumns: [acudienteInCore.id],
      name: "acudiente_estudiante_id_acudiente_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idEstudiante],
      foreignColumns: [estudianteInCore.id],
      name: "acudiente_estudiante_id_estudiante_fkey",
    }).onDelete("cascade"),
    unique("acudiente_estudiante_id_acudiente_id_estudiante_key").on(
      table.idAcudiente,
      table.idEstudiante
    ),
  ]
);

export const docenteAsignaturaInCore = core.table(
  "docente_asignatura",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.docente_asignatura_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idDocente: integer("id_docente").notNull(),
    idAsignatura: integer("id_asignatura").notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idDocente],
      foreignColumns: [docenteInCore.id],
      name: "docente_asignatura_id_docente_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idAsignatura],
      foreignColumns: [asignaturaInCore.id],
      name: "docente_asignatura_id_asignatura_fkey",
    }).onDelete("cascade"),
    unique("docente_asignatura_id_docente_id_asignatura_key").on(
      table.idAsignatura,
      table.idDocente
    ),
  ]
);

export const asignaturaInCore = core.table("asignatura", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "core.asignatura_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  idArea: integer("id_area").notNull(),
  nombre: varchar({ length: 50 }).notNull(),
  codigo: varchar({ length: 20 }).notNull(),
  estado: boolean().default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const gradoInCore = core.table("grado", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "core.grado_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  nombre: varchar({ length: 20 }).notNull(),
  nivel: varchar({ length: 20 }).notNull(),
  descripcion: varchar({ length: 50 }),
  estado: boolean().default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const grupoInCore = core.table(
  "grupo",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.grupo_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idGrado: integer("id_grado").notNull(),
    codigo: varchar({ length: 5 }).notNull(),
    anioLectivo: varchar("anio_lectivo", { length: 10 }).notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_grupo_anio_lectivo").using(
      "btree",
      table.anioLectivo.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.idGrado],
      foreignColumns: [gradoInCore.id],
      name: "grupo_id_grado_fkey",
    }).onDelete("restrict"),
  ]
);

export const tipoDocumentoInCore = core.table("tipo_documento", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "core.tipo_documento_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  nombre: varchar({ length: 20 }).notNull(),
  abreviatura: varchar({ length: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const estudianteInCore = core.table(
  "estudiante",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.estudiante_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idTipoDocumento: integer("id_tipo_documento").notNull(),
    idAcudiente: integer("id_acudiente"),
    numeroDocumento: varchar("numero_documento", { length: 10 }).notNull(),
    genero: varchar({ length: 20 }).notNull(),
    nombres: varchar({ length: 50 }).notNull(),
    apellidos: varchar({ length: 50 }).notNull(),
    fechaNacimiento: date("fecha_nacimiento").notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("idx_estudiante_id_acudiente").using(
      "btree",
      table.idAcudiente.asc().nullsLast().op("int4_ops")
    ),
    index("idx_estudiante_id_tipo_documento").using(
      "btree",
      table.idTipoDocumento.asc().nullsLast().op("int4_ops")
    ),
    uniqueIndex("idx_unique_estudiante_documento_active")
      .using("btree", table.numeroDocumento.asc().nullsLast().op("text_ops"))
      .where(sql`(estado IS TRUE)`),
    foreignKey({
      columns: [table.idTipoDocumento],
      foreignColumns: [tipoDocumentoInCore.id],
      name: "estudiante_id_tipo_documento_fkey",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.idAcudiente],
      foreignColumns: [acudienteInCore.id],
      name: "estudiante_id_acudiente_fkey",
    }).onDelete("set null"),
  ]
);

export const gradoAsignaturaInCore = core.table(
  "grado_asignatura",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.grado_asignatura_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idGrado: integer("id_grado").notNull(),
    idAsignatura: integer("id_asignatura").notNull(),
    idDocente: integer("id_docente"),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.idGrado],
      foreignColumns: [gradoInCore.id],
      name: "grado_asignatura_id_grado_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idAsignatura],
      foreignColumns: [asignaturaInCore.id],
      name: "grado_asignatura_id_asignatura_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idDocente],
      foreignColumns: [docenteInCore.id],
      name: "grado_asignatura_id_docente_fkey",
    }).onDelete("set null"),
    unique("grado_asignatura_id_grado_id_asignatura_key").on(table.idAsignatura, table.idGrado),
  ]
);

export const matriculaInCore = core.table(
  "matricula",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.matricula_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idEstudiante: integer("id_estudiante").notNull(),
    idGrupo: integer("id_grupo").notNull(),
    periodo: varchar({ length: 10 }).notNull(),
    fechaRegistro: date("fecha_registro")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_matricula_id_estudiante").using(
      "btree",
      table.idEstudiante.asc().nullsLast().op("int4_ops")
    ),
    index("idx_matricula_id_grupo").using("btree", table.idGrupo.asc().nullsLast().op("int4_ops")),
    index("idx_matricula_periodo").using("btree", table.periodo.asc().nullsLast().op("text_ops")),
    foreignKey({
      columns: [table.idEstudiante],
      foreignColumns: [estudianteInCore.id],
      name: "matricula_id_estudiante_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idGrupo],
      foreignColumns: [grupoInCore.id],
      name: "matricula_id_grupo_fkey",
    }).onDelete("cascade"),
  ]
);

export const evaluacionInCore = core.table(
  "evaluacion",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.evaluacion_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idGradoAsignatura: integer("id_grado_asignatura").notNull(),
    tipo: varchar({ length: 50 }).notNull(),
    fecha: date().notNull(),
    descripcion: text(),
    porcentaje: numeric({ precision: 5, scale: 2 }).notNull(),
    estado: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_evaluacion_id_grado_asignatura").using(
      "btree",
      table.idGradoAsignatura.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.idGradoAsignatura],
      foreignColumns: [gradoAsignaturaInCore.id],
      name: "evaluacion_id_grado_asignatura_fkey",
    }).onDelete("cascade"),
  ]
);

export const calificacionInCore = core.table(
  "calificacion",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "core.calificacion_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    idEstudiante: integer("id_estudiante").notNull(),
    idEvaluacion: integer("id_evaluacion").notNull(),
    valor: numeric({ precision: 4, scale: 2 }).notNull(),
    fechaRegistro: date("fecha_registro")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    observaciones: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_calificacion_id_estudiante").using(
      "btree",
      table.idEstudiante.asc().nullsLast().op("int4_ops")
    ),
    index("idx_calificacion_id_evaluacion").using(
      "btree",
      table.idEvaluacion.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.idEstudiante],
      foreignColumns: [estudianteInCore.id],
      name: "calificacion_id_estudiante_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.idEvaluacion],
      foreignColumns: [evaluacionInCore.id],
      name: "calificacion_id_evaluacion_fkey",
    }).onDelete("cascade"),
    check("chk_calificacion_valor", sql`(valor >= (0)::numeric) AND (valor <= (5)::numeric)`),
  ]
);
