const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Movimiento = require('./movimiento');
const Presupuesto = require('./presupuesto');
const Notificacion = require('./notificacion');

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

module.exports = { Usuario, Categoria, Movimiento, Presupuesto, Notificacion };
