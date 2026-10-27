const express = require('express');
const cookieParser = require('cookie-parser');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  return app;
}

module.exports = { createApp };
