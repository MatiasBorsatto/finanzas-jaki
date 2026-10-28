const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Movimiento = require('./movimiento');
const Presupuesto = require('./presupuesto');

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

module.exports = { Usuario, Categoria, Movimiento, Presupuesto };
