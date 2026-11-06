// JenLow Tools — Cloudflare Worker.
// Serves the JSON API (/api/*) from D1 and falls through to the static SPA.
// Media (images/video) is served as static assets, never from the database.

const JSON_FIELDS = {
  categories: ["subs", "fields"],
  products: ["strengths", "limitations", "specs", "sources", "editorial_refs"],
  guides: ["sections"],
  configurations: ["items"],
  news: ["tags", "product_ids"],
  releases: ["product_ids"],
  events: ["practical"],
  listings: [],
  tools: ["steps"],
};

// ---- middleware helpers ----
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
const err = (message, status = 500) => json({ error: message }, status);

// parse the JSON-encoded TEXT columns of a row back into values
function hydrate(table, row) {
  const fields = JSON_FIELDS[table] || [];
  for (const f of fields) {
    if (row[f] != null) {
      try { row[f] = JSON.parse(row[f]); } catch { /* leave as-is */ }
    }
  }
  // snake_case → camelCase for the frontend
  const out = {};
  for (const k of Object.keys(row)) {
    const ck = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[ck] = row[k];
  }
  return out;
}

async function all(db, table, sql, params = []) {
  const { results } = await db.prepare(sql).bind(...params).all();
  return (results || []).map((r) => hydrate(table, r));
}

// ---- API routes ----
async function api(request, env, url) {
  const db = env.DB;
  if (!db) return err("Database not configured. See frontend/SETUP.md.", 503);
  const p = url.pathname.replace(/\/+$/, "");
  const method = request.method;

  if (p === "/api/health") return json({ ok: true, time: new Date().toISOString() });

  if (p === "/api/catalogue" && method === "GET") {
    const [categories, products, guides, configurations] = await Promise.all([
      all(db, "categories", "SELECT * FROM categories ORDER BY position"),
      all(db, "products", "SELECT * FROM products ORDER BY brand, model"),
      all(db, "guides", "SELECT * FROM guides"),
      all(db, "configurations", "SELECT * FROM configurations"),
    ]);
    return json({ categories, products, guides, configurations });
  }

  if (p === "/api/categories" && method === "GET")
    return json(await all(db, "categories", "SELECT * FROM categories ORDER BY position"));

  if (p === "/api/products" && method === "GET") {
    const cat = url.searchParams.get("category");
    const sql = cat
      ? "SELECT * FROM products WHERE category = ? ORDER BY brand, model"
      : "SELECT * FROM products ORDER BY brand, model";
    return json(await all(db, "products", sql, cat ? [cat] : []));
  }

  const prod = p.match(/^\/api\/products\/([^/]+)$/);
  if (prod && method === "GET") {
    const rows = await all(db, "products", "SELECT * FROM products WHERE id = ?", [decodeURIComponent(prod[1])]);
    return rows[0] ? json(rows[0]) : err("Not found", 404);
  }

  if (p === "/api/news" && method === "GET") {
    const [news, releases, events] = await Promise.all([
      all(db, "news", "SELECT * FROM news ORDER BY date DESC"),
      all(db, "releases", "SELECT * FROM releases ORDER BY date DESC"),
      all(db, "events", "SELECT * FROM events ORDER BY start"),
    ]);
    return json({ news, releases, events });
  }

  if (p === "/api/tools" && method === "GET")
    return json(await all(db, "tools", "SELECT * FROM tools ORDER BY position"));

  if (p === "/api/market" && method === "GET") {
    const dir = url.searchParams.get("direction");
    const sql = dir
      ? "SELECT * FROM listings WHERE direction = ? ORDER BY created_at DESC"
      : "SELECT * FROM listings ORDER BY created_at DESC";
    return json(await all(db, "listings", sql, dir ? [dir] : []));
  }

  if ((p === "/api/market/offers" || p === "/api/market/requests") && method === "POST") {
    const direction = p.endsWith("offers") ? "offer" : "request";
    let body;
    try { body = await request.json(); } catch { return err("Invalid JSON body", 400); }
    if (!body || !body.title) return err("A title is required", 400);
    const id = (direction === "offer" ? "off-" : "req-") + Date.now().toString(36);
    await db.prepare(
      `INSERT INTO listings (id, account_id, person_name, direction, title, category, product_id, type, price, location, availability, note, source, is_sample)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'tools', 0)`
    ).bind(
      id, body.accountId ?? null, body.personName ?? null, direction, body.title,
      body.category ?? null, body.productId ?? null, body.type ?? null,
      body.price ?? null, body.location ?? null, body.availability ?? null, body.note ?? null
    ).run();
    const rows = await all(db, "listings", "SELECT * FROM listings WHERE id = ?", [id]);
    return json(rows[0], 201);
  }

  return err("Unknown API route", 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env, url);
      } catch (e) {
        return err(e && e.message ? e.message : "Server error", 500);
      }
    }
    // everything else → static assets (SPA fallback handled by the assets binding)
    return env.ASSETS.fetch(request);
  },
};
