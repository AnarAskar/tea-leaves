import { handleTelegramApi } from "../../api/telegram-handler.js";

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await context.request.json();
    const result = await handleTelegramApi(body);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    const status =
      err.status || (message.startsWith("Invalid") ? 400 : 500);
    return Response.json({ error: message }, { status });
  }
}
