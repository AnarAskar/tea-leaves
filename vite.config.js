import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleTelegramApi } from "./api/telegram-handler.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function telegramApiDevPlugin() {
  return {
    name: "telegram-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/telegram", async (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const result = await handleTelegramApi(body);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Request failed";
          const status = message.startsWith("Invalid") ? 400 : 500;
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), telegramApiDevPlugin()],
  };
});
