// =========================================
// 1. ПРЕСЕТЫ И ДАТЫ
// =========================================
const PRESETS = {
    meals: [
        // --- 🥩 PROTEIN (Мясо, Птица, Рыба, Яйца) ---
        { name: "Chicken Breast (raw)", kcalPer100g: 110 },
        { name: "Chicken Breast (cooked)", kcalPer100g: 165 },
        { name: "Chicken Thigh (boneless)", kcalPer100g: 209 },
        { name: "Chicken Teriyaki", kcalPer100g: 175 },
        { name: "Turkey Breast", kcalPer100g: 135 },
        { name: "Lean Beef (5% fat)", kcalPer100g: 137 },
        { name: "Beef Steak (Ribeye)", kcalPer100g: 291 },
        { name: "Pork Loin", kcalPer100g: 242 },
        { name: "Salmon (raw)", kcalPer100g: 208 },
        { name: "Tuna (canned in water)", kcalPer100g: 86 },
        { name: "Shrimp (cooked)", kcalPer100g: 99 },
        { name: "White Fish (Cod/Tilapia)", kcalPer100g: 85 },
        { name: "Whole Egg", kcalPer100g: 155 },
        { name: "Egg White", kcalPer100g: 52 },
        { name: "Tofu (firm)", kcalPer100g: 144 },

        // --- 🍚 CARBS (Крупы, Макароны, Хлеб) ---
        { name: "White Rice (dry)", kcalPer100g: 360 },
        { name: "White Rice (cooked)", kcalPer100g: 130 },
        { name: "Brown Rice (cooked)", kcalPer100g: 112 },
        { name: "Oatmeal (dry)", kcalPer100g: 379 },
        { name: "Buckwheat (cooked)", kcalPer100g: 92 },
        { name: "Pasta/Macaroni (dry)", kcalPer100g: 350 },
        { name: "Pasta (cooked)", kcalPer100g: 131 },
        { name: "Samyang Buldak Spicy Noodles", kcalPer100g: 400 },
        { name: "Potato (boiled)", kcalPer100g: 87 },
        { name: "Sweet Potato (baked)", kcalPer100g: 90 },
        { name: "White Bread", kcalPer100g: 265 },
        { name: "Whole Wheat Bread", kcalPer100g: 247 },
        { name: "Rice Cakes", kcalPer100g: 387 },

        // --- 🥛 DAIRY & FATS (Молочка, Сыры, Орехи, Масла) ---
        { name: "Milk 3.2%", kcalPer100g: 61 },
        { name: "Milk 1.5%", kcalPer100g: 44 },
        { name: "Cottage Cheese 5%", kcalPer100g: 98 },
        { name: "Cottage Cheese 0%", kcalPer100g: 72 },
        { name: "Greek Yogurt 2%", kcalPer100g: 73 },
        { name: "Cheddar Cheese", kcalPer100g: 402 },
        { name: "Mozzarella", kcalPer100g: 280 },
        { name: "Almonds", kcalPer100g: 579 },
        { name: "Walnuts", kcalPer100g: 654 },
        { name: "Peanut Butter", kcalPer100g: 588 },
        { name: "Olive Oil", kcalPer100g: 884 },
        { name: "Butter", kcalPer100g: 717 },
        { name: "Avocado", kcalPer100g: 160 },

        // --- 🍏 FRUITS & VEGGIES (Овощи и Фрукты) ---
        { name: "Banana", kcalPer100g: 89 },
        { name: "Apple", kcalPer100g: 52 },
        { name: "Orange", kcalPer100g: 47 },
        { name: "Strawberries", kcalPer100g: 32 },
        { name: "Blueberries", kcalPer100g: 57 },
        { name: "Broccoli", kcalPer100g: 34 },
        { name: "Spinach", kcalPer100g: 23 },
        { name: "Tomato", kcalPer100g: 18 },
        { name: "Cucumber", kcalPer100g: 15 },
        { name: "Bell Pepper", kcalPer100g: 20 },

        // --- 🍔 SNACKS & CHEAT MEALS ---
        { name: "Dark Chocolate 70%", kcalPer100g: 598 },
        { name: "Milk Chocolate", kcalPer100g: 535 },
        { name: "Potato Chips", kcalPer100g: 536 },
        { name: "Pizza (Average Margherita)", kcalPer100g: 266 },
        { name: "Burger (Fast Food)", kcalPer100g: 295 },
        { name: "Ice Cream", kcalPer100g: 207 },

        // --- 💊 SUPPLEMENTS (Добавки) ---
        { name: "Whey Protein Isolate", kcalPer100g: 360 },
        { name: "Whey Protein Concentrate", kcalPer100g: 400 },
        { name: "Mass Gainer", kcalPer100g: 380 },
        { name: "Creatine Monohydrate", kcalPer100g: 0 },
        { name: "Pre-Workout", kcalPer100g: 0 },
        { name: "BCAA / EAA", kcalPer100g: 0 },
        { name: "Ashwagandha", kcalPer100g: 0 },
        { name: "Magnesium", kcalPer100g: 0 },
        { name: "Omega-3 (Fish Oil)", kcalPer100g: 900 }
    ],
    
    workouts: [
        // --- CHEST (Грудь) ---
        { title: "Barbell Bench Press", notes: "4 sets x 8-10 reps" },
        { title: "Incline Barbell Press", notes: "3 sets x 8-12 reps" },
        { title: "Dumbbell Bench Press", notes: "3 sets x 8-12 reps" },
        { title: "Incline Dumbbell Press", notes: "3 sets x 10-12 reps" },
        { title: "Decline Bench Press", notes: "3 sets x 8-10 reps" },
        { title: "Chest Flyes (Machine/Cable)", notes: "3 sets x 12-15 reps" },
        { title: "Cable Crossovers", notes: "4 sets x 12-15 reps" },
        { title: "Push-ups", notes: "3 sets to failure" },
        { title: "Dips (Chest Focus)", notes: "3 sets x 8-12 reps" },

        // --- BACK (Спина) ---
        { title: "Pull-ups", notes: "3 sets to failure" },
        { title: "Chin-ups", notes: "3 sets to failure" },
        { title: "Lat Pulldown (Wide Grip)", notes: "4 sets x 10-12 reps" },
        { title: "Lat Pulldown (Close Grip)", notes: "3 sets x 10-12 reps" },
        { title: "Barbell Row", notes: "4 sets x 8-10 reps" },
        { title: "Dumbbell Row (One Arm)", notes: "3 sets x 10-12 reps" },
        { title: "Seated Cable Row", notes: "3 sets x 10-12 reps" },
        { title: "T-Bar Row", notes: "3 sets x 8-12 reps" },
        { title: "Deadlift", notes: "1 warm-up, 3 working sets x 5 reps" },
        { title: "Rack Pulls", notes: "3 sets x 6-8 reps" },

        // --- SHOULDERS (Плечи) ---
        { title: "Overhead Press (OHP)", notes: "4 sets x 6-8 reps" },
        { title: "Arnold Press", notes: "3 sets x 10-12 reps" },
        { title: "Seated Dumbbell Press", notes: "3 sets x 8-12 reps" },
        { title: "Lateral Raises (Dumbbell)", notes: "4 sets x 15 reps" },
        { title: "Lateral Raises (Cable)", notes: "3 sets x 15 reps" },
        { title: "Front Raises", notes: "3 sets x 12 reps" },
        { title: "Face Pulls", notes: "4 sets x 15-20 reps" },
        { title: "Reverse Pec Deck (Rear Delts)", notes: "3 sets x 15 reps" },
        { title: "Shrugs (Barbell/Dumbbell)", notes: "3 sets x 12-15 reps" },

        // --- ARMS (Руки) ---
        { title: "Barbell Bicep Curl", notes: "3 sets x 10-12 reps" },
        { title: "Dumbbell Alternate Curl", notes: "3 sets x 10-12 reps" },
        { title: "Hammer Curls", notes: "3 sets x 12 reps" },
        { title: "Preacher Curls", notes: "3 sets x 10-12 reps" },
        { title: "Tricep Pushdown (Rope)", notes: "4 sets x 12-15 reps" },
        { title: "Tricep Pushdown (Straight Bar)", notes: "3 sets x 10-12 reps" },
        { title: "Skullcrushers (EZ-Bar)", notes: "3 sets x 10-12 reps" },
        { title: "Overhead Tricep Extension", notes: "3 sets x 12 reps" },
        { title: "Close-grip Bench Press", notes: "3 sets x 8-10 reps" },

        // --- LEGS (Ноги) ---
        { title: "Barbell Squat", notes: "4 sets x 6-8 reps" },
        { title: "Front Squat", notes: "3 sets x 8-10 reps" },
        { title: "Leg Press", notes: "4 sets x 10-12 reps" },
        { title: "Romanian Deadlift (RDL)", notes: "3 sets x 8-12 reps" },
        { title: "Walking Lunges", notes: "3 sets x 12 steps per leg" },
        { title: "Bulgarian Split Squats", notes: "3 sets x 10 reps per leg" },
        { title: "Leg Extensions", notes: "3 sets x 15 reps" },
        { title: "Lying Leg Curls", notes: "3 sets x 12-15 reps" },
        { title: "Seated Leg Curls", notes: "3 sets x 12-15 reps" },
        { title: "Standing Calf Raises", notes: "4 sets x 15-20 reps" },
        { title: "Seated Calf Raises", notes: "3 sets x 15-20 reps" },

        // --- CORE & CARDIO (Пресс и Кардио) ---
        { title: "Crunches", notes: "3 sets x 20 reps" },
        { title: "Hanging Leg Raises", notes: "3 sets x 12-15 reps" },
        { title: "Plank", notes: "3 sets x 60 seconds" },
        { title: "Russian Twists", notes: "3 sets x 20 reps" },
        { title: "Ab Wheel Rollout", notes: "3 sets x 10-12 reps" },
        { title: "Treadmill Running", notes: "30 min, moderate pace" },
        { title: "Stairmaster", notes: "20 min, high intensity" },
        { title: "Cycling (Stationary)", notes: "45 min, steady state" },
        { title: "Jump Rope", notes: "15 min interval" }
    ]
};

