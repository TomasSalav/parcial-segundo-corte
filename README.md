# Concesionario de Coches - Full Stack App

Aplicación web completa tipo Cliente/Servidor para la gestión de un concesionario de coches.
Desarrollada para la materia **Programación II**, Universidad Libre Seccional Pereira (2026).

## Tecnologías Utilizadas

- **Frontend:** React, Vite, TailwindCSS v3, React Router v6, SweetAlert2, Axios, Lucide React.
- **Backend:** Node.js, Express, MySQL2, Bcrypt, JsonWebToken.
- **Base de Datos:** MySQL (Modelo Relacional en 3FN).

## Requisitos Previos

- **Node.js** v18.x o superior.
- **MySQL Server** v8.x.

## Instalación y Configuración

### 1. Base de Datos
1. Inicia tu servidor MySQL (ej. XAMPP, WAMP, o servicio nativo).
2. Abre tu gestor de base de datos preferido (DBeaver, MySQL Workbench, phpMyAdmin).
3. Ejecuta el script de esquema: `database/schema.sql`.
4. Ejecuta el script de datos iniciales: `database/seeds.sql`.

### 2. Backend
1. Abre una terminal y navega a la carpeta `backend/`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Renombra el archivo `.env.example` a `.env` (o crea uno nuevo basado en el de ejemplo) y ajusta tus credenciales de base de datos:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password  # ¡Importante configurar esto si tienes contraseña!
   DB_NAME=concesionario_coches
   
   JWT_SECRET=concesionario_jwt_super_secreto_2026
   JWT_EXPIRES=8h
   
   PORT=3001
   ```
4. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor correrá en `http://localhost:3001`*

### 3. Frontend
1. Abre otra terminal y navega a la carpeta `frontend/`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación React con Vite:
   ```bash
   npm run dev
   ```
   *La app estará disponible en `http://localhost:5173`*

## Credenciales de Prueba

Gracias al script `seeds.sql`, se han generado las siguientes cuentas de prueba:

- **Administrador:**
  - Usuario: `admin`
  - Contraseña: `Admin123!`
- **Moderador:**
  - Usuario: `mod_perez`
  - Contraseña: `Admin123!`
- **Usuario estándar:**
  - Usuario: `carlos_r`
  - Contraseña: `Admin123!`

*(Todas las cuentas de prueba comparten la misma contraseña).*

## Estructura de Entregables (PDF)

- `frontend/` y `backend/`: Código fuente funcional (RF-01 a RF-05).
- `database/`: Scripts SQL.
- El diagrama de entidad relación debe agregarse a la carpeta `docs/` o `database/` para la entrega final.
