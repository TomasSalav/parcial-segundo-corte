-- ============================================================
-- CONCESIONARIO DE COCHES - BASE DE DATOS
-- Ejercicio 8 - Programación II - Corte 2
-- Universidad Libre de Pereira
-- ============================================================

-- Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS concesionario_coches
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE concesionario_coches;

-- ============================================================
-- TABLA: usuarios (Autenticación)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario    VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    imagen     VARCHAR(255) DEFAULT NULL,
    rol        ENUM('admin','usuario','moderador') NOT NULL DEFAULT 'usuario',
    creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto (password: Admin123!)
INSERT IGNORE INTO usuarios (usuario, password, rol) VALUES
    ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ============================================================
-- TABLA: Cliente
-- ============================================================
CREATE TABLE IF NOT EXISTS Cliente (
    dni_cliente   INT          NOT NULL AUTO_INCREMENT,
    nombre_cliente   VARCHAR(50)  NOT NULL,
    apellido_cliente VARCHAR(50)  NOT NULL,
    direccion     VARCHAR(100) NOT NULL,
    telefono      VARCHAR(15)  NOT NULL,
    CONSTRAINT PK_Cliente PRIMARY KEY (dni_cliente)
);

-- ============================================================
-- TABLA: Coche (entidad padre de Coche_nuevo y Coche_usado)
-- ============================================================
CREATE TABLE IF NOT EXISTS Coche (
    matricula VARCHAR(10)  NOT NULL,
    modelo    VARCHAR(50)  NOT NULL,
    marca     VARCHAR(50)  NOT NULL,
    color     VARCHAR(30)  NOT NULL,
    CONSTRAINT PK_Coche PRIMARY KEY (matricula)
);

