# PPF Website — Production Deployment

Production-ready deployment for the Pak-Palestine Forum (PPF) Phase-1 site and CTA/Contact API.

---

## 1. Production context

- **Domain (REQ-DOM-01):** `pakpalforum.com`
- **Contact email (REQ-DOM-02):** `pakpalforum@gmail.com`
- **Frontend:** Static build from `app/dist/` (React + Vite). Serve over **HTTPS**.
- **Backend:** Optional Node server in `server/` for CTA config and contact form. Run on same host or a separate API host.

---

## 2. Environment variables

### Frontend (`app/`)

Build-time (Vite) variables — set before `npm run build`:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CTAS_API_URL` | Base URL of the CTA/Contact API. If empty, CTAs use bundled defaults and contact form shows “Sent!” without sending. | `https://api.pakpalforum.com` or `https://pakpalforum.com` (if API is same origin) |

Create `app/.env.production` (or set in CI):

```env
VITE_CTAS_API_URL=https://api.pakpalforum.com
```

### Backend (`server/`)

Runtime variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | HTTP port | `3001` |
| `PPF_DATA_DIR` | Directory for `ctas.json` and `submissions.json` | `/var/ppf/data` |
| `PPF_API_KEY` | Optional. If set, `PUT /api/ctas` requires `X-Api-Key` header (or `?apiKey=...`). | Strong secret in production |

Create `server/.env` (do not commit secrets):

```env
PORT=3001
PPF_DATA_DIR=./data
PPF_API_KEY=your-secret-key-for-put-ctas
```

---

## 3. Build and deploy

### Frontend (static)

```bash
cd app
npm ci
npm run build
```

- Output: `app/dist/` (index.html, assets/, etc.)
- Deploy `dist/` to your static host (e.g. Nginx, Vercel, Netlify, S3 + CloudFront).
- Ensure `index.html` is served for client-side routes if applicable.
- Copy or symlink `images/` (hero, impact, team) so they are available at the paths used in `app/src/data/images.ts` (e.g. `/images/...`).

### Backend (CTA + Contact API)

```bash
cd server
npm ci
npm start
```

- For production, use a process manager (e.g. PM2, systemd) or a PaaS that runs `node index.js`.
- Ensure `PPF_DATA_DIR` is writable and persisted (for `ctas.json` and `submissions.json`).
- Run behind HTTPS (reverse proxy or load balancer). Do not expose the server directly to the internet without TLS.

### CORS

The server uses `cors({ origin: true })`. For production you may restrict:

```js
app.use(cors({ origin: "https://pakpalforum.com" }))
```

---

## 4. Post-deploy checklist

- [ ] Frontend loads at `https://pakpalforum.com` (or your domain).
- [ ] `VITE_CTAS_API_URL` points to the live API; Join Us and CTAs load from API; contact form submits to `/api/contact`.
- [ ] Set `joinUrl` via `PUT /api/ctas` to your Google Form URL so “Join Us” opens the form.
- [ ] Contact submissions are stored (or forwarded) as required; check `PPF_DATA_DIR/submissions.json` or your integration.
- [ ] HTTPS only; no mixed content.

---

## 5. Updating CTAs without code deploy

Use the REST API (see `server/API.md`):

```bash
curl -X PUT https://api.pakpalforum.com/api/ctas \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: YOUR_SECRET" \
  -d '{"joinUrl":"https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform"}'
```

The frontend fetches CTAs on load; users see updated labels and Join Us link on next page load.
