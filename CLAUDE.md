# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tea Leaves is a React SPA for a restaurant/cafe menu with:
- Customer-facing multi-language menu (English, Arabic, Kurdish) with a shopping cart and Telegram-based order notifications
- Admin dashboard for live menu management (items, categories, images)
- Supabase backend (PostgreSQL + Auth + Storage) and Telegram Bot API for order delivery

## Commands

```bash
npm run dev          # Start Vite dev server (also starts /api/telegram middleware)
npm run build        # Production build
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

No test suite is configured — verify changes by running the dev server.

## Environment Variables

Copy `.env.example` to `.env.local`. Required for the app to function:

| Variable | Where used |
|---|---|
| `VITE_SUPABASE_URL` | `src/utils/supabaseClient.js` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/utils/supabaseClient.js` |
| `VITE_NUM_TABLES` | Number of tables shown in order modal (default: 25) |
| `VITE_BASE_URL` | Optional — base URL for QR code generation |
| `BOT_TOKEN` | Server-side only — Telegram bot token for orders/bills/notes |
| `CHAT_ID` | Server-side only — Telegram chat ID for orders/bills/notes |
| `REVIEW_BOT_TOKEN` | Server-side only — Telegram bot token for customer feedback |
| `REVIEW_CHAT_ID` | Server-side only — Telegram chat ID for customer feedback |

Server-only variables (no `VITE_` prefix): `BOT_TOKEN`, `CHAT_ID`, `REVIEW_BOT_TOKEN`, `REVIEW_CHAT_ID`. In dev, Vite middleware reads them directly; in production they are Vercel/Cloudflare environment secrets. Feedback is routed to the review bot if configured, otherwise uses the main bot.

## Architecture

### Routing (`src/App.jsx`)
- `/` — `TeaLeaves.jsx` (splash screen → menu)
- `/admin/login` — `AdminLogin.jsx`
- `/admin` — `AdminPanel.jsx` wrapped in `ProtectedRoute`

### Data Flow

**Customer menu:**
1. `TeaLeaves.jsx` renders `SplashScreen` (language select) then `MenuApp`
2. `MenuApp.jsx` calls `useMenuData()` hook which fetches `categories` (sorted by `sort_order`) and `menu_items` (where `is_available = true`) from Supabase
3. Items are grouped by category client-side and the DB fields (`photo_url`, `name_en/ar/ku`, etc.) are transformed to UI-friendly keys
4. Orders/bills/notes/feedback are POSTed to `/api/telegram` → formatted and sent to Telegram

**Admin:**
1. `AuthContext.jsx` manages Supabase email/password session, persisted in localStorage
2. `ProtectedRoute` guards the admin path
3. `AdminPanel.jsx` performs direct Supabase CRUD on `categories` and `menu_items` tables
4. Images upload to Supabase Storage buckets: `category-images` and `menu-images`

**Telegram API route:**
- `vite.config.js` intercepts `/api/telegram` in dev via a custom middleware that calls `api/telegram-handler.js`
- In production (Vercel): `api/telegram.js` is a serverless function
- In production (Cloudflare Pages): `functions/api/telegram.js` is a Worker
- Shared logic lives in `shared/telegramMessages.js` (message formatting) and `shared/sendTelegram.js` (HTTP call)

### Database Schema (Supabase PostgreSQL)

**`categories`**: `id` (text PK), `emoji`, `image_url`, `label_en/ar/ku`, `sort_order`

**`menu_items`**: `id` (bigint), `category_id` (FK), `name_en/ar/ku`, `ing_en/ar/ku` (ingredients/description), `price` (IQD integer), `photo_url`, `tags` (text[] — `"hot"`, `"cold"`, `"vegan"`, `"new"`), `is_available`, `created_at`

Migrations live in `supabase/migrations/` and must be applied in order via the Supabase SQL editor or `supabase db push`.

### Multi-language / i18n

- Language codes: `en`, `ar`, `ku`
- All UI strings are in `src/translations/index.js`
- RTL layout is applied when `lang === "ar" || lang === "ku"`
- Database stores separate columns per language for all user-visible text

### Key Files

| File | Purpose |
|---|---|
| `src/components/MenuApp.jsx` | Main customer UI (~1400 lines): categories, cart, order modals, feedback |
| `src/pages/AdminPanel.jsx` | Admin CRUD dashboard (~965 lines) |
| `src/hooks/useMenuData.js` | Supabase data fetching + transformation |
| `src/contexts/AuthContext.jsx` | Supabase auth session state |
| `src/utils/supabaseClient.js` | Supabase client singleton |
| `src/utils/telegram.js` | Client-side wrappers that POST to `/api/telegram` |
| `src/utils/formatSupabaseError.js` | Maps Supabase error codes to user-friendly messages with migration hints |
| `shared/telegramMessages.js` | Telegram message formatting (orders, bills, notes, feedback) |
| `api/telegram-handler.js` | Server-side handler: validates payload, calls shared formatters, sends to Telegram |

## Deployment

**Vercel (primary):** `vercel.json` rewrites all non-API paths to `index.html` for SPA routing. The build hook is `npm run vercel-build`.

**Cloudflare Pages (alternative):** See `wrangler.toml`. Worker entry is `functions/api/telegram.js`.

Both platforms need `BOT_TOKEN` and `CHAT_ID` set as encrypted environment variables (not prefixed with `VITE_`).
