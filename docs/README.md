# PPF Website — Documentation Guide

Use this as a checklist for what to document and where.

---

## 1. What to write (by audience)

### For stakeholders / clients
- **SRS.md** (you have this) — requirements, scope, user classes, features.
- **Product summary** — One-pager: what PPF site does, main sections, languages, chatbot, CTAs.
- **Content ownership** — Who provides copy, images, team details; where to update (e.g. `app/src/data/content.ts`, `app/src/data/images.ts`).

### For developers
- **Tech stack** — React 19, TypeScript, Vite 7, Tailwind v4, Radix/shadcn-style UI. (See `app/README.md`.)
- **Setup** — `cd app && npm install && npm run dev`; open http://localhost:5173.
- **Build & deploy** — `npm run build` in `app/`; deploy `app/dist/` or copy its contents to your host (e.g. root `PPF/` for static serve).
- **Where things live** — Components in `app/src/components/`, copy in `app/src/data/content.ts`, image paths in `app/src/data/images.ts`, assets in `app/public/` and project `images/`.

### For content editors
- **Copy** — Edit `app/src/data/content.ts` (EN and UR blocks).
- **Images** — Add files to `images/` or `app/public/images/`; update paths in `app/src/data/images.ts`.
- **Hero / Impact** — Hero: `images.hero` / `images.heroMobile`. Impact section: `images.humanitarian`.

### For QA / testers
- **Browsers** — Chrome, Firefox, Safari, Edge (latest).
- **Devices** — Desktop, tablet, mobile.
- **Key flows** — Language switch (EN/Urdu, RTL), nav, contact form, Join Us (Google Form or fallback), all CTAs.

---

## 2. Suggested file layout

| File | Purpose |
|------|--------|
| **SRS.md** | Full software requirements (scope, features, REQ-IDs). |
| **app/README.md** | Developer quick start, tech stack, build, images, structure. |
| **REFINEMENTS.md** | UI/UX applied and optional refinements. |
| **docs/README.md** | This guide — what to document and where. |
| **docs/DEPLOYMENT.md** (optional) | How to build and deploy (static host, env, cache). |
| **docs/CONTENT.md** (optional) | Content ownership and where to edit copy/images. |

---

## 3. Tech stack (copy-paste for docs)

**Frontend**
- React 19, TypeScript 5.9  
- Vite 7 (dev server + build)  
- Tailwind CSS v4  
- Radix UI, Lucide icons, class-variance-authority / clsx / tailwind-merge  

**Delivery**
- Static build from `app/dist/`; can be served from repo root (`PPF/`) or any static host.

---

## 4. Quick reference

- **Run dev:** `cd app && npm run dev` → http://localhost:5173  
- **Build:** `cd app && npm run build`  
- **Deploy from root:** Copy `app/dist/*` into `PPF/` (index.html, assets/, images/); ensure `PPF/images/` has hero and impact images.  
- **Content:** `app/src/data/content.ts`  
- **Image paths:** `app/src/data/images.ts`  
- **CTA API:** `server/` — GET/PUT `/api/ctas`, POST `/api/contact`. See `server/API.md` and `docs/DEPLOYMENT.md`.
