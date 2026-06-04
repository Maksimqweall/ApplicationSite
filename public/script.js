// Находим форму на странице
// Находим форму на странице
// Находим форму на странице
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

// Функция для показа красивого уведомления
function showToast(message, type = 'success') {
    toast.textContent = message;
    // Сбрасываем старые классы и вешаем новые
    toast.className = `toast show ${type}`;

    // Прячем уведомление через 3.5 секунды
    setTimeout(() => {
        toast.className = 'toast'; // Убираем 'show', плашка уезжает вниз
    }, 3500);
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
            showToast('Success! Your message has been sent.', 'success'); // Красивый успех
            form.reset();
        } else {
            showToast('An error occurred while sending.', 'error'); // Красивая ошибка
        }
    } catch (error) {
        console.error(error);
        showToast('Server is unavailable. Please try again later.', 'error'); // Ошибка сервера
    } finally {
        btn.textContent = originalBtnText;
    }
});