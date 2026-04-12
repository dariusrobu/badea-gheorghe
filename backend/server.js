const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER || 'robudarius'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'badea_gheorghe'}`,
});

// Database Initialization
const initDb = async () => {
  try {
    // Create subscribers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        delivery_type VARCHAR(20) NOT NULL,
        delivery_address TEXT,
        pickup_location VARCHAR(100),
        delivery_date DATE,
        delivery_time VARCHAR(20),
        special_instructions TEXT,
        payment_method VARCHAR(20) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending',
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL
      );
    `);

    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ Database Initialization Error:', err);
  }
};

initDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * REST API for Subscribers
 */

// POST /api/subscribers
app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const query = `
      INSERT INTO subscribers (email, subscribed_at)
      VALUES ($1, NOW())
      ON CONFLICT (email) DO UPDATE SET subscribed_at = EXCLUDED.subscribed_at
      RETURNING *;
    `;
    const result = await pool.query(query, [email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET /api/subscribers
app.get('/api/subscribers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// DELETE /api/subscribers
app.delete('/api/subscribers', async (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const result = await pool.query('DELETE FROM subscribers WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.status(200).json({ message: 'Subscriber deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

/**
 * REST API for Orders
 */

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  const { 
    id, customerName, phone, email, deliveryType, deliveryAddress, 
    pickupLocation, deliveryDate, deliveryTime, specialInstructions, 
    paymentMethod, totalAmount, items 
  } = req.body;

  if (!id || !customerName || !phone || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert order
    const orderQuery = `
      INSERT INTO orders (
        id, customer_name, phone, email, delivery_type, delivery_address, 
        pickup_location, delivery_date, delivery_time, special_instructions, 
        payment_method, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const orderValues = [
      id, customerName, phone, email, deliveryType, deliveryAddress, 
      pickupLocation, deliveryDate, deliveryTime, specialInstructions, 
      paymentMethod, totalAmount
    ];
    await client.query(orderQuery, orderValues);

    // Insert order items
    for (const item of items) {
      const itemQuery = `
        INSERT INTO order_items (order_id, menu_item_id, name, price, quantity)
        VALUES ($1, $2, $3, $4, $5);
      `;
      await client.query(itemQuery, [id, item.id, item.name, item.price, item.quantity]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', orderId: id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    client.release();
  }
});

// GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Badea Gheorghe Local Backend is running!');
});

app.listen(port, () => {
  console.log(`🚀 Local Backend listening at http://localhost:${port}`);
  console.log(`📡 Mapped routes:`);
  console.log(`   - POST http://localhost:${port}/api/subscribers`);
  console.log(`   - GET  http://localhost:${port}/api/subscribers`);
  console.log(`   - POST http://localhost:${port}/api/orders`);
  console.log(`   - GET  http://localhost:${port}/api/orders`);
});
