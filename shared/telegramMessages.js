import { fmt } from "./formatters.js";

function timeStamp() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function starRating(n) {
  return "⭐".repeat(n) + "☆".repeat(5 - n);
}

export function buildTelegramMessage(type, payload) {
  switch (type) {
    case "order": {
      const { tableNum, cartItems, cart, note, totalIQD } = payload;
      const lines = cartItems
        .map(
          (item) =>
            `• ${item.name.en} × ${cart[item.id]} — ${fmt(item.price * cart[item.id])} IQD`,
        )
        .join("\n");
      const noteLine = note?.trim() ? `\n📝 Note: ${note.trim()}` : "";
      return `🍵 *New Order — Table ${tableNum}*

${lines}${noteLine}

✅ *Total: ${fmt(totalIQD)} IQD*
🕐 ${timeStamp()}`;
    }
    case "bill":
      return `💳 *Bill Requested — Table ${payload.tableNum}*
🕐 ${timeStamp()}`;
    case "note":
      return `📝 *Note — Table ${payload.tableNum}*

${payload.note}

🕐 ${timeStamp()}`;
    case "feedback": {
      const { tableNum, stars, contact, comments } = payload;
      const contactLine = contact ? `\n📞 Contact: ${contact}` : "";
      const commentsLine = comments ? `\n💬 Comments: ${comments}` : "";
      return `⭐ *Feedback — Table ${tableNum}*

Staff: ${starRating(stars.staff)}
Service: ${starRating(stars.service)}
Hygiene: ${starRating(stars.hygiene)}${contactLine}${commentsLine}

🕐 ${timeStamp()}`;
    }
    default:
      throw new Error("Invalid message type");
  }
}
