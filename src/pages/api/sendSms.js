import pool from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { senderNumber, destinationNumbers, text } = req.body;

      if (!senderNumber || !destinationNumbers || !text) {
        return res.status(400).json({
          message:
            "Необходимо предоставить senderNumber, destinationNumbers и text.",
        });
      }

      const token = process.env.EXOLVE_API_TOKEN;
      if (!token) {
        return res
          .status(500)
          .json({ message: "Токен аутентификации не настроен." });
      }

      const sentAt = new Date();

      for (const destination of destinationNumbers) {
        const response = await fetch(process.env.EXOLVE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            number: senderNumber,
            destination,
            text,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Ошибка отправки SMS");
        }

        try {
          const insertQuery = `
            INSERT INTO messages (message_id, sender_number, recipient_numbers, text, direction, received_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
          `;
          const values = [
            data.message_id, // Ассоциируемый ID сообщения от внешнего API
            senderNumber,
            destination,
            text,
            "outbound", // Предполагаем, что направление исходящее
            sentAt,
          ];
          await pool.query(insertQuery, values);
        } catch (dbError) {
          console.error(
            "Ошибка при сохранении сообщения в базу данных:",
            dbError
          );
        }
      }

      return res
        .status(200)
        .json({ message: "Все сообщения успешно отправлены и сохранены" });
    } catch (error) {
      console.error("Ошибка при отправке SMS:", error);
      return res
        .status(500)
        .json({ message: `Ошибка сервера: ${error.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
