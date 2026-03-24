# PPF CTA API (file-based + admin auth)

Backend for the PPF admin: file-based CTA storage and server-side login with HttpOnly cookie.

## Production (secure)

1. Set environment variables (never commit real values):
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — admin login (server-side only)
   - `JWT_SECRET` — long random string (e.g. 32+ chars) for signing the session cookie
   - `CORS_ORIGIN` — your frontend origin (e.g. `https://pakpalforum.com`)
   - `PPF_DATA_DIR` — optional; directory for `ctas.json` (default: `./data`)

2. Run with HTTPS in production so the `secure` cookie flag works.

3. Back up the `data/` directory (or wherever `ctas.json` is stored).

## Local dev

```bash
cp .env.example .env
# Edit .env: set ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET
npm install
npm run dev
```

Frontend: set `VITE_CTAS_API_URL=http://localhost:3001` so the app uses this API and server-side login.

<<<<<<< HEAD
=======
## Production on Vercel

The deployed site uses **serverless functions** in [`app/api/`](../app/api/) with **Upstash Redis** for CTA storage and rate limits (no file writes on Vercel). This Express app is optional for local development only; production env vars live in the Vercel project. See the main [README](../README.md) Vercel section.

>>>>>>> modifics
## Endpoints

- `GET /api/ctas` — public; returns current CTA config from file
- `PUT /api/ctas` — auth required; updates `ctas.json`
- `POST /api/admin/login` — body `{ username, password }`; sets HttpOnly cookie
- `GET /api/admin/me` — auth required; returns 200 if cookie valid
- `POST /api/admin/logout` — clears cookie
