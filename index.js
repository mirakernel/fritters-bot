const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const MODERATOR_CHAT_ID = process.env.MODERATOR_CHAT_ID;

const limitConfig = {
    window: 5000, // Время, в течение которого происходит ограничение (в миллисекундах)
    limit: 1, // Максимальное количество сообщений за время window
    keyGenerator: (ctx) => ctx.from.id, // Генератор ключей для ограничения по пользователю
    onLimitExceeded: (ctx, next) => ctx.reply('Пожалуйста, подождите 5 секунд, прежде чем отправлять новое сообщение.'), // Сообщение, отправляемое при превышении лимита
  };
  
  const limitMiddleware = rateLimit(limitConfig);
  bot.use(limitMiddleware);

// Обработка команды /start
bot.start((ctx) => ctx.reply('Добро пожаловать! Отправьте сообщение, чтобы отправить предложку.'));

// Обработчик команды /getchatid
bot.command('getchatid', (ctx) => {
    const chatId = ctx.message.chat.id;
    ctx.reply(`Ваш chat ID: ${chatId}`);
  });

// Обработка сообщений
bot.on('photo', (ctx) => {
    const photo = ctx.message.photo[0].file_id;
    const user = ctx.message.from.username;
    const caption = ctx.message.caption || '';
  
    // Отправляем сообщение модератору
    ctx.telegram.sendPhoto(MODERATOR_CHAT_ID, photo, {
        caption: `\n${caption}\n\nПредложил(а) - @${user}\nПредложить пост - @AranaraFrittersBot`,
    });
  
    // Обрабатываем фото
    // ...
  // Ответ пользователю
  ctx.reply('Спасибо за предложку! Мы ее рассмотрим.');
  });
  
  bot.on('video', (ctx) => {
    const video = ctx.message.video.file_id;
    const user = ctx.message.from.username;
    const caption = ctx.message.caption || '';
  
    // Отправляем сообщение модератору
    ctx.telegram.sendVideo(MODERATOR_CHAT_ID, video, {
        caption: `\n${caption}\n\nПредложил(а) - @${user}\nПредложить пост - @AranaraFrittersBot`,
    });
  
  // Ответ пользователю
  ctx.reply('Спасибо за предложку! Мы ее рассмотрим.');
  });
  
  bot.on('text', (ctx) => {
    const text = ctx.message.text;
    const user = ctx.message.from.username;
  
    // Отправляем сообщение модератору
    const message = `${text}\n\nПредложил(а) - @${user}\nПредложить пост - @AranaraFrittersBot`;
    ctx.telegram.sendMessage(MODERATOR_CHAT_ID, message);
  
    // Ответ пользователю
    ctx.reply('Спасибо за предложку! Мы ее рассмотрим.');
  });

// Запуск бота
bot.launch();
