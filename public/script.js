// =========================================
// 1. БАЗОВАЯ ЛОГИКА И УВЕДОМЛЕНИЯ
// =========================================

const PRESETS = {
    meals: [
        // Proteins
        { name: "Chicken Breast", kcalPer100g: 165 },
        { name: "Salmon", kcalPer100g: 208 },
        { name: "Lean Beef", kcalPer100g: 250 },
        { name: "Egg", kcalPer100g: 155 },
        { name: "Cottage Cheese 5%", kcalPer100g: 98 },
        { name: "Whey Protein", kcalPer100g: 370 },
        // Carbs
        { name: "Oatmeal (dry)", kcalPer100g: 370 },
        { name: "White Rice (cooked)", kcalPer100g: 130 },
        { name: "Brown Rice (cooked)", kcalPer100g: 111 },
        { name: "Sweet Potato", kcalPer100g: 86 },
        { name: "Banana", kcalPer100g: 89 },
        // Fats & Others
        { name: "Almonds", kcalPer100g: 579 },
        { name: "Peanut Butter", kcalPer100g: 588 },
        { name: "Greek Yogurt", kcalPer100g: 60 }
    ],
    workouts: [
        // Push
        { title: "Bench Press", notes: "4 sets x 8-10 reps" },
        { title: "Overhead Press", notes: "3 sets x 10 reps" },
        { title: "Tricep Pushdowns", notes: "3 sets x 12-15 reps" },
        // Pull
        { title: "Pull-ups", notes: "3 sets to failure" },
        { title: "Barbell Rows", notes: "4 sets x 8 reps" },
        { title: "Bicep Curls", notes: "3 sets x 12 reps" },
        // Legs
        { title: "Barbell Squat", notes: "4 sets x 8 reps" },
        { title: "Deadlift", notes: "3 sets x 5 reps" },
        { title: "Leg Press", notes: "3 sets x 12 reps" },
        // Cardio
        { title: "Running", notes: "30 min steady pace" },
        { title: "Cycling", notes: "45 min moderate intensity" }
    ]
};
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
            showToast('Message sent to support!', 'success');
            form.reset();
        } else showToast('An error occurred.', 'error');
    } catch (error) { showToast('Server is unavailable.', 'error'); } 
    finally { btn.textContent = originalBtnText; }
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

// Элементы профиля
const profileUsername = document.getElementById('profile-username');
const avatarLetter = document.getElementById('avatar-letter');
const profilePhoto = document.getElementById('profile-photo');
const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
const profileLocation = document.getElementById('profile-location');
const profileBioText = document.getElementById('edit-bio');
const profileSkills = document.getElementById('profile-skills');
const profileContacts = document.getElementById('profile-contacts');
const logoutBtn = document.getElementById('logout-btn');

// Новые элементы: Тренировки и Питание
const workoutList = document.getElementById('workout-list');
const addWorkoutForm = document.getElementById('add-workout-form');
const mealList = document.getElementById('meal-list');
const addMealForm = document.getElementById('add-meal-form');
const totalCaloriesDisplay = document.getElementById('total-calories-display');

let currentUsername = '';

if (addMealForm) {
    addMealForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Берем имя продукта и УЖЕ ПОСЧИТАННЫЕ калории из нашей функции
        const itemName = document.getElementById('meal-name').value;
        const calories = window.calculateKcal(); 
        
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ itemName, calories })
            });
            const data = await response.json();
            
            if (data.success) {
                // Очищаем форму после успешного добавления
                document.getElementById('meal-name').value = '';
                document.getElementById('meal-weight').value = '';
                document.getElementById('meal-preset').value = '';
                document.getElementById('calculated-kcal').textContent = '0 kcal';
                
                await loadUserData(); // Перезагружаем интерфейс
            } else {
                showToast('Failed to add meal', 'error');
            }
        } catch (error) { 
            showToast('Server error', 'error'); 
        }
    });
}

function showLandingView(updateHistory = true) {
    profilePage.style.display = 'none';
    landingPage.style.display = 'block';
    if (updateHistory) window.history.pushState({ view: 'home' }, '', '/');
}

function showProfileView(updateHistory = true) {
    if (!currentUsername) return; 
    landingPage.style.display = 'none';
    profilePage.style.display = 'block';
    if (updateHistory) window.history.pushState({ view: 'profile' }, '', '/' + currentUsername);
}

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

openAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUsername) showProfileView(); 
    else modal.classList.add('show'); 
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        showToast('Password must be 8+ chars, include uppercase, lowercase & number.', 'error');
        return; 
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
        } else showToast(data.message, 'error'); 
    } catch (error) { showToast('Server error', 'error'); }
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
        } else showToast(data.message, 'error'); 
    } catch (error) { showToast('Server error', 'error'); }
});

// ЗАГРУЗКА И РЕНДЕР ДАННЫХ ДАШБОРДА
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
            openAuthBtn.textContent = 'Dashboard';

            if (data.photo && data.photo.trim() !== '') {
                profilePhoto.src = data.photo;
                profilePhoto.style.display = 'block';
                profileAvatarFallback.style.display = 'none';
            } else {
                profilePhoto.style.display = 'none';
                profileAvatarFallback.style.display = 'flex';
                document.getElementById('avatar-letter').textContent = data.username.charAt(0).toUpperCase();
            }

            profileLocation.textContent = data.location ? `🌍 ${data.location}` : '🌍 Location not set';
            
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
            } else profileSkills.innerHTML = '<span class="text-secondary">No goals added</span>';

            profileContacts.innerHTML = '';
            if (data.telegram) profileContacts.innerHTML += `<a href="https://t.me/${data.telegram.replace('@', '')}" target="_blank">✈️ Telegram</a>`;
            if (data.github) profileContacts.innerHTML += `<a href="${data.github}" target="_blank">🔗 Social Link</a>`;
            if (!data.telegram && !data.github) profileContacts.innerHTML = '<span class="text-secondary">No contacts added</span>';

            // Рендер Тренировок
            workoutList.innerHTML = '';
            data.workouts.forEach(w => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="item-info">
                        <span class="item-title">${w.title}</span>
                        ${w.notes ? `<span class="item-notes">${w.notes}</span>` : ''}
                    </div>
                    <button class="btn-del" onclick="deleteItem('workouts', ${w.id})">✕</button>
                `;
                workoutList.appendChild(li);
            });

            // Рендер Питания и Подсчет Калорий
            mealList.innerHTML = '';
            let totalCals = 0;
            data.meals.forEach(m => {
                totalCals += m.calories;
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="item-info">
                        <span class="item-title">${m.itemName}</span>
                    </div>
                    <span class="item-badge ${m.calories === 0 ? 'badge-green' : ''}">
                        ${m.calories > 0 ? '+' + m.calories + ' kcal' : 'Supplement'}
                    </span>
                    <button class="btn-del" onclick="deleteItem('meals', ${m.id})">✕</button>
                    </div>
                `;
                mealList.appendChild(li);
            });
            
            // Анимация изменения счетчика
            totalCaloriesDisplay.textContent = totalCals;

            return true;
        } else {
            clearAuthSession();
            return false;
        }
    } catch (error) { return false; }
}

// ДОБАВЛЕНИЕ ТРЕНИРОВКИ
addWorkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('workout-title').value;
    const notes = document.getElementById('workout-notes').value;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, notes })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('workout-title').value = '';
            document.getElementById('workout-notes').value = '';
            await loadUserData();
        } else showToast('Failed to add workout', 'error'); 
    } catch (error) { showToast('Server error', 'error'); }
});

// ДОБАВЛЕНИЕ ЕДЫ / ДОБАВОК
addMealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemName = document.getElementById('meal-name').value;
    const calories = document.getElementById('meal-calories').value;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ itemName, calories })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('meal-name').value = '';
            document.getElementById('meal-calories').value = '';
            await loadUserData();
        } else showToast('Failed to add log', 'error'); 
    } catch (error) { showToast('Server error', 'error'); }
});

// =========================================
// 4. ВЫХОД И ЖЕСТКИЙ СБРОС СЕССИИ
// =========================================
logoutBtn.addEventListener('click', () => {
    clearAuthSession();
    showLandingView();
    showToast('Logged out successfully.', 'success');
});

function clearAuthSession() {
    localStorage.removeItem('token'); 
    currentUsername = ''; 
    openAuthBtn.textContent = 'Login'; 
}

window.addEventListener('DOMContentLoaded', () => {
    clearAuthSession();
    initPresets();
    if (window.location.pathname !== '/') window.history.replaceState({}, '', '/');
    showLandingView(false);
});

