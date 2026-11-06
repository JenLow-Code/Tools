// Thin data layer: read from the Worker API (/api/*), fall back to bundled seed.
// Every call resolves to data or null; callers keep the seed when it returns null,
// so the app works fully before the D1 database exists.

async function get(path) {
  try {
    const r = await fetch(path, { headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export const fetchCatalogue = () => get("/api/catalogue");
export const fetchNews = () => get("/api/news");
export const fetchTools = () => get("/api/tools");
export const fetchMarket = () => get("/api/market");

// Returns the created listing, or null if the API is unavailable (caller keeps a local draft).
export async function postListing(kind, body) {
  try {
    const r = await fetch("/api/market/" + kind, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
