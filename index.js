const { Telegraf } = require('telegraf');

const bot = new Telegraf('6228082361:AAHphN_mLTRP7qG-Wi3GCbMyqKWL9Ew00rk');

// Обработка команды /start
bot.start((ctx) => ctx.reply('Добро пожаловать! Отправьте сообщение, чтобы отправить предложку.'));

// Обработчик команды /getchatid
bot.command('getchatid', (ctx) => {
    const chatId = ctx.message.chat.id;
    ctx.reply(`Ваш chat ID: ${chatId}`);
  });

// Обработка сообщений
bot.on('message', (ctx) => {
  const message = ctx.message.text;

  // Отправка сообщения модератору
  bot.telegram.sendMessage('498989662', `Получено предложение: ${message}`);

  // Ответ пользователю
  ctx.reply('Спасибо за предложку! Мы ее рассмотрим.');
});

// Запуск бота
bot.launch();
