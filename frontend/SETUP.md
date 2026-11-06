# JenLow Tools — backend setup (Cloudflare Worker + D1)

The site works with **no backend**: the catalogue, news, tools and sample
marketplace are bundled as `src/seed.json`, and `/api/*` simply returns `503`
until a database is connected. The app notices and keeps using the seed, so you
can deploy today and wire the database whenever you want.

Media (product photos, category art) is served as static files under
`public/assets/…`. **Only metadata goes in the database** — the tables store the
image *path*, never the image bytes.

## What is already in the repo

- `worker/index.js` — the Worker. Serves `/api/*` from D1 (with CORS/JSON/error
  middleware) and falls through to the built SPA for everything else.
- `migrations/0001_init.sql` — schema, including the generic `metadata` table.
- `migrations/0002_seed.sql` — the real catalogue + editorial + tools + sample
  marketplace, generated from `src/seed.json` by `scripts/build-seed-sql.mjs`.
- `wrangler.jsonc` — Worker + static-assets config, with the D1 binding commented.

## Turn the database on

```sh
cd frontend

# 1. Create the database (copy the database_id it prints)
npx wrangler d1 create jenlow-tools

# 2. In wrangler.jsonc, uncomment the "d1_databases" block and paste the id.

# 3. Create the tables and load the data (runs 0001 then 0002)
npx wrangler d1 migrations apply jenlow-tools --remote

# 4. Build the frontend and deploy
npm run build
npx wrangler deploy
```

After that, `/api/catalogue`, `/api/news`, `/api/tools` and `/api/market` serve
live data, and the app overlays them automatically.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | liveness check |
| GET | `/api/catalogue` | categories + products + guides + configurations |
| GET | `/api/categories` | categories |
| GET | `/api/products` `?category=` | products (optionally by category) |
| GET | `/api/products/:id` | one product |
| GET | `/api/news` | news + releases + events |
| GET | `/api/tools` | planned tools |
| GET | `/api/market` `?direction=offer\|request` | marketplace listings |
| POST | `/api/market/offers` | create an offer `{title, category, type, price, location, …}` |
| POST | `/api/market/requests` | create a request `{title, category, type, location, …}` |

## Regenerating the seed

Edit `src/seed.json` (or re-extract from source), then:

```sh
node scripts/build-seed-sql.mjs      # rewrites migrations/0002_seed.sql
```

## Notes / next steps

- **Personal studios** (`studios`, `items` tables) exist but are unused: the app
  still keeps your inventory in the browser, because there is no login yet. Once
  you add auth, those tables and a few endpoints move that data server-side.
- The catalogue content is **French** (brands, specs, reviews). The app chrome is
  English; localising the chrome is a separate step.
- To move images off the repo later, upload `public/assets/**` to R2/Cloudflare
  Images and update the stored `image` paths — no schema change needed.
