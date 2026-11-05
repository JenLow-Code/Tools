# JenLow Tools — Frontend prototype

Desktop-first, independent JenLow Tools web app. React + Vite; professional blue visual identity.

## Start locally

From the repository root:

    cd frontend
    npm install
    npm run dev

Open the local URL printed by Vite. For a production build, run npm run build.

## What you can test

- First-visit three-step onboarding with "I'll do this later" on every step.
- A lightweight **sample 2D home studio** with clickable Desk / Rack / Storage / Cellar locations.
- Adding owned equipment by model or manually, with condition, serial number, location and quantity. A quantity of three creates **three independent physical inventory items**.
- Search / filter inventory, view item details, change item location/condition/status, remove records.
- Add new locations and export inventory to CSV.
- Explore: sample catalogue, wishlist, high-level comparisons, and placeholder editorial guides.
- Marketplace: professional list, offers + requests together, filters by transaction, category, city, price, availability; create sale/rental/free-loan drafts linked to an owned inventory item; create equipment-request drafts.

## Important current limits

**This is a frontend-only product/design prototype.**

- Data is persisted in the current browser's localStorage. It is **not** saved to a server, synchronized between devices or shared with other users.
- Every marketplace offer is a **draft**, never a real public listing. No purchases, payments, insurance, reservations, chat, identity or ownership verification.
- Four sample marketplace entries (including two marked as Network previews) are **fictional**, not current availability or real Network requests.
- Equipment catalogue, recommendations, comparison attributes and news are **illustrative starter data**, not a verified live feed.
- There are **no dreams inside Tools**. The Network link only opens Network's homepage; shared identity and deep links are not integrated yet.
- The virtual room uses a purpose-built 2D SVG illustration, not a real photograph, WebGL scene or technical room plan.
- The private inventory record is a self-declaration, **not evidence of ownership**.
- Do not enter sensitive personal data into this prototype; browser storage is not a secure production database.

## Next product decisions to test

1. How many onboarding questions are actually useful?
2. What is the fastest add-equipment flow (manual entry, model selection, scanning)?
3. How do we represent nested racks, cabinets and storage locations?
4. What fields are required when listing an owned item?
5. Do combined offers + requests make the marketplace more valuable in its first months?

## Architecture

The prototype is self-contained in the frontend folder. It does not alter JenLow Network or require any backend. Network and Tools remain separate products with independent core experiences.
