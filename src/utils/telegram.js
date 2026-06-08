async function postTelegram(type, payload) {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  });
  if (!res.ok) throw new Error("Telegram error");
}

export async function sendTelegramOrder(params) {
  await postTelegram("order", params);
}

export async function sendTelegramBill(tableNum) {
  await postTelegram("bill", { tableNum });
}

export async function sendTelegramNote(tableNum, note) {
  await postTelegram("note", { tableNum, note });
}

export async function sendTelegramFeedback(tableNum, stars, contact, comments) {
  await postTelegram("feedback", { tableNum, stars, contact, comments });
}
