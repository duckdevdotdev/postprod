// components/MessagesList.js
import React, { useEffect, useState } from 'react';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('Data fetching failed');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, []);

  if (isLoading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Полученные сообщения</h1>
      <ul className="divide-y divide-gray-300">
        {messages.map((message) => (
          <li key={message.id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
            <p className="text-gray-600"><strong>От:</strong> {message.sender_number}</p>
            <p className="text-gray-900"><strong>Сообщение:</strong> {message.text}</p>
            <p className="text-gray-500 text-sm">
              <strong>Время:</strong> {new Date(message.direction === 'DIRECTION_OUTGOING' ? message.sent_at : message.received_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;
