// routes/auth.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.post('/register', verifyToken, checkRole('admin'), ctrl.register); // Solo admin puede crear usuarios
router.post('/login',    ctrl.login);
router.get ('/me',       verifyToken, ctrl.me);
router.get ('/stats',    verifyToken, ctrl.stats);

module.exports = router;
