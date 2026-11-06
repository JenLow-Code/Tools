// Real JenLow Tools content, compiled from manufacturer and press sources.
// Loaded from the bundled seed; the app overlays the live API (D1) when available.
// The Gear Exchange marketplace entries and the "other studios" are still samples.
import seed from "./seed.json";

export const CHECKED_AT = seed.checkedAt;
export const categories = seed.categories;        // [{id,name,subs,fields,icon}]
export const products = seed.products;            // 64 real products
export const guides = seed.guides;
export const configurations = seed.configurations;
export const news = seed.news;                    // {section: "Tests" | "Technique"}
export const releases = seed.releases;
export const events = seed.events;
export const tools = seed.tools;
export const market = seed.market;                // sample offers/requests

const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
export const catName = (id) => (catMap[id] && catMap[id].name) || id || "";
export const catIcon = (id) => (catMap[id] && catMap[id].icon) || null;
export const productById = Object.fromEntries(products.map((p) => [p.id, p]));
export const productByModel = (name) => products.find((p) => p.model === name);

// Still illustrative: no real studios are listed yet.
export const otherStudios = [
  {id:"os1", name:"Studio Léman", place:"Genève", kind:"Home recording studio", tags:["Vocal booth","Audio interface","2 monitors"], terms:"Free lending"},
  {id:"os2", name:"La Petite Salle", place:"Annecy", kind:"Rehearsal room", tags:["Drum kit","PA system","Amps"], terms:"Rental"},
  {id:"os3", name:"Atelier Sonore", place:"Lyon", kind:"Podcast studio", tags:["4 microphones","Mixer","Acoustic treatment"], terms:"Rental"}
];
