#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# seed.sh – Seed the academic_db with initial data
# Run:  bash scripts/seed.sh
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

API="http://localhost:3000/api"
CT="Content-Type: application/json"

post() {
  local endpoint="$1"
  local data="$2"
  local resp
  resp=$(curl -s -w "\n%{http_code}" -X POST "$API/$endpoint" -H "$CT" -d "$data")
  local code
  code=$(echo "$resp" | tail -1)
  local body
  body=$(echo "$resp" | sed '$d')
  if [[ "$code" -ge 400 ]]; then
    echo "  ⚠ $endpoint → $code: $body"
  else
    echo "  ✓ $endpoint (id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2))"
  fi
}

echo "══════════════════════════════════════════"
echo " Seeding academic_db"
echo "══════════════════════════════════════════"

# ─── 1. Tipos de Documento ─────────────────────────────────────
echo ""
echo "→ Tipos de Documento"
post "tipos-documento" '{"nombre":"Cédula de Ciudadanía","abreviatura":"CC"}'
post "tipos-documento" '{"nombre":"Tarjeta de Identidad","abreviatura":"TI"}'
post "tipos-documento" '{"nombre":"Registro Civil","abreviatura":"RC"}'
post "tipos-documento" '{"nombre":"Pasaporte","abreviatura":"PP"}'

# ─── 2. Roles ──────────────────────────────────────────────────
echo ""
echo "→ Roles"
post "roles" '{"nombre":"Admin","descripcion":"Administrador del sistema"}'
post "roles" '{"nombre":"Docente","descripcion":"Docente de la institución"}'
post "roles" '{"nombre":"Acudiente","descripcion":"Acudiente de estudiante"}'

# ─── 3. Usuarios ───────────────────────────────────────────────
echo ""
echo "→ Usuarios"
post "usuarios" '{"username":"admin","password":"admin123","nombres":"Administrador","apellidos":"Sistema","idRol":1}'
post "usuarios" '{"username":"docente1","password":"docente123","nombres":"Carlos","apellidos":"Pérez","idRol":2}'
post "usuarios" '{"username":"docente2","password":"docente123","nombres":"Ana","apellidos":"Martínez","idRol":2}'

# ─── 4. Áreas ──────────────────────────────────────────────────
echo ""
echo "→ Áreas"
post "areas" '{"nombre":"Matemáticas","descripcion":"Ciencias exactas y razonamiento"}'
post "areas" '{"nombre":"Ciencias Naturales","descripcion":"Biología, química y física"}'
post "areas" '{"nombre":"Ciencias Sociales","descripcion":"Historia, geografía y cívica"}'
post "areas" '{"nombre":"Lenguaje","descripcion":"Español y comunicación"}'
post "areas" '{"nombre":"Inglés","descripcion":"Lengua extranjera"}'
post "areas" '{"nombre":"Educación Física","descripcion":"Deporte y salud"}'
post "areas" '{"nombre":"Tecnología","descripcion":"Informática y tecnología"}'
post "areas" '{"nombre":"Artes","descripcion":"Expresión artística y cultural"}'
post "areas" '{"nombre":"Ética y Valores","descripcion":"Formación ética y ciudadana"}'
post "areas" '{"nombre":"Religión","descripcion":"Educación religiosa"}'

# ─── 5. Asignaturas ────────────────────────────────────────────
echo ""
echo "→ Asignaturas"
post "asignaturas" '{"idArea":1,"nombre":"Matemáticas","codigo":"MAT"}'
post "asignaturas" '{"idArea":1,"nombre":"Estadística","codigo":"EST"}'
post "asignaturas" '{"idArea":1,"nombre":"Geometría","codigo":"GEO"}'
post "asignaturas" '{"idArea":2,"nombre":"Biología","codigo":"BIO"}'
post "asignaturas" '{"idArea":2,"nombre":"Química","codigo":"QUI"}'
post "asignaturas" '{"idArea":2,"nombre":"Física","codigo":"FIS"}'
post "asignaturas" '{"idArea":3,"nombre":"Historia","codigo":"HIS"}'
post "asignaturas" '{"idArea":3,"nombre":"Geografía","codigo":"GEG"}'
post "asignaturas" '{"idArea":3,"nombre":"Cívica","codigo":"CIV"}'
post "asignaturas" '{"idArea":4,"nombre":"Español","codigo":"ESP"}'
post "asignaturas" '{"idArea":4,"nombre":"Lectura Crítica","codigo":"LEC"}'
post "asignaturas" '{"idArea":5,"nombre":"Inglés","codigo":"ING"}'
post "asignaturas" '{"idArea":6,"nombre":"Educación Física","codigo":"EDF"}'
post "asignaturas" '{"idArea":7,"nombre":"Informática","codigo":"INF"}'
post "asignaturas" '{"idArea":8,"nombre":"Artes","codigo":"ART"}'
post "asignaturas" '{"idArea":9,"nombre":"Ética y Valores","codigo":"ETV"}'
post "asignaturas" '{"idArea":10,"nombre":"Religión","codigo":"REL"}'

