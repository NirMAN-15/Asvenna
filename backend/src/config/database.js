const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.db);

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database:', config.db.database);
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
