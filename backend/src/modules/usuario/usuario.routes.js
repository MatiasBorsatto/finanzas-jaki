const { Router } = require('express');
const { autenticar } = require('../../middlewares/autenticar');

const router = Router();
router.get('/perfil', autenticar, (req, res) => {
  res.json(req.usuario);
});

module.exports = router;
