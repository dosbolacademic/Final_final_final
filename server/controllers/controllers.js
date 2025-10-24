import { pool } from '../config/database.js';

export const getAllCars = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM custom_cars ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM custom_cars WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Car not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const { color, wheels, total_price } = req.body;
    // Validate impossible combo
    if (color === 'green' && wheels === 'standard') {
      return res.status(400).json({ error: 'Green color incompatible with standard wheels!' });
    }
    const { rows } = await pool.query(
      'INSERT INTO custom_cars (color, wheels, total_price) VALUES ($1, $2, $3) RETURNING *',
      [color, wheels, total_price]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, wheels, total_price } = req.body;
    if (color === 'green' && wheels === 'standard') {
      return res.status(400).json({ error: 'Green color incompatible with standard wheels!' });
    }
    const { rows } = await pool.query(
      'UPDATE custom_cars SET color = $1, wheels = $2, total_price = $3 WHERE id = $4 RETURNING *',
      [color, wheels, total_price, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Car not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM custom_cars WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};