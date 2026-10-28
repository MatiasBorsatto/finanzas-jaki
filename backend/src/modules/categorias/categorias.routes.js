const { Router } = require('express');
const { autenticar } = require('../../middlewares/autenticar');
const controller = require('./categorias.controller');

const router = Router();
router.use(autenticar);
router.get('/', controller.listar);
router.post('/', controller.crear);
router.patch('/:id', controller.editar);
router.delete('/:id', controller.archivar); // archiva; no hay borrado físico

module.exports = router;
