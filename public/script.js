// =========================================
// 1. БАЗОВАЯ ЛОГИКА И УВЕДОМЛЕНИЯ
// =========================================
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const btn = form.querySelector('button');
    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending...';

    try {
        const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const result = await response.json();
        if (result.success) {
            showToast('Success! Your message has been sent.', 'success');
            form.reset();
        } else {
            showToast('An error occurred.', 'error');
        }
    } catch (error) {
        showToast('Server is unavailable.', 'error');
    } finally {
        btn.textContent = originalBtnText;
    }
});

// =========================================
// 2. УПРАВЛЕНИЕ МАРШРУТАМИ И АВТОРИЗАЦИЕЙ (SPA)
// =========================================
const modal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth');
const closeModalBtn = document.getElementById('close-modal');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const landingPage = document.getElementById('landing-page');
const profilePage = document.getElementById('profile-page');
const logoLink = document.getElementById('logo-link');
const homeLinks = document.querySelectorAll('.nav-home-link');

const profileUsername = document.getElementById('profile-username');
const avatarLetter = document.getElementById('avatar-letter');
const bioInput = document.getElementById('bio-input');
const saveProfileBtn = document.getElementById('save-profile-btn');
const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const logoutBtn = document.getElementById('logout-btn');

// Хранилище текущего имени пользователя в сессии фронтенда
let currentUsername = '';

// Переключение на ГЛАВНУЮ страницу (БЕЗ разлогина)
function showLandingView(updateHistory = true) {
    profilePage.style.display = 'none';
    landingPage.style.display = 'block';
    if (updateHistory) {
        window.history.pushState({ view: 'home' }, '', '/');
    }
}

// Переключение на страницу ПРОФИЛЯ
function showProfileView(updateHistory = true) {
    if (!localStorage.getItem('token')) return;
    landingPage.style.display = 'none';
    profilePage.style.display = 'block';
    if (updateHistory && currentUsername) {
        window.history.pushState({ view: 'profile' }, '', '/' + currentUsername);
    }
}

// Клик по логотипу (возврат в самое начало)
logoLink.addEventListener('click', (e) => {
    e.preventDefault(); // Запрещаем стандартный переход
    
    showLandingView(false); // Показываем главную страницу
    window.history.pushState({ view: 'home' }, '', '/'); // Ставим чистый URL
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Плавно едем наверх
});

// Клик по ссылкам меню (About, Expertise, Projects, Contact)
homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Запрещаем браузеру делать кривую ссылку /hui#skills
        
        // 1. Включаем отображение лендинга (прячем профиль)
        showLandingView(false); 
        
        // 2. Достаем якорь из ссылки (например, "#skills" или "#portfolio")
        const targetHash = link.getAttribute('href');
        
        // 3. Принудительно ставим красивый URL от корня: http://localhost:3000/#skills
        window.history.pushState({ view: 'home' }, '', '/' + targetHash);
        
        // 4. Ищем нужный блок на странице и плавно прокручиваем к нему
        const targetSection = document.querySelector(targetHash);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Клик по кнопке Профиль / Логин
openAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
        // Если авторизован, просто прыгаем в профиль
        showProfileView();
    } else {
        // Если нет, открываем модалку для входа
        modal.classList.add('show');
    }
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

// Переключение вкладок в модалке
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    loginForm.classList.add('active-form'); registerForm.classList.remove('active-form');
});
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    registerForm.classList.add('active-form'); loginForm.classList.add('active-form');
});

// Регистрация
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            showToast('Registration successful! Please login.', 'success');
            registerForm.reset();
            tabLogin.click();
        } else { showToast(data.message, 'error'); }
    } catch (error) { showToast('Server error', 'error'); }
});

// Логин
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            showToast('Login successful!', 'success');
            localStorage.setItem('token', data.token);
            modal.classList.remove('show');
            loginForm.reset();
            
            // Загружаем данные и сразу открываем вид профиля
            await loadUserData();
            showProfileView();
        } else { showToast(data.message, 'error'); }
    } catch (error) { showToast('Server error', 'error'); }
});

// Загрузка данных пользователя из бэкенда
async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await fetch('/api/user-data', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            currentUsername = data.username;
            profileUsername.textContent = data.username;
            avatarLetter.textContent = data.username.charAt(0).toUpperCase();
            bioInput.value = data.bio;
            openAuthBtn.textContent = 'My Profile';

            // Рендер задач
            taskList.innerHTML = '';
            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.text;
                taskList.appendChild(li);
            });
            return true;
        } else {
            clearAuthSession();
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Добавление задачи
addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('task-input').value;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('task-input').value = '';
            await loadUserData();
        } else { showToast('Failed to add task', 'error'); }
    } catch (error) { showToast('Server error', 'error'); }
});

// Элементы нового профиля
const profilePhoto = document.getElementById('profile-photo');
const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
const profileLocation = document.getElementById('profile-location');
const profileBioText = document.getElementById('profile-bio-text');
const profileSkills = document.getElementById('profile-skills');
const profileContacts = document.getElementById('profile-contacts');

// Элементы модалки редактирования
const editProfileModal = document.getElementById('edit-profile-modal');
const openEditProfileBtn = document.getElementById('open-edit-profile-btn');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const editProfileForm = document.getElementById('edit-profile-form');

// Открытие и закрытие окна редактирования
openEditProfileBtn.addEventListener('click', () => {
    editProfileModal.classList.add('show');
});
closeEditModalBtn.addEventListener('click', () => editProfileModal.classList.remove('show'));
window.addEventListener('click', (e) => { if (e.target === editProfileModal) editProfileModal.classList.remove('show'); });

