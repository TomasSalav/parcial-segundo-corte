// middleware/checkRole.js — Verifica que el usuario tenga el rol requerido
// Uso: router.delete('/...', verifyToken, checkRole('admin'), controller)

const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'No autenticado.',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        data: null,
        message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}.`,
      });
    }

    next();
  };
};

module.exports = checkRole;
