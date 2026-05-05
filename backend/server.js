// server.js — Punto de entrada del backend
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/clientes',    require('./routes/cliente.routes'));
app.use('/api/coches',      require('./routes/coche.routes'));
app.use('/api/mecanicos',   require('./routes/mecanico.routes'));
app.use('/api/reparaciones',require('./routes/reparacion.routes'));
app.use('/api/compras',     require('./routes/compra.routes'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API Concesionario funcionando', timestamp: new Date() });
});

// ── Ruta no encontrada ────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Ruta no encontrada.' });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
