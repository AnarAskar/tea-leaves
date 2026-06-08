# Hosting options (both free tier)

## Vercel (current)

- Build: `npm run vercel-build` (or `npm run build`)
- Output: `dist`
- SPA routing: `vercel.json` rewrites
- Telegram proxy: `api/telegram.js` serverless function
- Env vars in dashboard: `VITE_*` for client, `BOT_TOKEN` + `CHAT_ID` for server

Note: Vercel Hobby is intended for personal/non-commercial use. A commercial café may prefer Cloudflare Pages below.

## Cloudflare Pages (recommended for commercial use)

- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: `public/_redirects` (copied to dist)
- Telegram proxy: `functions/api/telegram.js` Pages Function
- Env vars in dashboard: same split as Vercel (`VITE_*` + `BOT_TOKEN` + `CHAT_ID`)
- Config reference: `wrangler.toml`

Migration from Vercel: connect the same Git repo, set env vars, deploy. No app code changes required.

## Local development

- `npm run dev` — Vite dev server with `/api/telegram` middleware (uses `BOT_TOKEN`/`CHAT_ID` from `.env`, or legacy `VITE_*` fallback)
- `vercel dev` — full Vercel parity including serverless functions
