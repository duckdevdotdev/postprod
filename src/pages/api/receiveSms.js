// pages/api/receiveMessage.js
import pool from '../../../db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Достаем данные из тела запроса
      const { message_id, sender, receiver, text, direction } = req.body;
  
      // Проверяем, что все необходимые поля переданы и не содержат null
      if (!message_id || !sender || !receiver || !text || !direction) {
        return res.status(400).json({ error: "All fields must be provided and cannot be null." });
      }
  
      try {
        const insertQuery = `
          INSERT INTO messages (message_id, sender_number, recipient_numbers, text, direction)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const values = [message_id, sender, receiver, text, direction];
        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    } else {
      res.status(405).end('Method Not Allowed');
    }
  }
  