import React, { useState } from 'react';

const SmsForm = () => {
  // Используем хук useState для управления состоянием полей ввода
  const [phoneNumbers, setPhoneNumbers] = useState(''); // Состояние для хранения введенных номеров телефонов
  const [message, setMessage] = useState(''); // Состояние для хранения введенного текста сообщения

  // Функция-обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
    // Разделяем строку номеров телефонов на массив номеров
    const destinationNumbers = phoneNumbers.split(',').map(number => number.trim());
    
    try {
      // Отправляем POST-запрос на серверный API для отправки SMS
      const response = await fetch('/api/sendSms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Указываем тип содержимого запроса
        },
        body: JSON.stringify({
          senderNumber: '79862266046', // Номер отправителя
          destinationNumbers, // Массив номеров получателей
          text: message, // Текст сообщения
        })
      });

      // Разбираем ответ API
      const data = await response.json();
      if (response.ok) {
        alert('Сообщение успешно отправлено!'); // Показываем уведомление об успешной отправке
        setPhoneNumbers(''); // Очищаем поле ввода номеров телефонов
        setMessage(''); // Очищаем поле ввода сообщения
      } else {
        throw new Error(data.message || 'Что-то пошло не так'); // Обрабатываем ошибку, если запрос не был успешным
      }
    } catch (error) {
      // Обрабатываем ошибку при выполнении запроса
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
          className="   rounded-lg text-sm  border-blue-400 focus:ring-blue-500 text-gray-900 focus:border-blue-500 block w-full p-2.5 border"
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
          className=" block  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 border-blue-400  border w-full p-2.5"
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
