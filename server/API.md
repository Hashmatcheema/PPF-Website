# PPF CTA Config API

REST API for editable call-to-action content. No admin UI; updates via `PUT` (e.g. curl, Postman, or a script).

## Base URL

- **Local:** `http://localhost:3001` (or set `PORT`)
- **Production:** Set `VITE_CTAS_API_URL` in the frontend to your deployed API base (e.g. `https://api.pakpalforum.com`).

## Endpoints

### GET /api/ctas

Returns the current CTA configuration (public, no auth).

**Response (200)** — JSON:

```json
{
  "joinUrl": "https://docs.google.com/forms/d/e/...",
  "joinLabel": { "en": "Join Us", "ur": "شامل ہوں" },
  "contactLabel": { "en": "Contact Us", "ur": "رابطہ کریں" },
  "heroCtaHeading": { "en": "Stand in Solidarity.", "ur": "یکجہتی میں کھڑے ہوں۔" },
  "heroCtaSubtext": {
    "en": "Add your voice. Join thousands making a difference.",
    "ur": "اپنی آواز شامل کریں۔"
  },
  "volunteerLabel": { "en": "Volunteer", "ur": "رضاکار" },
  "donateLabel": { "en": "Donate", "ur": "عطیہ" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `joinUrl` | string | Google Form (or any) URL for "Join Us". Empty = fallback (message + Contact Us). |
| `joinLabel` | `{ en, ur }` | "Join Us" button/link text. |
| `contactLabel` | `{ en, ur }` | "Contact Us" button/link text. |
| `heroCtaHeading` | `{ en, ur }` | Hero CTA heading (catchy). |
| `heroCtaSubtext` | `{ en, ur }` | Hero CTA subtext (catchy). |
| `volunteerLabel` | `{ en, ur }` | Volunteer CTA label. |
| `donateLabel` | `{ en, ur }` | Donate CTA label. |

### PUT /api/ctas

Updates the CTA configuration. Send a JSON body with any subset of fields; missing fields are left unchanged.

**Request:** `Content-Type: application/json`

```json
{
  "joinUrl": "https://docs.google.com/forms/d/e/your-form-id/viewform",
  "joinLabel": { "en": "Join Us", "ur": "شامل ہوں" }
}
```

**Response (200):** Full merged CTA config (same shape as GET).

**Auth (optional):** If `PPF_API_KEY` is set on the server, send it in the request:

- Header: `X-Api-Key: your-secret-key`
- Or query: `?apiKey=your-secret-key`

**Example (curl):**

```bash
curl -X PUT http://localhost:3001/api/ctas \
  -H "Content-Type: application/json" \
  -d '{"joinUrl":"https://docs.google.com/forms/d/e/xxx/viewform"}'
```

## Storage

Config is stored in `data/ctas.json` (or path given by `PPF_DATA_DIR`). Ensure the process has write access to that directory.

### POST /api/contact

Contact form submission. Stores in `data/submissions.json`. **Spam protection:** if the request body includes a non-empty `website` field (honeypot), the server responds with 400 and does not store.

**Request:** `Content-Type: application/json`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello..."
}
```

Optional honeypot: include `"website": ""` in the payload; if the client sends a value (e.g. bot-filled), the server rejects.

**Response (201):** `{ "ok": true }`

**Response (400):** `{ "error": "Invalid submission" }` (honeypot triggered or missing required fields).

Submissions are appended to `data/submissions.json` (same directory as `ctas.json`). In production you may replace this with email forwarding or a CRM integration.

---

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `3001`). |
| `PPF_DATA_DIR` | Directory for `ctas.json` and `submissions.json` (default `./data`). |
| `PPF_API_KEY` | If set, PUT /api/ctas requires `X-Api-Key` or `apiKey` query. |