# ─── 6. Grados ─────────────────────────────────────────────────
echo ""
echo "→ Grados"
post "grados" '{"nombre":"Transición","nivel":"Preescolar","descripcion":"Grado 0"}'
post "grados" '{"nombre":"Primero","nivel":"Primaria","descripcion":"Grado 1"}'
post "grados" '{"nombre":"Segundo","nivel":"Primaria","descripcion":"Grado 2"}'
post "grados" '{"nombre":"Tercero","nivel":"Primaria","descripcion":"Grado 3"}'
post "grados" '{"nombre":"Cuarto","nivel":"Primaria","descripcion":"Grado 4"}'
post "grados" '{"nombre":"Quinto","nivel":"Primaria","descripcion":"Grado 5"}'
post "grados" '{"nombre":"Sexto","nivel":"Secundaria","descripcion":"Grado 6"}'
post "grados" '{"nombre":"Séptimo","nivel":"Secundaria","descripcion":"Grado 7"}'
post "grados" '{"nombre":"Octavo","nivel":"Secundaria","descripcion":"Grado 8"}'
post "grados" '{"nombre":"Noveno","nivel":"Secundaria","descripcion":"Grado 9"}'
post "grados" '{"nombre":"Décimo","nivel":"Media","descripcion":"Grado 10"}'
post "grados" '{"nombre":"Undécimo","nivel":"Media","descripcion":"Grado 11"}'

# ─── 7. Grupos (2025) ──────────────────────────────────────────
echo ""
echo "→ Grupos (año lectivo 2025)"
for grado_id in $(seq 1 12); do
  post "grupos" "{\"idGrado\":$grado_id,\"codigo\":\"A\",\"anioLectivo\":\"2025\"}"
  post "grupos" "{\"idGrado\":$grado_id,\"codigo\":\"B\",\"anioLectivo\":\"2025\"}"
done

# ─── 8. Docentes ───────────────────────────────────────────────
echo ""
echo "→ Docentes"
post "docentes" '{"idUsuario":2,"idTipoDocumento":1,"numeroDocumento":"1001001","nombres":"Carlos","apellidos":"Pérez","telefono":"3001234567","correo":"carlos@colegio.edu","genero":"Masculino","fechaNacimiento":"1985-04-12","fechaContratacion":"2020-02-01"}'
post "docentes" '{"idUsuario":3,"idTipoDocumento":1,"numeroDocumento":"1001002","nombres":"Ana","apellidos":"Martínez","telefono":"3009876543","correo":"ana@colegio.edu","genero":"Femenino","fechaNacimiento":"1990-09-25","fechaContratacion":"2019-08-15"}'
post "docentes" '{"idUsuario":null,"idTipoDocumento":1,"numeroDocumento":"1001003","nombres":"Jorge","apellidos":"Ramírez","telefono":"3005554444","correo":"jorge@colegio.edu","genero":"Masculino","fechaNacimiento":"1988-01-30","fechaContratacion":"2021-01-10"}'
post "docentes" '{"idUsuario":null,"idTipoDocumento":1,"numeroDocumento":"1001004","nombres":"Laura","apellidos":"García","telefono":"3007778888","correo":"laura@colegio.edu","genero":"Femenino","fechaNacimiento":"1992-07-08","fechaContratacion":"2018-06-20"}'

# ─── 9. Grado–Asignatura (asignaturas principales para Sexto = grado 7) ───
echo ""
echo "→ Grado–Asignatura (Sexto, id=7)"
# Asignaturas: MAT=1, BIO=4, HIS=7, ESP=10, ING=12, EDF=13, INF=14, ART=15, ETV=16, REL=17
for asig_id in 1 4 7 10 12 13 14 15 16 17; do
  post "grado-asignaturas" "{\"idGrado\":7,\"idAsignatura\":$asig_id,\"idDocente\":null}"
done

echo ""
echo "→ Grado–Asignatura (Séptimo, id=8)"
for asig_id in 1 4 7 10 12 13 14 15 16 17; do
  post "grado-asignaturas" "{\"idGrado\":8,\"idAsignatura\":$asig_id,\"idDocente\":null}"
done

echo ""
echo "→ Grado–Asignatura (Décimo, id=11)"
# Décimo incluye asignaturas más avanzadas
for asig_id in 1 2 3 4 5 6 7 8 10 11 12 13 14 15 16 17; do
  post "grado-asignaturas" "{\"idGrado\":11,\"idAsignatura\":$asig_id,\"idDocente\":null}"
done

echo ""
echo "→ Grado–Asignatura (Undécimo, id=12)"
for asig_id in 1 2 3 4 5 6 7 8 10 11 12 13 14 15 16 17; do
  post "grado-asignaturas" "{\"idGrado\":12,\"idAsignatura\":$asig_id,\"idDocente\":null}"
done

# ─── 10. Estudiantes de ejemplo ─────────────────────────────────
echo ""
echo "→ Estudiantes de ejemplo"
post "estudiantes" '{"idTipoDocumento":2,"idAcudiente":null,"numeroDocumento":"1090001","genero":"Masculino","nombres":"Juan","apellidos":"López","fechaNacimiento":"2012-03-15"}'
post "estudiantes" '{"idTipoDocumento":2,"idAcudiente":null,"numeroDocumento":"1090002","genero":"Femenino","nombres":"María","apellidos":"Torres","fechaNacimiento":"2012-07-22"}'
post "estudiantes" '{"idTipoDocumento":2,"idAcudiente":null,"numeroDocumento":"1090003","genero":"Masculino","nombres":"Andrés","apellidos":"Silva","fechaNacimiento":"2012-01-10"}'
post "estudiantes" '{"idTipoDocumento":2,"idAcudiente":null,"numeroDocumento":"1090004","genero":"Femenino","nombres":"Camila","apellidos":"Rodríguez","fechaNacimiento":"2011-11-05"}'
post "estudiantes" '{"idTipoDocumento":2,"idAcudiente":null,"numeroDocumento":"1090005","genero":"Masculino","nombres":"Santiago","apellidos":"Hernández","fechaNacimiento":"2012-05-30"}'

echo ""
echo "══════════════════════════════════════════"
echo " Seed completado"
echo "══════════════════════════════════════════"