// Обновление отображения текущей даты на UI
function updateDateDisplay() {
    const today = getLocalISOString(new Date());
    const displayTitle = document.getElementById('current-date-display');
    const displaySubtitle = document.getElementById('current-date-subtitle');
    
    if (displayTitle && displaySubtitle) {
        if (window.currentAppDate === today) {
            displayTitle.textContent = "Today";
        } else {
            const d = new Date(window.currentAppDate);
            displayTitle.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        }
        displaySubtitle.textContent = window.currentAppDate;
    }
}

// =========================================
// 2. ДВИЖОК АНИМАЦИЙ (SCROLL REVEAL & PAGE SWAP)
// =========================================

// Scroll Observer (Анимации при скролле - появление элементов)
const setupScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => observer.observe(el));
};

// Функция плавного переключения экранов (в стиле iOS)
async function switchView(hideEl, showEl, callback) {
    if(!hideEl || !showEl) return;
    
    // Шаг 1: Анимируем исчезновение текущего экрана
    hideEl.classList.add('view-hidden');
    
    // Ждем окончания CSS транзишена (примерно 600ms)
    setTimeout(() => {
        hideEl.style.display = 'none';
        showEl.style.display = 'block';
        
        // Подготавливаем новый экран к появлению
        showEl.classList.add('view-hidden');
        
        // Форсируем перерисовку браузера для корректного запуска анимации
        void showEl.offsetWidth;
        
        // Шаг 2: Анимируем появление нового экрана
        showEl.classList.remove('view-hidden');
        
        if (callback) setTimeout(callback, 700);
    }, 600); 
}

