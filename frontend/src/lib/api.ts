import axios from "axios";

import type {
  Acudiente,
  AcudienteEstudiante,
  Area,
  Asignatura,
  Calificacion,
  CreateAcudiente,
  CreateAcudienteEstudiante,
  CreateArea,
  CreateAsignatura,
  CreateCalificacion,
  CreateDocente,
  CreateDocenteAsignatura,
  CreateEstudiante,
  CreateEvaluacion,
  CreateGrado,
  CreateGradoAsignatura,
  CreateGrupo,
  CreateMatricula,
  CreateRol,
  CreateTipoDocumento,
  CreateUsuario,
  Docente,
  DocenteAsignatura,
  Estudiante,
  Evaluacion,
  Grado,
  GradoAsignatura,
  Grupo,
  Matricula,
  Rol,
  TipoDocumento,
  Usuario,
} from "@academic/common";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Generic helpers ──────────────────────────────────────────
function buildCrud<T, C>(endpoint: string) {
  return {
    list: () => api.get<T[]>(endpoint).then((r) => r.data),
    create: (data: C) => api.post<T>(endpoint, data).then((r) => r.data),
  };
}

// ─── Entity-specific API functions ────────────────────────────
export const estudiantesApi = buildCrud<Estudiante, CreateEstudiante>("/estudiantes");
export const tiposDocumentoApi = buildCrud<TipoDocumento, CreateTipoDocumento>("/tipos-documento");
export const rolesApi = buildCrud<Rol, CreateRol>("/roles");
export const areasApi = buildCrud<Area, CreateArea>("/areas");
export const usuariosApi = buildCrud<Usuario, CreateUsuario>("/usuarios");
export const acudientesApi = buildCrud<Acudiente, CreateAcudiente>("/acudientes");
export const docentesApi = buildCrud<Docente, CreateDocente>("/docentes");
export const asignaturasApi = buildCrud<Asignatura, CreateAsignatura>("/asignaturas");
export const gradosApi = buildCrud<Grado, CreateGrado>("/grados");
export const gruposApi = buildCrud<Grupo, CreateGrupo>("/grupos");
export const matriculasApi = buildCrud<Matricula, CreateMatricula>("/matriculas");
export const evaluacionesApi = buildCrud<Evaluacion, CreateEvaluacion>("/evaluaciones");
export const calificacionesApi = buildCrud<Calificacion, CreateCalificacion>("/calificaciones");
export const gradoAsignaturasApi = buildCrud<GradoAsignatura, CreateGradoAsignatura>("/grado-asignaturas");
export const docenteAsignaturasApi = buildCrud<DocenteAsignatura, CreateDocenteAsignatura>("/docente-asignaturas");
export const acudienteEstudiantesApi = buildCrud<AcudienteEstudiante, CreateAcudienteEstudiante>("/acudiente-estudiantes");

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }).then((r) => r.data),
};

export default api;
