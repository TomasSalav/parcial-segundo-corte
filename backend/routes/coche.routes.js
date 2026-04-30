// routes/coche.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/cocheController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.get   ('/',             verifyToken, ctrl.getAll);
router.get   ('/:matricula',   verifyToken, ctrl.getById);
router.post  ('/',             verifyToken, ctrl.create);
router.put   ('/:matricula',   verifyToken, ctrl.update);
router.delete('/:matricula',   verifyToken, checkRole('admin', 'moderador'), ctrl.remove);

module.exports = router;
