const { BOOKS } = require("../lib/books");
const { mainKeyboard, booksKeyboard, bookDetailKeyboard, donateKeyboard, backToCatalogKeyboard } = require("../lib/keyboards");
const { sendMessage, editMessage, answerCallback } = require("../lib/telegram");

const getWallet = (crypto) =>
  ({
    btc: process.env.BTC_WALLET,
    eth: process.env.ETH_WALLET,
    usdt: process.env.USDT_WALLET,
    ton: process.env.TON_WALLET,
  }[crypto.toLowerCase()] || "Not configured");

const formatBook = (b) =>
  `📖 *${b.title}*\n\n✍️ ${b.author}\n📂 ${b.category}\n📝 ${b.description}\n\n🏷️ ${b.tags.join(", ")}\n\nВыберите перевод:`;

async function handleMessage(chatId, name, text, token) {
  if (text === "/start") {
    return sendMessage(
      chatId,
      `👋 Привет, ${name}!\n\n📚 Здесь ты найдёшь книги с переводами.\n💰 Можно поддержать крипто-донатом!\n\nВыбери действие:`,
      token,
      mainKeyboard()
    );
  }
  if (text === "/catalog") {
    return sendMessage(
      chatId,
      `📚 *Каталог* (${BOOKS.length} книг):\n\nВыберите книгу:`,
      token,
      booksKeyboard(BOOKS)
    );
  }
  if (text === "/donate") {
    return sendMessage(chatId, `💰 *Поддержать проект*\n\nВыберите валюту:`, token, donateKeyboard());
  }
  if (text === "/help") {
    return sendMessage(
      chatId,
      `📖 *Команды:*\n\n/start — Главное меню\n/catalog — Каталог книг\n/donate — Крипто-донаты\n/help — Помощь\n\n🔍 Или просто напишите название книги для поиска.`,
      token
    );
  }
  if (!text.startsWith("/") && text.trim().length > 2) {
    const q = text.toLowerCase().trim();
    const results = BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (!results.length) {
      return sendMessage(
        chatId,
        `❌ По запросу *"${text}"* ничего не найдено.\n\nПопробуйте другой запрос.`,
        token,
        mainKeyboard()
      );
    }
    return sendMessage(
      chatId,
      `🔍 Найдено ${results.length} ${results.length === 1 ? "книга" : "книг"} по запросу *"${text}"*:`,
      token,
      booksKeyboard(results)
    );
  }
  return sendMessage(
    chatId,
    `🤔 Не понял команду.\n\nИспользуйте /help для списка команд или напишите название книги для поиска.`,
    token,
    mainKeyboard()
  );
}

async function handleCallback(chatId, messageId, data, token) {
  if (data === "main_menu") {
    return editMessage(chatId, messageId, `📋 *Главное меню:*`, token, mainKeyboard());
  }
  if (data === "catalog") {
    return editMessage(
      chatId,
      messageId,
      `📚 *Каталог* (${BOOKS.length} книг):\n\nВыберите книгу:`,
      token,
      booksKeyboard(BOOKS)
    );
  }
  if (data.startsWith("book_")) {
    const bookId = parseInt(data.split("_")[1]);
    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) {
      return editMessage(chatId, messageId, "❌ Книга не найдена.", token, backToCatalogKeyboard());
    }
    return editMessage(chatId, messageId, formatBook(book), token, bookDetailKeyboard(book));
  }
  if (data === "donate") {
    return editMessage(chatId, messageId, `💰 *Поддержать проект*\n\nВыберите валюту:`, token, donateKeyboard());
  }
  if (data.startsWith("crypto_")) {
    const currency = data.split("_")[1].toUpperCase();
    const wallet = getWallet(data.split("_")[1]);
    return editMessage(
      chatId,
      messageId,
      `💰 *${currency} кошелёк:*\n\n\`${wallet}\`\n\n📋 Нажмите на адрес чтобы скопировать.`,
      token,
      donateKeyboard()
    );
  }
  if (data === "about") {
    return editMessage(
      chatId,
      messageId,
      `ℹ️ *О боте*\n\n${process.env.BOT_NAME || "BookBot"} v${process.env.BOT_VERSION || "1.0"}\n\n📚 Каталог книг с переводами\n💰 Поддержка через крипту\n\n❤️ Работает на Vercel`,
      token,
      mainKeyboard()
    );
  }
  if (data === "search") {
    return editMessage(
      chatId,
      messageId,
      `🔍 *Поиск по каталогу*\n\nНапишите название книги, автора или тег — я найду совпадения.`,
      token,
      { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "main_menu" }]] } }
    );
  }
}

// Vercel serverless handler
module.exports = async (req, res) => {
  // GET — health check
  if (req.method === "GET") {
    return res.status(200).send(
      `🤖 ${process.env.BOT_NAME || "Bot"} v${process.env.BOT_VERSION || "1.0"}\n✅ Running on Vercel`
    );
  }

  // Only POST accepted for webhook
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.error("BOT_TOKEN is not set");
    return res.status(500).send("Configuration error");
  }

  // Respond to Telegram immediately — required to avoid retries
  res.status(200).send("OK");

  try {
    const update = req.body;

    if (update.message) {
      const {
        chat: { id: chatId },
        from: { first_name: name = "Friend" },
        text,
      } = update.message;
      if (text) await handleMessage(chatId, name, text, token);
    } else if (update.callback_query) {
      const {
        id: callbackId,
        message: {
          chat: { id: chatId },
          message_id: messageId,
        },
        data,
      } = update.callback_query;
      await answerCallback(callbackId, token);
      await handleCallback(chatId, messageId, data, token);
    }
  } catch (e) {
    console.error("Webhook error:", e);
  }
};
