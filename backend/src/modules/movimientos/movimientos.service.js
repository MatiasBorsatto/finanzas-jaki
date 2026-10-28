const { Op } = require('sequelize');
const { Movimiento, Categoria } = require('../../db/models');
const { ErrorNoEncontrado, ErrorValidacion } = require('../../utils/errores');
const { diaValido } = require('../../utils/fechas');

// La categoría debe ser base o del propio usuario.
async function verificarCategoria(usuarioId, categoriaId) {
  if (!categoriaId) return;
  const cat = await Categoria.findOne({
    where: { id: categoriaId, [Op.or]: [{ usuarioId }, { usuarioId: null }] },
  });
  if (!cat) throw new ErrorValidacion('Categoría inválida');
}

async function obtenerPropio(usuarioId, id) {
  const mov = await Movimiento.findOne({ where: { id, usuarioId } });
  if (!mov) throw new ErrorNoEncontrado('Movimiento no encontrado');
  return mov;
}

async function crearMovimiento(usuarioId, datos) {
  await verificarCategoria(usuarioId, datos.categoriaId);
  return Movimiento.create({ ...datos, usuarioId, alcance: 'personal' });
}

async function editarMovimiento(usuarioId, id, datos) {
  const mov = await obtenerPropio(usuarioId, id);
  await verificarCategoria(usuarioId, datos.categoriaId);
  Object.assign(mov, datos);
  await mov.save();
  return mov;
}

async function eliminarMovimiento(usuarioId, id) {
  const mov = await obtenerPropio(usuarioId, id);
  await mov.destroy();
}

// fecha es DATEONLY (texto YYYY-MM-DD, sin zona horaria): el mes se filtra por rango de texto.
function rangoDelMes(mes) {
  const [anio, m] = mes.split('-').map(Number);
  const ultimo = diaValido(anio, m, 31);
  return [`${mes}-01`, `${mes}-${String(ultimo).padStart(2, '0')}`];
}

async function listarMovimientos(usuarioId, { mes, categoriaId, tipo, page = 1, limit = 20 } = {}) {
  const where = { usuarioId };
  if (mes) where.fecha = { [Op.between]: rangoDelMes(mes) };
  if (categoriaId) where.categoriaId = categoriaId;
  if (tipo) where.tipo = tipo;
  const { rows, count } = await Movimiento.findAndCountAll({
    where,
    order: [['fecha', 'DESC'], ['createdAt', 'DESC'], ['id', 'ASC']],
    limit,
    offset: (page - 1) * limit,
  });
  return { items: rows, total: count };
}

module.exports = { crearMovimiento, editarMovimiento, eliminarMovimiento, listarMovimientos };
