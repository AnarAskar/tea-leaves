import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { handleTelegramApi } from "./api/telegram-handler.js";
import { handleTranslateApi } from "./api/translate-handler.js";

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

function readRequest(req) {
  return new Promise((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") {
      resolve({ body: {}, headers: req.headers });
      return;
    }
    readJsonBody(req)
      .then((body) => resolve({ body, headers: req.headers }))
      .catch(reject);
  });
}

function apiDevPlugin(path, handler) {
  return {
    name: `api-dev-${path}`,
    configureServer(server) {
      server.middlewares.use(path, async (req, res, next) => {
        try {
          const { body, headers } = await readRequest(req);
          const result = await handler({
            method: req.method,
            body,
            headers,
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.ok !== undefined ? result : { ok: true, ...result }));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Request failed";
          const status =
            err.status ||
            (message === "Unauthorized"
              ? 401
              : message.startsWith("Invalid") || message === "Method not allowed"
                ? 400
                : 500);
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
    // Dev server only (ignored by `vite build`): listen on all interfaces so
    // the Windows browser can reach it when running inside WSL2.
    server: { host: true },
    // Terser only minifies the legacy bundle. Stop it from turning methods
    // back into arrow functions, which Safari 9 can't parse.
    build: { terserOptions: { compress: { arrows: false } } },
    plugins: [
      react(),
      // Extra ES5 bundle + polyfills for old browsers (e.g. the café's iPad 2,
      // stuck on iOS 9 / Safari 9). Modern browsers never download it.
      legacy({
        targets: ["defaults", "ios >= 9", "safari >= 9"],
        // iOS 12 passes the module feature check and loads the modern entry.
        // Its dependencies still need runtime polyfills on that Safari version.
        modernPolyfills: true,
        additionalLegacyPolyfills: ["whatwg-fetch"],
      }),
      apiDevPlugin("/api/telegram", async (req) => {
        if (req.method !== "POST") {
          throw Object.assign(new Error("Method not allowed"), { status: 405 });
        }
        return handleTelegramApi(req.body);
      }),
      apiDevPlugin("/api/translate", async (req) => {
        if (req.method !== "POST") {
          throw Object.assign(new Error("Method not allowed"), { status: 405 });
        }
        return handleTranslateApi(req.body);
      }),
    ],
  };
});
