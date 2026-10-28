const { Op } = require('sequelize');
const { Presupuesto, Movimiento } = require('../../db/models');
const { ErrorNoEncontrado, ErrorValidacion } = require('../../utils/errores');
const { sumar } = require('../../utils/dinero');
const { rangoDelMes, verificarCategoria } = require('../movimientos/movimientos.service');
const { calcularEstado } = require('./presupuestos.calculo');

// En esta fase solo se admite solo_personal; con_compartidos se habilita más adelante.
const REGLAS_PERMITIDAS = ['solo_personal'];

async function upsertPresupuesto(usuarioId, { categoriaId, mes, montoLimite, regla = 'solo_personal' }) {
  if (!REGLAS_PERMITIDAS.includes(regla)) throw new ErrorValidacion('Regla de presupuesto no permitida');
  await verificarCategoria(usuarioId, categoriaId);
  const existente = await Presupuesto.findOne({ where: { usuarioId, categoriaId, mes } });
  if (existente) {
    Object.assign(existente, { montoLimite, regla });
    await existente.save();
    return existente;
  }
  return Presupuesto.create({ usuarioId, categoriaId, mes, montoLimite, regla });
}

async function listarPresupuestos(usuarioId, mes) {
  return Presupuesto.findAll({ where: { usuarioId, mes }, order: [['createdAt', 'ASC'], ['id', 'ASC']] });
}

async function eliminarPresupuesto(usuarioId, id) {
  const p = await Presupuesto.findOne({ where: { id, usuarioId } });
  if (!p) throw new ErrorNoEncontrado('Presupuesto no encontrado');
  await p.destroy();
}

async function estadoPresupuestos(usuarioId, mes) {
  const presupuestos = await listarPresupuestos(usuarioId, mes);
  if (presupuestos.length === 0) return [];
  const gastos = await Movimiento.findAll({
    where: {
      usuarioId,
      tipo: 'gasto',
      alcance: 'personal',
      fecha: { [Op.between]: rangoDelMes(mes) },
      categoriaId: presupuestos.map((p) => p.categoriaId),
    },
    attributes: ['categoriaId', 'monto'],
  });
  return presupuestos.map((p) => {
    const consumido = sumar(gastos.filter((g) => g.categoriaId === p.categoriaId).map((g) => g.monto));
    return {
      id: p.id,
      categoriaId: p.categoriaId,
      mes: p.mes,
      regla: p.regla,
      montoLimite: p.montoLimite,
      consumido,
      ...calcularEstado({ montoLimite: p.montoLimite, consumido }),
    };
  });
}

module.exports = { upsertPresupuesto, listarPresupuestos, eliminarPresupuesto, estadoPresupuestos };
