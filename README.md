# Pak-Palestine Forum Website

A modern React web application built with Vite, Tailwind CSS v4, TypeScript, and shadcn/ui.

## Quick Start

```shell
cd app
npm install
npm run dev
```

Open **http://localhost:5173** to view the application locally.

## Building for Production

```shell
cd app
npm run build
```

## Vercel Deployment

For seamless automated deployment on Vercel:
1. Open your **Vercel Project Dashboard**.
2. Go to **Settings** -> **General**.
3. Set the **Root Directory** to `app` and click **Save**.
<<<<<<< HEAD
4. Future pushes to GitHub will now automatically build and deploy properly!
=======
4. In **Settings → Environment Variables**, add:
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis REST, e.g. from the Vercel Upstash integration)
   - `JWT_SECRET` — long random string for admin session cookies
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — site owner login (server-side only)
   - Optional: `ALLOWED_ORIGINS` — comma-separated origins for cross-origin dev (e.g. `http://localhost:5173`). Same-host browser requests work without this.
5. Leave `VITE_CTAS_API_URL` unset in production so the site uses same-origin `/api/*`.
6. Future pushes will build the static app and deploy **API routes** under `app/api/` automatically.

**Local full stack:** from `app/`, run `vercel dev` (needs Upstash env in `.env.local`), or use `npm run dev` with the Express server and `VITE_CTAS_API_URL=http://localhost:3001`. For Vite-only dev with proxied API, set `VITE_DEV_API_PROXY` to match your `vercel dev` URL.
>>>>>>> modifics
