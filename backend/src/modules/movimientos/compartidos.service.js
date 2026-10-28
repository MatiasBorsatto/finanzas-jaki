const { sequelize } = require('../../db/sequelize');
const { Movimiento, MiembroGrupo, ParticipacionGasto } = require('../../db/models');
const { dividirEnPartes, sumar, aCentavos } = require('../../utils/dinero');
const { ErrorValidacion } = require('../../utils/errores');
const { verificarCategoria } = require('./movimientos.service');

async function esMiembro(grupoId, usuarioId) {
  return Boolean(await MiembroGrupo.findOne({ where: { grupoId, usuarioId } }));
}

// Devuelve [{ usuarioId, monto }] que suma exactamente `monto`.
async function calcularParticipaciones(grupoId, monto, participantes) {
  if (!participantes) {
    const miembros = await MiembroGrupo.findAll({
      where: { grupoId },
      order: [['createdAt', 'ASC'], ['id', 'ASC']],
    });
    const partes = dividirEnPartes(monto, miembros.length);
    return miembros.map((m, i) => ({ usuarioId: m.usuarioId, monto: partes[i] }));
  }
  const ids = participantes.map((p) => p.usuarioId);
  if (new Set(ids).size !== ids.length) throw new ErrorValidacion('Hay participantes repetidos');
  for (const id of ids) {
    if (!(await esMiembro(grupoId, id))) {
      throw new ErrorValidacion('Todos los participantes deben ser miembros del grupo');
    }
  }
  if (aCentavos(sumar(participantes.map((p) => p.monto))) !== aCentavos(monto)) {
    throw new ErrorValidacion('La suma de las participaciones debe ser igual al monto');
  }
  return participantes;
}

// El llamador ya verificó que usuarioId es miembro del grupo (grupoAccesible).
async function crearGastoCompartido(
  usuarioId,
  { grupoId, pagadorId, monto, fecha, categoriaId = null, descripcion = null, participantes }
) {
  if (!(await esMiembro(grupoId, pagadorId))) throw new ErrorValidacion('El pagador debe ser miembro del grupo');
  await verificarCategoria(usuarioId, categoriaId);
  const partes = await calcularParticipaciones(grupoId, monto, participantes);

  return sequelize.transaction(async (transaction) => {
    const mov = await Movimiento.create(
      { usuarioId, tipo: 'gasto', alcance: 'compartido', grupoId, pagadorId, monto, fecha, descripcion, categoriaId },
      { transaction }
    );
    const filas = await ParticipacionGasto.bulkCreate(
      partes.map((p) => ({ movimientoId: mov.id, usuarioId: p.usuarioId, monto: p.monto })),
      { transaction }
    );
    return { ...mov.toJSON(), participaciones: filas.map((f) => f.toJSON()) };
  });
}

module.exports = { crearGastoCompartido };
