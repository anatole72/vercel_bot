const tgRequest = async (method, token, body) => {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok && !json.description?.includes("not modified")) {
      console.error(`Telegram API error [${method}]:`, json.description);
    }
    return json;
  } catch (e) {
    console.error(`Telegram fetch error [${method}]:`, e);
  }
};

const sendMessage = (chatId, text, token, options = {}) =>
  tgRequest("sendMessage", token, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...options,
  });

const editMessage = (chatId, messageId, text, token, options = {}) =>
  tgRequest("editMessageText", token, {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "Markdown",
    ...options,
  });

const answerCallback = (callbackId, token, text = "") =>
  tgRequest("answerCallbackQuery", token, {
    callback_query_id: callbackId,
    text,
  });

module.exports = { sendMessage, editMessage, answerCallback };
