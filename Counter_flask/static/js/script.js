// Знаходимо на сторінці елемент з id="counter-value" (там, де показане число)
const counterValueEl = document.getElementById('counter-value');
// Знаходимо кнопку "+1"
const incrementBtn = document.getElementById('increment-btn');
// Знаходимо кнопку "Скинути"
const resetBtn = document.getElementById('reset-btn');
// Знаходимо елемент для тимчасових повідомлень (наприклад "Оновлено ✓")
const statusEl = document.getElementById('status');

// Функція показує текст статусу, а через 1.5 секунди сама його прибирає
function setStatus(text) {
    // Записуємо переданий текст у наш елемент statusEl
    statusEl.textContent = text;
    // setTimeout відкладає виконання коду на вказаний час (1500 мс = 1.5 сек)
    setTimeout(() => { statusEl.textContent = ''; }, 1500);
}

// Функція додає коротку анімацію "пульсації" до числа
function pulse() {
    // Додаємо CSS-клас "pulse", який збільшує елемент (див. style.css)
    counterValueEl.classList.add('pulse');
    // Через 150 мс прибираємо клас, щоб анімація повернулась у початковий стан
    setTimeout(() => counterValueEl.classList.remove('pulse'), 150);
}

// async - позначає функцію, всередині якої можна "чекати" (await) відповідь сервера
async function loadCounter() {
    // fetch надсилає запит на наш Python-сервер за адресою /api/counter
    // await - чекаємо, поки прийде відповідь, не блокуючи сторінку
    const response = await fetch('/api/counter');
    // Перетворюємо "сиру" відповідь сервера у зручний JavaScript-об'єкт (JSON)
    const data = await response.json();
    // Вставляємо отримане значення у текст елемента на сторінці
    counterValueEl.textContent = data.value;
}

// Функція, яка викликається при натисканні кнопки "+1"
async function incrementCounter() {
    // Надсилаємо POST-запит на сервер - "будь ласка, збільш лічильник"
    const response = await fetch('/api/counter/increment', { method: 'POST' });
    // Чекаємо та отримуємо оновлені дані у форматі JSON
    const data = await response.json();
    // Оновлюємо число на сторінці новим значенням із відповіді сервера
    counterValueEl.textContent = data.value;
    // Викликаємо анімацію пульсації для наочності
    pulse();
    // Показуємо коротке повідомлення користувачу
    setStatus('Оновлено на сервері ✓');
}

// Функція, яка викликається при натисканні кнопки "Скинути"
async function resetCounter() {
    // Надсилаємо POST-запит - "будь ласка, скинь лічильник до нуля"
    const response = await fetch('/api/counter/reset', { method: 'POST' });
    // Отримуємо оновлені (скинуті) дані
    const data = await response.json();
    // Показуємо нове (нульове) значення на сторінці
    counterValueEl.textContent = data.value;
    // Анімація для наочності
    pulse();
    // Повідомлення користувачу про успішне скидання
    setStatus('Скинуто ✓');
}

// "Слухаємо" клік по кнопці "+1" і викликаємо функцію incrementCounter
incrementBtn.addEventListener('click', incrementCounter);
// "Слухаємо" клік по кнопці "Скинути" і викликаємо функцію resetCounter
resetBtn.addEventListener('click', resetCounter);

// Коли вся HTML-сторінка повністю завантажилась - завантажуємо поточне значення лічильника
document.addEventListener('DOMContentLoaded', loadCounter);
