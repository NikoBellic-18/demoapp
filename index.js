const express = require('express');
const { Pool } = require('pg');
require('dotenv').config({ path: process.env.ENVFILE || '.env.local' });

// Log para confirmar que leímos bien el .env
console.log('DB cfg =>', {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  db: process.env.PGDATABASE,
  user: process.env.PGUSER
});

// Si PGHOST no es localhost, usamos SSL (requerido por RDS)
const useSsl = process.env.PGHOST && !['127.0.0.1', 'localhost'].includes(process.env.PGHOST);

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

const app = express();

// Home
app.get('/', (_, res) => res.send('✅ Demo (Node + Express + PostgreSQL RDS)'));

// Health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Endpoint que lee de la BD
app.get('/todos', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT id, titulo, creado_en FROM todos ORDER BY id');
    res.json(rows);
  } catch (e) {
    console.error('DB error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`App escuchando en ${port}`));



