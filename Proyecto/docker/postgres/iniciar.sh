#!/bin/bash

# Esperar a que PostgreSQL esté disponible
while ! pg_isready -h localhost -p 5432 > /dev/null 2> /dev/null; do
  echo "Esperando a que PostgreSQL esté disponible..."
  sleep 1
done

# Ejecutar el script SQL si la base de datos está disponible
psql -h localhost -U postgres -d nombre_basededatos -f init_db.sql

# Otros comandos o acciones que desees realizar después de la inicialización
