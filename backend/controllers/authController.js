// controllers/authController.js — Registro, Login y perfil del usuario
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const ROUNDS = 10; // bcrypt rounds mínimo según PDF

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { usuario, password, rol = 'usuario' } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ success: false, data: null, message: 'Usuario y contraseña son requeridos.' });
    }

    // Verificar que el usuario no exista
    const [existing] = await db.query('SELECT id FROM usuarios WHERE usuario = ?', [usuario]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, data: null, message: 'El usuario ya existe.' });
    }

    const hash = await bcrypt.hash(password, ROUNDS);
    const [result] = await db.query(
      'INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)',
      [usuario, hash, rol]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, usuario, rol },
      message: 'Usuario registrado correctamente.',
    });
  } catch (error) {
    console.error('[authController.register]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al registrar usuario.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ success: false, data: null, message: 'Usuario y contraseña son requeridos.' });
    }

    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, data: null, message: 'Credenciales incorrectas.' });
    }

    const user = rows[0];
    const esValido = await bcrypt.compare(password, user.password);
    if (!esValido) {
      return res.status(401).json({ success: false, data: null, message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    res.status(200).json({
      success: true,
      data: { token, usuario: user.usuario, rol: user.rol, imagen: user.imagen },
      message: 'Login exitoso.',
    });
  } catch (error) {
    console.error('[authController.login]', error);
    res.status(500).json({ success: false, data: null, message: 'Error en el servidor.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
const me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, usuario, rol, imagen, creado_en FROM usuarios WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ success: true, data: rows[0], message: 'Perfil obtenido.' });
  } catch (error) {
    console.error('[authController.me]', error);
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

// ── GET /api/auth/stats ───────────────────────────────────────────────────────
const stats = async (req, res) => {
  try {
    const [[{ totalClientes }]]   = await db.query('SELECT COUNT(*) AS totalClientes FROM Cliente');
    const [[{ totalCoches }]]     = await db.query('SELECT COUNT(*) AS totalCoches FROM Coche');
    const [[{ totalCompras }]]    = await db.query('SELECT COUNT(*) AS totalCompras FROM Compra');
    const [[{ totalMecanicos }]]  = await db.query('SELECT COUNT(*) AS totalMecanicos FROM Mecanico');
    const [[{ totalReparaciones }]]= await db.query('SELECT COUNT(*) AS totalReparaciones FROM Reparacion');

    res.status(200).json({
      success: true,
      data: { totalClientes, totalCoches, totalCompras, totalMecanicos, totalReparaciones },
      message: 'Estadísticas obtenidas correctamente.',
    });
  } catch (error) {
    console.error('[authController.stats]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener estadísticas.' });
  }
};

module.exports = { register, login, me, stats };
