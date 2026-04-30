// controllers/cocheController.js — CRUD de Coche + Coche_nuevo + Coche_usado
const db = require('../config/db');

// GET /api/coches — Lista todos los coches con tipo (nuevo/usado)
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*,
             cn.unidades_disponibles,
             cu.kilometraje,
             CASE
               WHEN cn.matricula IS NOT NULL THEN 'nuevo'
               WHEN cu.matricula IS NOT NULL THEN 'usado'
               ELSE 'sin_clasificar'
             END AS tipo
      FROM Coche c
      LEFT JOIN Coche_nuevo cn ON c.matricula = cn.matricula
      LEFT JOIN Coche_usado  cu ON c.matricula = cu.matricula
      ORDER BY c.marca, c.modelo
    `);
    res.status(200).json({ success: true, data: rows, message: 'Coches obtenidos correctamente.' });
  } catch (error) {
    console.error('[cocheController.getAll]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al consultar coches.' });
  }
};

// GET /api/coches/:matricula
const getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, cn.unidades_disponibles, cu.kilometraje,
             CASE WHEN cn.matricula IS NOT NULL THEN 'nuevo'
                  WHEN cu.matricula IS NOT NULL THEN 'usado'
                  ELSE 'sin_clasificar' END AS tipo
      FROM Coche c
      LEFT JOIN Coche_nuevo cn ON c.matricula = cn.matricula
      LEFT JOIN Coche_usado  cu ON c.matricula = cu.matricula
      WHERE c.matricula = ?
    `, [req.params.matricula]);
    if (rows.length === 0) return res.status(404).json({ success: false, data: null, message: 'Coche no encontrado.' });
    res.status(200).json({ success: true, data: rows[0], message: 'Coche encontrado.' });
  } catch (error) {
    console.error('[cocheController.getById]', error);
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

// POST /api/coches
const create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { matricula, modelo, marca, color, tipo, unidades_disponibles, kilometraje } = req.body;
    if (!matricula || !modelo || !marca || !color || !tipo) {
      await conn.rollback(); conn.release();
      return res.status(400).json({ success: false, data: null, message: 'Todos los campos son obligatorios.' });
    }
    await conn.query('INSERT INTO Coche (matricula, modelo, marca, color) VALUES (?, ?, ?, ?)', [matricula, modelo, marca, color]);
    if (tipo === 'nuevo') {
      await conn.query('INSERT INTO Coche_nuevo (matricula, unidades_disponibles) VALUES (?, ?)', [matricula, unidades_disponibles ?? 1]);
    } else if (tipo === 'usado') {
      await conn.query('INSERT INTO Coche_usado (matricula, kilometraje) VALUES (?, ?)', [matricula, kilometraje ?? 0]);
    }
    await conn.commit(); conn.release();
    res.status(201).json({ success: true, data: { matricula }, message: 'Coche creado correctamente.' });
  } catch (error) {
    await conn.rollback(); conn.release();
    console.error('[cocheController.create]', error);
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, data: null, message: 'La matrícula ya existe.' });
    res.status(500).json({ success: false, data: null, message: 'Error al crear coche.' });
  }
};

// PUT /api/coches/:matricula
const update = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { modelo, marca, color, tipo, unidades_disponibles, kilometraje } = req.body;
    const mat = req.params.matricula;
    const [r] = await conn.query('UPDATE Coche SET modelo=?, marca=?, color=? WHERE matricula=?', [modelo, marca, color, mat]);
    if (r.affectedRows === 0) { await conn.rollback(); conn.release(); return res.status(404).json({ success: false, data: null, message: 'Coche no encontrado.' }); }
    if (tipo === 'nuevo') {
      await conn.query('DELETE FROM Coche_usado WHERE matricula=?', [mat]);
      await conn.query('INSERT INTO Coche_nuevo (matricula, unidades_disponibles) VALUES (?,?) ON DUPLICATE KEY UPDATE unidades_disponibles=?', [mat, unidades_disponibles, unidades_disponibles]);
    } else if (tipo === 'usado') {
      await conn.query('DELETE FROM Coche_nuevo WHERE matricula=?', [mat]);
      await conn.query('INSERT INTO Coche_usado (matricula, kilometraje) VALUES (?,?) ON DUPLICATE KEY UPDATE kilometraje=?', [mat, kilometraje, kilometraje]);
    }
    await conn.commit(); conn.release();
    res.status(200).json({ success: true, data: null, message: 'Coche actualizado correctamente.' });
  } catch (error) {
    await conn.rollback(); conn.release();
    console.error('[cocheController.update]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar coche.' });
  }
};

// DELETE /api/coches/:matricula
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Coche WHERE matricula = ?', [req.params.matricula]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Coche no encontrado.' });
    res.status(200).json({ success: true, data: null, message: 'Coche eliminado correctamente.' });
  } catch (error) {
    console.error('[cocheController.remove]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar coche.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
