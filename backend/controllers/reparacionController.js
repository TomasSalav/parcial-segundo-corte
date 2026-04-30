// controllers/reparacionController.js — CRUD completo para Reparacion
const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, 
             m.nombre_mecanico, m.apellido_mecanico,
             c.modelo, c.marca
      FROM Reparacion r
      JOIN Mecanico m ON r.dni_mecanico = m.dni_mecanico
      JOIN Coche    c ON r.matricula    = c.matricula
      ORDER BY r.fecha_reparacion DESC
    `);
    res.status(200).json({ success: true, data: rows, message: 'Reparaciones obtenidas correctamente.' });
  } catch (error) {
    console.error('[reparacionController.getAll]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al consultar reparaciones.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Reparacion WHERE id_reparacion = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, data: null, message: 'Reparación no encontrada.' });
    res.status(200).json({ success: true, data: rows[0], message: 'Reparación encontrada.' });
  } catch (error) {
    console.error('[reparacionController.getById]', error);
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { dni_mecanico, matricula, fecha_reparacion, horas_reparacion } = req.body;
    if (!dni_mecanico || !matricula || !fecha_reparacion || !horas_reparacion) {
      return res.status(400).json({ success: false, data: null, message: 'Todos los campos son obligatorios.' });
    }
    const [result] = await db.query(
      'INSERT INTO Reparacion (dni_mecanico, matricula, fecha_reparacion, horas_reparacion) VALUES (?, ?, ?, ?)',
      [dni_mecanico, matricula, fecha_reparacion, horas_reparacion]
    );
    res.status(201).json({ success: true, data: { id_reparacion: result.insertId }, message: 'Reparación creada correctamente.' });
  } catch (error) {
    console.error('[reparacionController.create]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al crear reparación.' });
  }
};

const update = async (req, res) => {
  try {
    const { dni_mecanico, matricula, fecha_reparacion, horas_reparacion } = req.body;
    const [result] = await db.query(
      'UPDATE Reparacion SET dni_mecanico=?, matricula=?, fecha_reparacion=?, horas_reparacion=? WHERE id_reparacion=?',
      [dni_mecanico, matricula, fecha_reparacion, horas_reparacion, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Reparación no encontrada.' });
    res.status(200).json({ success: true, data: null, message: 'Reparación actualizada correctamente.' });
  } catch (error) {
    console.error('[reparacionController.update]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar reparación.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Reparacion WHERE id_reparacion = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Reparación no encontrada.' });
    res.status(200).json({ success: true, data: null, message: 'Reparación eliminada correctamente.' });
  } catch (error) {
    console.error('[reparacionController.remove]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar reparación.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
