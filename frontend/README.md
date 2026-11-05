# JenLow Tools — Frontend prototype

**Visual direction: R'HiFi / premium audio** — adapted to JenLow Tools' blue identity.
Desktop-first independent application. Thin horizontal navigation, expansive photographic hero,
large intentional typography, minimal cards and borders, and a professional equipment inventory.
The 2D example room and all product catalogue content are illustrative prototypes.

## Start

    cd frontend
    npm install
    npm run dev

Build check:

    npm run build

## Interactive features

- Skippable onboarding with sample studio.
- 2D sample home-studio illustration with clickable Desk, Rack, Storage, Cellar.
- Individual equipment records, including distinct records for multiple identical microphones.
- Add, find, filter, relocate, update and remove equipment.
- Add locations and export a CSV inventory.
- Explore: sample products, saved products, elementary comparison and editorial layout.
- Marketplace: one combined offers-and-requests list with compact professional filters.
- Sell/rent/lend offer drafts only for individually registered owned equipment.
- Local equipment request drafts.

## Limitations

Frontend-only, with localStorage in the browser. **No backend, no public listings, no actual
Network requests, no bookings, insurance, payments, identity verification, notifications
or multi-device synchronization.** Sample marketplace entries and sample news are explicitly
fictional. Current product data and comparisons are illustrative rather than verified.
The virtual studio room is an SVG illustration; no custom photo, 3D engine or real
acoustic simulation is involved. The studio hero uses a third-party photographic
background that requires an internet connection and is intended as a design placeholder.

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
