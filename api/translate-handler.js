// Auto-translation for the admin panel. Calls the Google Gemini API (free tier)
// to translate a menu title/description between English, Arabic and Central
// Kurdish (Sorani). The API key is server-side only (GEMINI_API_KEY).

const VALID_LANGS = new Set(["en", "ar", "ku"]);
const LANG_NAMES = {
  en: "English",
  ar: "Arabic",
  ku: "Central Kurdish (Sorani, written in the Arabic-based Kurdish script)",
};
const MAX_LEN = 2000;

function getConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing translation configuration");
  }
  const model = process.env.TRANSLATE_MODEL || "gemini-2.0-flash";
  return { apiKey, model };
}

export async function handleTranslateApi(body) {
  const { text, source, target } = body ?? {};
  const src = String(source || "");
  const tgt = String(target || "");
  const input = String(text ?? "").trim();

  if (!VALID_LANGS.has(src) || !VALID_LANGS.has(tgt) || src === tgt) {
    throw new Error("Invalid languages");
  }
  if (!input || input.length > MAX_LEN) {
    throw new Error("Invalid text");
  }

  const { apiKey, model } = getConfig();

  const system =
    "You are a professional translator for a café/restaurant menu. " +
    `Translate the user's text from ${LANG_NAMES[src]} to ${LANG_NAMES[tgt]}. ` +
    "Output ONLY the translated text — no quotes, no notes, no explanations, " +
    "no romanization, no alternatives. Keep it natural and concise, as it would " +
    "appear on a menu. Do not add or remove ingredients or details.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
      }),
    });
  } catch (err) {
    throw Object.assign(
      new Error(`Translation service unavailable: ${err?.message || "network error"}`),
      { status: 502 },
    );
  }

  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const detail =
      data?.error?.message || raw?.slice(0, 300) || `HTTP ${res.status}`;
    console.error("Gemini translate error:", res.status, detail);
    throw Object.assign(new Error(`Gemini error: ${detail}`), { status: 502 });
  }

  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    throw Object.assign(new Error(`Blocked by Gemini: ${blockReason}`), {
      status: 502,
    });
  }

  const translation = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p?.text || "")
    .join("")
    .trim();
  if (!translation) {
    throw Object.assign(
      new Error("Gemini returned no translation (empty response)"),
      { status: 502 },
    );
  }

  return { translation };
}