window.addEventListener('popstate', (e) => {
    if (window.location.pathname === '/') showLandingView(false);
    else if (currentUsername) showProfileView(false);
    else showLandingView(false);
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
        photoInput.value = ''; cropContainer.style.display = 'none'; return;
    }
    const url = URL.createObjectURL(file);
    cropImage.src = url;
    cropContainer.style.display = 'block';

    if (cropper) cropper.destroy();
    cropper = new Cropper(cropImage, { aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false });
});

function getCroppedBlob(cropperInstance) {
    return new Promise((resolve) => {
        cropperInstance.getCroppedCanvas({ width: 400, height: 400 }).toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
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
            method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
        });
        const data = await response.json();
        if (data.success) {
            showToast('Profile updated!', 'success');
            if (cropper) { cropper.destroy(); cropper = null; }
            cropContainer.style.display = 'none'; photoInput.value = '';
            editProfileModal.classList.remove('show');
            await loadUserData(); 
        } else showToast('Failed to save profile', 'error');
    } catch (error) { showToast('Server error', 'error'); } 
    finally { btn.textContent = originalText; }
});

async function deleteItem(type, id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/${type}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
            await loadUserData(); // Перезагружаем список
        } else showToast('Delete failed', 'error');
    } catch (error) { showToast('Server error', 'error'); }
}

function fillMealPreset() {
    const select = document.getElementById('meal-preset');
    const index = select.value;
    if (index === "") return;
    
    const meal = PRESETS.meals[index];
    document.getElementById('meal-name').value = meal.name;
    document.getElementById('meal-weight').value = 100; // Ставим 100г по умолчанию
    calculateKcal(); // Автоматически пересчитываем калории
}

function fillWorkoutPreset() {
    const select = document.getElementById('workout-preset');
    const index = select.value;
    if (index === "") return;

    const workout = PRESETS.workouts[index];
    document.getElementById('workout-title').value = workout.title; // ID твоего инпута
    document.getElementById('workout-notes').value = workout.notes; // ID твоего инпута
}

function initPresets() {
    const mealSelect = document.getElementById('meal-preset');
    const workoutSelect = document.getElementById('workout-preset');

    PRESETS.meals.forEach((m, index) => {
        mealSelect.innerHTML += `<option value="${index}">${m.name} (${m.kcalPer100g} kcal/100g)</option>`;
    });

    PRESETS.workouts.forEach((w, index) => {
        workoutSelect.innerHTML += `<option value="${index}">${w.title}</option>`;
    });
}

// =========================================
// ЛОГИКА КАЛЬКУЛЯТОРА И ПРЕСЕТОВ
// =========================================

// 1. Автозаполнение еды при выборе из списка
window.fillMealPreset = function() {
    const select = document.getElementById('meal-preset');
    const index = select.value;
    if (index === "") return;
    
    const meal = PRESETS.meals[index];
    document.getElementById('meal-name').value = meal.name;
    document.getElementById('meal-weight').value = 100; // Ставим 100г по умолчанию
    window.calculateKcal(); // Автоматически считаем
};

// 2. Расчет калорий "на лету" при вводе граммов
window.calculateKcal = function() {
    const weight = document.getElementById('meal-weight').value;
    const select = document.getElementById('meal-preset');
    const display = document.getElementById('calculated-kcal');
    
    // Если поле пустое, сбрасываем
    if (!weight || weight <= 0) {
        display.textContent = "0 kcal";
        return 0;
    }

    // Если продукт выбран из базы
    if (select.value !== "") {
        const meal = PRESETS.meals[select.value];
        const result = Math.round((meal.kcalPer100g / 100) * weight);
        display.textContent = result + " kcal";
        return result; 
    } else {
        // Если продукта нет в базе, пользователь может просто написать "Яблоко" 
        // и ввести 150 в поле граммов, мы посчитаем это как 150 ккал.
        display.textContent = weight + " kcal";
        return Number(weight);
    }
};

// 3. Автозаполнение тренировок
window.fillWorkoutPreset = function() {
    const select = document.getElementById('workout-preset');
    const index = select.value;
    if (index === "") return;

    const workout = PRESETS.workouts[index];
    document.getElementById('workout-title').value = workout.title;
    document.getElementById('workout-notes').value = workout.notes;
};