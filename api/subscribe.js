import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Adresa de email invalidă' });
  }

  try {
    // Insert subscriber into the 'subscribers' table using pg
    const query = `
      INSERT INTO subscribers (email, subscribed_at)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET subscribed_at = EXCLUDED.subscribed_at
      RETURNING *;
    `;
    const result = await pool.query(query, [email, new Date().toISOString()]);

    return res.status(200).json({ message: 'Te-ai abonat cu succes!', data: result.rows[0] });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Eroare la procesarea abonamentului' });
  }
}