-- ============================================================
-- TABLA: Coche_nuevo (herencia de Coche)
-- ============================================================
CREATE TABLE IF NOT EXISTS Coche_nuevo (
    matricula             VARCHAR(10) NOT NULL,
    unidades_disponibles  INT         NOT NULL,
    CONSTRAINT PK_Coche_nuevo PRIMARY KEY (matricula),
    CONSTRAINT FK_Coche_nuevo_Coche
        FOREIGN KEY (matricula) REFERENCES Coche(matricula)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- TABLA: Coche_usado (herencia de Coche)
-- ============================================================
CREATE TABLE IF NOT EXISTS Coche_usado (
    matricula    VARCHAR(10) NOT NULL,
    kilometraje  INT         NOT NULL,
    CONSTRAINT PK_Coche_usado PRIMARY KEY (matricula),
    CONSTRAINT FK_Coche_usado_Coche
        FOREIGN KEY (matricula) REFERENCES Coche(matricula)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- TABLA: Compra
-- ============================================================
CREATE TABLE IF NOT EXISTS Compra (
    id_compra   INT         NOT NULL AUTO_INCREMENT,
    dni_cliente INT         NOT NULL,
    matricula   VARCHAR(10) NOT NULL,
    CONSTRAINT PK_Compra PRIMARY KEY (id_compra),
    CONSTRAINT FK_Compra_Cliente
        FOREIGN KEY (dni_cliente) REFERENCES Cliente(dni_cliente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT FK_Compra_Coche
        FOREIGN KEY (matricula) REFERENCES Coche(matricula)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- TABLA: Mecanico
-- ============================================================
CREATE TABLE IF NOT EXISTS Mecanico (
    dni_mecanico        INT         NOT NULL AUTO_INCREMENT,
    nombre_mecanico     VARCHAR(50) NOT NULL,
    apellido_mecanico   VARCHAR(50) NOT NULL,
    fecha_contratacion  DATE        NOT NULL,
    salario             INT         NOT NULL,
    CONSTRAINT PK_Mecanico PRIMARY KEY (dni_mecanico)
);

-- ============================================================
-- TABLA: Reparacion
-- ============================================================
CREATE TABLE IF NOT EXISTS Reparacion (
    id_reparacion    INT         NOT NULL AUTO_INCREMENT,
    dni_mecanico     INT         NOT NULL,
    matricula        VARCHAR(10) NOT NULL,
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

-- ============================================================
-- INSERCIÓN DE DATOS (5 registros por tabla)
-- ============================================================

-- Clientes
INSERT INTO Cliente (nombre_cliente, apellido_cliente, direccion, telefono) VALUES
    ('Carlos',   'Ramírez',   'Calle 12 #45-20',      '3101234567'),
    ('Laura',    'Gómez',     'Av. Los Pinos #8-15',   '3209876543'),
    ('Andrés',   'Torres',    'Carrera 7 #22-10',      '3153456789'),
    ('Valentina','Moreno',    'Calle 5 #100-30',       '3004567890'),
    ('Miguel',   'Herrera',   'Diagonal 33 #18-05',    '3178901234');

-- Coches
INSERT INTO Coche (matricula, modelo, marca, color) VALUES
    ('ABC-001', 'Corolla 2022', 'Toyota',     'Blanco'),
    ('DEF-002', 'Civic 2021',   'Honda',      'Gris'),
    ('GHI-003', 'Sandero 2020', 'Renault',    'Rojo'),
    ('JKL-004', 'Tucson 2023',  'Hyundai',    'Negro'),
    ('MNO-005', 'Spark 2019',   'Chevrolet',  'Azul');

-- Coches nuevos
INSERT INTO Coche_nuevo (matricula, unidades_disponibles) VALUES
    ('ABC-001', 10),
    ('DEF-002',  5),
    ('GHI-003',  8),
    ('JKL-004',  3),
    ('MNO-005', 12);

-- Coches usados (matriculas distintas, necesitan estar en Coche primero)
-- Primero agregamos más coches base para los usados
INSERT INTO Coche (matricula, modelo, marca, color) VALUES
    ('PQR-006', 'Logan 2018',   'Renault',   'Verde'),
    ('STU-007', 'Fiesta 2017',  'Ford',      'Plateado'),
    ('VWX-008', 'Polo 2016',    'Volkswagen','Blanco'),
    ('YZA-009', 'Aveo 2015',    'Chevrolet', 'Rojo'),
    ('BCD-010', 'Accent 2014',  'Hyundai',   'Negro');

INSERT INTO Coche_usado (matricula, kilometraje) VALUES
    ('PQR-006', 80000),
    ('STU-007', 65000),
    ('VWX-008', 92000),
    ('YZA-009', 110000),
    ('BCD-010', 75000);

-- Compras
INSERT INTO Compra (dni_cliente, matricula) VALUES
    (1, 'ABC-001'),
    (2, 'PQR-006'),
    (3, 'DEF-002'),
    (4, 'STU-007'),
    (5, 'JKL-004');

-- Mecánicos
INSERT INTO Mecanico (nombre_mecanico, apellido_mecanico, fecha_contratacion, salario) VALUES
    ('Pedro',   'Vargas',   '2020-03-15', 2500000),
    ('Juan',    'Pérez',    '2019-07-01', 2800000),
    ('Luisa',   'Castro',   '2021-01-20', 2300000),
    ('Sofía',   'Muñoz',    '2022-06-10', 2600000),
    ('Ricardo', 'Salcedo',  '2018-11-05', 3000000);

-- Reparaciones
INSERT INTO Reparacion (dni_mecanico, matricula, fecha_reparacion, horas_reparacion) VALUES
    (1, 'PQR-006', '2024-01-10',  3),
    (2, 'STU-007', '2024-02-15',  5),
    (3, 'VWX-008', '2024-03-20',  2),
    (4, 'YZA-009', '2024-04-08',  4),
    (5, 'BCD-010', '2024-05-12',  6);

-- ============================================================
-- VERIFICACIÓN: Mostrar todos los registros
-- ============================================================
SELECT 'CLIENTES'    AS Tabla, COUNT(*) AS Registros FROM Cliente
UNION ALL
SELECT 'COCHES',        COUNT(*) FROM Coche
UNION ALL
SELECT 'COCHES_NUEVOS', COUNT(*) FROM Coche_nuevo
UNION ALL
SELECT 'COCHES_USADOS', COUNT(*) FROM Coche_usado
UNION ALL
SELECT 'COMPRAS',       COUNT(*) FROM Compra
UNION ALL
SELECT 'MECANICOS',     COUNT(*) FROM Mecanico
UNION ALL
SELECT 'REPARACIONES',  COUNT(*) FROM Reparacion;
