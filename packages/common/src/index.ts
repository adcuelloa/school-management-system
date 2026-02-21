import { z } from "zod";

// ─── Tipo Documento ──────────────────────────────────────────
export const tipoDocumentoSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1).max(20),
  abreviatura: z.string().min(1).max(2),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createTipoDocumentoSchema = tipoDocumentoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type TipoDocumento = z.infer<typeof tipoDocumentoSchema>;
export type CreateTipoDocumento = z.infer<typeof createTipoDocumentoSchema>;

// ─── Rol ─────────────────────────────────────────────────────
export const rolSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1).max(20),
  descripcion: z.string().max(100).nullable(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createRolSchema = rolSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Rol = z.infer<typeof rolSchema>;
export type CreateRol = z.infer<typeof createRolSchema>;

// ─── Área ────────────────────────────────────────────────────
export const areaSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(50).nullable(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createAreaSchema = areaSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Area = z.infer<typeof areaSchema>;
export type CreateArea = z.infer<typeof createAreaSchema>;

// ─── Usuario ─────────────────────────────────────────────────
export const usuarioSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1).max(20),
  password: z.string().min(1).max(100),
  nombres: z.string().min(1).max(50),
  apellidos: z.string().min(1).max(50),
  idRol: z.number().int(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createUsuarioSchema = usuarioSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Usuario = z.infer<typeof usuarioSchema>;
export type CreateUsuario = z.infer<typeof createUsuarioSchema>;

// ─── Estudiante ──────────────────────────────────────────────
export const estudianteSchema = z.object({
  id: z.number().int(),
  idTipoDocumento: z.number().int(),
  idAcudiente: z.number().int().nullable(),
  numeroDocumento: z.string().min(1).max(10),
  genero: z.string().min(1).max(20),
  nombres: z.string().min(1).max(50),
  apellidos: z.string().min(1).max(50),
  fechaNacimiento: z.string(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});
export const createEstudianteSchema = estudianteSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type Estudiante = z.infer<typeof estudianteSchema>;
export type CreateEstudiante = z.infer<typeof createEstudianteSchema>;

// ─── Acudiente ───────────────────────────────────────────────
export const acudienteSchema = z.object({
  id: z.number().int(),
  idTipoDocumento: z.number().int(),
  numeroDocumento: z.string().min(1).max(10),
  genero: z.string().min(1).max(20),
  nombres: z.string().min(1).max(50),
  apellidos: z.string().min(1).max(50),
  telefono: z.string().max(15).nullable(),
  correo: z.string().max(30).nullable(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});
export const createAcudienteSchema = acudienteSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type Acudiente = z.infer<typeof acudienteSchema>;
export type CreateAcudiente = z.infer<typeof createAcudienteSchema>;

// ─── Docente ─────────────────────────────────────────────────
export const docenteSchema = z.object({
  id: z.number().int(),
  idUsuario: z.number().int().nullable(),
  idTipoDocumento: z.number().int(),
  numeroDocumento: z.string().min(1).max(10),
  nombres: z.string().min(1).max(50),
  apellidos: z.string().min(1).max(50),
  telefono: z.string().max(15).nullable(),
  correo: z.string().max(50).nullable(),
  fechaNacimiento: z.string().nullable(),
  genero: z.string().max(20).nullable(),
  fechaContratacion: z.string(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createDocenteSchema = docenteSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Docente = z.infer<typeof docenteSchema>;
export type CreateDocente = z.infer<typeof createDocenteSchema>;

// ─── Asignatura ──────────────────────────────────────────────
export const asignaturaSchema = z.object({
  id: z.number().int(),
  idArea: z.number().int(),
  nombre: z.string().min(1).max(50),
  codigo: z.string().min(1).max(20),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createAsignaturaSchema = asignaturaSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Asignatura = z.infer<typeof asignaturaSchema>;
export type CreateAsignatura = z.infer<typeof createAsignaturaSchema>;

// ─── Grado ───────────────────────────────────────────────────
export const gradoSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1).max(20),
  nivel: z.string().min(1).max(20),
  descripcion: z.string().max(50).nullable(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createGradoSchema = gradoSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Grado = z.infer<typeof gradoSchema>;
export type CreateGrado = z.infer<typeof createGradoSchema>;

// ─── Grupo ───────────────────────────────────────────────────
export const grupoSchema = z.object({
  id: z.number().int(),
  idGrado: z.number().int(),
  codigo: z.string().min(1).max(5),
  anioLectivo: z.string().min(1).max(10),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createGrupoSchema = grupoSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Grupo = z.infer<typeof grupoSchema>;
export type CreateGrupo = z.infer<typeof createGrupoSchema>;

// ─── Matrícula ───────────────────────────────────────────────
export const matriculaSchema = z.object({
  id: z.number().int(),
  idEstudiante: z.number().int(),
  idGrupo: z.number().int(),
  periodo: z.string().min(1).max(10),
  fechaRegistro: z.string(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createMatriculaSchema = matriculaSchema.omit({
  id: true,
  fechaRegistro: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Matricula = z.infer<typeof matriculaSchema>;
export type CreateMatricula = z.infer<typeof createMatriculaSchema>;

// ─── Evaluación ──────────────────────────────────────────────
export const evaluacionSchema = z.object({
  id: z.number().int(),
  idGradoAsignatura: z.number().int(),
  tipo: z.string().min(1).max(50),
  fecha: z.string(),
  descripcion: z.string().nullable(),
  porcentaje: z.string(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createEvaluacionSchema = evaluacionSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type Evaluacion = z.infer<typeof evaluacionSchema>;
export type CreateEvaluacion = z.infer<typeof createEvaluacionSchema>;

// ─── Calificación ────────────────────────────────────────────
export const calificacionSchema = z.object({
  id: z.number().int(),
  idEstudiante: z.number().int(),
  idEvaluacion: z.number().int(),
  valor: z.string(),
  fechaRegistro: z.string(),
  observaciones: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createCalificacionSchema = calificacionSchema.omit({
  id: true,
  fechaRegistro: true,
  createdAt: true,
  updatedAt: true,
});
export type Calificacion = z.infer<typeof calificacionSchema>;
export type CreateCalificacion = z.infer<typeof createCalificacionSchema>;

// ─── Grado Asignatura ────────────────────────────────────────
export const gradoAsignaturaSchema = z.object({
  id: z.number().int(),
  idGrado: z.number().int(),
  idAsignatura: z.number().int(),
  idDocente: z.number().int().nullable(),
  estado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createGradoAsignaturaSchema = gradoAsignaturaSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
  updatedAt: true,
});
export type GradoAsignatura = z.infer<typeof gradoAsignaturaSchema>;
export type CreateGradoAsignatura = z.infer<typeof createGradoAsignaturaSchema>;

// ─── Docente Asignatura ──────────────────────────────────────
export const docenteAsignaturaSchema = z.object({
  id: z.number().int(),
  idDocente: z.number().int(),
  idAsignatura: z.number().int(),
  estado: z.boolean(),
  createdAt: z.string(),
});
export const createDocenteAsignaturaSchema = docenteAsignaturaSchema.omit({
  id: true,
  estado: true,
  createdAt: true,
});
export type DocenteAsignatura = z.infer<typeof docenteAsignaturaSchema>;
export type CreateDocenteAsignatura = z.infer<typeof createDocenteAsignaturaSchema>;

// ─── Acudiente Estudiante ────────────────────────────────────
export const acudienteEstudianteSchema = z.object({
  id: z.number().int(),
  idAcudiente: z.number().int(),
  idEstudiante: z.number().int(),
  parentesco: z.string().max(30).nullable(),
  createdAt: z.string(),
});
export const createAcudienteEstudianteSchema = acudienteEstudianteSchema.omit({
  id: true,
  createdAt: true,
});
export type AcudienteEstudiante = z.infer<typeof acudienteEstudianteSchema>;
export type CreateAcudienteEstudiante = z.infer<typeof createAcudienteEstudianteSchema>;
