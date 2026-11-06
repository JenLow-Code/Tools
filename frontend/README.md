# JenLow Tools — Frontend prototype

**Visual direction: R'HiFi / premium audio** — adapted to JenLow Tools' blue identity.
Desktop-first independent application. Thin horizontal navigation, large intentional typography,
minimal cards and borders, and a professional equipment inventory.

**Five tabs, each with a hero:** My Studio, Equipment, News, Gear Exchange and Tools.
("Tools" is the working name for the tools section; Gear Exchange is also a working name.)
Equipment and News have full-height heroes; Gear Exchange and Tools use a shorter one so the
content starts sooner. My Studio's hero is the entrance to a studio; its workspace opens on click.

The catalogue, news and tools are **real content** (compiled from manufacturer and press
sources, in French): 64 products with photos, specs and sources; independent reviews,
release notes and events. It is bundled as `src/seed.json` and, when the Cloudflare
backend is connected, loaded live from D1 instead (see `SETUP.md`). The 2D studio room is
still an illustration, and the Gear Exchange marketplace entries are still samples.

## Start

    cd frontend
    npm install
    npm run dev

Build check:

    npm run build

## Interactive features

- **My Studio:** studio chapters on the hero to switch between your studios (add / rename). Each studio has
  its own rooms and equipment. A studio's page is a hero; click it to open the workspace (2D
  sample room + equipment list side by side). Below the hero: sample "Other studios".
- Individual equipment records, including distinct records for multiple identical microphones.
- Add, find (name, brand, category, location, serial), relocate, update and remove equipment;
  add and rename locations; export a CSV inventory. Equipment may be left without a location.
- **Equipment:** hero search and category shortcuts, the real catalogue (64 products with
  photos) with category filter, a product detail panel (specs, strengths, limitations,
  sources), a saved view, an early "Fits my setup" filter (it only shows categories you
  don't own yet; real compatibility checks are not built), and a side-by-side spec compare.
- **News:** a carousel on top (latest review, release, event), then real reviews, news,
  release notes and events, each linking to its source. Translation into the reader's
  language is planned (the content is currently French).
- **Gear Exchange:** All / Offers / Requests with filters and quick search; requests show what
  they want (borrow, rent, buy); sample entries are tagged SAMPLE.
- Sell/rent/lend offer drafts from an owned item, or from Gear Exchange for gear not yet
  registered (this creates the private My Studio record automatically).
- **Tools:** the planned membership sits in the hero; below it, a list of planned tools with how each would work.
  Nothing there is built.
- Local equipment request drafts.

## Backend

A Cloudflare Worker (`worker/index.js`) serves a JSON API (`/api/*`) from a D1 database and
falls through to the static SPA. The schema (`migrations/0001_init.sql`) includes a generic
`metadata` table plus catalogue, editorial, tools and marketplace tables; **only metadata is
stored — media stays as static files.** The database is optional: until it is created, `/api`
returns `503` and the app uses the bundled seed. Full steps are in `SETUP.md`.

## Limitations

Personal studio inventory still lives in the browser (localStorage); there is no login yet,
so the `studios`/`items` tables are unused until auth is added. **No bookings, insurance,
payments, identity verification, notifications or multi-device sync for personal data.**
Gear Exchange marketplace entries are sample content (tagged SAMPLE). The virtual studio
room is an SVG illustration; no custom photo, 3D engine or acoustic simulation is involved.
The My Studio hero and onboarding panel use third-party photographic backgrounds that
require an internet connection and are design placeholders.
The first four locations of a studio occupy the four hotspots of the sample room (even if renamed);
additional locations appear in the list and chips but not on the illustration.

The workspace stays independent from JenLow Network; no dreams are rendered inside Tools.
All ownership records are user-declared and private. Marketplace drafts do not create
live listings.

## Design notes

- Use the R'HiFi high-end audiovisual art direction: spacious, restrained,
  image-first, sophisticated typography, light/graphite surfaces, subtle blue details.
- The main landing point should feel like a premium audio brand with a useful
  personal studio, not a conventional SaaS dashboard.
- Keep the marketplace compact and professional.
- Do not make visual navigation, photography or 3D mandatory for inventory management.
- If a future redesign changes visuals, do not remove user-facing workflows.
