// config/db.js — Conexión a MySQL usando mysql2
require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool de conexiones para mayor rendimiento
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'concesionario_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Verificar conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado a MySQL — Base de datos:', process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
