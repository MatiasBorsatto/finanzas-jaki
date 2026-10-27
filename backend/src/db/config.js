require('dotenv').config({ quiet: true });

const base = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
};

module.exports = { development: base, test: base, production: base };