// ОБНОВЛЕННАЯ ФУНКЦИЯ: Загрузка и Рендер данных
async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await fetch('/api/user-data', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            currentUsername = data.username;
            profileUsername.textContent = data.username;
            openAuthBtn.textContent = 'My Profile';

            // 1. Аватарка (показываем фото или букву)
            if (data.photo && data.photo.trim() !== '') {
                profilePhoto.src = data.photo;
                profilePhoto.style.display = 'block';
                profileAvatarFallback.style.display = 'none';
            } else {
                profilePhoto.style.display = 'none';
                profileAvatarFallback.style.display = 'flex';
                document.getElementById('avatar-letter').textContent = data.username.charAt(0).toUpperCase();
            }

            // 2. Текстовые данные
            profileLocation.textContent = data.location ? `🌍 ${data.location}` : '🌍 Not specified';
            profileBioText.textContent = data.bio ? data.bio : 'No description provided yet.';
            
            // Заполняем форму редактирования текущими данными
            document.getElementById('edit-photo').value = data.photo || '';
            document.getElementById('edit-location').value = data.location || '';
            document.getElementById('edit-bio').value = data.bio || '';
            document.getElementById('edit-skills').value = data.skills || '';
            document.getElementById('edit-telegram').value = data.telegram || '';
            document.getElementById('edit-github').value = data.github || '';

            // 3. Рендер Навыков (разбиваем строку по запятым)
            profileSkills.innerHTML = '';
            if (data.skills) {
                const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s !== '');
                skillsArray.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-chip';
                    span.textContent = skill;
                    profileSkills.appendChild(span);
                });
            } else {
                profileSkills.innerHTML = '<span class="text-secondary">No skills added</span>';
            }

            // 4. Рендер Контактов
            profileContacts.innerHTML = '';
            if (data.telegram) {
                profileContacts.innerHTML += `<a href="https://t.me/${data.telegram.replace('@', '')}" target="_blank">✈️ Telegram</a>`;
            }
            if (data.github) {
                profileContacts.innerHTML += `<a href="${data.github}" target="_blank">🐙 GitHub</a>`;
            }
            if (!data.telegram && !data.github) {
                profileContacts.innerHTML = '<span class="text-secondary">No contacts added</span>';
            }

            // Рендер задач (остается как было)
            taskList.innerHTML = '';
            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.text;
                taskList.appendChild(li);
            });
            return true;
        } else {
            clearAuthSession();
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

// =========================================
// 4. ЛОГИКА ОБРЕЗКИ ФОТО (CROPPER.JS) И СОХРАНЕНИЕ
// =========================================
const photoInput = document.getElementById('edit-photo');
const cropContainer = document.getElementById('crop-container');
const cropImage = document.getElementById('crop-image');
let cropper = null; // Переменная для хранения инструмента обрезки

// Слушаем выбор файла
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Ограничение по размеру (2 МБ = 2 * 1024 * 1024 байт)
    if (file.size > 2 * 1024 * 1024) {
        showToast('File is too large! Maximum size is 2MB.', 'error');
        photoInput.value = ''; // Сбрасываем выбор
        cropContainer.style.display = 'none';
        return;
    }

    // 2. Показываем картинку
    const url = URL.createObjectURL(file);
    cropImage.src = url;
    cropContainer.style.display = 'block';

    // 3. Если старый кроппер существует, удаляем его
    if (cropper) {
        cropper.destroy();
    }

    // 4. Инициализируем редактор (Соотношение сторон строго 1:1 - квадрат)
    cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1, // Ограничиваем рамку размерами картинки
        dragMode: 'move', // Позволяем двигать картинку мышкой
        background: false,
    });
});

// Вспомогательная функция для получения обрезанного файла
function getCroppedBlob(cropperInstance) {
    return new Promise((resolve) => {
        // Выдаем картинку размером 400x400 пикселей (идеально для аватарок)
        cropperInstance.getCroppedCanvas({ width: 400, height: 400 }).toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.9); // Формат JPEG с качеством 90%
    });
}

// СОХРАНЕНИЕ НОВЫХ ДАННЫХ ПРОФИЛЯ
editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const btn = editProfileForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';

    const formData = new FormData();
    
    // Если пользователь загрузил и обрезал картинку
    if (cropper) {
        // Ждем, пока кроппер сгенерирует финальный ровный файл
        const croppedBlob = await getCroppedBlob(cropper);
        // Добавляем обрезанный файл в форму (притворяясь, что это обычный файл)
        formData.append('photo', croppedBlob, 'avatar.jpg');
    }
    
    // Добавляем остальные текстовые данные
    formData.append('location', document.getElementById('edit-location').value);
    formData.append('skills', document.getElementById('edit-skills').value);
    formData.append('telegram', document.getElementById('edit-telegram').value);
    formData.append('github', document.getElementById('edit-github').value);
    formData.append('bio', document.getElementById('edit-bio').value);
    
    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            showToast('Profile updated successfully!', 'success');
            
            // Очищаем редактор после успешного сохранения
            if (cropper) { cropper.destroy(); cropper = null; }
            cropContainer.style.display = 'none';
            photoInput.value = '';
            
            editProfileModal.classList.remove('show');
            await loadUserData(); // Обновляем профиль на экране
        } else {
            showToast('Failed to save profile', 'error');
        }
    } catch (error) { 
        showToast('Server error', 'error'); 
    } finally { 
        btn.textContent = originalText; 
    }
});