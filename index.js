const TelegramBot = require('node-telegram-bot-api');
const express = require('express'); // Для использования вебхука с Express
const app = express();
const token = '7515370853:AAEikh7iTegPcr8vhxpYsBNNJOuB30M3oaQ';
const webAppUrl = 'https://sunvillrest.netlify.app/';

// Здесь ваш ngrok URL
const ngrokUrl = 'https://8596-113-189-111-119.ngrok-free.app';  // Замените на свой ngrok URL

// Создаем бота, но теперь без polling
const bot = new TelegramBot(token, { webHook: true });

// Устанавливаем вебхук на URL, который предоставляет ngrok
const webhookUrl = `${ngrokUrl}/bot${token}`;
bot.setWebHook(webhookUrl);

// Устанавливаем обработчик запросов от Telegram
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  const msg = req.body;
  const chatId = msg.message.chat.id;
  const text = msg.message.text;

  if (text === '/start') {
      try {
          // Отправка Web App кнопки как inline-клавиатуры
          bot.sendMessage(chatId, 'Открывайте приложение по кнопке снизу', {
              reply_markup: {
                  inline_keyboard: [
                      [{ text: 'Открыть приложение', web_app: { url: `${webAppUrl}?chatId=${chatId}` } }]
                  ]
              }
          });

          // Отправка Web App кнопки возле поля ввода
          bot.sendMessage(chatId, 'Используйте кнопку внизу для запуска приложения.', {
              reply_markup: {
                  keyboard: [
                      [{ text: 'Открыть приложение', web_app: { url: `${webAppUrl}?chatId=${chatId}` } }]
                  ],
                  resize_keyboard: true
              }
          });
      } catch (error) {
          console.error(`Ошибка при отправке сообщения: ${error.message}`);
      }
  }

  res.send('OK'); // Ответ на запрос Telegram
});

// Запуск сервера Express
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
