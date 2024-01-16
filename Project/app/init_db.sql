-- Crear la base de datos de usuarios
CREATE DATABASE users_db;

-- Conectar a la base de datos de usuarios
\c users_db;

-- Crear la tabla de Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);


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
