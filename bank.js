const express = require('express');
const app = express();
const port = 3000; // Порт, на котором будет работать сервер

const apiBot = '54603598:AAHXZH88Z7Ac4h8jeRG0u9FQWQvC7UV'; // API ключ бота (указан пример)
const sendTo = 122831500; // ID пользователя в боте (указан пример)


app.get('/wh', (req, res) => {
    try {

        const receivedValue = `Tinkoff bank: ${extractTextBeforeBalance(req.query.bigtext)}`;

        console.log(receivedValue);

        SendMessageToTelegram(receivedValue, sendTo);

    } catch (error) {
        console.log(error);
    }
});



app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

//Функция чтобы отправить сообщение в телеграм Бот
async function SendMessageToTelegram(data, id) {
    const url = `https://api.telegram.org/bot${apiBot}/sendMessage?chat_id=${id}&text=${data}`;

    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Ошибка при запросе данных:', error);
        });
}

// Используем регулярное выражение для поиска текста до слова "Баланс" или "Доступно", чтобы менеджеру не показывать общий баланс счета
function extractTextBeforeBalance(inputText) {
    const regex = /([\s\S]*?)(Баланс|Доступно)/i;
    const match = inputText.match(regex);

    if (match && match[1]) {
        return match[1].trim();
    } else {
        return "Текст до слова 'Баланс' или 'Доступно' не найден.";
    }
}