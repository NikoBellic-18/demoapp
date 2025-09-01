const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});
pool.query('SELECT current_user, current_database(), 1 as ok', (err, r) => {
  if (err) return console.error('TEST ERROR:', err.message);
  console.log('TEST OK:', r.rows[0]);
  process.exit(0);
});
