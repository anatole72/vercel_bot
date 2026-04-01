# Telegram Book Bot — Vercel

## Структура проекта

```
/
├── api/
│   └── webhook.js        ← serverless функция (точка входа)
├── lib/
│   ├── books.js          ← данные книг
│   ├── keyboards.js      ← клавиатуры
│   └── telegram.js       ← Telegram API helpers
├── scripts/
│   └── set-webhook.js    ← регистрация webhook (запускается один раз)
├── package.json
└── vercel.json
```

---

## Деплой на Vercel

### 1. Установить Vercel CLI

```bash
npm i -g vercel
```

### 2. Залогиниться

```bash
vercel login
```

### 3. Задеплоить проект

```bash
cd vercel-bot
vercel --prod
```

Vercel спросит несколько вопросов при первом деплое — отвечай по умолчанию (Enter).

### 4. Прописать переменные окружения

В Vercel Dashboard → Settings → Environment Variables добавить:

| Переменная      | Значение                   |
|-----------------|----------------------------|
| `BOT_TOKEN`     | токен от @BotFather        |
| `BOT_NAME`      | название бота (опционально)|
| `BOT_VERSION`   | версия бота (опционально)  |
| `BTC_WALLET`    | адрес BTC кошелька         |
| `ETH_WALLET`    | адрес ETH кошелька         |
| `USDT_WALLET`   | адрес USDT кошелька        |
| `TON_WALLET`    | адрес TON кошелька         |

Или через CLI:

```bash
vercel env add BOT_TOKEN
vercel env add BTC_WALLET
# и т.д.
```

После добавления переменных — передеплой:

```bash
vercel --prod
```

### 5. Зарегистрировать webhook в Telegram

```bash
BOT_TOKEN=ваш_токен VERCEL_URL=https://your-project.vercel.app node scripts/set-webhook.js
```

Либо вручную — открыть в браузере:

```
https://api.telegram.org/botВАШ_ТОКЕН/setWebhook?url=https://your-project.vercel.app/api/webhook
```

---

## Проверка

- `GET https://your-project.vercel.app/` — health check, должен вернуть статус бота
- Написать боту `/start` — должно ответить меню

## Отличия от Cloudflare Workers

| Cloudflare Workers          | Vercel Serverless           |
|-----------------------------|-----------------------------|
| `export default { fetch() }`| `module.exports = async (req, res)` |
| `env.BOT_TOKEN`             | `process.env.BOT_TOKEN`     |
| `ctx.waitUntil(...)`        | ответ `res.send()` до await |
| Нет `require()`             | CommonJS `require()` работает|
| Глобальный `fetch`          | Глобальный `fetch` (Node 18+)|