const landingPage = document.getElementById('landing-page');
const profilePage = document.getElementById('profile-page');
const authBtn = document.getElementById('open-auth');

// Отображение главной страницы (лендинга)
function showLandingView(instant = false) {
    if (instant) {
        if(profilePage) profilePage.style.display = 'none';
        if(landingPage){
            landingPage.style.display = 'block';
            landingPage.classList.remove('view-hidden');
        }
    } else {
        if (profilePage && profilePage.style.display !== 'none') {
            switchView(profilePage, landingPage);
        }
    }
    
    if (authBtn) {
        authBtn.textContent = localStorage.getItem('token') ? 'Dashboard' : 'Sign In';
    }
    
    // Скрываем кнопку "Start Your Journey", если пользователь уже авторизован
  const landingCtaBtn = document.getElementById('landing-cta-btn');
if (landingCtaBtn) {
    landingCtaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) modal.classList.add('show');    
        const tabRegister = document.getElementById('tab-register');
        if (tabRegister) tabRegister.click();
    });
}
}
// Отображение профиля (дашборда)
function showProfileView() {
    if (!currentUsername) return;
    
    if (landingPage && landingPage.style.display !== 'none') {
        switchView(landingPage, profilePage, () => {
            updateDateDisplay();
        });
    } else {
        updateDateDisplay();
    }
    
    if (authBtn) authBtn.textContent = 'Dashboard';
}

