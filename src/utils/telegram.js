import { BOT_TOKEN, CHAT_ID } from "../constants/config";
import { fmt } from "./formatters";

export async function sendTelegramOrder({
  tableNum,
  cartItems,
  cart,
  note,
  grand,
  tax,
  totalIQD,
  lang,
}) {
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const lines = cartItems
    .map(
      (item) =>
        `• ${item.name.en} × ${cart[item.id]} — ${fmt(item.price * cart[item.id])} IQD`,
    )
    .join("\n");

  const noteLine = note.trim() ? `\n📝 Note: ${note.trim()}` : "";
  const message = `🍵 *New Order — Table ${tableNum}*

${lines}${noteLine}

💰 Subtotal: ${fmt(totalIQD)} IQD
🧾 Service: ${fmt(tax)} IQD
✅ *Total: ${fmt(grand)} IQD*
🕐 ${time}`;

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    },
  );
  if (!res.ok) throw new Error("Telegram error");
}

export async function sendTelegramBill(tableNum) {
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        parse_mode: "Markdown",
        text: `💳 *Bill Requested — Table ${tableNum}*
🕐 ${time}`,
      }),
    },
  );
  if (!res.ok) throw new Error("Telegram error");
}

export async function sendTelegramNote(tableNum, note) {
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        parse_mode: "Markdown",
        text: `📝 *Note — Table ${tableNum}*

${note}

🕐 ${time}`,
      }),
    },
  );
  if (!res.ok) throw new Error("Telegram error");
}

export async function sendTelegramFeedback(tableNum, stars, contact, comments) {
  const star = (n) => "⭐".repeat(n) + "☆".repeat(5 - n);
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const contactLine = contact
    ? `
📞 Contact: ${contact}`
    : "";
  const commentsLine = comments
    ? `
💬 Comments: ${comments}`
    : "";
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        parse_mode: "Markdown",
        text: `⭐ *Feedback — Table ${tableNum}*

Staff: ${star(stars.staff)}
Service: ${star(stars.service)}
Hygiene: ${star(stars.hygiene)}${contactLine}${commentsLine}

🕐 ${time}`,
      }),
    },
  );
  if (!res.ok) throw new Error("Telegram error");
}
