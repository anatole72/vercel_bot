const mainKeyboard = () => ({
  reply_markup: {
    inline_keyboard: [
      [{ text: "📚 Каталог", callback_data: "catalog" }],
      [{ text: "🔍 Поиск", callback_data: "search" }],
      [{ text: "💰 Донаты", callback_data: "donate" }],
      [{ text: "ℹ️ О боте", callback_data: "about" }],
    ],
  },
});

const booksKeyboard = (books) => ({
  reply_markup: {
    inline_keyboard: [
      ...books.slice(0, 5).map((b) => [
        { text: `📖 ${b.title.slice(0, 30)}`, callback_data: `book_${b.id}` },
      ]),
      [{ text: "◀️ Назад", callback_data: "main_menu" }],
    ],
  },
});

const bookDetailKeyboard = (book) => ({
  reply_markup: {
    inline_keyboard: [
      ...book.translations.map((t) => [{ text: t.lang, url: t.url }]),
      [{ text: "🌐 Оригинал", url: book.original_link }],
      [{ text: "◀️ Назад", callback_data: "catalog" }],
    ],
  },
});

const donateKeyboard = () => ({
  reply_markup: {
    inline_keyboard: [
      [{ text: "₿ BTC", callback_data: "crypto_btc" }],
      [{ text: "Ξ ETH", callback_data: "crypto_eth" }],
      [{ text: "💵 USDT", callback_data: "crypto_usdt" }],
      [{ text: "💎 TON", callback_data: "crypto_ton" }],
      [{ text: "🔗 Donate Link", url: "https://donate.ton.org" }],
      [{ text: "◀️ Назад", callback_data: "main_menu" }],
    ],
  },
});

const backToCatalogKeyboard = () => ({
  reply_markup: {
    inline_keyboard: [[{ text: "◀️ Назад к каталогу", callback_data: "catalog" }]],
  },
});

module.exports = {
  mainKeyboard,
  booksKeyboard,
  bookDetailKeyboard,
  donateKeyboard,
  backToCatalogKeyboard,
};
