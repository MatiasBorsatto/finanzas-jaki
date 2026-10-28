const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Movimiento = require('./movimiento');
const Presupuesto = require('./presupuesto');
const Notificacion = require('./notificacion');
const Tarjeta = require('./tarjeta');
const Compra = require('./compra');

Usuario.hasMany(Categoria, { foreignKey: 'usuarioId' });
Categoria.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Movimiento, { foreignKey: 'usuarioId' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Categoria.hasMany(Movimiento, { foreignKey: 'categoriaId' });
Movimiento.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Usuario.hasMany(Presupuesto, { foreignKey: 'usuarioId' });
Presupuesto.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Categoria.hasMany(Presupuesto, { foreignKey: 'categoriaId' });
Presupuesto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

Usuario.hasMany(Notificacion, { foreignKey: 'usuarioId' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Presupuesto.hasMany(Notificacion, { foreignKey: 'presupuestoId' });
Notificacion.belongsTo(Presupuesto, { foreignKey: 'presupuestoId' });

Usuario.hasMany(Tarjeta, { foreignKey: 'usuarioId' });
Tarjeta.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Compra, { foreignKey: 'usuarioId' });
Compra.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Tarjeta.hasMany(Compra, { foreignKey: 'tarjetaId' });
Compra.belongsTo(Tarjeta, { foreignKey: 'tarjetaId' });
Tarjeta.hasMany(Movimiento, { foreignKey: 'tarjetaId' });
Movimiento.belongsTo(Tarjeta, { foreignKey: 'tarjetaId' });
Compra.hasMany(Movimiento, { foreignKey: 'compraId' });
Movimiento.belongsTo(Compra, { foreignKey: 'compraId' });

module.exports = { Usuario, Categoria, Movimiento, Presupuesto, Notificacion, Tarjeta, Compra };
