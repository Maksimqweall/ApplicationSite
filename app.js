const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

// Создаем папку для картинок, если её ещё нет
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Настраиваем, куда и под каким именем сохранять файлы
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Сохраняем в public/uploads
    },
    filename: (req, file, cb) => {
        // Даем файлу уникальное имя: логин_пользователя-время.расширение
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.username}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

const app = express();
const PORT = 3000;

// Твои данные от Telegram
const TELEGRAM_BOT_TOKEN = '8792149286:AAHCqXEDSdxh3BOd-njHJJohopZ2xTKj59I';
const TELEGRAM_CHAT_ID = '688681425';
const JWT_SECRET = 'my-super-secret-key-for-portfolio';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Функции для работы с "базой данных"
const getUsers = () => {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Middleware: проверка токена
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
// АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
// =========================================
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // ПРИ РЕГИСТРАЦИИ СОЗДАЕМ ЛИЧНЫЕ ПУСТЫЕ МАССИВЫ ДЛЯ ЗАДАЧ И ПРОФИЛЯ
        users.push({ 
            username, 
            password: hashedPassword,
            bio: "",
            tasks: [{ id: Date.now(), text: 'Welcome to your personal workspace!' }]
        });
        saveUsers(users);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) { res.status(500).json({ success: false }); }
});

// =========================================
// ЛИЧНЫЙ КАБИНЕТ (ЗАДАЧИ И ПРОФИЛЬ)
// =========================================

app.get('/api/user-data', authMiddleware, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.username === req.user.username);
    
    if (!user) return res.status(404).json({ success: false });

    // Отправляем все личные данные
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
});

// Добавить новую задачу
app.post('/api/tasks', authMiddleware, (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false });

    const users = getUsers();
    const user = users.find(u => u.username === req.user.username);
    
    if (!user.tasks) user.tasks = []; // Страховка, если массив пуст
    
    const newTask = { id: Date.now(), text };
    user.tasks.push(newTask); // Добавляем задачу только этому пользователю
    saveUsers(users);

    res.json({ success: true, task: newTask });
});


// Сохранить полные данные профиля
// Сохранить полные данные профиля (Добавили upload.single('photo'))
app.post('/api/profile', authMiddleware, upload.single('photo'), (req, res) => {
    // Текстовые данные лежат в req.body
    const { bio, location, skills, telegram, github } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === req.user.username);
    
    if (user) {
        user.bio = bio || "";
        user.location = location || "";
        user.skills = skills || "";
        user.telegram = telegram || "";
        user.github = github || "";
        
        // Если пользователь загрузил новый файл, он будет лежать в req.file
        if (req.file) {
            // Сохраняем относительный путь для браузера
            user.photo = '/uploads/' + req.file.filename;
        }
        
        saveUsers(users);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
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
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
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