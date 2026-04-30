// routes/mecanico.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/mecanicoController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.get   ('/',    verifyToken, ctrl.getAll);
router.get   ('/:id', verifyToken, ctrl.getById);
router.post  ('/',    verifyToken, ctrl.create);
router.put   ('/:id', verifyToken, ctrl.update);
router.delete('/:id', verifyToken, checkRole('admin', 'moderador'), ctrl.remove);

module.exports = router;
