export async function sendTelegramMessage(text, { botToken, chatId }) {
  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    },
  );
  if (!res.ok) {
    throw new Error("Telegram error");
  }
}
