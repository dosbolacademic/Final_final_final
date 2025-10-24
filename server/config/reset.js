import { pool } from './database.js';

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS custom_cars (
      id SERIAL PRIMARY KEY,
      color VARCHAR(50) NOT NULL,
      wheels VARCHAR(50) NOT NULL,
      total_price INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('Table created!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

createTable();