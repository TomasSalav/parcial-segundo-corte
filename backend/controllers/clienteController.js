// controllers/clienteController.js — CRUD completo para Cliente
const db = require('../config/db');

// GET /api/clientes
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Cliente ORDER BY dni_cliente DESC');
    res.status(200).json({ success: true, data: rows, message: 'Clientes obtenidos correctamente.' });
  } catch (error) {
    console.error('[clienteController.getAll]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al consultar clientes.' });
  }
};

// GET /api/clientes/:id
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Cliente WHERE dni_cliente = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, data: null, message: 'Cliente no encontrado.' });
    res.status(200).json({ success: true, data: rows[0], message: 'Cliente encontrado.' });
  } catch (error) {
    console.error('[clienteController.getById]', error);
    res.status(500).json({ success: false, data: null, message: 'Error del servidor.' });
  }
};

// POST /api/clientes
const create = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, direccion, telefono } = req.body;
    if (!nombre_cliente || !apellido_cliente || !direccion || !telefono) {
      return res.status(400).json({ success: false, data: null, message: 'Todos los campos son obligatorios.' });
    }
    const [result] = await db.query(
      'INSERT INTO Cliente (nombre_cliente, apellido_cliente, direccion, telefono) VALUES (?, ?, ?, ?)',
      [nombre_cliente, apellido_cliente, direccion, telefono]
    );
    res.status(201).json({ success: true, data: { dni_cliente: result.insertId, nombre_cliente, apellido_cliente, direccion, telefono }, message: 'Cliente creado correctamente.' });
  } catch (error) {
    console.error('[clienteController.create]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al crear cliente.' });
  }
};

// PUT /api/clientes/:id
const update = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, direccion, telefono } = req.body;
    const [result] = await db.query(
      'UPDATE Cliente SET nombre_cliente=?, apellido_cliente=?, direccion=?, telefono=? WHERE dni_cliente=?',
      [nombre_cliente, apellido_cliente, direccion, telefono, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, data: null, message: 'Cliente no encontrado.' });
    res.status(200).json({ success: true, data: null, message: 'Cliente actualizado correctamente.' });
  } catch (error) {
    console.error('[clienteController.update]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar cliente.' });
  }
};

// DELETE /api/clientes/:id
const remove = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Primero eliminar las compras asociadas al cliente
    await conn.query('DELETE FROM Compra WHERE dni_cliente = ?', [req.params.id]);

    // Luego eliminar el cliente
    const [result] = await conn.query('DELETE FROM Cliente WHERE dni_cliente = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ success: false, data: null, message: 'Cliente no encontrado.' });
    }

    await conn.commit();
    conn.release();
    res.status(200).json({ success: true, data: null, message: 'Cliente y sus compras eliminados correctamente.' });
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error('[clienteController.remove]', error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar cliente.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
