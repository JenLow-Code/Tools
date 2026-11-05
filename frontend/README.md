# JenLow Tools — Frontend prototype

**Visual direction: R'HiFi / premium audio** — adapted to JenLow Tools' blue identity.
Desktop-first independent application. Thin horizontal navigation, large intentional typography,
minimal cards and borders, and a professional equipment inventory.

**Hero rule:** only *Explore* has a large cinematic photographic hero. *My Studio* and *Marketplace*
are compact working interfaces that put the user's task first.
The 2D example room and all product catalogue content are illustrative prototypes.

## Start

    cd frontend
    npm install
    npm run dev

Build check:

    npm run build

## Interactive features

- Skippable onboarding with sample studio.
- My Studio: compact header, then the 2D sample room and the equipment list side by side.
  Clicking Desk, Rack, Storage or Cellar filters the same list that location chips filter.
- Individual equipment records, including distinct records for multiple identical microphones.
- Add, find (name, brand, category, location, serial), relocate, update and remove equipment.
  Equipment may be left without a location.
- Add and rename locations (renaming moves the equipment with it); export a CSV inventory.
- Explore: sample products, saved-products view, elementary comparison and editorial layout.
- Marketplace: compact header with quick search; one combined offers-and-requests list with
  filters; requests show what they want (borrow, rent, buy); sample entries are tagged SAMPLE.
- Sell/rent/lend offer drafts from an owned item, or from Marketplace for gear not yet
  registered (this creates the private My Studio record automatically).
- Local equipment request drafts.

## Limitations

Frontend-only, with localStorage in the browser. **No backend, no public listings, no actual
Network requests, no bookings, insurance, payments, identity verification, notifications
or multi-device synchronization.** Sample marketplace entries and sample news are explicitly
fictional. Current product data and comparisons are illustrative rather than verified.
The virtual studio room is an SVG illustration; no custom photo, 3D engine or real
acoustic simulation is involved. The Explore hero and the onboarding panel use third-party
photographic backgrounds that require an internet connection and are design placeholders.
The first four locations occupy the four hotspots of the sample room (even if renamed);
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
