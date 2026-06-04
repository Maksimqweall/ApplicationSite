const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Твои данные от Telegram
const TELEGRAM_BOT_TOKEN = '8792149286:AAHCqXEDSdxh3BOd-njHJJohopZ2xTKj59I';
const TELEGRAM_CHAT_ID = '688681425';

// Настройки
app.use(cors()); // Разрешаем фронтенду общаться с бэкендом
app.use(express.json()); // Учим сервер понимать JSON из формы

// УЧИМ СЕРВЕР ПОКАЗЫВАТЬ САЙТ ИЗ ПАПКИ public (Новая строка!)
app.use(express.static('public')); 


// ... дальше без изменений ...

// Создаем маршрут для приема данных из формы
app.post('/send', async (req, res) => {
    // Получаем данные, которые прислал сайт
    const { name, email, message } = req.body;

    // Красиво форматируем текст сообщения для Telegram
    const text = `🚀 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`;

    try {
        // Отправляем запрос к API Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, message: 'Отправлено в Telegram!' });
        } else {
            res.status(500).json({ success: false, message: 'Ошибка API Telegram' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер бэкенда запущен на http://localhost:${PORT}`);
});
