const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config(); // Загружаем переменные окружения

const app = express();

const token = process.env.TELEGRAM_BOT_TOKEN; // Загружаем токен из .env
const webAppUrl = 'https://sunvillage-6aec8.web.app/';
const railwayUrl = process.env.RAILWAY_URL; // Загружаем Railway URL из .env

// Проверяем, загружены ли переменные
if (!token || !railwayUrl) {
    console.error('Error: Отсутствует TELEGRAM_BOT_TOKEN или RAILWAY_URL');
    process.exit(1);
}

// Создаем бота с вебхуком
const bot = new TelegramBot(token, { webHook: true });

// Устанавливаем вебхук
const webhookUrl = `${railwayUrl}/bot${token}`;
bot.setWebHook(webhookUrl);

app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
    const msg = req.body;
    const chatId = msg.message.chat.id;
    const text = msg.message.text;

    if (text === '/start') {
        try {
            bot.sendMessage(chatId, 'Открывайте приложение по кнопке снизу', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Открыть приложение', web_app: { url: `${webAppUrl}?chatId=${chatId}` } }]
                    ]
                }
            });

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

    res.send('OK');
});

// Запуск сервера Express
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
