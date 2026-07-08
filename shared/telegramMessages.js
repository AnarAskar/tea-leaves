import { fmt } from "./formatters.js";

// Escape every reserved MarkdownV2 character so customer free-text (notes,
// comments, item names, etc.) can never produce an invalid message that
// Telegram rejects with HTTP 400 (which would make orders fail silently).
const MDV2_SPECIAL = /[_*[\]()~`>#+\-=|{}.!\\]/g;
const esc = (v) => String(v ?? "").replace(MDV2_SPECIAL, "\\$&");

function timeStamp() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Baghdad",
  });
}

function starRating(n) {
  return "⭐".repeat(n) + "☆".repeat(5 - n);
}

export function buildTelegramMessage(type, payload) {
  switch (type) {
    case "order": {
      const { tableNum, cartItems, cart, cartAddons, note, totalIQD } = payload;
      const lines = cartItems
        .map((item) => {
          const addon = cartAddons?.[item.id];
          const unitPrice = item.price + (addon?.price || 0);
          const addonLabel = addon ? ` \\(${esc(addon.name_en)}\\)` : "";
          return `• ${esc(item.name.en)}${addonLabel} × ${esc(cart[item.id])} — ${esc(fmt(unitPrice * cart[item.id]))} IQD`;
        })
        .join("\n");
      const noteLine = note?.trim() ? `\n📝 Note: ${esc(note.trim())}` : "";
      return `🍵 *New Order — Table ${esc(tableNum)}*

${lines}${noteLine}

✅ *Total: ${esc(fmt(totalIQD))} IQD*
🕐 ${esc(timeStamp())}`;
    }
    case "bill":
      return `💳 *Bill Requested — Table ${esc(payload.tableNum)}*
🕐 ${esc(timeStamp())}`;
    case "note":
      return `📝 *Note — Table ${esc(payload.tableNum)}*

${esc(payload.note)}

🕐 ${esc(timeStamp())}`;
    case "feedback": {
      const { tableNum, stars, contact, comments } = payload;
      const contactLine = contact ? `\n📞 Contact: ${esc(contact)}` : "";
      const commentsLine = comments ? `\n💬 Comments: ${esc(comments)}` : "";
      return `⭐ *Feedback — Table ${esc(tableNum)}*

Staff: ${starRating(stars.staff)}
Service: ${starRating(stars.service)}
Hygiene: ${starRating(stars.hygiene)}${contactLine}${commentsLine}

🕐 ${esc(timeStamp())}`;
    }
    default:
      throw new Error("Invalid message type");
  }
}
