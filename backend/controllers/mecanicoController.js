// controllers/mecanicoController.js — CRUD completo para Mecanico
const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Mecanico ORDER BY apellido_mecanico');
    res.status(200).json({ success: true, data: rows, message: 'Mecánicos obtenidos correctamente.' });
  } catch (error) {
    console.error('[mecanicoController.getAll]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al consultar mecánicos.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Mecanico WHERE dni_mecanico = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, data: null, message: 'Mecánico no encontrado.' });
    res.status(200).json({ success: true, data: rows[0], message: 'Mecánico encontrado.' });
  } catch (error) {
    console.error('[mecanicoController.getById]', error);
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { nombre_mecanico, apellido_mecanico, fecha_contratacion, salario } = req.body;
    if (!nombre_mecanico || !apellido_mecanico || !fecha_contratacion || !salario) {
      return res.status(400).json({ success: false, data: null, message: 'Todos los campos son obligatorios.' });
    }
    const [result] = await db.query(
      'INSERT INTO Mecanico (nombre_mecanico, apellido_mecanico, fecha_contratacion, salario) VALUES (?, ?, ?, ?)',
      [nombre_mecanico, apellido_mecanico, fecha_contratacion, salario]
    );
    res.status(201).json({ success: true, data: { dni_mecanico: result.insertId }, message: 'Mecánico creado correctamente.' });
  } catch (error) {
    console.error('[mecanicoController.create]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al crear mecánico.' });
  }
};

const update = async (req, res) => {
  try {
    const { nombre_mecanico, apellido_mecanico, fecha_contratacion, salario } = req.body;
    const [result] = await db.query(
      'UPDATE Mecanico SET nombre_mecanico=?, apellido_mecanico=?, fecha_contratacion=?, salario=? WHERE dni_mecanico=?',
      [nombre_mecanico, apellido_mecanico, fecha_contratacion, salario, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Mecánico no encontrado.' });
    res.status(200).json({ success: true, data: null, message: 'Mecánico actualizado correctamente.' });
  } catch (error) {
    console.error('[mecanicoController.update]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar mecánico.' });
  }
};

const remove = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Primero eliminar las reparaciones asociadas al mecánico
    await conn.query('DELETE FROM Reparacion WHERE dni_mecanico = ?', [req.params.id]);

    // Luego eliminar al mecánico
    const [result] = await conn.query('DELETE FROM Mecanico WHERE dni_mecanico = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ success: false, data: null, message: 'Mecánico no encontrado.' });
    }

    await conn.commit();
    conn.release();
    res.status(200).json({ success: true, data: null, message: 'Mecánico y sus reparaciones eliminados correctamente.' });
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error('[mecanicoController.remove]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar mecánico.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
