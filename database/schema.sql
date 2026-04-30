-- ============================================================
-- CONCESIONARIO DE COCHES — schema.sql
-- Programación II · Corte 2 · Unilibre Pereira 2026-1
-- ============================================================

CREATE DATABASE IF NOT EXISTS concesionario_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE concesionario_db;

-- ── Tabla de autenticación (RF-01) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario    VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,         -- hash bcrypt ≥ 10 rounds
  imagen     VARCHAR(255) DEFAULT NULL,
  rol        ENUM('admin','usuario','moderador') NOT NULL DEFAULT 'usuario',
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Dominio: Concesionario de Coches ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Cliente (
  dni_cliente      INT          NOT NULL AUTO_INCREMENT,
  nombre_cliente   VARCHAR(60)  NOT NULL,
  apellido_cliente VARCHAR(60)  NOT NULL,
  direccion        VARCHAR(120) NOT NULL,
  telefono         VARCHAR(20)  NOT NULL,
  CONSTRAINT PK_Cliente PRIMARY KEY (dni_cliente)
);

CREATE TABLE IF NOT EXISTS Coche (
  matricula VARCHAR(15) NOT NULL,
  modelo    VARCHAR(60) NOT NULL,
  marca     VARCHAR(60) NOT NULL,
  color     VARCHAR(30) NOT NULL,
  CONSTRAINT PK_Coche PRIMARY KEY (matricula)
);

CREATE TABLE IF NOT EXISTS Coche_nuevo (
  matricula            VARCHAR(15) NOT NULL,
  unidades_disponibles INT         NOT NULL DEFAULT 0,
  CONSTRAINT PK_CocheNuevo PRIMARY KEY (matricula),
  CONSTRAINT FK_CocheNuevo_Coche
    FOREIGN KEY (matricula) REFERENCES Coche(matricula)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Coche_usado (
  matricula   VARCHAR(15) NOT NULL,
  kilometraje INT         NOT NULL DEFAULT 0,
  CONSTRAINT PK_CocheUsado PRIMARY KEY (matricula),
  CONSTRAINT FK_CocheUsado_Coche
    FOREIGN KEY (matricula) REFERENCES Coche(matricula)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Compra (
  id_compra   INT         NOT NULL AUTO_INCREMENT,
  dni_cliente INT         NOT NULL,
  matricula   VARCHAR(15) NOT NULL,
  fecha_compra DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT PK_Compra PRIMARY KEY (id_compra),
  CONSTRAINT FK_Compra_Cliente
    FOREIGN KEY (dni_cliente) REFERENCES Cliente(dni_cliente)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT FK_Compra_Coche
    FOREIGN KEY (matricula) REFERENCES Coche(matricula)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Mecanico (
  dni_mecanico       INT         NOT NULL AUTO_INCREMENT,
  nombre_mecanico    VARCHAR(60) NOT NULL,
  apellido_mecanico  VARCHAR(60) NOT NULL,
  fecha_contratacion DATE        NOT NULL,
  salario            INT         NOT NULL,
  CONSTRAINT PK_Mecanico PRIMARY KEY (dni_mecanico)
);

CREATE TABLE IF NOT EXISTS Reparacion (
  id_reparacion    INT         NOT NULL AUTO_INCREMENT,
  dni_mecanico     INT         NOT NULL,
  matricula        VARCHAR(15) NOT NULL,
  fecha_reparacion DATE        NOT NULL,
  horas_reparacion INT         NOT NULL,
  CONSTRAINT PK_Reparacion PRIMARY KEY (id_reparacion),
  CONSTRAINT FK_Reparacion_Mecanico
    FOREIGN KEY (dni_mecanico) REFERENCES Mecanico(dni_mecanico)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT FK_Reparacion_Coche
    FOREIGN KEY (matricula) REFERENCES Coche(matricula)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
