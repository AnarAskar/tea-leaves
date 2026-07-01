// Client wrapper for the admin auto-translate endpoint (/api/translate).
export async function translateText(text, source, target) {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });
  if (!res.ok) {
    let message = "Translation failed";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }
  const data = await res.json();
  return data.translation;
}
