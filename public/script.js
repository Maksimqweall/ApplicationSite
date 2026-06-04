// Находим форму на странице
const form = document.getElementById('contact-form');

// Вешаем прослушиватель события "отправка"
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Отменяем стандартную перезагрузку страницы при нажатии кнопки

    // Собираем данные из полей
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Меняем текст кнопки на время отправки
    const btn = form.querySelector('button');
    const originalBtnText = btn.textContent;
    btn.textContent = 'Отправка...';

    try {
        // Отправляем данные на наш Node.js бэкенд
      const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (result.success) {
            alert('Ура! Сообщение успешно отправлено!');
            form.reset(); // Очищаем поля формы
        } else {
            alert('Произошла ошибка при отправке.');
        }
    } catch (error) {
        console.error(error);
        alert('Сервер недоступен. Проверьте, запущен ли Node.js');
    } finally {
        btn.textContent = originalBtnText; // Возвращаем исходный текст кнопке
    }
});