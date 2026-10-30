const { Router } = require('express');
const { autenticar } = require('../../middlewares/autenticar');
const { ErrorValidacion } = require('../../utils/errores');
const { validarMes } = require('../movimientos/movimientos.validation');
const service = require('./estadisticas.service');

const router = Router();
router.use(autenticar);

router.get('/mensual', async (req, res) => {
  if (req.query.mes === undefined) throw new ErrorValidacion('El mes es obligatorio');
  res.json(await service.resumenMensual(req.usuario.id, validarMes(req.query.mes)));
});

module.exports = router;
