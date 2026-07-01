import { handleTranslateApi } from "../../api/translate-handler.js";

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await context.request.json();
    const result = await handleTranslateApi(body);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    const status =
      err.status || (message.startsWith("Invalid") ? 400 : 500);
    return Response.json({ error: message }, { status });
  }
}