// Навигация из шапки: логин или переход в профиль
document.getElementById('open-auth')?.addEventListener('click', (e) => { 
    e.preventDefault(); 
    if (localStorage.getItem('token')) {
        if (profilePage && profilePage.style.display === 'none') showProfileView(); 
    } else {
        if(modal) modal.classList.add('show'); 
    }
});

// Возврат на главную при клике на логотип
document.getElementById('logo-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (landingPage && landingPage.style.display === 'none') {
        showLandingView();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Навигация по якорям на главной странице
document.querySelectorAll('.nav-home-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            
            if (landingPage && landingPage.style.display === 'none') {
                // Если мы в профиле, плавно переходим на лендинг, затем скроллим
                switchView(profilePage, landingPage, () => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                });
            } else {
                // Если уже на лендинге, просто скроллим
                const targetElement = document.querySelector(targetId);
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});


// =========================================
// 3. БАЗОВЫЕ ФУНКЦИИ И УВЕДОМЛЕНИЯ
// =========================================
const toast = document.getElementById('toast');

// Показ всплывающих уведомлений (toast)
function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

let currentUsername = '';
const modal = document.getElementById('auth-modal');

// =========================================
// 4. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
// =========================================
// =========================================
// 4. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
// =========================================
async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        clearAuthSession();
        return false;
    }

    try {
        const response = await fetch(`/api/user-data?date=${window.currentAppDate}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            currentUsername = data.username;
            
            // --- 1. БАЗОВЫЕ ДАННЫЕ ПРОФИЛЯ (ИМЯ, ЛОКАЦИЯ, РОСТ, ВЕС) ---
            const profileUsernameEl = document.getElementById('profile-username');
            const profileLocationEl = document.getElementById('profile-location');
            
            if (profileUsernameEl) profileUsernameEl.textContent = data.username;
            if (profileLocationEl) {
                profileLocationEl.innerHTML = data.location ? `🌍 ${data.location}` : '🌍 Location not set';
                
                // Красиво выводим вес и рост под локацией
                const statsText = [];
                if (data.weight) statsText.push(`${data.weight} kg`);
                if (data.height) statsText.push(`${data.height} cm`);
                if (statsText.length > 0) {
                    profileLocationEl.innerHTML += `<br><span style="color:var(--ios-cyan); font-size:0.85rem; display:inline-block; margin-top:8px; font-weight:600;">${statsText.join(' • ')}</span>`;
                }
            }

            // --- 2. ВЫВОД BIO-DATA В БЛОК "FOCUS OBJECTIVES" ---
            const skillsEl = document.getElementById('profile-skills');
            if (skillsEl) {
                skillsEl.innerHTML = data.bio 
                    ? `<p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${data.bio}</p>` 
                    : `<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">No bio-data defined.</p>`;
            }

            // --- 3. ВЫВОД TELEGRAM И GITHUB В БЛОК "INTEGRATIONS" ---
            const contactsEl = document.getElementById('profile-contacts');
            if (contactsEl) {
                contactsEl.innerHTML = ''; // Очищаем старые данные
                if (data.telegram) {
                    const cleanTg = data.telegram.replace('@', ''); // Убираем @ если юзер ввел с ним
                    contactsEl.innerHTML += `<a href="https://t.me/${cleanTg}" target="_blank" style="display:flex; align-items:center; gap:8px; margin-bottom:10px;"><span style="font-size:1.2rem">✈️</span> @${cleanTg}</a>`;
                }
                if (data.github) {
                    contactsEl.innerHTML += `<a href="${data.github}" target="_blank" style="display:flex; align-items:center; gap:8px; margin-bottom:10px;"><span style="font-size:1.2rem">🔗</span> External Node</a>`;
                }
                if (!data.telegram && !data.github) {
                    contactsEl.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">No integrations linked.</span>`;
                }
            }

            // --- 4. РЕНДЕР АВАТАРА ---
            const profilePhoto = document.getElementById('profile-photo');
            const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
            if (profilePhoto && profileAvatarFallback) {
                if (data.photo) {
                    profilePhoto.src = data.photo;
                    profilePhoto.style.display = 'block';
                    profileAvatarFallback.style.display = 'none';
                } else {
                    profilePhoto.style.display = 'none';
                    profileAvatarFallback.style.display = 'flex';
                    const avatarLetter = document.getElementById('avatar-letter');
                    if(avatarLetter) avatarLetter.textContent = data.username.charAt(0).toUpperCase();
                }
            }

            // --- 5. ЗАПОЛНЕНИЕ ФОРМЫ РЕДАКТИРОВАНИЯ ---
            // Сохраняем введенные данные в инпутах, чтобы они не пропадали при открытии окна
            const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; }
            setVal('edit-weight', data.weight || '');
            setVal('edit-height', data.height || '');
            setVal('edit-calorie-goal', data.calorieGoal || 2500);
            setVal('edit-location', data.location || '');
            setVal('edit-telegram', data.telegram || '');
            setVal('edit-github', data.github || '');
            setVal('edit-bio', data.bio || '');

            // --- 6. ТРЕНИРОВКИ ---
            const workoutList = document.getElementById('workout-list');
            if(workoutList){
                workoutList.innerHTML = '';
                (data.workouts || []).forEach(w => {
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
            }

            // --- 7. ПИТАНИЕ И РАСЧЕТ КАЛОРИЙ ---
            const mealList = document.getElementById('meal-list');
            let totalCals = 0;
            if(mealList){
                mealList.innerHTML = '';
                (data.meals || []).forEach(m => {
                    totalCals += m.calories;
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="item-info">
                            <span class="item-title">${m.itemName}</span>
                        </div>
                        <div class="item-actions">
                            <span class="item-badge ${m.calories === 0 ? 'badge-green' : ''}">${m.calories > 0 ? '+' + m.calories + ' kcal' : 'Supplement'}</span>
                            <button class="btn-del" onclick="deleteItem('meals', ${m.id})">✕</button>
                        </div>
                    `;
                    mealList.appendChild(li);
                });
            } else {
                 (data.meals || []).forEach(m => totalCals += m.calories);
            }

            // --- 8. ПРОГРЕСС-БАР КАЛОРИЙ (ИСПРАВЛЕННОЕ ЖЕСТКОЕ ПРИСВОЕНИЕ) ---
            // Жестко приводим цель к числу, чтобы избежать багов строки
            const DAILY_GOAL = Number(data.calorieGoal) || 2500; 
            
            const display = document.getElementById('total-calories-display');
            const displayGoal = document.getElementById('daily-goal-display');
            const progressBar = document.getElementById('calorie-progress');

            if (display) display.textContent = totalCals;
            if (displayGoal) displayGoal.textContent = DAILY_GOAL;

            if (progressBar) {
                setTimeout(() => {
                    let percentage = (totalCals / DAILY_GOAL) * 100;
                    progressBar.style.width = (percentage > 100 ? 100 : percentage) + '%';
                    
                    if(display){
                        const headerBox = display.parentElement;
                        if (totalCals > DAILY_GOAL) {
                            progressBar.classList.add('over-limit');
                            headerBox.style.color = 'var(--ios-red)';
                            headerBox.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                            headerBox.style.background = 'rgba(239, 68, 68, 0.1)';
                        } else {
                            progressBar.classList.remove('over-limit');
                            headerBox.style.color = 'var(--ios-cyan)';
                            headerBox.style.borderColor = 'rgba(14, 165, 233, 0.2)';
                            headerBox.style.background = 'rgba(14, 165, 233, 0.1)';
                        }
                    }
                }, 100);
            }

            return true;
        } else {
            clearAuthSession();
            return false;
        }
    } catch (error) { 
        console.error("Error loading user data:", error);
        return false; 
    }
}

// Очистка сессии и выход
function clearAuthSession() {
    localStorage.removeItem('token');
    currentUsername = '';
    showLandingView();
}

// =========================================
// 5. УДАЛЕНИЕ И ДОБАВЛЕНИЕ ЭЛЕМЕНТОВ
// =========================================
window.deleteItem = async function(type, id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/${type}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
            await loadUserData();
        } else showToast('Deletion Interrupted', 'error');
    } catch (error) { showToast('Server Link Failed', 'error'); }
};

// Обработка формы тренировок
const addWorkoutForm = document.getElementById('add-workout-form');
if (addWorkoutForm) {
    addWorkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleEl = document.getElementById('workout-title');
        const notesEl = document.getElementById('workout-notes');
        const title = titleEl ? titleEl.value : '';
        const notes = notesEl ? notesEl.value : '';
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, notes, date: window.currentAppDate })
            });
            const data = await response.json();
            if (data.success) {
                if(titleEl) titleEl.value = '';
                if(notesEl) notesEl.value = '';
                await loadUserData();
            }
        } catch (error) { showToast('Server Link Failed', 'error'); }
    });
}

// Обработка формы питания
const addMealForm = document.getElementById('add-meal-form');
if (addMealForm) {
    addMealForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemNameEl = document.getElementById('meal-name');
        const itemName = itemNameEl ? itemNameEl.value : '';
        const calories = window.calculateKcal(); 
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ itemName, calories, date: window.currentAppDate })
            });
            const data = await response.json();
            if (data.success) {
                if(itemNameEl) itemNameEl.value = '';
                const weightEl = document.getElementById('meal-weight');
                const presetEl = document.getElementById('meal-preset');
                const calcKcalEl = document.getElementById('calculated-kcal');
                
                if(weightEl) weightEl.value = '';
                if(presetEl) presetEl.value = '';
                if(calcKcalEl) calcKcalEl.textContent = '0 kcal';
                await loadUserData();
            }
        } catch (error) { showToast('Server Link Failed', 'error'); }
    });
}

// =========================================
// 6. КАЛЬКУЛЯТОР КАЛОРИЙ И ПРЕСЕТЫ
// =========================================

// Заполнение данных питания из пресета
window.fillMealPreset = function() {
    const select = document.getElementById('meal-preset');
    if(!select) return;
    const index = select.value;
    if (index === "") return;
    
    const meal = PRESETS.meals[index];
    const nameEl = document.getElementById('meal-name');
    const weightEl = document.getElementById('meal-weight');
    
    if(nameEl) nameEl.value = meal.name;
    if(weightEl) weightEl.value = 100;
    
    window.calculateKcal();
};

// Расчет калорий на основе веса и пресета
window.calculateKcal = function() {
    const weightEl = document.getElementById('meal-weight');
    const selectEl = document.getElementById('meal-preset');
    const displayEl = document.getElementById('calculated-kcal');
    
    if(!weightEl || !displayEl) return 0;
    
    const weight = weightEl.value;
    const select = selectEl ? selectEl.value : "";
    
    if (!weight || weight <= 0) {
        displayEl.textContent = "0 kcal";
        return 0;
    }

    if (select !== "") {
        const meal = PRESETS.meals[select];
        const result = Math.round((meal.kcalPer100g / 100) * weight);
        displayEl.textContent = result + " kcal";
        return result; 
    } else {
        displayEl.textContent = weight + " kcal";
        return Number(weight);
    }
};

// Заполнение тренировки из пресета
window.fillWorkoutPreset = function() {
    const select = document.getElementById('workout-preset');
    if(!select) return;
    const index = select.value;
    if (index === "") return;

    const workout = PRESETS.workouts[index];
    const titleEl = document.getElementById('workout-title');
    const notesEl = document.getElementById('workout-notes');
    
    if(titleEl) titleEl.value = workout.title;
    if(notesEl) notesEl.value = workout.notes;
};

// Инициализация пресетов в селектах
function initPresets() {
    const mealSelect = document.getElementById('meal-preset');
    const workoutSelect = document.getElementById('workout-preset');
    if (mealSelect) {
        mealSelect.innerHTML = '<option value="">-- Access Nutrition Database --</option>';
        PRESETS.meals.forEach((m, index) => {
            mealSelect.innerHTML += `<option value="${index}">${m.name} (${m.kcalPer100g} kcal/100g)</option>`;
        });
    }
    if (workoutSelect) {
        workoutSelect.innerHTML = '<option value="">-- Access Exercise Database --</option>';
        PRESETS.workouts.forEach((w, index) => {
            workoutSelect.innerHTML += `<option value="${index}">${w.title}</option>`;
        });
    }
}

// =========================================
// 7. ОБНОВЛЕНИЕ ПРОФИЛЯ (CROPPER & UPDATE)
// =========================================
let cropper;
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileForm = document.getElementById('edit-profile-form');
const editPhotoInput = document.getElementById('edit-photo');
const cropImage = document.getElementById('crop-image');
const cropContainer = document.getElementById('crop-container');

document.getElementById('open-edit-profile-btn')?.addEventListener('click', () => {
    if(editProfileModal) editProfileModal.classList.add('show');
});

document.getElementById('close-edit-modal')?.addEventListener('click', () => {
    if(editProfileModal) editProfileModal.classList.remove('show');
});

if(editPhotoInput && cropImage && cropContainer){
    editPhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            cropImage.src = event.target.result;
            cropContainer.style.display = 'block';
            if (cropper) cropper.destroy();
            cropper = new Cropper(cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                background: false
            });
        };
        reader.readAsDataURL(file);
    });
}

function getCroppedBlob(cropperInstance) {
    return new Promise((resolve) => {
        cropperInstance.getCroppedCanvas({
            width: 400, height: 400
        }).toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
}

if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const btn = editProfileForm.querySelector('button');
        let originalText = 'Save';
        if(btn){
            originalText = btn.textContent;
            btn.textContent = 'Syncing...';
        }
        
        const formData = new FormData();
        if (cropper) {
            const croppedBlob = await getCroppedBlob(cropper);
            formData.append('photo', croppedBlob, 'avatar.jpg');
        }
        
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ''; }
        
        formData.append('location', getVal('edit-location'));
        formData.append('bio', getVal('edit-bio'));
        formData.append('telegram', getVal('edit-telegram'));
        formData.append('github', getVal('edit-github'));
        formData.append('weight', getVal('edit-weight'));
        formData.append('height', getVal('edit-height'));
        formData.append('calorieGoal', getVal('edit-calorie-goal'));

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                showToast('Configuration Synced', 'success');
                if(editProfileModal) editProfileModal.classList.remove('show');
                await loadUserData(); 
            } else showToast('Sync Failed', 'error');
        } catch (error) { showToast('Server Link Error', 'error'); } 
        finally { if(btn) btn.textContent = originalText; }
    });
}

// =========================================
// 8. СТАРТ ПРИЛОЖЕНИЯ И АВТОРИЗАЦИЯ
// =========================================

// Обработка формы поддержки (Contact Form)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        
        const btn = contactForm.querySelector('button');
        let originalText = 'Send';
        if (btn) {
            originalText = btn.textContent;
            btn.textContent = 'Sending...';
        }

        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const message = document.getElementById('message')?.value || '';

        try {
            // Пытаемся отправить запрос на наш бэкенд
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            if (data.success) {
                showToast('Request sent to Core Team!', 'success');
                contactForm.reset(); // Очищаем форму
            } else {
                showToast('Failed to send request', 'error');
            }
        } catch (error) {
            // Если серверный роут еще не настроен, показываем успех для UX
            showToast('Request sent! (UI mode)', 'success');
            contactForm.reset();
        } finally {
            if (btn) btn.textContent = originalText;
        }
    });
}

// Логаут с анимацией
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    currentUsername = '';
    showLandingView(false); // Запускаем красивую анимацию выхода на главную
});

document.getElementById('close-modal')?.addEventListener('click', () => { 
    if(modal) modal.classList.remove('show'); 
});

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if(tabLogin && tabRegister && loginForm && registerForm){
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        loginForm.classList.add('active-form'); registerForm.classList.remove('active-form');
    });
    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        registerForm.classList.add('active-form'); loginForm.classList.remove('active-form');
    });
}

// Отправка формы логина
if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userEl = document.getElementById('login-username');
        const passEl = document.getElementById('login-password');
        const username = userEl ? userEl.value : '';
        const password = passEl ? passEl.value : '';
        
        const btn = loginForm.querySelector('button');
        let originalText = 'Login';
        if(btn){
            originalText = btn.textContent;
            btn.textContent = 'Decrypting...';
        }
        try {
            const res = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                if(modal) modal.classList.remove('show');
                const success = await loadUserData();
                if (success) showProfileView();
            } else showToast(data.message || 'Access Denied', 'error');
        } catch (error) { showToast('Server Link Failed', 'error'); }
        finally { if(btn) btn.textContent = originalText; }
    });
}

// Отправка формы регистрации
if(registerForm){
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userEl = document.getElementById('reg-username');
        const passEl = document.getElementById('reg-password');
        const username = userEl ? userEl.value : '';
        const password = passEl ? passEl.value : '';
        
        const btn = registerForm.querySelector('button');
        let originalText = 'Register';
        if(btn){
            originalText = btn.textContent;
            btn.textContent = 'Initializing...';
        }
        try {
            const res = await fetch('/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            const data = await res.json();
            if (data.success) {
                showToast('Node Created. Please Authenticate.', 'success');
                if(tabLogin) tabLogin.click();
            } else showToast(data.message || 'Initialization Failed', 'error');
        } catch (error) { showToast('Server Link Failed', 'error'); }
        finally { if(btn) btn.textContent = originalText; }
    });
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
    initPresets();
    setupScrollAnimations(); // Запускаем слушатель скролла
    
    // Изначально прячем обе страницы до выяснения статуса
    if(landingPage) landingPage.style.display = 'none';
    if(profilePage) profilePage.style.display = 'none';
    
    const token = localStorage.getItem('token');
    if (token) {
        const success = await loadUserData();
        if (success) {
            showProfileView(true); // Показывать дашборд мгновенно
        } else {
            showLandingView(true);
        }
    } else {
        showLandingView(true);
    }
    const landingCtaBtn = document.getElementById('landing-cta-btn');
    if (landingCtaBtn && localStorage.getItem('token')) {
        landingCtaBtn.style.display = 'none';
    }
    // Функция обработки ответа от Google
window.handleCredentialResponse = async function(response) {
    try {
        // Отправляем полученный токен на наш бэкенд
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential })
        });

        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token); // Сохраняем JWT
            const modal = document.getElementById('auth-modal');
            if (modal) modal.classList.remove('show'); // Закрываем модалку
            
            showToast('Authenticated via Google Node', 'success');
            
            // Глобальная функция загрузки данных юзера и переключения на дашборд
            await loadUserData();
            showProfileView();
        } else {
            showToast(data.message || 'Google Auth Failed', 'error');
        }
    } catch (error) {
        showToast('Server Link Failed', 'error');
    }
};

// Инициализация кнопки Google (вызывать при загрузке страницы)
function initGoogleAuth() {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "311190288090-7cqes2gcihvfr6bsrkpe7mp7kggu3ntf.apps.googleusercontent.com", // Замени на свой ID
            callback: window.handleCredentialResponse
        });
        
        // Рендерим кнопку в красивом стеклянном/темном стиле под дизайн iOS
        google.accounts.id.renderButton(
            document.getElementById("googleButton"),
            { theme: "outline", size: "large", type: "standard", shape: "pill", text: "signin_with" }
        );
    }
}
initGoogleAuth()
});