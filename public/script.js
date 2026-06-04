// Находим форму на странице
// Находим форму на странице
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const btn = form.querySelector('button');
    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending...'; // Перевели текст ожидания

    try {
        const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (result.success) {
            alert('Success! Your message has been sent.'); // Перевели успех
            form.reset();
        } else {
            alert('An error occurred while sending.'); // Перевели ошибку
        }
    } catch (error) {
        console.error(error);
        alert('Server is unavailable. Please try again later.'); // Перевели ошибку сервера
    } finally {
        btn.textContent = originalBtnText;
    }
});