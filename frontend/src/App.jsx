import React, { useEffect, useId, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, Check, CheckCircle2,
  ChevronRight, Download, Filter, GitCompareArrows, Heart, Home, Info, Layers3,
  LayoutGrid, MapPin, Mic2, Package, Pencil, Plus, Search, ShieldCheck,
  ShoppingBag, SlidersHorizontal, Sparkles, Trash2, X
} from "lucide-react";
import PageHero from "./PageHero.jsx";
import NewsPage from "./NewsPage.jsx";
import ToolsPage from "./ToolsPage.jsx";
import {
  CHECKED_AT, categories as seedCategories, products as seedProducts,
  market as seedMarket, otherStudios, catName, productByModel
} from "./data.js";
import { fetchCatalogue, fetchMarket, postListing } from "./api.js";
import "./styles.css";

// Official JenLow Tools mark (from the brand source): a cyan→blue equaliser
// on a transparent background. Unique gradient id per instance.
function JlWave({className = "jl-wave"}) {
  const gid = "wave" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs><linearGradient id={gid} x2=".3" y2="1"><stop stopColor="#00e9ed"/><stop offset="1" stopColor="#003bff"/></linearGradient></defs>
      <g fill="none" stroke={`url(#${gid})`} strokeWidth="11" strokeLinecap="round"><path d="M8 73v12m18-29v38m19-68v82m18-64v13m20-70v78m19-30v25m18-15v13"/></g>
    </svg>
  );
}

const KEY = "jenlow-tools-front-v1";
const DEFAULT_LOCATIONS = ["Desk", "Rack", "Storage", "Cellar"];
const BASE = {
  setupComplete: false, studioName: "My Home Studio", purpose: "Music production", daw: "",
  studios: [], items: [], listings: [], requests: [], wishlist: []
};
// The first four locations of a studio occupy the four hotspots of the sample room, even if renamed.
const SLOTS = [{left:"40%",top:"67%"},{left:"74%",top:"44%"},{left:"82%",top:"75%"},{left:"14%",top:"75%"}];
const NAV = [
  {key:"studio", label:"My Studio"},
  {key:"equipment", label:"Equipment"},
  {key:"news", label:"News"},
  {key:"market", label:"Gear Exchange"},
  {key:"tools", label:"Tools"}
];
const marketLabel = (m) => m.direction==="request"
  ? ({borrow:"Wants to borrow", lend:"Wants to borrow", rent:"Wants to rent", sell:"Wants to buy"}[m.type] || "Wanted")
  : m.type==="sell" ? "For sale" : m.type==="rent" ? "For rent" : "Free lending";
