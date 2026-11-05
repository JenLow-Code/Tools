# JenLow Tools — Frontend prototype

**Visual direction: R'HiFi / premium audio** — adapted to JenLow Tools' blue identity.
Desktop-first independent application. Thin horizontal navigation, large intentional typography,
minimal cards and borders, and a professional equipment inventory.

**Five tabs, each with a hero:** My Studio, Equipment, News, Gear Exchange and Tools.
("Tools" is the working name for the tools section; Gear Exchange is also a working name.)
Equipment and News have full-height heroes; Gear Exchange and Tools use a shorter one so the
content starts sooner. My Studio's hero is the entrance to a studio; its workspace opens on click.
The 2D example room and all product catalogue content are illustrative prototypes.

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
- **Equipment:** hero search and category shortcuts, one catalogue with category filter,
  saved view and an early "Fits my setup" filter (it only shows categories you don't own yet;
  real compatibility checks are not built), plus an elementary comparison.
- **News:** a carousel on top (latest review, release alert, upcoming event), then reviews (with a translation / show-original toggle, interface idea only), new
  release alerts and upcoming events. All sample content.
- **Gear Exchange:** All / Offers / Requests with filters and quick search; requests show what
  they want (borrow, rent, buy); sample entries are tagged SAMPLE.
- Sell/rent/lend offer drafts from an owned item, or from Gear Exchange for gear not yet
  registered (this creates the private My Studio record automatically).
- **Tools:** the planned membership sits in the hero; below it, a list of planned tools with how each would work.
  Nothing there is built.
- Local equipment request drafts.

## Limitations

Frontend-only, with localStorage in the browser. **No backend, no public listings, no actual
Network requests, no bookings, insurance, payments, identity verification, notifications
or multi-device synchronization.** Sample marketplace entries and sample news are explicitly
fictional. Current product data and comparisons are illustrative rather than verified.
The virtual studio room is an SVG illustration; no custom photo, 3D engine or real
acoustic simulation is involved. The Equipment and My Studio heroes and the onboarding panel use third-party photos; the News, Gear Exchange and Tools heroes are plain gradients. The photos use third-party
photographic backgrounds that require an internet connection and are design placeholders.
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
