const Usuario = require('./usuario');
const Categoria = require('./categoria');

Usuario.hasMany(Categoria, { foreignKey: 'usuarioId' });
Categoria.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = { Usuario, Categoria };
