-- Crear la base de datos de usuarios
CREATE DATABASE users_db;

-- Crear un usuario y otorgar privilegios para users_db
CREATE USER user_admin WITH PASSWORD 'password';
ALTER ROLE user_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE user_admin SET timezone TO 'UTC';
ALTER ROLE user_admin SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE users_db TO user_admin;

-- Conectar a la base de datos de usuarios
\c users_db;

-- Crear la tabla de Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL;
);

-- Desconectar de la base de datos de usuarios
\c postgres;

-- Crear la base de datos de tareas
CREATE DATABASE tarea_db;

-- Crear un usuario y otorgar privilegios para tarea_db
CREATE USER tarea_admin WITH PASSWORD 'password';
ALTER ROLE tarea_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE tarea_admin SET timezone TO 'UTC';
ALTER ROLE tarea_admin SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE tarea_db TO tarea_admin;

-- Conectar a la base de datos de tareas
\c tarea_db;

-- Crear la tabla de Tareas
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    task_description TEXT NOT NULL,
    task_due_date DATE,
    task_status VARCHAR(50) DEFAULT 'pendiente'
);

-- Desconectar de la base de datos de tareas
\c postgres;
