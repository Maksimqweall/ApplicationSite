require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client'); // Подключаем Prisma
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Настраиваем Cloudinary ключами из .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const prisma = new PrismaClient(); // Инициализируем базу данных
const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '8792149286:AAHCqXEDSdxh3BOd-njHJJohopZ2xTKj59I';
const TELEGRAM_CHAT_ID = '688681425';
const JWT_SECRET = 'my-super-secret-key-for-portfolio';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Сохранение только в память 
const upload = multer({ storage: multer.memoryStorage() });

// MIDDLEWARE ДЛЯ ПРОВЕРКИ JWT ТОКЕНА
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access denied.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

// =========================================
// АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ (PRISMA)
// =========================================
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // --- СТРОГАЯ ВАЛИДАЦИЯ ПАРОЛЯ НА СЕРВЕРЕ ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must contain 8+ chars, 1 uppercase, 1 lowercase, and 1 number.' 
        });
    }

    try {
        // Проверяем, есть ли уже такой юзер
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return res.status(400).json({ success: false, message: 'Username already exists' });

        // Шифруем пароль и сохраняем в БД
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { username, password: hashedPassword }
        });
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// =========================================
// ЛИЧНЫЙ КАБИНЕТ (PRISMA)
// =========================================

app.get('/api/user-data', authMiddleware, async (req, res) => {
    try {
        // Достаем юзера вместе с его задачами (join таблиц)
        const user = await prisma.user.findUnique({
            where: { username: req.user.username },
            include: { tasks: true }
        });
        
        if (!user) return res.status(404).json({ success: false });

        res.json({ 
            success: true, 
            username: user.username, 
            bio: user.bio || "",
            photo: user.photo || "",
            location: user.location || "",
            skills: user.skills || "",
            telegram: user.telegram || "",
            github: user.github || "",
            tasks: user.tasks || [] 
        });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.post('/api/profile', authMiddleware, upload.single('photo'), async (req, res) => {
    const { bio, location, skills, telegram, github } = req.body;
    try {
        const updateData = {
            bio: bio || "",
            location: location || "",
            skills: skills || "",
            telegram: telegram || "",
            github: github || ""
        };

        // Если прилетел новый файл фото
        if (req.file) {
            // Функция для загрузки буфера напрямую в Cloudinary
            const uploadFromBuffer = (req) => {
                return new Promise((resolve, reject) => {
                    const cld_upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "portfolio_avatars" }, // Папка внутри твоего Cloudinary
                        (error, result) => {
                            if (result) { resolve(result); }
                            else { reject(error); }
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
                });
            };

            // Ждем завершения загрузки в облако
            const result = await uploadFromBuffer(req);
            
            // Сохраняем в базу данных красивую и вечную ссылку от Cloudinary
            updateData.photo = result.secure_url; 
        }

        // Обновляем данные пользователя в БД
        await prisma.user.update({
            where: { username: req.user.username },
            data: updateData
        });

        res.json({ success: true });
    } catch (error) { 
        console.error("Profile update error:", error);
        res.status(500).json({ success: false }); 
    }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false });

    try {
        // Создаем задачу и привязываем к юзеру
        const newTask = await prisma.task.create({
            data: {
                text,
                user: { connect: { username: req.user.username } }
            }
        });
        res.json({ success: true, task: newTask });
    } catch (error) { res.status(500).json({ success: false }); }
});

// =========================================
// МАРШРУТ TELEGRAM
// =========================================
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;
    const text = `🚀 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`;
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
        });
        if (response.ok) res.status(200).json({ success: true });
        else res.status(500).json({ success: false });
    } catch (error) { res.status(500).json({ success: false }); }
});

// МАРШРУТ-ЛОВУШКА ДЛЯ SPA
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер бэкенда запущен на http://localhost:${PORT}`);
});