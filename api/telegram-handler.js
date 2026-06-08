import { buildTelegramMessage } from "../shared/telegramMessages.js";
import { sendTelegramMessage } from "../shared/sendTelegram.js";

const VALID_TYPES = new Set(["order", "bill", "note", "feedback"]);
const MAX_TABLE = 99;

function getTelegramConfig() {
  const botToken = process.env.BOT_TOKEN || process.env.VITE_BOT_TOKEN;
  const chatId = process.env.CHAT_ID || process.env.VITE_CHAT_ID;
  if (!botToken || !chatId) {
    throw new Error("Missing Telegram configuration");
  }
  return { botToken, chatId };
}

function validatePayload(type, payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload");
  }

  const tableNum = Number(payload.tableNum);
  if (!Number.isInteger(tableNum) || tableNum < 1 || tableNum > MAX_TABLE) {
    throw new Error("Invalid table number");
  }

  if (type === "order") {
    if (!Array.isArray(payload.cartItems) || !payload.cartItems.length) {
      throw new Error("Invalid order");
    }
    if (typeof payload.cart !== "object" || payload.cart === null) {
      throw new Error("Invalid order");
    }
    for (const [key, qty] of Object.entries(payload.cart)) {
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        throw new Error("Invalid order quantity");
      }
    }
  }

  if (type === "note") {
    const note = String(payload.note || "").trim();
    if (!note || note.length > 500) {
      throw new Error("Invalid note");
    }
  }

  if (type === "feedback") {
    const { stars } = payload;
    if (!stars || typeof stars !== "object") {
      throw new Error("Invalid feedback");
    }
    for (const key of ["staff", "service", "hygiene"]) {
      const value = Number(stars[key]);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error("Invalid feedback rating");
      }
    }
    if (payload.contact && String(payload.contact).length > 100) {
      throw new Error("Invalid contact");
    }
    if (payload.comments && String(payload.comments).length > 1000) {
      throw new Error("Invalid comments");
    }
  }
}

export async function handleTelegramApi(body) {
  const { type, payload } = body ?? {};
  if (!VALID_TYPES.has(type)) {
    throw new Error("Invalid message type");
  }

  validatePayload(type, payload);

  const text = buildTelegramMessage(type, payload);
  const config = getTelegramConfig();
  await sendTelegramMessage(text, config);
  return { ok: true };
}
