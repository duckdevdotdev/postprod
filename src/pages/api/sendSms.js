// pages/api/sendSms.js
import pool from '../../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Разбор тела запроса
      const { senderNumber, destinationNumbers, text } = req.body;

      // Проверяем, что все необходимые данные предоставлены
      if (!senderNumber || !destinationNumbers || !text) {
        return res.status(400).json({ message: 'Необходимо предоставить senderNumber, destinationNumbers и text.' });
      }

      // Токен аутентификации
      const token = process.env.EXOLVE_API_TOKEN;
      if (!token) {
        return res.status(500).json({ message: 'Токен аутентификации не настроен.' });
      }

      const sentAt = new Date();

      // Проходим по каждому номеру получателя и отправляем SMS
      for (const destination of destinationNumbers) {
        const response = await fetch(process.env.EXOLVE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            number: senderNumber,
            destination,
            text
          })
        });

        // Обрабатываем ответ API
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка отправки SMS');
        }

        // Сохраняем отправленное сообщение в базу данных
        try {
          const insertQuery = `
            INSERT INTO messages (message_id, sender_number, recipient_numbers, text, direction, sent_at)
            VALUES ($1, $2, $3, $4, 'DIRECTION_OUTGOING', $5)
            ON CONFLICT (message_id) DO NOTHING
            RETURNING *;
          `;
          const values = [data.message_id, senderNumber, destination, text, sentAt];
          await pool.query(insertQuery, values);
        } catch (dbError) {
          console.error('Ошибка при сохранении сообщения в базу данных:', dbError);
        }
      }

      // Возвращаем ответ, если все SMS были успешно отправлены и сохранены
      return res.status(200).json({ message: 'Все сообщения успешно отправлены и сохранены' });
    } catch (error) {
      // Обработка ошибок при запросе к внешнему API
      console.error('Ошибка при отправке SMS:', error);
      return res.status(500).json({ message: `Ошибка сервера: ${error.message}` });
    }
  } else {
    // Отклоняем все не-POST запросы
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