const uid = () => "jl-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,8);
function readStore() {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { raw = {}; }
  const s = {...BASE, ...raw};
  // Migration: earlier versions had a single studio with top-level locations.
  if (!Array.isArray(s.studios) || !s.studios.length) {
    s.studios = [{id:"studio-1", name:s.studioName || "My Home Studio", locations:Array.isArray(raw.locations) && raw.locations.length ? raw.locations : [...DEFAULT_LOCATIONS]}];
  }
  const first = s.studios[0].id;
  s.items = (s.items || []).map(x => x.studioId ? x : {...x, studioId:first});
  return s;
}
function ProductGlyph({kind="mic"}) {
  if (kind === "interface") return <div className="glyph-interface"><span/><span/><span/><i/></div>;
  if (kind === "speaker") return <div className="glyph-speaker"><span/><i/></div>;
  if (kind === "keys") return <div className="glyph-keys"><span>▯ ▯ ▯ ▯ ▯ ▯</span></div>;
  if (kind === "headphones") return <div className="glyph-headphones">◠</div>;
  return <Mic2 size={60} strokeWidth={1.15}/>;
}
function ProductArt({kind="mic",accent="blue",small=false}) {
  return <div className={"product-art product-art-" + accent + (small ? " product-art-small" : "")}><div className="art-halo"/><ProductGlyph kind={kind}/></div>;
}
function Scene({items,locations,onSelect,location,onAdd}) {
  const count = (loc) => items.filter(x => x.location === loc && x.status !== "Sold").length;
  // The first four locations occupy the four hotspots of the sample room, even if renamed.
  const locs = locations.slice(0,4).map((name,i)=>({name,...SLOTS[i]}));
  return <div className="scene">
    <svg className="room-svg" viewBox="0 0 900 415" role="img" aria-label="Illustrated home studio with desk, rack, storage and cellar">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#223e58"/><stop offset="1" stopColor="#172e46"/></linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#42546a"/><stop offset="1" stopColor="#27384d"/></linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ac9275"/><stop offset="1" stopColor="#755f50"/></linearGradient>
      </defs>
      <rect width="900" height="415" fill="url(#wall)"/>
      <path d="M0 309 L900 309 L900 415 L0 415Z" fill="url(#floor)"/>
      <path d="M0 309H900" stroke="#7f90a0" strokeOpacity=".35" strokeWidth="3"/>
      <path d="M38 37H862M38 37V297M862 37V297" stroke="#7690a7" strokeOpacity=".16" strokeWidth="2"/>
      <path d="M120 58v217M160 58v217M700 58v217M740 58v217" stroke="#8fa3b4" strokeOpacity=".08" strokeWidth="1"/>
      <rect x="360" y="58" width="180" height="114" rx="8" fill="#11253a" stroke="#637c94" strokeOpacity=".45" strokeWidth="3"/>
      <path d="M375 152 L408 116 L438 139 L485 94 L528 135" fill="none" stroke="#4f819c" strokeWidth="4" opacity=".5"/>
      <circle cx="491" cy="85" r="9" fill="#659cbb" opacity=".55"/>
      <rect x="366" y="64" width="168" height="7" fill="#203b52"/>
      <path d="M171 270H628L655 294H151Z" fill="url(#desk)" stroke="#c7a787" strokeWidth="2"/>
      <path d="M175 295v97M616 295v97" stroke="#76685e" strokeWidth="16"/>
      <path d="M198 392H596" stroke="#1a2a3d" strokeWidth="6" strokeOpacity=".5"/>
      <rect x="339" y="179" width="164" height="99" rx="6" fill="#101923" stroke="#657b8c" strokeWidth="6"/>
      <rect x="349" y="190" width="144" height="78" rx="2" fill="#234c6b"/>
      <path d="M354 245 L388 220 L420 236 L451 203 L485 226" fill="none" stroke="#6fa1bc" strokeWidth="3" opacity=".6"/>
      <rect x="410" y="279" width="20" height="12" fill="#26394c"/>
      <rect x="384" y="291" width="74" height="5" rx="3" fill="#1f2d3b"/>
      <g fill="#18232f" stroke="#6c8191" strokeWidth="2">
        <rect x="247" y="201" width="69" height="87" rx="5"/><rect x="530" y="201" width="69" height="87" rx="5"/>
      </g>
      <g fill="#374f66" stroke="#728ba1" strokeWidth="2"><circle cx="281" cy="229" r="12"/><circle cx="281" cy="261" r="20"/><circle cx="564" cy="229" r="12"/><circle cx="564" cy="261" r="20"/></g>
      <g fill="#111d2a"><circle cx="281" cy="229" r="5"/><circle cx="281" cy="261" r="10"/><circle cx="564" cy="229" r="5"/><circle cx="564" cy="261" r="10"/></g>
      <path d="M316 291H529L544 305H308Z" fill="#283746" stroke="#647b90"/>
      <path d="M318 296H524" stroke="#aebccc" strokeWidth="2" strokeDasharray="6 3"/>
      <path d="M203 304l14 1M217 305l12 35" stroke="#91a6bb" strokeWidth="4"/>
      <ellipse cx="234" cy="201" rx="13" ry="19" fill="#182e45" stroke="#94b4cf" strokeWidth="3"/>
      <path d="M234 220v57M218 278h32" stroke="#9db4c7" strokeWidth="5"/>
      <g transform="translate(680 134)">
        <rect x="0" y="0" width="114" height="226" rx="4" fill="#0b1825" stroke="#8ea4b7" strokeWidth="5"/>
        <rect x="11" y="16" width="92" height="37" rx="3" fill="#223a50" stroke="#536d83"/>
        <rect x="11" y="62" width="92" height="37" rx="3" fill="#23384b" stroke="#536d83"/>
        <rect x="11" y="108" width="92" height="34" rx="3" fill="#23384b" stroke="#536d83"/>
        <rect x="11" y="151" width="92" height="58" rx="3" fill="#152a3e" stroke="#536d83"/>
        <g fill="#76b5db"><circle cx="23" cy="34" r="4"/><circle cx="23" cy="80" r="4"/><circle cx="23" cy="124" r="4"/></g>
        <g fill="#8ba6b8"><rect x="40" y="31" width="49" height="4" rx="2"/><rect x="40" y="78" width="49" height="4" rx="2"/><rect x="40" y="123" width="49" height="4" rx="2"/></g>
      </g>
      <g transform="translate(74 222)">
        <rect x="0" y="0" width="100" height="136" rx="4" fill="#697d89" stroke="#a2b5bc" strokeWidth="3"/>
        <rect x="9" y="13" width="82" height="53" rx="2" fill="#25394a"/>
        <rect x="9" y="74" width="82" height="51" rx="2" fill="#283f51"/>
        <circle cx="79" cy="91" r="3" fill="#b0c9d6"/>
      </g>
      <path d="M0 397H900" stroke="#718295" strokeOpacity=".25"/>
      <path d="M20 353L190 415M260 309L205 415M665 309L731 415M888 348L762 415" stroke="#a7b4bf" strokeOpacity=".12" strokeWidth="2"/>
    </svg>
    <div className="scene-top"><span className="scene-live"><span/> SAMPLE LAYOUT</span><span>2D Workspace · Home Studio</span></div>
    {locs.map(loc=><button type="button" key={loc.name} className={"hotspot" + (location === loc.name ? " active" : "")} style={{left:loc.left,top:loc.top}} onClick={()=>onSelect(loc.name)} title={"Open "+loc.name}>
      <span className="hotspot-dot"><Layers3 size={13}/></span><span className="hotspot-label">{loc.name} <strong>{count(loc.name)}</strong></span>
    </button>)}
    <button className="scene-add" type="button" onClick={onAdd}><Plus size={15}/> Add equipment</button>
  </div>;
}
function Modal({title,subtitle,onClose,children}) {
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button></div>
      <div className="modal-body">{children}</div>
    </div>
  </div>;
}
function Onboarding({state,onComplete,onAdd}) {
  const [step,setStep]=useState(0);
  const [purpose,setPurpose]=useState(state.purpose);
  const [daw,setDaw]=useState(state.daw);
  const [name,setName]=useState(state.studioName);
  const purposes=["Music production","Recording / vocals","Instruments & practice","Podcast / streaming"];
  const finish=()=>onComplete({purpose,daw,studioName:name.trim() || "My Home Studio"});
  return <div className="welcome-layer"><div className="welcome-card">
    <div className="welcome-visual">
      <div className="welcome-brand jl-brand jl-brand-dark"><JlWave/><span className="jl-wordmark"><span className="jl-word">JENLOW</span><span className="jl-tools">TOOLS</span></span></div>
      <div className="welcome-copy"><span className="overline pale">WELCOME TO YOUR WORKSPACE</span><h1>Your equipment.<br/>Your space.<br/><em>Under control.</em></h1><p>Start with a simple studio. Make it yours as you go.</p></div>
      <div className="welcome-orbit"><div className="orbit-screen"/><div className="orbit-speaker a"/><div className="orbit-speaker b"/><div className="orbit-table"/></div>
      <div className="welcome-foot">DESKTOP-FIRST · PRIVATE BY DEFAULT</div>
    </div>
    <div className="welcome-steps">
      <div className="step-meta"><span>SET UP MY STUDIO</span><span>{step+1} OF 3</span></div>
      <div className="step-progress"><span style={{width:((step+1)/3*100)+"%"}}/></div>
      {step===0&&<div className="step-main"><div className="step-icon"><Home size={24}/></div><h2>Start with your space.</h2><p>We've prepared a clean 2D home studio. No room measurements, photos, or 3D setup required.</p><div className="sample-choice"><div className="sample-choice-icon"><LayoutGrid size={27}/></div><div><strong>Sample home studio</strong><span>Desk · Rack · Storage · Cellar</span></div><CheckCircle2 size={19} className="blue-icon"/></div><label className="field-label">Name your space <span>optional</span></label><input value={name} onChange={e=>setName(e.target.value)} placeholder="My Home Studio"/></div>}
      {step===1&&<div className="step-main"><div className="step-icon"><SlidersHorizontal size={24}/></div><h2>What do you create?</h2><p>One quick answer helps make your equipment suggestions more relevant. You can change this later.</p><div className="choice-grid">{purposes.map(p=><button className={"choice" +(purpose===p?" chosen":"")} key={p} onClick={()=>setPurpose(p)}>{p}{purpose===p&&<Check size={16}/>}</button>)}</div><label className="field-label">Your main software <span>optional</span></label><select value={daw} onChange={e=>setDaw(e.target.value)}><option value="">None / tell you later</option><option>FL Studio</option><option>Ableton Live</option><option>Logic Pro</option><option>Pro Tools</option><option>Reaper</option><option>Cubase</option><option>Other</option></select></div>}
      {step===2&&<div className="step-main"><div className="step-icon"><Package size={24}/></div><h2>Ready for your first item?</h2><p>Your studio is private. Each physical item gets its own record, even if you own several of the same model.</p><div className="final-check"><CheckCircle2 size={20}/><div><strong>Your studio is ready</strong><span>Add equipment now or whenever you're ready.</span></div></div><button className="secondary-button wide" onClick={()=>{finish();onAdd();}}><Plus size={17}/> Add my first piece of equipment</button></div>}
      <div className="welcome-actions"><button className="text-button" onClick={finish}>I'll do this later</button><div className="welcome-right">{step>0&&<button className="secondary-button" onClick={()=>setStep(step-1)}><ArrowLeft size={16}/> Back</button>}<button className="primary-button" onClick={()=>step<2?setStep(step+1):finish()}>{step<2?"Continue":"Open My Studio"} <ArrowRight size={16}/></button></div></div>
    </div>
  </div></div>;
}
function App() {
  const [store,setStore]=useState(readStore);
  // Catalogue and marketplace come from the bundled seed, overlaid by the live API when present.
  const [catalog,setCatalog]=useState({categories:seedCategories,products:seedProducts});
  const [marketData,setMarketData]=useState(seedMarket);
  const categories=catalog.categories;
  const products=catalog.products;
  useEffect(()=>{fetchCatalogue().then(d=>{if(d&&Array.isArray(d.products)&&d.products.length)setCatalog({categories:d.categories,products:d.products});});},[]);
  useEffect(()=>{fetchMarket().then(d=>{if(Array.isArray(d)&&d.length)setMarketData(d);});},[]);
  const [page,setPage]=useState("studio");
  const [studioId,setStudioId]=useState(null);
  const [studioOpen,setStudioOpen]=useState(false);
  const [activeLocation,setActiveLocation]=useState("All locations");
  const [itemSearch,setItemSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [selectedItem,setSelectedItem]=useState(null);
  const [exploreTab,setExploreTab]=useState("browse");
  const [exploreSearch,setExploreSearch]=useState("");
  const [exploreSaved,setExploreSaved]=useState(false);
  const [exploreCategory,setExploreCategory]=useState("all");
  const [fitOnly,setFitOnly]=useState(false);
  const [compareA,setCompareA]=useState(seedProducts[0].id);
  const [compareB,setCompareB]=useState(seedProducts[1].id);
  const [marketTab,setMarketTab]=useState("all");
  const [marketType,setMarketType]=useState("all");
  const [marketCategory,setMarketCategory]=useState("all");
  const [marketLocation,setMarketLocation]=useState("");
  const [marketPrice,setMarketPrice]=useState("");
  const [marketAvailable,setMarketAvailable]=useState(false);
  const [marketSearch,setMarketSearch]=useState("");
  const [toast,setToast]=useState("");
  const [itemForm,setItemForm]=useState({name:"",brand:"",category:"microphones",location:"Desk",quantity:1,serial:"",condition:"Good"});
  const [offerForm,setOfferForm]=useState({type:"rent",price:"",location:"",availability:"Available",itemId:"",newName:"",newBrand:"",newCategory:"microphones"});
  const [requestForm,setRequestForm]=useState({title:"",category:"microphones",location:"",type:"borrow"});

  useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(store));},[store]);
  useEffect(()=>{if(toast){const h=setTimeout(()=>setToast(""),3800);return()=>clearTimeout(h);}},[toast]);
  const pageTitle=(NAV.find(n=>n.key===page)||NAV[0]).label;
  useEffect(()=>{document.title="JenLow Tools — "+pageTitle;window.scrollTo(0,0);},[page,pageTitle]);

  // ---- studios, locations, items ----
  const studios=store.studios;
  const studio=studios.find(s=>s.id===studioId)||studios[0];
  const locations=studio.locations;
  const allActive=store.items.filter(x=>x.status!=="Sold");
  const studioItems=store.items.filter(x=>x.studioId===studio.id);
  const activeItems=allActive.filter(x=>x.studioId===studio.id);
  const availableCount=activeItems.filter(x=>x.status==="Available").length;
  const countIn=(loc)=>activeItems.filter(x=>x.location===loc).length;
  const inventory=activeItems.filter(x=>(activeLocation==="All locations"||x.location===activeLocation)&&[x.name,x.brand,x.category,x.location,x.serial].join(" ").toLowerCase().includes(itemSearch.trim().toLowerCase()));

  // ---- marketplace ----
  const userOffers=store.listings.map(o=>({...o,direction:"offer",source:"tools",isSample:false,mine:true}));
  const userRequests=store.requests.map(o=>({...o,direction:"request",source:"tools",isSample:false,mine:true}));
  const marketAll=[...userOffers,...userRequests,...marketData];
  const marketplace=marketAll.filter(x=>(marketTab==="all"||x.direction===marketTab)&&(marketType==="all"||x.type===marketType)&&(marketCategory==="all"||x.category===marketCategory)&&(!marketLocation||(x.location||"").toLowerCase().includes(marketLocation.toLowerCase()))&&(!marketAvailable||x.availability==="Available"||x.availability==="Flexible")&&(!marketPrice||x.direction==="request"||Number(x.price)<=Number(marketPrice))&&(!marketSearch.trim()||(x.title+" "+catName(x.category)).toLowerCase().includes(marketSearch.trim().toLowerCase())));
  const marketCount=(d)=>marketAll.filter(x=>d==="all"||x.direction===d).length;
  const typeOptions=marketTab==="offer"?[["sell","Buy / sell"],["rent","Rent"],["lend","Lend for free"]]:marketTab==="request"?[["borrow","Borrow"],["rent","Rent"],["sell","Buy"]]:[["sell","Buy / sell"],["rent","Rent"],["lend","Lend for free"],["borrow","Borrow request"]];
  const marketIntro=marketTab==="offer"?"Equipment people want to sell, rent or lend":marketTab==="request"?"What people are looking for right now":"Offers and requests in one place";
  const resetMarketFilters=()=>{setMarketType("all");setMarketCategory("all");setMarketLocation("");setMarketPrice("");setMarketAvailable(false);setMarketSearch("");};

  // ---- equipment catalogue ----
  const usedCategories=new Set(products.map(p=>p.category));
  const productCategories=categories.filter(c=>usedCategories.has(c.id));
  const ownedCategories=new Set(allActive.map(x=>x.category));
  const displayProducts=products.filter(p=>((p.brand+" "+p.model+" "+catName(p.category)+" "+(p.sub||"")).toLowerCase().includes(exploreSearch.trim().toLowerCase()))&&(exploreCategory==="all"||p.category===exploreCategory)&&(!exploreSaved||store.wishlist.includes(p.id))&&(!fitOnly||!ownedCategories.has(p.category)));
  const toggleWish=(id)=>setStore(s=>({...s,wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):[...s.wishlist,id]}));
  const goToList=()=>setTimeout(()=>document.getElementById("equipment-list")?.scrollIntoView({behavior:"smooth",block:"start"}),0);
  const pickCategory=(c)=>{setExploreCategory(c);setExploreTab("browse");goToList();};

  const notify=(s)=>setToast(s);
  const selectStudio=(id,keepOpen)=>{setStudioId(id);setStudioOpen(!!keepOpen);setActiveLocation("All locations");setItemSearch("");};
  const openAdd=(product)=>{setItemForm({name:product?.model||"",brand:product?.brand||"",category:product?.category||"microphones",location:activeLocation==="All locations"?(locations[0]||""):activeLocation,quantity:1,serial:"",condition:"Good"});setModal({type:"add"});};
  const openOffer=(id)=>{setOfferForm({type:"rent",price:"",location:"",availability:"Available",itemId:id||activeItems[0]?.id||allActive[0]?.id||"__new",newName:"",newBrand:"",newCategory:"Microphones"});setModal({type:"offer"});};
  const addItem=(e)=>{e.preventDefault();if(!itemForm.name.trim())return;const count=Math.min(30,Math.max(1,Number(itemForm.quantity)||1));const added=Array.from({length:count},()=>({id:uid(),studioId:studio.id,name:itemForm.name.trim(),brand:itemForm.brand.trim(),category:itemForm.category,location:itemForm.location,condition:itemForm.condition,serial:count===1?itemForm.serial.trim():"",status:"Available",addedAt:new Date().toISOString()}));setStore(s=>({...s,items:[...s.items,...added]}));setModal(null);notify(count+" item"+(count>1?"s":"")+" added to "+studio.name);};
  const updateItem=(id,change)=>setStore(s=>({...s,items:s.items.map(x=>x.id===id?{...x,...change}:x)}));
  const deleteItem=(id)=>{setStore(s=>({...s,items:s.items.filter(x=>x.id!==id),listings:s.listings.filter(x=>x.itemId!==id)}));setSelectedItem(null);notify("Item removed from inventory");};
  const createOffer=(e)=>{e.preventDefault();
    const isNew=offerForm.itemId==="__new";
    let item=store.items.find(x=>x.id===offerForm.itemId);
    if(isNew){
      if(!offerForm.newName.trim())return;
      // Offering gear that is not registered yet silently creates its private My Studio record.
      item={id:uid(),studioId:studio.id,name:offerForm.newName.trim(),brand:offerForm.newBrand.trim(),category:offerForm.newCategory,location:"",condition:"Good",serial:"",status:"Available",addedAt:new Date().toISOString()};
    }
    if(!item)return;
    const offer={id:uid(),itemId:item.id,title:item.name,category:item.category,location:offerForm.location.trim()||"Location not set",type:offerForm.type,price:Number(offerForm.price)||0,availability:offerForm.availability};
    setStore(s=>({...s,items:isNew?[...s.items,item]:s.items,listings:[offer,...s.listings]}));
    setModal(null);
    notify(isNew?"Draft offer created · item added privately to My Studio · not published online":"Draft offer created locally · not published online");
    postListing("offers",{title:item.name,category:item.category,productId:productByModel(item.name)?.id||null,type:offerForm.type,price:Number(offerForm.price)||0,location:offerForm.location.trim()||null,availability:offerForm.availability}).then(res=>{if(res){setMarketData(m=>[res,...m]);notify("Offer published to Gear Exchange.");}});
  };
  const createRequest=(e)=>{e.preventDefault();if(!requestForm.title.trim())return;setStore(s=>({...s,requests:[{id:uid(),title:requestForm.title.trim(),category:requestForm.category,location:requestForm.location.trim()||"Location not set",type:requestForm.type,price:0,availability:"Flexible"},...s.requests]}));setModal(null);notify("Request saved locally · not visible to others");
    postListing("requests",{title:requestForm.title.trim(),category:requestForm.category,type:requestForm.type,location:requestForm.location.trim()||null,availability:"Flexible"}).then(res=>{if(res){setMarketData(m=>[res,...m]);notify("Request published to Gear Exchange.");}});};
  const saveLocation=(e)=>{e.preventDefault();
    const value=e.currentTarget.elements.namedItem("locationName").value.trim();
    const old=modal?.rename;
    if(!value){setModal(null);return;}
    if(locations.some(l=>l.toLowerCase()===value.toLowerCase()&&l!==old)){notify("A location with that name already exists");return;}
    setStore(s=>({...s,
      studios:s.studios.map(st=>st.id===studio.id?{...st,locations:old?st.locations.map(l=>l===old?value:l):[...st.locations,value]}:st),
      items:old?s.items.map(x=>x.studioId===studio.id&&x.location===old?{...x,location:value}:x):s.items}));
    if(old&&activeLocation===old)setActiveLocation(value);
    notify(old?"Location renamed":"Location added");
    setModal(null);
  };
  const saveStudio=(e)=>{e.preventDefault();
    const name=e.currentTarget.elements.namedItem("studioName").value.trim();
    if(!name){setModal(null);return;}
    if(modal?.rename){
      setStore(s=>({...s,studios:s.studios.map(st=>st.id===studio.id?{...st,name}:st)}));
      notify("Studio renamed");
    } else {
      const created={id:uid(),name,locations:[...DEFAULT_LOCATIONS]};
      setStore(s=>({...s,studios:[...s.studios,created]}));
      selectStudio(created.id);
      notify(name+" created");
    }
    setModal(null);
  };
  const exportCSV=()=>{const names=Object.fromEntries(studios.map(s=>[s.id,s.name]));const cols=["id","studio","brand","name","category","serial","location","condition","status"];const csv=[cols.join(","),...store.items.map(x=>cols.map(k=>'"'+String(k==="studio"?names[x.studioId]:x[k]||"").replaceAll('"','""')+'"').join(",")) ].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="jenlow-tools-inventory.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
  const itemThumb=(item)=>{const p=productByModel(item.name);return p&&p.image?<img src={p.image} alt="" loading="lazy"/>:<ProductGlyph/>;};
  const renderItem=(item)=> <button key={item.id} className="inventory-row" onClick={()=>setSelectedItem(item)}>
    <div className="inventory-mini">{itemThumb(item)}</div>
    <div className="item-primary"><strong>{item.name}</strong><span>{item.brand?item.brand+" · ":""}{catName(item.category)}</span></div>
    <span className="row-location"><MapPin size={13}/>{item.location||"No location"}</span><span className={"status-pill "+(item.status==="Available"?"good":"")}>{item.status}</span><ChevronRight className="row-chevron" size={17}/>
  </button>;
  const productCard=(p)=><article className="product-card" key={p.id}>
    <button className="product-photo" onClick={()=>setModal({type:"product",id:p.id})} aria-label={"Details for "+p.brand+" "+p.model}>{p.image?<img src={p.image} alt={p.brand+" "+p.model} loading="lazy"/>:<ProductArt/>}</button>
    <div className="product-card-body">
      <span className="overline">{catName(p.category)}{p.sub?" · "+p.sub:""}</span>
      <h3 onClick={()=>setModal({type:"product",id:p.id})}>{p.brand} {p.model}</h3>
      <p>{p.description}</p>
      <div className="product-actions"><button onClick={()=>openAdd(p)}><Plus size={15}/> Add to studio</button><button className="small-heart" onClick={()=>toggleWish(p.id)} aria-label={"Wishlist "+p.model}><Heart size={17} fill={store.wishlist.includes(p.id)?"currentColor":"none"}/></button></div>
    </div></article>;
  const cmpA=products.find(p=>p.id===compareA), cmpB=products.find(p=>p.id===compareB);
  const cmpSpecs=[...new Set([...Object.keys(cmpA?.specs||{}),...Object.keys(cmpB?.specs||{})])];
  const detail=modal?.type==="product"?products.find(p=>p.id===modal.id):null;

  return <div className="app-shell">
    <div className="app-main">
      <header className="topbar">
        <a className="premium-logo jl-brand" href="#" onClick={e=>{e.preventDefault();setPage("studio");setStudioOpen(false);}} aria-label="JenLow Tools Home"><JlWave/><span className="jl-wordmark"><span className="jl-word">JENLOW</span><span className="jl-tools">TOOLS</span></span></a>
        <nav className="premium-nav" aria-label="Tools navigation">
          {NAV.map(n=><button type="button" key={n.key} className={page===n.key?"is-active":""} onClick={()=>{setPage(n.key);if(n.key==="studio")setStudioOpen(false);}}>{n.label}</button>)}
        </nav>
        <div className="premium-header-actions">
          <button className="premium-icon" title="Add equipment" onClick={()=>openAdd()} aria-label="Add equipment"><Plus size={19}/></button>
          <button className="premium-icon" title="Notifications" onClick={()=>notify("Notifications need a backend connection.")} aria-label="Notifications"><Bell size={18}/></button>
          <button className="premium-avatar" onClick={()=>notify("Account management is not connected yet.")} title="Account">JL</button>
          <a className="ecosystem-link" href="https://jenlow.net" target="_blank" rel="noreferrer" title="JenLow ecosystem"><LayoutGrid size={17}/></a>
        </div>
      </header>
      <main className="main-content">
        {page==="studio"&&<div className="page-studio">
          <div className="studio-main">
            {!studioOpen&&<>
              <section className="premium-studio-hero" role="button" tabIndex={0} aria-label={"Open "+studio.name} onClick={()=>setStudioOpen(true)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setStudioOpen(true);}}}>
                <div className="hero-photography" aria-hidden="true"/>
                <div className="hero-shade" aria-hidden="true"/>
                <div className="hero-content">
                  <div className="hero-topline"><span className="hero-kicker">JENLOW TOOLS / YOUR STUDIO</span><span className="hero-topline-right"><span className="hero-indicator"/> PRIVATE STUDIO</span></div>
                  <div className="hero-center">
                    <span className="hero-pretitle">MY STUDIO</span>
                    <h1>{studio.name}</h1>
                    <p>{activeItems.length} {activeItems.length===1?"item":"items"} across {locations.length} locations. Everything you own, in its place.</p>
                    <div className="hero-buttons">
                      <button className="hero-primary" onClick={e=>{e.stopPropagation();setStudioOpen(true);}}>Open my studio <ArrowUpRight size={19}/></button>
                      <button className="hero-secondary" onClick={e=>{e.stopPropagation();openAdd();}}>Add equipment <ArrowRight size={18}/></button>
                    </div>
                  </div>
                  <nav className="studio-chapters" aria-label="My studios" onClick={e=>e.stopPropagation()}>
                    <span className="chapters-title">MY STUDIOS</span>
                    {studios.map((st,n)=><button key={st.id} className={st.id===studio.id?"active":""} aria-current={st.id===studio.id?"true":undefined} onClick={e=>{e.stopPropagation();selectStudio(st.id);}}><span className="ch-num">{String(n+1).padStart(2,"0")}</span><span className="ch-name">{st.name}</span><span className="ch-count">{store.items.filter(x=>x.studioId===st.id&&x.status!=="Sold").length}</span></button>)}
                    <button className="ch-add" onClick={e=>{e.stopPropagation();setModal({type:"studio"});}}><Plus size={14}/> New studio</button>
                  </nav>
                  <div className="hero-bottomline"><span>STUDIO {String(studios.indexOf(studio)+1).padStart(2,"0")} <i/> {studio.name}</span><span>CLICK TO OPEN · SCROLL FOR OTHER STUDIOS <ArrowRight size={16} style={{transform:"rotate(90deg)"}}/></span></div>
                </div>
              </section>
              <section className="other-studios">
                <div className="other-studios-head"><div><span className="premium-small-caps">DISCOVER</span><h2>Other studios</h2><p>Studios with similar features. Sample entries only: no real studios are listed yet.</p></div></div>
                <div className="studio-cards">{otherStudios.map(o=><button key={o.id} className="studio-card" onClick={()=>notify("Sample studio: illustrative only. Studio pages and booking are not built yet.")}><div className="studio-card-art"><span className="sample-tag">SAMPLE</span>{o.kind.toUpperCase()}</div><h3>{o.name}</h3><p>{o.place} · {o.terms}</p><div className="studio-tags">{o.tags.map(t=><span key={t}>{t}</span>)}</div></button>)}</div>
              </section>
            </>}
            {studioOpen&&<>
              <div className="studio-topbar"><button className="studio-back" onClick={()=>setStudioOpen(false)}><ArrowLeft size={15}/> Overview</button>
                <div className="studio-pick" role="group" aria-label="Switch studio">{studios.map(st=><button key={st.id} className={st.id===studio.id?"active":""} onClick={()=>selectStudio(st.id,true)}>{st.name}</button>)}<button className="pick-add" onClick={()=>setModal({type:"studio"})}><Plus size={13}/> New studio</button></div></div>
              <section className="studio-head">
                <div>
                  <span className="premium-small-caps">YOUR WORKSPACE</span>
                  <h2>{studio.name}</h2>
                  <p className="studio-summary"><strong>{activeItems.length}</strong> {activeItems.length===1?"item":"items"}<i/><strong>{locations.length}</strong> locations<i/><strong>{availableCount}</strong> available<i/>private by default</p>
                </div>
                <div className="heading-buttons"><button className="secondary-button" onClick={()=>setModal({type:"studio",rename:true})}><Pencil size={15}/> Rename</button><button className="secondary-button" onClick={exportCSV}><Download size={16}/> Export CSV</button><button className="primary-button" onClick={()=>openAdd()}><Plus size={17}/> Add equipment</button></div>
              </section>
              <div className="studio-workspace">
                <div className="studio-visual">
                  <Scene items={studioItems} locations={locations} onSelect={l=>setActiveLocation(a=>a===l?"All locations":l)} location={activeLocation} onAdd={()=>openAdd()}/>
                  <div className="premium-room-caption"><span>SAMPLE ROOM</span><span>Select a spot to filter the equipment list</span></div>
                </div>
                <section className="studio-inventory" aria-label="Equipment inventory">
                  <div className="inventory-head"><div><h2>Equipment</h2><p>Each physical item is tracked separately.</p></div><span className="subtle-label">{inventory.length} SHOWN</span></div>
                  <div className="location-chips" role="group" aria-label="Filter by location">
                    <button className={activeLocation==="All locations"?"active":""} onClick={()=>setActiveLocation("All locations")}>All <span>{activeItems.length}</span></button>
                    {locations.map(l=><button key={l} className={activeLocation===l?"active":""} onClick={()=>setActiveLocation(l)}>{l} <span>{countIn(l)}</span></button>)}
                    <button className="chip-action" onClick={()=>setModal({type:"location"})}><Plus size={13}/> Location</button>
                    {activeLocation!=="All locations"&&<button className="chip-action" onClick={()=>setModal({type:"location",rename:activeLocation})}><Pencil size={13}/> Rename</button>}
                  </div>
                  <div className="search-input inventory-search"><Search size={17}/><input placeholder="Search equipment, brand, location or serial…" value={itemSearch} onChange={e=>setItemSearch(e.target.value)}/></div>
                  {inventory.length>0?<div className="inventory-list">{inventory.map(renderItem)}</div>:<div className="empty-state"><div className="empty-icon"><Package size={26}/></div><h3>{activeItems.length?"No matching equipment":"Your studio starts here."}</h3><p>{activeItems.length?"Try a different search or location.":"Add your first microphone, instrument or interface. You'll see it in the list and at its chosen location."}</p><button className="primary-button" onClick={()=>openAdd()}><Plus size={16}/> Add equipment</button></div>}
                </section>
              </div>
              <div className="studio-bottom"><div className="small-feature"><span><Sparkles size={19}/></span><div><strong>Explore your next upgrade</strong><p>Browse the sample catalogue and compare products.</p><button onClick={()=>{setPage("equipment");setExploreTab("browse");}}>Explore equipment <ArrowRight size={15}/></button></div></div><div className="small-feature"><span><ShoppingBag size={19}/></span><div><strong>Make the most of your gear</strong><p>Draft a sale, rental or free loan from an inventory item.</p><button onClick={()=>openOffer()}>Create an offer <ArrowRight size={15}/></button></div></div></div>
            </>}
          </div>
        </div>}

        {page==="equipment"&&<div className="page-equipment">
          <PageHero
            kicker="JENLOW TOOLS / EQUIPMENT" title="Know your gear." accent="Find what's next."
            text="Everything in one catalogue. Search it, compare it, or narrow it to what suits your setup."
            foot={["CATALOGUE · COMPARE · SAVE","BUILT FOR YOUR SETUP"]} variant="mic"
          >
            <div className="hero-search"><Search size={18}/><input aria-label="Search equipment" placeholder="Search any brand, model or category…" value={exploreSearch} onChange={e=>{setExploreSearch(e.target.value);setExploreTab("browse");}} onKeyDown={e=>{if(e.key==="Enter")goToList();}}/></div>
            <div className="hero-chips">{productCategories.map(c=><button key={c.id} onClick={()=>pickCategory(c.id)}>{c.name}</button>)}</div>
          </PageHero>
          <div className="explore-tabs" id="equipment-list">{[{id:"browse",name:"All equipment"},{id:"compare",name:"Compare"}].map(t=><button key={t.id} className={exploreTab===t.id?"current":""} onClick={()=>setExploreTab(t.id)}>{t.name}</button>)}</div>
          {exploreTab==="browse"&&<>
            <div className="explore-toolbar"><div className="search-input explore-search"><Search size={18}/><input placeholder="Search brands, models, categories…" value={exploreSearch} onChange={e=>setExploreSearch(e.target.value)}/></div>
              <button className={"saved-toggle"+(fitOnly?" active":"")} onClick={()=>setFitOnly(v=>!v)} aria-pressed={fitOnly}><Sparkles size={15}/> Fits my setup</button>
              <button className={"saved-toggle"+(exploreSaved?" active":"")} onClick={()=>setExploreSaved(v=>!v)} aria-pressed={exploreSaved}><Heart size={15} fill={exploreSaved?"currentColor":"none"}/> Saved ({store.wishlist.length})</button></div>
            <div className="category-chips" role="group" aria-label="Filter by category"><button className={exploreCategory==="all"?"active":""} onClick={()=>setExploreCategory("all")}>All categories</button>{productCategories.map(c=><button key={c.id} className={exploreCategory===c.id?"active":""} onClick={()=>setExploreCategory(c.id)}>{c.name}</button>)}</div>
            {fitOnly&&<div className="market-info"><Info size={16}/><span>{allActive.length?"Early prototype: this only shows categories you don't own yet. Real compatibility checks (connectors, drivers, your stated needs) are not built.":"Add equipment in My Studio first, so there is a setup to match. Until then this filter shows everything."}</span></div>}
            <div className="product-grid">{displayProducts.map(productCard)}</div>
            {!displayProducts.length&&<div className="empty-state"><p>{exploreSaved&&!store.wishlist.length?"Nothing saved yet. Use the heart on any product to keep it here.":"No matching products. You can always add equipment manually in My Studio."}</p></div>}
            <p className="catalogue-note"><Info size={14}/> {products.length} products across {productCategories.length} categories, compiled from manufacturer and press sources. Last checked {CHECKED_AT}.</p>
          </>}
          {exploreTab==="compare"&&<div className="panel compare-panel"><div className="compare-title"><GitCompareArrows size={24}/><div><h2>Compare products</h2><p>Side-by-side specifications from the catalogue.</p></div></div><div className="compare-selectors"><select value={compareA} onChange={e=>setCompareA(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}</select><span>VS</span><select value={compareB} onChange={e=>setCompareB(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}</select></div>
            <div className="compare-photos"><div>{cmpA?.image&&<img src={cmpA.image} alt={cmpA.model}/>}<strong>{cmpA?.brand} {cmpA?.model}</strong></div><div>{cmpB?.image&&<img src={cmpB.image} alt={cmpB.model}/>}<strong>{cmpB?.brand} {cmpB?.model}</strong></div></div>
            <div className="compare-results"><div className="compare-row"><span>Category</span><strong>{catName(cmpA?.category)}</strong><strong>{catName(cmpB?.category)}</strong></div><div className="compare-row"><span>Type</span><strong>{cmpA?.sub||"—"}</strong><strong>{cmpB?.sub||"—"}</strong></div>{cmpSpecs.map(k=><div className="compare-row" key={k}><span>{k}</span><strong>{cmpA?.specs?.[k]||"—"}</strong><strong>{cmpB?.specs?.[k]||"—"}</strong></div>)}</div></div>}
        </div>}

        {page==="news"&&<NewsPage notify={notify}/>}

        {page==="market"&&<div className="page-market">
          <PageHero
            kicker="JENLOW TOOLS / GEAR EXCHANGE" title="Good equipment." accent="New possibilities."
            text="Browse offers and requests from one professional marketplace."
            foot={["OFFERS · REQUESTS","LEND · RENT · SELL"]} variant="exchange" short
          >
            <div className="hero-buttons">
              <button className="hero-primary" onClick={()=>openOffer()}>Offer equipment <ArrowUpRight size={19}/></button>
              <button className="hero-secondary" onClick={()=>{setRequestForm({title:"",category:"Microphones",location:"",type:"borrow"});setModal({type:"request"});}}>Post a request <ArrowRight size={18}/></button>
            </div>
          </PageHero>
          <div className="market-info"><Info size={16}/><span>Prototype preview: listings marked SAMPLE (including Network request examples) are fictional, and your own drafts are saved only in this browser. No real bookings or payments.</span></div>
          <div className="market-toolbar">
            <div className="market-tabs">{[{key:"all",name:"All"},{key:"offer",name:"Offers"},{key:"request",name:"Requests"}].map(t=><button className={marketTab===t.key?"current":""} key={t.key} onClick={()=>{setMarketTab(t.key);setMarketType("all");}}>{t.name} <span className="tab-count">{marketCount(t.key)}</span></button>)}</div>
            <div className="search-input market-search"><Search size={16}/><input placeholder="Search equipment…" value={marketSearch} onChange={e=>setMarketSearch(e.target.value)}/></div>
          </div>
          <div className="market-layout"><aside className="filter-panel"><div className="filters-heading"><Filter size={16}/> Filters <button onClick={resetMarketFilters}>Reset</button></div><label>TRANSACTION TYPE<select value={marketType} onChange={e=>setMarketType(e.target.value)}><option value="all">All types</option>{typeOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>EQUIPMENT CATEGORY<select value={marketCategory} onChange={e=>setMarketCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>LOCATION<input placeholder="City or region" value={marketLocation} onChange={e=>setMarketLocation(e.target.value)}/></label><label>MAX. PRICE (€)<input type="number" min="0" placeholder="Any price" value={marketPrice} onChange={e=>setMarketPrice(e.target.value)}/></label><label className="filter-checkbox"><input type="checkbox" checked={marketAvailable} onChange={e=>setMarketAvailable(e.target.checked)}/> Available / flexible now</label></aside>
          <div className={"market-results"+(marketTab==="request"?" is-requests":"")}><div className="market-results-head"><div><strong>{marketplace.length} {marketplace.length===1?"result":"results"}</strong><span>{marketIntro}</span></div></div><div className="market-header"><span>EQUIPMENT / REQUEST</span><span>TYPE</span><span>LOCATION</span><span>TERMS</span></div>{marketplace.map(m=><div className="market-row" key={m.id}><div className="market-name"><span className={"market-type-icon "+(m.direction==="request"?"wanted":"")}><Package size={19}/></span><div><strong>{m.title}</strong><span>{catName(m.category)} · {m.source==="network"?"Network preview":m.mine?"Your draft":"JenLow Tools"}{m.isSample?<em className="sample-tag">SAMPLE</em>:null}</span></div></div><div><span className={"market-label "+(m.direction==="request"?"wanted":"")}>{marketLabel(m)}</span></div><span className="market-city"><MapPin size={13}/>{m.location}</span><div className="market-end"><strong>{m.direction==="request"?<span className="terms-open">Open to offers</span>:m.type==="sell"?"€"+m.price:m.type==="rent"?"€"+m.price+"/day":"Free"}</strong><button className="market-open" aria-label={"Open "+m.title} onClick={()=>m.isSample?notify("This is illustrative sample data, not an active public request or offer."):m.mine?notify("This draft exists only in this browser until the backend is connected."):notify("Messaging is not connected yet.")}><ArrowUpRight size={17}/></button></div></div>)}{marketplace.length===0&&<div className="empty-state"><h3>No matching results</h3><p>Try removing a filter or post an equipment request.</p><button className="secondary-button" onClick={()=>{resetMarketFilters();setMarketTab("all");}}>Clear filters</button></div>}</div></div>
          <div className="market-cta"><div><strong>{marketTab==="request"?"Can you help with one of these?":marketTab==="offer"?"Looking for something that is not listed?":"Not finding what you need?"}</strong><span>{marketTab==="request"?"Offer a piece of equipment you do not use right now.":"Post a request and let people with the right gear find you."}</span></div><div className="market-cta-actions"><button className="secondary-button" onClick={()=>openOffer()}>Offer equipment</button><button className="primary-button" onClick={()=>{setRequestForm({title:"",category:"Microphones",location:"",type:"borrow"});setModal({type:"request"});}}>Post a request</button></div></div>
          <div className="market-footnote"><ShieldCheck size={17}/> Lending, renting and selling use different terms. Insurance, payment processing and identity verification are not implemented in this prototype.</div>
        </div>}

        {page==="tools"&&<ToolsPage notify={notify}/>}
      </main>
    </div>
    {!store.setupComplete&&<Onboarding state={{...store,studioName:studios[0].name}} onComplete={changes=>setStore(s=>({...s,...changes,studios:s.studios.map((st,i)=>i===0?{...st,name:changes.studioName}:st),setupComplete:true}))} onAdd={()=>openAdd()}/>}
    {modal?.type==="add"&&<Modal title="Add equipment" subtitle={"Register what you physically own in "+studio.name+". Each copy gets its own record."} onClose={()=>setModal(null)}><form className="form-grid" onSubmit={addItem}><label className="full">Equipment model / name<input required autoFocus value={itemForm.name} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} list="suggested-models" placeholder="e.g. Shure SM58"/><datalist id="suggested-models">{products.map(p=><option value={p.model} key={p.id}/>)}</datalist></label><label>Brand<input value={itemForm.brand} onChange={e=>setItemForm(f=>({...f,brand:e.target.value}))} placeholder="e.g. Shure"/></label><label>Category<select value={itemForm.category} onChange={e=>setItemForm(f=>({...f,category:e.target.value}))}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Physical location<select value={itemForm.location} onChange={e=>setItemForm(f=>({...f,location:e.target.value}))}><option value="">No location yet</option>{locations.map(c=><option key={c}>{c}</option>)}</select></label><label>Condition<select value={itemForm.condition} onChange={e=>setItemForm(f=>({...f,condition:e.target.value}))}>{["New","Excellent","Good","Fair","Needs repair"].map(c=><option key={c}>{c}</option>)}</select></label><label>Quantity<input type="number" min="1" max="30" value={itemForm.quantity} onChange={e=>setItemForm(f=>({...f,quantity:e.target.value}))}/></label><label>Serial number <span>optional, for 1 item</span><input value={itemForm.serial} disabled={Number(itemForm.quantity)>1} onChange={e=>setItemForm(f=>({...f,serial:e.target.value}))} placeholder="Serial number"/></label><div className="form-note full"><Info size={16}/>{Number(itemForm.quantity)>1?"We'll create "+itemForm.quantity+" separate item records, not one combined item.":"This item stays private until you explicitly create a marketplace offer."}</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Save equipment</button></div></form></Modal>}
    {modal?.type==="offer"&&<Modal title="Offer equipment" subtitle="Pick an item from My Studio, or describe one here. Its inventory record stays private." onClose={()=>setModal(null)}><form className="form-grid" onSubmit={createOffer}><label className="full">Equipment<select required value={offerForm.itemId} onChange={e=>setOfferForm(f=>({...f,itemId:e.target.value}))}>{allActive.map(i=><option key={i.id} value={i.id}>{i.name} · {i.location||"No location"}{studios.length>1?" · "+(studios.find(s=>s.id===i.studioId)?.name||""):""} · {i.id.slice(-5)}</option>)}<option value="__new">+ Something not in My Studio yet…</option></select></label>{offerForm.itemId==="__new"&&<><label className="full">Equipment model / name<input required autoFocus value={offerForm.newName} onChange={e=>setOfferForm(f=>({...f,newName:e.target.value}))} list="suggested-models" placeholder="e.g. Shure SM58"/><datalist id="suggested-models">{products.map(p=><option value={p.model} key={p.id}/>)}</datalist></label><label>Brand<input value={offerForm.newBrand} onChange={e=>setOfferForm(f=>({...f,newBrand:e.target.value}))} placeholder="e.g. Shure"/></label><label>Category<select value={offerForm.newCategory} onChange={e=>setOfferForm(f=>({...f,newCategory:e.target.value}))}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></>}<label className="full">Transaction<select value={offerForm.type} onChange={e=>setOfferForm(f=>({...f,type:e.target.value}))}><option value="rent">Rent out (paid, return expected)</option><option value="lend">Lend (free, return expected)</option><option value="sell">Sell (ownership transfer)</option></select></label>{offerForm.type!=="lend"&&<label>Price (€) {offerForm.type==="rent"?"per day":""}<input required min="0" type="number" value={offerForm.price} onChange={e=>setOfferForm(f=>({...f,price:e.target.value}))} placeholder="0"/></label>}<label>Location<input value={offerForm.location} onChange={e=>setOfferForm(f=>({...f,location:e.target.value}))} placeholder="City or region"/></label><label className="full">Availability<select value={offerForm.availability} onChange={e=>setOfferForm(f=>({...f,availability:e.target.value}))}><option>Available</option><option>Flexible</option><option>By request</option></select></label><div className="form-note full"><Info size={16}/>{offerForm.itemId==="__new"?"This also adds the item to your private My Studio inventory, so you never enter it twice. Local draft only: nothing is published.":"This creates a local draft only. Online bookings, payments, deposits and insurance are not enabled."}</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit">Save offer draft <ArrowRight size={16}/></button></div></form></Modal>}
    {modal?.type==="request"&&<Modal title="Post an equipment request" subtitle="Looking to borrow, buy or rent something? Start with a simple request." onClose={()=>setModal(null)}><form className="form-grid" onSubmit={createRequest}><label className="full">What equipment do you need?<input required autoFocus placeholder="e.g. Two condenser microphones" value={requestForm.title} onChange={e=>setRequestForm(f=>({...f,title:e.target.value}))}/></label><label>Category<select value={requestForm.category} onChange={e=>setRequestForm(f=>({...f,category:e.target.value}))}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Request type<select value={requestForm.type} onChange={e=>setRequestForm(f=>({...f,type:e.target.value}))}><option value="borrow">Borrow for free</option><option value="rent">Looking to rent</option><option value="sell">Looking to buy</option></select></label><label className="full">Location<input placeholder="City or region" value={requestForm.location} onChange={e=>setRequestForm(f=>({...f,location:e.target.value}))}/></label><div className="form-note full"><Info size={16}/>Saved in your browser only. Publishing to other people requires a backend.</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="primary-button">Save request draft <ArrowRight size={16}/></button></div></form></Modal>}
    {detail&&<Modal title={detail.brand+" "+detail.model} subtitle={catName(detail.category)+(detail.sub?" · "+detail.sub:"")} onClose={()=>setModal(null)}><div className="product-detail">
      <div className="pd-media">{detail.image?<img src={detail.image} alt={detail.brand+" "+detail.model}/>:<ProductArt/>}{detail.imageCredit&&<span className="pd-credit">© {detail.imageCredit}</span>}</div>
      <div className="pd-body">
        <p className="pd-desc">{detail.description}</p>
        {detail.usage&&<p className="pd-usage"><strong>Typical use. </strong>{detail.usage}</p>}
        {detail.strengths?.length>0&&<div className="pd-points"><span className="overline">STRENGTHS</span><ul>{detail.strengths.map(s=><li key={s}>{s}</li>)}</ul></div>}
        {detail.limitations?.length>0&&<div className="pd-points pd-limits"><span className="overline">LIMITATIONS</span><ul>{detail.limitations.map(s=><li key={s}>{s}</li>)}</ul></div>}
        {detail.specs&&Object.keys(detail.specs).length>0&&<div className="pd-specs">{Object.entries(detail.specs).map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>}
        {detail.sources?.length>0&&<div className="pd-sources"><span className="overline">SOURCES</span><div>{detail.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div></div>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={()=>toggleWish(detail.id)}><Heart size={16} fill={store.wishlist.includes(detail.id)?"currentColor":"none"}/> {store.wishlist.includes(detail.id)?"Saved":"Save"}</button><button type="button" className="primary-button" onClick={()=>openAdd(detail)}><Plus size={16}/> Add to my studio</button></div>
      </div></div></Modal>}
    {modal?.type==="location"&&<Modal title={modal.rename?"Rename location":"New location"} subtitle={modal.rename?"Equipment in this location moves with the new name.":"A shelf, cupboard, rack or another storage space in "+studio.name+"."} onClose={()=>setModal(null)}><form onSubmit={saveLocation} className="form-grid"><label className="full">Location name<input autoFocus name="locationName" required defaultValue={modal.rename||""} placeholder="e.g. Guitar wall, Flight cases, Living room"/></label><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit">{modal.rename?"Save name":"Add location"}</button></div></form></Modal>}
    {modal?.type==="studio"&&<Modal title={modal.rename?"Rename studio":"New studio"} subtitle={modal.rename?"This is the title of your studio page.":"A separate space with its own rooms and equipment, such as a second home studio or a rehearsal room."} onClose={()=>setModal(null)}><form onSubmit={saveStudio} className="form-grid"><label className="full">Studio name<input autoFocus name="studioName" required defaultValue={modal.rename?studio.name:"Studio "+(studios.length+1)} placeholder="e.g. Studio 2, Rehearsal room"/></label><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit">{modal.rename?"Save name":"Create studio"}</button></div></form></Modal>}
    {selectedItem&&<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedItem(null);}}><aside className="item-drawer"><div className="drawer-top"><span className="overline">PHYSICAL EQUIPMENT ITEM</span><button className="icon-button" onClick={()=>setSelectedItem(null)} aria-label="Close item"><X size={20}/></button></div><div className="drawer-art">{productByModel(selectedItem.name)?.image?<img src={productByModel(selectedItem.name).image} alt=""/>:<ProductArt accent="blue"/>}</div><h2>{selectedItem.name}</h2><p>{selectedItem.brand||catName(selectedItem.category)}</p><span className="id-tag">{selectedItem.id}</span><div className="drawer-fields"><label>Location<select value={store.items.find(i=>i.id===selectedItem.id)?.location??""} onChange={e=>updateItem(selectedItem.id,{location:e.target.value})}><option value="">No location</option>{(studios.find(s=>s.id===selectedItem.studioId)||studio).locations.map(l=><option key={l}>{l}</option>)}</select></label><label>Condition<select value={store.items.find(i=>i.id===selectedItem.id)?.condition||selectedItem.condition} onChange={e=>updateItem(selectedItem.id,{condition:e.target.value})}>{["New","Excellent","Good","Fair","Needs repair"].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={store.items.find(i=>i.id===selectedItem.id)?.status||selectedItem.status} onChange={e=>updateItem(selectedItem.id,{status:e.target.value})}>{["Available","In use","Lent out","Rented out","In repair","Sold"].map(x=><option key={x}>{x}</option>)}</select></label><label>Serial number<input placeholder="Optional" defaultValue={selectedItem.serial} onBlur={e=>updateItem(selectedItem.id,{serial:e.target.value})}/></label></div><div className="drawer-actions"><button className="primary-button wide" onClick={()=>{const id=selectedItem.id;setSelectedItem(null);openOffer(id);}}><ShoppingBag size={16}/> Sell, rent or lend this item</button><button className="secondary-button wide" onClick={()=>{if(window.confirm("Remove this physical item from My Studio?"))deleteItem(selectedItem.id);}}><Trash2 size={16}/> Remove item</button></div><p className="drawer-hint"><ShieldCheck size={15}/> Private inventory record. Listing it requires an explicit offer.</p></aside></div>}
    {toast&&<div className="toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast("")} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>;
}
export default App;
