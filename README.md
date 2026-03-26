# Pak-Palestine Forum Website

React app and Vercel serverless API live in **`app/`** (Vite, Tailwind v4, TypeScript).  
Public site plus **`/admin/login`** → **`/admin`** for CTA editing (cookie auth, `app/api/*` + Upstash on Vercel).

## Quick start

```shell
cd app
npm install
npm run dev
```

Open **http://localhost:5173**.  
For a local API (CTAs, contact, admin), use **`vercel dev`** from **`app/`** with Upstash env in `.env.local`, or point the Vite proxy at that process (`VITE_DEV_API_PROXY`).

## Production build

```shell
cd app
npm run build
```

## Vercel

1. **Settings → General:** set **Root Directory** to **`app`**.
2. **Settings → Environment Variables:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (optional: `ALLOWED_ORIGINS` for cross-origin dev).
3. Leave **`VITE_CTAS_API_URL`** empty in production so the browser calls same-origin **`/api/*`**.

See **[`app/.env.example`](app/.env.example)** for frontend env hints.
