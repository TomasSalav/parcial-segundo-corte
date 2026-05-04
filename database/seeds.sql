-- ============================================================
-- seeds.sql — Datos de prueba (5+ registros por tabla)
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

USE concesionario_coches;

-- ── Usuarios (contraseñas hasheadas con bcrypt 10 rounds) ────────────────────
-- password para todos: Admin123!  →  genera el hash con: node -e "require('bcrypt').hash('Admin123!',10).then(console.log)"
-- Insertamos el hash directamente para que el seed funcione sin Node
INSERT INTO usuarios (usuario, password, rol) VALUES
  ('admin',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('carlos_r',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario'),
  ('laura_g',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario'),
  ('mod_perez',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moderador'),
  ('vendedor1',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario');
-- NOTA: el hash anterior corresponde a la contraseña "password" (hash de prueba de Laravel/PHPUnit)
-- Para producción ejecutar: node backend/scripts/hashPasswords.js

-- ── Clientes ─────────────────────────────────────────────────────────────────
INSERT INTO Cliente (nombre_cliente, apellido_cliente, direccion, telefono) VALUES
  ('Carlos',    'Ramírez',   'Calle 12 #45-20, Pereira',      '3101234567'),
  ('Laura',     'Gómez',     'Av. Los Pinos #8-15, Pereira',  '3209876543'),
  ('Andrés',    'Torres',    'Carrera 7 #22-10, Dosquebradas', '3153456789'),
  ('Valentina', 'Moreno',    'Calle 5 #100-30, Pereira',      '3004567890'),
  ('Miguel',    'Herrera',   'Diagonal 33 #18-05, Pereira',   '3178901234');

-- ── Coches base ──────────────────────────────────────────────────────────────
INSERT INTO Coche (matricula, modelo, marca, color) VALUES
  ('ABC-001', 'Corolla 2022',  'Toyota',     'Blanco'),
  ('DEF-002', 'Civic 2021',    'Honda',      'Gris'),
  ('GHI-003', 'Sandero 2020',  'Renault',    'Rojo'),
  ('JKL-004', 'Tucson 2023',   'Hyundai',    'Negro'),
  ('MNO-005', 'Spark 2019',    'Chevrolet',  'Azul'),
  ('PQR-006', 'Logan 2018',    'Renault',    'Verde'),
  ('STU-007', 'Fiesta 2017',   'Ford',       'Plateado'),
  ('VWX-008', 'Polo 2016',     'Volkswagen', 'Blanco'),
  ('YZA-009', 'Aveo 2015',     'Chevrolet',  'Rojo'),
  ('BCD-010', 'Accent 2014',   'Hyundai',    'Negro');

-- ── Coches nuevos (5 registros) ───────────────────────────────────────────────
INSERT INTO Coche_nuevo (matricula, unidades_disponibles) VALUES
  ('ABC-001', 10),
  ('DEF-002',  5),
  ('GHI-003',  8),
  ('JKL-004',  3),
  ('MNO-005', 12);

-- ── Coches usados (5 registros) ──────────────────────────────────────────────
INSERT INTO Coche_usado (matricula, kilometraje) VALUES
  ('PQR-006',  80000),
  ('STU-007',  65000),
  ('VWX-008',  92000),
  ('YZA-009', 110000),
  ('BCD-010',  75000);

-- ── Compras ──────────────────────────────────────────────────────────────────
INSERT INTO Compra (dni_cliente, matricula, fecha_compra) VALUES
  (1, 'ABC-001', '2024-01-15'),
  (2, 'PQR-006', '2024-02-20'),
  (3, 'DEF-002', '2024-03-10'),
  (4, 'STU-007', '2024-04-05'),
  (5, 'JKL-004', '2024-05-18');

-- ── Mecánicos ─────────────────────────────────────────────────────────────────
INSERT INTO Mecanico (nombre_mecanico, apellido_mecanico, fecha_contratacion, salario) VALUES
  ('Pedro',   'Vargas',  '2020-03-15', 2500000),
  ('Juan',    'Pérez',   '2019-07-01', 2800000),
  ('Luisa',   'Castro',  '2021-01-20', 2300000),
  ('Sofía',   'Muñoz',   '2022-06-10', 2600000),
  ('Ricardo', 'Salcedo', '2018-11-05', 3000000);

-- ── Reparaciones ─────────────────────────────────────────────────────────────
INSERT INTO Reparacion (dni_mecanico, matricula, fecha_reparacion, horas_reparacion) VALUES
  (1, 'PQR-006', '2024-01-10', 3),
  (2, 'STU-007', '2024-02-15', 5),
  (3, 'VWX-008', '2024-03-20', 2),
  (4, 'YZA-009', '2024-04-08', 4),
  (5, 'BCD-010', '2024-05-12', 6);

-- ── Resumen ───────────────────────────────────────────────────────────────────
SELECT 'usuarios'    AS Tabla, COUNT(*) AS Registros FROM usuarios    UNION ALL
SELECT 'Cliente',    COUNT(*) FROM Cliente    UNION ALL
SELECT 'Coche',      COUNT(*) FROM Coche      UNION ALL
SELECT 'Coche_nuevo',COUNT(*) FROM Coche_nuevo UNION ALL
SELECT 'Coche_usado',COUNT(*) FROM Coche_usado UNION ALL
SELECT 'Compra',     COUNT(*) FROM Compra     UNION ALL
SELECT 'Mecanico',   COUNT(*) FROM Mecanico   UNION ALL
SELECT 'Reparacion', COUNT(*) FROM Reparacion;
