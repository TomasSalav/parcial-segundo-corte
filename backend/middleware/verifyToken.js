// middleware/verifyToken.js — Verifica el JWT en cada petición protegida
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token no proporcionado. Acceso denegado.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, rol }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Token inválido o expirado.',
    });
  }
};

module.exports = verifyToken;
