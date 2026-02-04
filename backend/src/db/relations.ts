import { relations } from "drizzle-orm/relations";

import {
  acudienteEstudianteInCore,
  acudienteInCore,
  asignaturaInCore,
  calificacionInCore,
  docenteAsignaturaInCore,
  docenteInCore,
  estudianteInCore,
  evaluacionInCore,
  gradoAsignaturaInCore,
  gradoInCore,
  grupoInCore,
  matriculaInCore,
  rolInCore,
  tipoDocumentoInCore,
  usuarioInCore,
} from "./schema.js";

export const acudienteInCoreRelations = relations(acudienteInCore, ({ one, many }) => ({
  tipoDocumentoInCore: one(tipoDocumentoInCore, {
    fields: [acudienteInCore.idTipoDocumento],
    references: [tipoDocumentoInCore.id],
  }),
  acudienteEstudianteInCores: many(acudienteEstudianteInCore),
  estudianteInCores: many(estudianteInCore),
}));

export const tipoDocumentoInCoreRelations = relations(tipoDocumentoInCore, ({ many }) => ({
  acudienteInCores: many(acudienteInCore),
  docenteInCores: many(docenteInCore),
  estudianteInCores: many(estudianteInCore),
}));

export const docenteInCoreRelations = relations(docenteInCore, ({ one, many }) => ({
  tipoDocumentoInCore: one(tipoDocumentoInCore, {
    fields: [docenteInCore.idTipoDocumento],
    references: [tipoDocumentoInCore.id],
  }),
  usuarioInCore: one(usuarioInCore, {
    fields: [docenteInCore.idUsuario],
    references: [usuarioInCore.id],
  }),
  docenteAsignaturaInCores: many(docenteAsignaturaInCore),
  gradoAsignaturaInCores: many(gradoAsignaturaInCore),
}));

export const usuarioInCoreRelations = relations(usuarioInCore, ({ one, many }) => ({
  docenteInCores: many(docenteInCore),
  rolInCore: one(rolInCore, {
    fields: [usuarioInCore.idRol],
    references: [rolInCore.id],
  }),
}));

export const rolInCoreRelations = relations(rolInCore, ({ many }) => ({
  usuarioInCores: many(usuarioInCore),
}));

export const acudienteEstudianteInCoreRelations = relations(
  acudienteEstudianteInCore,
  ({ one }) => ({
    acudienteInCore: one(acudienteInCore, {
      fields: [acudienteEstudianteInCore.idAcudiente],
      references: [acudienteInCore.id],
    }),
    estudianteInCore: one(estudianteInCore, {
      fields: [acudienteEstudianteInCore.idEstudiante],
      references: [estudianteInCore.id],
    }),
  })
);

export const estudianteInCoreRelations = relations(estudianteInCore, ({ one, many }) => ({
  acudienteEstudianteInCores: many(acudienteEstudianteInCore),
  tipoDocumentoInCore: one(tipoDocumentoInCore, {
    fields: [estudianteInCore.idTipoDocumento],
    references: [tipoDocumentoInCore.id],
  }),
  acudienteInCore: one(acudienteInCore, {
    fields: [estudianteInCore.idAcudiente],
    references: [acudienteInCore.id],
  }),
  matriculaInCores: many(matriculaInCore),
  calificacionInCores: many(calificacionInCore),
}));

export const docenteAsignaturaInCoreRelations = relations(docenteAsignaturaInCore, ({ one }) => ({
  docenteInCore: one(docenteInCore, {
    fields: [docenteAsignaturaInCore.idDocente],
    references: [docenteInCore.id],
  }),
  asignaturaInCore: one(asignaturaInCore, {
    fields: [docenteAsignaturaInCore.idAsignatura],
    references: [asignaturaInCore.id],
  }),
}));

export const asignaturaInCoreRelations = relations(asignaturaInCore, ({ many }) => ({
  docenteAsignaturaInCores: many(docenteAsignaturaInCore),
  gradoAsignaturaInCores: many(gradoAsignaturaInCore),
}));

export const grupoInCoreRelations = relations(grupoInCore, ({ one, many }) => ({
  gradoInCore: one(gradoInCore, {
    fields: [grupoInCore.idGrado],
    references: [gradoInCore.id],
  }),
  matriculaInCores: many(matriculaInCore),
}));

export const gradoInCoreRelations = relations(gradoInCore, ({ many }) => ({
  grupoInCores: many(grupoInCore),
  gradoAsignaturaInCores: many(gradoAsignaturaInCore),
}));

export const gradoAsignaturaInCoreRelations = relations(gradoAsignaturaInCore, ({ one, many }) => ({
  gradoInCore: one(gradoInCore, {
    fields: [gradoAsignaturaInCore.idGrado],
    references: [gradoInCore.id],
  }),
  asignaturaInCore: one(asignaturaInCore, {
    fields: [gradoAsignaturaInCore.idAsignatura],
    references: [asignaturaInCore.id],
  }),
  docenteInCore: one(docenteInCore, {
    fields: [gradoAsignaturaInCore.idDocente],
    references: [docenteInCore.id],
  }),
  evaluacionInCores: many(evaluacionInCore),
}));

export const matriculaInCoreRelations = relations(matriculaInCore, ({ one }) => ({
  estudianteInCore: one(estudianteInCore, {
    fields: [matriculaInCore.idEstudiante],
    references: [estudianteInCore.id],
  }),
  grupoInCore: one(grupoInCore, {
    fields: [matriculaInCore.idGrupo],
    references: [grupoInCore.id],
  }),
}));

export const evaluacionInCoreRelations = relations(evaluacionInCore, ({ one, many }) => ({
  gradoAsignaturaInCore: one(gradoAsignaturaInCore, {
    fields: [evaluacionInCore.idGradoAsignatura],
    references: [gradoAsignaturaInCore.id],
  }),
  calificacionInCores: many(calificacionInCore),
}));

export const calificacionInCoreRelations = relations(calificacionInCore, ({ one }) => ({
  estudianteInCore: one(estudianteInCore, {
    fields: [calificacionInCore.idEstudiante],
    references: [estudianteInCore.id],
  }),
  evaluacionInCore: one(evaluacionInCore, {
    fields: [calificacionInCore.idEvaluacion],
    references: [evaluacionInCore.id],
  }),
}));
