import { handleTelegramApi } from "./telegram-handler.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await handleTelegramApi(req.body);
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    const status =
      err.status || (message.startsWith("Invalid") ? 400 : 500);
    return res.status(status).json({ error: message });
  }
}
