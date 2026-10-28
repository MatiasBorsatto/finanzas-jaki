const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./modules/auth/auth.routes');
const usuarioRoutes = require('./modules/usuario/usuario.routes');
const categoriasRoutes = require('./modules/categorias/categorias.routes');
const movimientosRoutes = require('./modules/movimientos/movimientos.routes');
const presupuestosRoutes = require('./modules/presupuestos/presupuestos.routes');
const { manejarErrores } = require('./middlewares/manejarErrores');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/usuario', usuarioRoutes);
  app.use('/api/categorias', categoriasRoutes);
  app.use('/api/movimientos', movimientosRoutes);
  app.use('/api/presupuestos', presupuestosRoutes);
  app.use(manejarErrores);

  return app;
}

module.exports = { createApp };
