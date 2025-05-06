CREATE DATABASE crud;
USE crud;

-- Crear tabla personas
CREATE TABLE IF NOT EXISTS personas (
  id_persona INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único autoincremental
  nombre VARCHAR(100),                        -- Cadena para el nombre
  apellido VARCHAR(100),                      -- Cadena para el apellido
  tipo_identificacion VARCHAR(50),            -- Tipo de documento: CC, TI, CE, etc.
  nuip INT,                                   -- Número único de identificación (ej: cédula)
  email VARCHAR(100),                         -- Correo electrónico del usuario
  clave VARCHAR(50),                          -- Contraseña encriptada
  salario DECIMAL(10,2),                      -- Valor numérico decimal para salario
  activo BOOLEAN DEFAULT TRUE,                -- Valor booleano 1 (activo), 0 (inactivo)
  fecha_registro DATE DEFAULT (CURRENT_DATE), -- Fecha en la que se registra la persona
  imagen LONGBLOB                             -- Imagen en binario (para subir una foto)
);

-- Ver los registros actuales de la tabla personas
SELECT * FROM personas;
