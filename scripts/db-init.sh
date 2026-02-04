#!/bin/bash
# Ejecuta todos los scripts SQL en la carpeta db/ en orden alfabético
# Uso: ./run-db-sql.sh [usuario] [base_de_datos]

set -e


# Cargar variables de entorno desde backend/.env obligatoriamente
ENV_FILE="$(dirname "$0")/../backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "No se encontró el archivo de entorno: $ENV_FILE"
  exit 1
fi

# Exportar variables del .env
set -a
source "$ENV_FILE"
set +a

DB_USER="${DB_USER}"
DB_PASS="${DB_PASS}"
DB_HOST="${DB_HOST}"
DB_PORT="${DB_PORT}"
DB_NAME="${DB_NAME}"

SQL_DIR="$(dirname "$0")/../db"

if [ ! -d "$SQL_DIR" ]; then
  echo "Directorio de scripts SQL no encontrado: $SQL_DIR"
  exit 1
fi

SQL_FILES=( "core.sql" )

if [ ${#SQL_FILES[@]} -eq 0 ]; then
  echo "No se encontraron archivos .sql en $SQL_DIR"
  exit 1
fi

echo "Ejecutando scripts SQL en $SQL_DIR para la base de datos $DB_NAME..."

for sql_file in "${SQL_FILES[@]}"; do
  SQL_PATH="$SQL_DIR/$sql_file"
  if [ ! -f "$SQL_PATH" ]; then
    echo "No se encontró el archivo: $SQL_PATH"
    exit 1
  fi
  echo "--> Ejecutando $SQL_PATH"
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_PATH"
  if [ $? -ne 0 ]; then
    echo "Error al ejecutar $SQL_PATH"
    exit 2
  fi
  echo "OK: $SQL_PATH"
done

echo "Todos los scripts SQL ejecutados correctamente."
