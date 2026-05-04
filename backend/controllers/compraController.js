// controllers/compraController.js — CRUD completo para Compra
const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT co.*, 
             cl.nombre_cliente, cl.apellido_cliente, cl.telefono,
             c.modelo, c.marca, c.color
      FROM Compra co
      JOIN Cliente cl ON co.dni_cliente = cl.dni_cliente
      JOIN Coche   c  ON co.matricula   = c.matricula
    `);
    res.status(200).json({ success: true, data: rows, message: 'Compras obtenidas correctamente.' });
  } catch (error) {
    console.error('[compraController.getAll]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al consultar compras.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Compra WHERE id_compra = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, data: null, message: 'Compra no encontrada.' });
    res.status(200).json({ success: true, data: rows[0], message: 'Compra encontrada.' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

const create = async (req, res) => {
  try {
    const { dni_cliente, matricula, fecha_compra } = req.body;
    if (!dni_cliente || !matricula) {
      return res.status(400).json({ success: false, data: null, message: 'Cliente y matrícula son obligatorios.' });
    }
    // Si fecha_compra viene del body la usamos; si no, dejamos que MySQL aplique su DEFAULT
    let sql, params;
    if (fecha_compra) {
      sql = 'INSERT INTO Compra (dni_cliente, matricula, fecha_compra) VALUES (?, ?, ?)';
      params = [dni_cliente, matricula, fecha_compra];
    } else {
      sql = 'INSERT INTO Compra (dni_cliente, matricula) VALUES (?, ?)';
      params = [dni_cliente, matricula];
    }
    const [result] = await db.query(sql, params);
    res.status(201).json({ success: true, data: { id_compra: result.insertId }, message: 'Compra registrada correctamente.' });
  } catch (error) {
    console.error('[compraController.create]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al registrar compra.' });
  }
};

const update = async (req, res) => {
  try {
    const { dni_cliente, matricula, fecha_compra } = req.body;
    // Construimos el SET dinámicamente según los campos recibidos
    const fields = [];
    const values = [];
    if (dni_cliente !== undefined) { fields.push('dni_cliente=?'); values.push(dni_cliente); }
    if (matricula !== undefined) { fields.push('matricula=?'); values.push(matricula); }
    if (fecha_compra !== undefined) { fields.push('fecha_compra=?'); values.push(fecha_compra); }
    if (fields.length === 0) {
      return res.status(400).json({ success: false, data: null, message: 'No hay campos para actualizar.' });
    }
    values.push(req.params.id);
    const [result] = await db.query(`UPDATE Compra SET ${fields.join(', ')} WHERE id_compra=?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Compra no encontrada.' });
    res.status(200).json({ success: true, data: null, message: 'Compra actualizada correctamente.' });
  } catch (error) {
    console.error('[compraController.update]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar compra.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Compra WHERE id_compra = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Compra no encontrada.' });
    res.status(200).json({ success: true, data: null, message: 'Compra eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar compra.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
