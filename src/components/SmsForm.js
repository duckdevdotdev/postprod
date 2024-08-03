import React, { useState } from 'react';

const SmsForm = () => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const destinationNumbers = phoneNumbers.split(',').map(number => number.trim());
    
    try {
        const response = await fetch('/api/sendSms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderNumber: '79862266046', // Здесь должен быть ваш реальный номер отправителя
                destinationNumbers,
                text: message,
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Сообщение успешно отправлено!');
            setPhoneNumbers('');
            setMessage('');
        } else {
            throw new Error(data.message || 'Что-то пошло не так');
        }
    } catch (error) {
        console.error('Ошибка при отправке SMS:', error);
        alert(`Ошибка: ${error.message}`);
    }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-10 p-4">
      <div className="mb-6">
        <label htmlFor="phoneNumbers" className="block mb-2 text-sm font-medium text-gray-900">
          Телефонные номера (разделите запятой):
        </label>
        <input
          type="text"
          id="phoneNumbers"
          name="phoneNumbers"
          value={phoneNumbers}
          onChange={e => setPhoneNumbers(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="79031234567, 79031234568"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
          Сообщение:
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          rows="4"
          required
        />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
        Отправить сообщения
      </button>
    </form>
  );
};

export default SmsForm;
