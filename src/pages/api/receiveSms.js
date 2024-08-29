// pages/api/receiveMessage.js
import pool from "../../../db"; // Импортируем пул соединений с базой данных

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Достаем данные из тела запроса
    const { message_id, sender, receiver, text, direction } = req.body;
    console.log("Получен запрос:", {
      message_id,
      sender,
      receiver,
      text,
      direction,
    });

    // Проверяем, что все необходимые поля переданы и не содержат null
    if (!message_id || !sender || !receiver || !text || !direction) {
      console.error(
        "Ошибка запроса: Не все поля предоставлены или содержат null."
      );
      return res.status(400).json({
        error: "Все поля должны быть предоставлены и не могут быть null.",
      });
    }

    // Время получения сообщения
    const receivedAt = new Date();
    console.log("Время получения сообщения:", receivedAt.toISOString());

    try {
      // Формируем SQL-запрос для вставки данных сообщения в таблицу
      const insertQuery = `
      INSERT INTO messages (message_id, sender_number, recipient_numbers, text, direction, received_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
      const values = [
        message_id,
        sender,
        receiver,
        text,
        direction,
        receivedAt,
      ];
      const result = await pool.query(insertQuery, values);
      console.log("Сообщение вставлено в базу данных:", result.rows[0]);

      // Если сообщение уже существует, возвращаем ошибку 409
      if (result.rows.length === 0) {
        console.error("Сообщение уже существует:", { message_id });
        return res.status(409).json({
          error: "Сообщение уже существует",
        });
      }

      // Возвращаем вставленное сообщение с кодом 201
      res.status(201).json(result.rows[0]);
    } catch (error) {
      // Обрабатываем ошибки базы данных
      console.error("Ошибка базы данных:", error);
      res.status(500).json({
        error: "Внутренняя ошибка сервера",
        details: error.message,
      });
    }
  } else {
    // Отклоняем запросы с методами, отличными от POST
    console.warn("Попытка использования неподдерживаемого метода:", req.method);
    res.status(405).end("Метод не разрешен");
  }
}
