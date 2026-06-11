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

// Отправка формы в Telegram
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
// 2. ИНТЕРФЕЙС И РОУТИНГ (SPA)
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
const profilePhoto = document.getElementById('profile-photo');
const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
const profileLocation = document.getElementById('profile-location');
const profileBioText = document.getElementById('profile-bio-text');
const profileSkills = document.getElementById('profile-skills');
const profileContacts = document.getElementById('profile-contacts');

const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const logoutBtn = document.getElementById('logout-btn');

let currentUsername = '';

// Переключение на Главную
function showLandingView(updateHistory = true) {
    profilePage.style.display = 'none';
    landingPage.style.display = 'block';
    if (updateHistory) window.history.pushState({ view: 'home' }, '', '/');
}

// Переключение на Профиль
function showProfileView(updateHistory = true) {
    if (!currentUsername) return; // Защита: пускаем только если есть имя пользователя
    landingPage.style.display = 'none';
    profilePage.style.display = 'block';
    if (updateHistory) window.history.pushState({ view: 'profile' }, '', '/' + currentUsername);
}

// Навигация по меню
logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLandingView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showLandingView(false);
        const targetHash = link.getAttribute('href');
        window.history.pushState({ view: 'home' }, '', '/' + targetHash);
        const targetSection = document.querySelector(targetHash);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Клик по кнопке Login в шапке
openAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUsername) {
        showProfileView(); // Если уже ввели логин в этой сессии — пускаем
    } else {
        modal.classList.add('show'); // Иначе — требуем логин
    }
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    loginForm.classList.add('active-form'); registerForm.classList.remove('active-form');
});
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active'); tabLogin.classList.remove('active');
    registerForm.classList.add('active-form'); loginForm.classList.remove('active-form');
});

// =========================================
// 3. ЛОГИКА АВТОРИЗАЦИИ
// =========================================
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    // --- ВАЛИДАЦИЯ ПАРОЛЯ ПЕРЕД ОТПРАВКОЙ НА СЕРВЕР ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        showToast('Password must be 8+ chars, include uppercase, lowercase & number.', 'error');
        return; // Останавливаем выполнение, сервер даже не потревожим
    }

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
        } else { 
            // Показываем ошибку с сервера (например, если логин занят)
            showToast(data.message, 'error'); 
        }
    } catch (error) { 
        showToast('Server error', 'error'); 
    }
});

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
            
            await loadUserData();
            showProfileView();
        } else { showToast(data.message, 'error'); }
    } catch (error) { showToast('Server error', 'error'); }
});

// Загрузка данных профиля
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

            if (data.photo && data.photo.trim() !== '') {
                profilePhoto.src = data.photo;
                profilePhoto.style.display = 'block';
                profileAvatarFallback.style.display = 'none';
            } else {
                profilePhoto.style.display = 'none';
                profileAvatarFallback.style.display = 'flex';
                document.getElementById('avatar-letter').textContent = data.username.charAt(0).toUpperCase();
            }

            profileLocation.textContent = data.location ? `🌍 ${data.location}` : '🌍 Not specified';
            profileBioText.textContent = data.bio ? data.bio : 'No description provided yet.';
            
            document.getElementById('edit-location').value = data.location || '';
            document.getElementById('edit-bio').value = data.bio || '';
            document.getElementById('edit-skills').value = data.skills || '';
            document.getElementById('edit-telegram').value = data.telegram || '';
            document.getElementById('edit-github').value = data.github || '';

            profileSkills.innerHTML = '';
            if (data.skills) {
                data.skills.split(',').map(s => s.trim()).filter(s => s !== '').forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-chip';
                    span.textContent = skill;
                    profileSkills.appendChild(span);
                });
            } else {
                profileSkills.innerHTML = '<span class="text-secondary">No skills added</span>';
            }

            profileContacts.innerHTML = '';
            if (data.telegram) profileContacts.innerHTML += `<a href="https://t.me/${data.telegram.replace('@', '')}" target="_blank">✈️ Telegram</a>`;
            if (data.github) profileContacts.innerHTML += `<a href="${data.github}" target="_blank">🐙 GitHub</a>`;
            if (!data.telegram && !data.github) profileContacts.innerHTML = '<span class="text-secondary">No contacts added</span>';

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

// =========================================
// 4. ВЫХОД (LOGOUT) И ЖЕСТКИЙ СБРОС СЕССИИ
// =========================================
logoutBtn.addEventListener('click', () => {
    clearAuthSession();
    showLandingView();
    showToast('Logged out successfully.', 'success');
});

function clearAuthSession() {
    localStorage.removeItem('token'); // Удаляем токен из памяти
    currentUsername = ''; // Стираем имя
    openAuthBtn.textContent = 'Login'; // Возвращаем кнопку в исходное состояние
}

// ЖЕСТКИЙ СБРОС: При любом обновлении страницы (F5) мы стираем старые сессии
window.addEventListener('DOMContentLoaded', () => {
    clearAuthSession(); // Заставляем логиниться заново каждый раз!
    
    if (window.location.pathname !== '/') {
        window.history.replaceState({}, '', '/');
    }
    showLandingView(false);
});

window.addEventListener('popstate', (e) => {
    if (window.location.pathname === '/') {
        showLandingView(false);
    } else if (currentUsername) {
        showProfileView(false);
    } else {
        showLandingView(false);
    }
});

// =========================================
// 5. ОБРЕЗКА ФОТО И СОХРАНЕНИЕ ПРОФИЛЯ
// =========================================
const editProfileModal = document.getElementById('edit-profile-modal');
const openEditProfileBtn = document.getElementById('open-edit-profile-btn');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const editProfileForm = document.getElementById('edit-profile-form');

const photoInput = document.getElementById('edit-photo');
const cropContainer = document.getElementById('crop-container');
const cropImage = document.getElementById('crop-image');
let cropper = null;

openEditProfileBtn.addEventListener('click', () => editProfileModal.classList.add('show'));
closeEditModalBtn.addEventListener('click', () => editProfileModal.classList.remove('show'));
window.addEventListener('click', (e) => { if (e.target === editProfileModal) editProfileModal.classList.remove('show'); });

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('File is too large! Maximum size is 2MB.', 'error');
        photoInput.value = ''; 
        cropContainer.style.display = 'none';
        return;
    }

    const url = URL.createObjectURL(file);
    cropImage.src = url;
    cropContainer.style.display = 'block';

    if (cropper) cropper.destroy();

    cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        background: false,
    });
});

function getCroppedBlob(cropperInstance) {
    return new Promise((resolve) => {
        cropperInstance.getCroppedCanvas({ width: 400, height: 400 }).toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.9);
    });
}

editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const btn = editProfileForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';

    const formData = new FormData();
    
    if (cropper) {
        const croppedBlob = await getCroppedBlob(cropper);
        formData.append('photo', croppedBlob, 'avatar.jpg');
    }
    
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
            if (cropper) { cropper.destroy(); cropper = null; }
            cropContainer.style.display = 'none';
            photoInput.value = '';
            
            editProfileModal.classList.remove('show');
            await loadUserData(); 
        } else {
            showToast('Failed to save profile', 'error');
        }
    } catch (error) { 
        showToast('Server error', 'error'); 
    } finally { 
        btn.textContent = originalText; 
    }
});