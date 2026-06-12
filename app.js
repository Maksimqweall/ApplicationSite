require('dotenv').config();
console.log("DEBUG: Cloudinary Name loaded:", process.env.CLOUDINARY_CLOUD_NAME);
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Твои токены
const TELEGRAM_BOT_TOKEN = '8792149286:AAHCqXEDSdxh3BOd-njHJJohopZ2xTKj59I';
const TELEGRAM_CHAT_ID = '688681425';
const JWT_SECRET = 'my-super-secret-key-for-portfolio';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Настройка Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Настройка сохранения в оперативную память (для Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware для проверки токена
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
// --- ОТПРАВКА ЗАЯВКИ В TELEGRAM ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Формируем текст сообщения
    const text = `🚨 Новая заявка с FitTrack!\n\n👤 Имя: ${name}\n✉️ Email: ${email}\n📝 Сообщение:\n${message}`;
    
    try {
        // Отправляем в Telegram API
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text
            })
        });
        
        if (response.ok) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        console.error("Telegram API Error:", error);
        res.status(500).json({ success: false });
    }
});

// =========================================
// 1. АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
// =========================================
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Строгая проверка пароля
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must contain 8+ chars, 1 uppercase, 1 lowercase, and 1 number.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return res.status(400).json({ success: false, message: 'Username already exists' });

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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(400).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) { 
        res.status(500).json({ success: false }); 
    }
});

// =========================================
// 2. ЛИЧНЫЙ КАБИНЕТ И ДАННЫЕ (SPA)
// =========================================
// =========================================
// 2. ЛИЧНЫЙ КАБИНЕТ И ДАННЫЕ (SPA)
// =========================================
app.get('/api/user-data', authMiddleware, async (req, res) => {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.user.username },
            include: {
                workouts: { where: { date: targetDate } }, 
                meals: { where: { date: targetDate } }     
            }
        });
        
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ 
            success: true, 
            username: user.username, 
            bio: user.bio || "",
            photo: user.photo || "",
            location: user.location || "",
            skills: user.skills || "",
            telegram: user.telegram || "",
            github: user.github || "",
            workouts: user.workouts || [],
            meals: user.meals || []
        });
    } catch (error) { 
        res.status(500).json({ error: "Server error" }); 
    }
});

// Обновление профиля (Cloudinary) - ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ
// Обновление профиля
// Обновление профиля
app.post('/api/profile', authMiddleware, (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: "Upload error" });
        next();
    });
}, async (req, res) => {
    // ВАЖНО: Добавили calorieGoal, weight, height
    const { bio, location, telegram, github, calorieGoal, weight, height } = req.body;
    
    try {
        const updateData = {
            bio: bio || "",
            location: location || "",
            telegram: telegram || "",
            github: github || "",
            // Аккуратно конвертируем в числа. Если пусто - оставляем дефолт или null
            calorieGoal: calorieGoal ? parseInt(calorieGoal) : 2500,
            weight: weight ? parseFloat(weight) : null,
            height: height ? parseFloat(height) : null
        };

        if (req.file) {
            const uploadFromBuffer = (req) => {
                return new Promise((resolve, reject) => {
                    const cld_upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "portfolio_avatars" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
                });
            };
            const result = await uploadFromBuffer(req);
            updateData.photo = result.secure_url; 
        }

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

// Тренировки
app.post('/api/workouts', authMiddleware, async (req, res) => {
    const { title, notes, date } = req.body; // Принимаем date
    try {
        const workout = await prisma.workout.create({
            data: { 
                title, 
                notes, 
                date: date, // Записываем дату
                user: { connect: { username: req.user.username } } 
            }
        });
        res.json({ success: true, workout });
    } catch (error) { res.status(500).json({ success: false }); }
});

// Питание
app.post('/api/meals', authMiddleware, async (req, res) => {
    const { itemName, calories, date } = req.body; // Принимаем date
    try {
        const meal = await prisma.meal.create({
            data: { 
                itemName, 
                calories: parseInt(calories), 
                date: date, // Записываем дату
                user: { connect: { username: req.user.username } } 
            }
        });
        res.json({ success: true, meal });
    } catch (error) { res.status(500).json({ success: false }); }
});

// Обновление профиля (Cloudinary)
app.post('/api/profile', authMiddleware, upload.single('photo'), async (req, res) => {
    console.log("File received:", req.file); 
    const { bio, location, skills, telegram, github } = req.body;
    try {
        const updateData = {
            bio: bio || "",
            location: location || "",
            telegram: telegram || "",
            github: github || "",
            calorieGoal: calorieGoal ? parseInt(calorieGoal) : 2500,
            weight: weight ? parseFloat(weight) : null,
            height: height ? parseFloat(height) : null
        };

        if (req.file) {
            const uploadFromBuffer = (req) => {
                return new Promise((resolve, reject) => {
                    const cld_upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "portfolio_avatars" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
                });
            };
            const result = await uploadFromBuffer(req);
            updateData.photo = result.secure_url; 
        }

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

// Добавление задач
// --- ДОБАВЛЕНИЕ ТРЕНИРОВКИ ---
app.post('/api/workouts', authMiddleware, async (req, res) => {
    const { title, notes } = req.body;
    if (!title) return res.status(400).json({ success: false });

    try {
        const newWorkout = await prisma.workout.create({
            data: {
                title,
                notes: notes || "",
                user: { connect: { username: req.user.username } }
            }
        });
        res.json({ success: true, workout: newWorkout });
    } catch (error) { res.status(500).json({ success: false }); }
});

// --- ДОБАВЛЕНИЕ ПРИЕМА ПИЩИ / КАЛОРИЙ ---
app.post('/api/meals', authMiddleware, async (req, res) => {
    const { itemName, calories } = req.body;
    
    try {
        const newMeal = await prisma.meal.create({
            data: {
                itemName,
                calories: parseInt(calories) || 0,
                user: { connect: { username: req.user.username } }
            }
        });
        res.json({ success: true, meal: newMeal });
    } catch (error) { res.status(500).json({ success: false }); }
});

// =========================================
// 3. МАРШРУТ TELEGRAM И СТАТИКА
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
    } catch (error) { 
        res.status(500).json({ success: false }); 
    }
});
//4. --- УДАЛЕНИЕ ТРЕНИРОВКИ ---
app.delete('/api/workouts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.workout.deleteMany({
            where: { 
                id: parseInt(id), 
                user: { username: req.user.username } 
            }
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});

// --- УДАЛЕНИЕ ПРИЕМА ПИЩИ ---
app.delete('/api/meals/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.meal.deleteMany({
            where: { 
                id: parseInt(id), 
                user: { username: req.user.username } 
            }
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false }); }
});
// МАРШРУТ-ЛОВУШКА ДЛЯ SPA
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error("!!! ГЛОБАЛЬНАЯ ОШИБКА EXPRESS !!!");
    console.error(err.stack); // Выведет полный путь ошибки
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
});
app.listen(PORT, () => {
    console.log(`Сервер бэкенда запущен на http://localhost:${PORT}`);
});