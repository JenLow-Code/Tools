import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Bell,
  Box, Boxes, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardList,
  Compass, Download, ExternalLink, Filter, GitCompareArrows, Heart, Home,
  Info, Layers3, LayoutGrid, List, MapPin, Menu, Mic2, MoreHorizontal,
  Package, Plus, Radio, Search, Settings2, ShieldCheck, ShoppingBag, SlidersHorizontal,
  Sparkles, Tag, Trash2, Upload, Warehouse, X
} from "lucide-react";
import "./styles.css";

const KEY = "jenlow-tools-front-v1";
const BASE = {
  setupComplete: false, studioName: "My Home Studio", purpose: "Music production", daw: "",
  items: [], listings: [], requests: [], wishlist: [], locations: ["Desk", "Rack", "Storage", "Cellar"]
};
const products = [
  {id:"scarlett", brand:"Focusrite", name:"Scarlett 2i2 (4th Gen)", category:"Audio interfaces", connection:"USB-C", use:"Recording", accent:"orange", icon:"interface", note:"Compact 2-input recording interface"},
  {id:"sm7b", brand:"Shure", name:"SM7B", category:"Microphones", connection:"XLR", use:"Voice / broadcast", accent:"slate", icon:"mic", note:"Dynamic vocal microphone"},
  {id:"hs5", brand:"Yamaha", name:"HS5", category:"Monitors", connection:"XLR / TRS", use:"Monitoring", accent:"blue", icon:"speaker", note:"Active nearfield studio monitor"},
  {id:"minilab", brand:"Arturia", name:"MiniLab 3", category:"Controllers", connection:"USB / MIDI", use:"Music production", accent:"sand", icon:"keys", note:"Compact MIDI keyboard controller"},
  {id:"nt1", brand:"RØDE", name:"NT1", category:"Microphones", connection:"XLR", use:"Recording", accent:"purple", icon:"mic", note:"Condenser studio microphone"},
  {id:"dt770", brand:"beyerdynamic", name:"DT 770 PRO", category:"Headphones", connection:"Analog audio", use:"Monitoring", accent:"indigo", icon:"headphones", note:"Closed-back studio headphones"}
];
const demoMarket = [
  {id:"demo1", title:"Pair of stage microphones", category:"Microphones", location:"Geneva", direction:"request", type:"lend", price:0, source:"Network preview", availability:"Flexible", demo:true},
  {id:"demo2", title:"Audio interface, 2 inputs", category:"Audio interfaces", location:"Annemasse", direction:"request", type:"rent", price:0, source:"Network preview", availability:"This month", demo:true},
  {id:"demo3", title:"Shure SM7B", category:"Microphones", location:"Lyon", direction:"offer", type:"rent", price:18, source:"Tools demo", availability:"Available", demo:true},
  {id:"demo4", title:"Yamaha HS5 (pair)", category:"Monitors", location:"Annecy", direction:"offer", type:"sell", price:240, source:"Tools demo", availability:"Available", demo:true}
];
const newsSamples = [
  {eyebrow:"PRODUCT WATCH", title:"What to check before choosing a new audio interface", description:"Inputs, outputs, drivers and your actual recording workflow.", icon:"interface"},
  {eyebrow:"STUDIO GUIDE", title:"Understanding monitor connections", description:"A practical way to compare the ports on speakers and interfaces.", icon:"speaker"},
  {eyebrow:"EQUIPMENT CARE", title:"Build a reliable maintenance checklist", description:"Keep your inventory records useful long after the first setup.", icon:"mic"}
];
const uid = () => "jl-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,8);
function readStore() {
  try { return {...BASE,...JSON.parse(localStorage.getItem(KEY) || "{}")}; }
  catch { return BASE; }
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
function Scene({items,onSelect,location,onAdd}) {
  const count = (loc) => items.filter(x => x.location === loc && x.status !== "Sold").length;
  const locs = [{name:"Desk",left:"40%",top:"67%"},{name:"Rack",left:"74%",top:"44%"},{name:"Storage",left:"82%",top:"75%"},{name:"Cellar",left:"14%",top:"75%"}];
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
      <div className="welcome-brand"><span className="brand-mark"><AudioLines size={23}/></span> jenlow<span>tools.</span></div>
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
  const [page,setPage]=useState("studio");
  const [studioTab,setStudioTab]=useState("overview");
  const [activeLocation,setActiveLocation]=useState("All locations");
  const [itemSearch,setItemSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [selectedItem,setSelectedItem]=useState(null);
  const [exploreTab,setExploreTab]=useState("recommended");
  const [exploreSearch,setExploreSearch]=useState("");
  const [compareA,setCompareA]=useState("scarlett");
  const [compareB,setCompareB]=useState("sm7b");
  const [marketTab,setMarketTab]=useState("all");
  const [marketType,setMarketType]=useState("all");
  const [marketCategory,setMarketCategory]=useState("all");
  const [marketLocation,setMarketLocation]=useState("");
  const [marketPrice,setMarketPrice]=useState("");
  const [marketAvailable,setMarketAvailable]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [itemForm,setItemForm]=useState({name:"",brand:"",category:"Microphones",location:"Desk",quantity:1,serial:"",condition:"Good"});
  const [offerForm,setOfferForm]=useState({type:"rent",price:"",location:"",availability:"Available",itemId:""});
  const [requestForm,setRequestForm]=useState({title:"",category:"Microphones",location:"",type:"borrow"});
  useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(store));},[store]);
  useEffect(()=>{if(toast){const h=setTimeout(()=>setToast(""),3800);return()=>clearTimeout(h);}},[toast]);
  const activeItems=store.items.filter(x=>x.status!=="Sold");
  const inventory=activeItems.filter(x=>(activeLocation==="All locations"||x.location===activeLocation)&&(x.name+" "+x.brand+" "+x.category).toLowerCase().includes(itemSearch.toLowerCase()));
  const userOffers=store.listings.map(o=>({...o,direction:"offer",source:"My listing",demo:false}));
  const userRequests=store.requests.map(o=>({...o,direction:"request",source:"My request",demo:false}));
  const marketplace=[...userOffers,...userRequests,...demoMarket].filter(x=>(marketTab==="all"||x.direction===marketTab)&&(marketType==="all"||x.type===marketType)&&(marketCategory==="all"||x.category===marketCategory)&&(!marketLocation||x.location.toLowerCase().includes(marketLocation.toLowerCase()))&&(!marketAvailable||x.availability==="Available"||x.availability==="Flexible")&&(!marketPrice||x.direction==="request"||Number(x.price)<=Number(marketPrice)));
  const displayProducts=products.filter(p=>(p.brand+" "+p.name+" "+p.category).toLowerCase().includes(exploreSearch.toLowerCase()));
  const notify=(s)=>setToast(s);
  const openAdd=(product)=>{setItemForm({name:product?.name||"",brand:product?.brand||"",category:product?.category||"Microphones",location:activeLocation==="All locations"?"Desk":activeLocation,quantity:1,serial:"",condition:"Good"});setModal({type:"add"});};
  const openOffer=(id)=>{setOfferForm({type:"rent",price:"",location:"",availability:"Available",itemId:id||activeItems[0]?.id||""});setModal({type:"offer"});};
  const addItem=(e)=>{e.preventDefault();if(!itemForm.name.trim())return;const count=Math.min(30,Math.max(1,Number(itemForm.quantity)||1));const added=Array.from({length:count},(_,i)=>({id:uid(),name:itemForm.name.trim(),brand:itemForm.brand.trim(),category:itemForm.category,location:itemForm.location,condition:itemForm.condition,serial:count===1?itemForm.serial.trim():"",status:"Available",addedAt:new Date().toISOString()}));setStore(s=>({...s,items:[...s.items,...added]}));setModal(null);notify(count+" item"+(count>1?"s":"")+" added to My Studio");};
  const updateItem=(id,change)=>setStore(s=>({...s,items:s.items.map(x=>x.id===id?{...x,...change}:x)}));
  const deleteItem=(id)=>{setStore(s=>({...s,items:s.items.filter(x=>x.id!==id),listings:s.listings.filter(x=>x.itemId!==id)}));setSelectedItem(null);notify("Item removed from inventory");};
  const createOffer=(e)=>{e.preventDefault();const item=store.items.find(x=>x.id===offerForm.itemId);if(!item)return;const offer={id:uid(),itemId:item.id,title:item.name,category:item.category,location:offerForm.location.trim()||"Location not set",type:offerForm.type,price:Number(offerForm.price)||0,availability:offerForm.availability};setStore(s=>({...s,listings:[offer,...s.listings]}));setModal(null);notify("Draft offer created locally · not published online");};
  const createRequest=(e)=>{e.preventDefault();if(!requestForm.title.trim())return;setStore(s=>({...s,requests:[{id:uid(),title:requestForm.title.trim(),category:requestForm.category,location:requestForm.location.trim()||"Location not set",type:requestForm.type,price:0,availability:"Flexible"},...s.requests]}));setModal(null);notify("Request saved locally · not visible to others");};
  const exportCSV=()=>{const cols=["id","brand","name","category","serial","location","condition","status"];const csv=[cols.join(","),...store.items.map(x=>cols.map(k=>'"'+String(x[k]||"").replaceAll('"','""')+'"').join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="jenlow-tools-inventory.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
  const renderItem=(item)=> <button key={item.id} className="inventory-row" onClick={()=>setSelectedItem(item)}>
    <div className="inventory-mini"><ProductGlyph kind={products.find(p=>p.name===item.name)?.icon||"mic"}/></div>
    <div className="item-primary"><strong>{item.name}</strong><span>{item.brand?item.brand+" · ":""}{item.category}</span></div>
    <span className="row-location"><MapPin size={13}/>{item.location}</span><span className={"status-pill "+(item.status==="Available"?"good":"")}>{item.status}</span><ChevronRight className="row-chevron" size={17}/>
  </button>;
  return <div className="app-shell">
    <aside className={"sidebar"+(menuOpen?" open":"")}>
      <div className="sidebar-brand"><span className="brand-icon"><AudioLines size={24}/></span><span className="brand-type">jenlow<span>tools.</span></span></div>
      <div className="sidebar-caption">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {[{key:"studio",icon:Home,label:"My Studio"},{key:"explore",icon:Compass,label:"Explore"},{key:"market",icon:ShoppingBag,label:"Marketplace"}].map(n=><button key={n.key} className={"nav-link"+(page===n.key?" current":"")} onClick={()=>{setPage(n.key);setMenuOpen(false);}}><n.icon size={19}/>{n.label}{page===n.key&&<span className="nav-current-dot"/>}</button>)}
      </nav>
      <div className="sidebar-caption with-space">MY LOCATIONS</div>
      <div className="sidebar-locations">{store.locations.map(loc=><button key={loc} className={"location-link"+(page==="studio"&&activeLocation===loc?" selected":"")} onClick={()=>{setPage("studio");setActiveLocation(loc);setStudioTab("inventory");setMenuOpen(false);}}><span className="location-indicator"/>{loc}<span>{activeItems.filter(x=>x.location===loc).length}</span></button>)}</div>
      <button className="sidebar-add" onClick={()=>setModal({type:"location"})}><Plus size={15}/> New location</button>
      <div className="sidebar-spacer"/>
      <div className="sidebar-note"><span className="note-orb"><ShieldCheck size={17}/></span><div><strong>Private by default</strong><p>Your inventory is visible only to you in this prototype.</p></div></div>
      <div className="sidebar-bottom"><a href="https://network.jenlow.net/" target="_blank" rel="noreferrer"><LayoutGrid size={16}/> JenLow apps <ExternalLink size={13}/></a><div className="sidebar-version">TOOLS / FRONTEND PREVIEW 0.1</div></div>
    </aside>
    {menuOpen&&<button className="mobile-scrim" aria-label="Close menu" onClick={()=>setMenuOpen(false)}/>}
    <div className="app-main">
      <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={()=>setMenuOpen(!menuOpen)}><Menu size={21}/></button><div className="breadcrumbs"><span>JenLow Tools</span><ChevronRight size={14}/><strong>{page==="studio"?"My Studio":page==="explore"?"Explore":"Marketplace"}</strong></div><div className="top-actions"><span className="top-prototype">INTERACTIVE PROTOTYPE</span><button className="icon-button" aria-label="Notifications" onClick={()=>notify("Notifications will connect to a backend in a later phase.")}><Bell size={19}/></button><button className="avatar" aria-label="Account demo" onClick={()=>notify("Account management is not connected yet.")}>JL</button></div></header>
      <main className="main-content">
        {page==="studio"&&<div className="page-studio">
          <div className="page-heading"><div><span className="overline">MY WORKSPACE / HOME STUDIO</span><h1>{store.studioName}</h1><p>Everything you own, where it belongs.</p></div><div className="heading-buttons"><button className="secondary-button" onClick={exportCSV}><Download size={16}/> Export inventory</button><button className="primary-button" onClick={()=>openAdd()}><Plus size={17}/> Add equipment</button></div></div>
          <div className="stats-grid"><div className="stat-card"><div className="stat-label"><Boxes size={17}/> TOTAL EQUIPMENT</div><strong>{store.items.length}</strong><span>Individually tracked items</span></div><div className="stat-card"><div className="stat-label"><LayoutGrid size={17}/> LOCATIONS</div><strong>{store.locations.length}</strong><span>Organized spaces</span></div><div className="stat-card"><div className="stat-label"><CheckCircle2 size={17}/> AVAILABLE</div><strong>{activeItems.filter(x=>x.status==="Available").length}</strong><span>Ready to use or offer</span></div></div>
          <div className="section-title-row"><div><h2>Your workspace</h2><p>Select a location to see what's there.</p></div><span className="subtle-label"><span className="blue-dot"/> 2D SAMPLE STUDIO</span></div>
          <Scene items={store.items} onSelect={l=>{setActiveLocation(l);setStudioTab("inventory");}} location={activeLocation} onAdd={()=>openAdd()}/>
          <div className="section-title-row inventory-heading"><div><h2>Equipment inventory</h2><p>Each physical item is tracked separately.</p></div><div className="segmented"><button className={studioTab==="overview"?"active":""} onClick={()=>{setStudioTab("overview");setActiveLocation("All locations");}}>All items</button><button className={studioTab==="inventory"?"active":""} onClick={()=>setStudioTab("inventory")}>By location</button></div></div>
          <div className="panel inventory-panel"><div className="inventory-toolbar"><div className="search-input"><Search size={17}/><input placeholder="Search your equipment..." value={itemSearch} onChange={e=>setItemSearch(e.target.value)}/></div><select value={activeLocation} onChange={e=>setActiveLocation(e.target.value)}><option>All locations</option>{store.locations.map(l=><option key={l}>{l}</option>)}</select></div>
            {inventory.length>0?<div className="inventory-list">{inventory.map(renderItem)}</div>:<div className="empty-state"><div className="empty-icon"><Package size={26}/></div><h3>{activeItems.length?"No matching equipment":"Your studio starts here."}</h3><p>{activeItems.length?"Try a different search or location.":"Add your first microphone, instrument or interface. You'll see it in the inventory and its chosen location."}</p><button className="primary-button" onClick={()=>openAdd()}><Plus size={16}/> Add equipment</button></div>}
          </div>
          <div className="studio-bottom"><div className="small-feature"><span><Sparkles size={19}/></span><div><strong>Explore your next upgrade</strong><p>Find equipment suggestions using your actual setup as context.</p><button onClick={()=>{setPage("explore");setExploreTab("recommended");}}>Explore equipment <ArrowRight size={15}/></button></div></div><div className="small-feature"><span><ShoppingBag size={19}/></span><div><strong>Make the most of your gear</strong><p>List an inventory item for sale, rent or free lending.</p><button onClick={()=>activeItems.length?openOffer():openAdd()}>Create an offer <ArrowRight size={15}/></button></div></div></div>
        </div>}
        {page==="explore"&&<div className="page-explore">
          <div className="page-heading"><div><span className="overline">EXPLORE / EQUIPMENT INTELLIGENCE</span><h1>Discover what fits.</h1><p>Research equipment, compare your options and keep learning.</p></div></div>
          <div className="explore-hero"><div><span className="overline pale">BETTER CHOICES START HERE</span><h2>Build a setup that<br/>works for you.</h2><p>Start from what you already own—or discover freely.</p></div><div className="hero-decoration"><div className="hero-big-ring"/><Mic2 size={104} strokeWidth={1}/></div></div>
          <div className="explore-tabs">{[{id:"recommended",name:"For my setup"},{id:"compare",name:"Compare"},{id:"browse",name:"All equipment"},{id:"news",name:"News & guides"}].map(t=><button key={t.id} className={exploreTab===t.id?"current":""} onClick={()=>setExploreTab(t.id)}>{t.name}</button>)}</div>
          {exploreTab==="recommended"&&<><div className="section-title-row"><div><h2>Equipment worth exploring</h2><p>{store.items.length?"Based on your setup preferences and equipment categories.":"Add equipment to My Studio for more personalized suggestions."}</p></div><span className="note-outline"><Info size={14}/> Suggestions are illustrative</span></div><div className="product-grid">{products.slice(0,4).map(p=><article className="product-card" key={p.id}><ProductArt kind={p.icon} accent={p.accent}/><div className="product-card-body"><span className="overline">{p.category}</span><h3>{p.brand} {p.name}</h3><p>{p.note}</p><div className="product-actions"><button onClick={()=>openAdd(p)}><Plus size={15}/> Add to studio</button><button className="small-heart" onClick={()=>{setStore(s=>({...s,wishlist:s.wishlist.includes(p.id)?s.wishlist.filter(x=>x!==p.id):[...s.wishlist,p.id]}));}} aria-label={"Wishlist "+p.name}><Heart size={17} fill={store.wishlist.includes(p.id)?"currentColor":"none"}/></button></div></div></article>)}</div></>}
          {exploreTab==="compare"&&<div className="panel compare-panel"><div className="compare-title"><GitCompareArrows size={24}/><div><h2>Compare products</h2><p>A starter comparison of basic product attributes. Not an acoustic or performance assessment.</p></div></div><div className="compare-selectors"><select value={compareA} onChange={e=>setCompareA(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}</select><span>VS</span><select value={compareB} onChange={e=>setCompareB(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}</select></div><div className="compare-results">{["Category","Connection","Typical use"].map((label,i)=><div className="compare-row" key={label}><span>{label}</span><strong>{[products.find(p=>p.id===compareA)?.category,products.find(p=>p.id===compareA)?.connection,products.find(p=>p.id===compareA)?.use][i]}</strong><strong>{[products.find(p=>p.id===compareB)?.category,products.find(p=>p.id===compareB)?.connection,products.find(p=>p.id===compareB)?.use][i]}</strong></div>)}</div></div>}
          {exploreTab==="browse"&&<><div className="search-input explore-search"><Search size={18}/><input placeholder="Search brands, models, categories..." value={exploreSearch} onChange={e=>setExploreSearch(e.target.value)}/></div><div className="product-grid">{displayProducts.map(p=><article className="product-card" key={p.id}><ProductArt kind={p.icon} accent={p.accent}/><div className="product-card-body"><span className="overline">{p.category}</span><h3>{p.brand} {p.name}</h3><p>{p.note}</p><div className="product-actions"><button onClick={()=>openAdd(p)}><Plus size={15}/> Add to studio</button><button className="small-heart" onClick={()=>setStore(s=>({...s,wishlist:s.wishlist.includes(p.id)?s.wishlist.filter(x=>x!==p.id):[...s.wishlist,p.id]}))}><Heart size={17} fill={store.wishlist.includes(p.id)?"currentColor":"none"}/></button></div></div></article>)}</div>{!displayProducts.length&&<div className="empty-state">No matching sample products. You can always add equipment manually in My Studio.</div>}</>}
          {exploreTab==="news"&&<><div className="section-title-row"><div><h2>News & practical guides</h2><p>Editorial layout preview. No live news service is connected yet.</p></div></div><div className="news-list">{newsSamples.map((n,i)=><div className="news-row" key={n.title}><ProductArt kind={n.icon} accent={["blue","slate","purple"][i]} small/><div><span className="overline">{n.eyebrow} · EXAMPLE</span><h3>{n.title}</h3><p>{n.description}</p></div><ArrowUpRight size={18}/></div>)}</div></>}
        </div>}
        {page==="market"&&<div className="page-market">
          <div className="page-heading"><div><span className="overline">MARKETPLACE / EQUIPMENT EXCHANGE</span><h1>Equipment in motion.</h1><p>Buy, sell, rent, lend—or find what others are looking for.</p></div><div className="heading-buttons"><button className="secondary-button" onClick={()=>{setRequestForm({title:"",category:"Microphones",location:"",type:"borrow"});setModal({type:"request"});}}><Search size={17}/> Post a request</button><button className="primary-button" onClick={()=>activeItems.length?openOffer():openAdd()}><Plus size={17}/> Offer equipment</button></div></div>
          <div className="market-info"><Info size={17}/><span>This is a frontend preview. Sample listings—including Network request examples—are fictional; your own drafts are saved only in this browser. No real bookings or payments.</span></div>
          <div className="market-tabs">{[{key:"all",name:"All listings"},{key:"offer",name:"Available offers"},{key:"request",name:"Equipment wanted"}].map(t=><button className={marketTab===t.key?"current":""} key={t.key} onClick={()=>setMarketTab(t.key)}>{t.name}</button>)}</div>
          <div className="market-layout"><aside className="filter-panel"><div className="filters-heading"><Filter size={16}/> Filters <button onClick={()=>{setMarketType("all");setMarketCategory("all");setMarketLocation("");setMarketPrice("");setMarketAvailable(false);}}>Reset</button></div><label>TRANSACTION TYPE<select value={marketType} onChange={e=>setMarketType(e.target.value)}><option value="all">All types</option><option value="sell">Buy / sell</option><option value="rent">Rent</option><option value="lend">Lend for free</option><option value="borrow">Borrow request</option></select></label><label>EQUIPMENT CATEGORY<select value={marketCategory} onChange={e=>setMarketCategory(e.target.value)}><option value="all">All categories</option>{["Microphones","Audio interfaces","Monitors","Controllers","Headphones","Instruments","Other"].map(c=><option key={c}>{c}</option>)}</select></label><label>LOCATION<input placeholder="City or region" value={marketLocation} onChange={e=>setMarketLocation(e.target.value)}/></label><label>MAX. PRICE (€)<input type="number" min="0" placeholder="Any price" value={marketPrice} onChange={e=>setMarketPrice(e.target.value)}/></label><label className="filter-checkbox"><input type="checkbox" checked={marketAvailable} onChange={e=>setMarketAvailable(e.target.checked)}/> Available / flexible now</label></aside>
          <div className="market-results"><div className="market-results-head"><div><strong>{marketplace.length} results</strong><span>Offers and requests in one place</span></div><span className="table-mode"><List size={16}/> List view</span></div><div className="market-header"><span>EQUIPMENT / REQUEST</span><span>TYPE</span><span>LOCATION</span><span>TERMS</span></div>{marketplace.map(m=><div className="market-row" key={m.id}><div className="market-name"><span className={"market-type-icon "+(m.direction==="request"?"wanted":"")}><Package size={19}/></span><div><strong>{m.title}</strong><span>{m.category} · {m.source}</span></div></div><div><span className={"market-label "+(m.direction==="request"?"wanted":"")}>{m.direction==="request"?"Wanted":m.type==="sell"?"For sale":m.type==="rent"?"For rent":"Free lending"}</span></div><span className="market-city"><MapPin size={13}/>{m.location}</span><div className="market-end"><strong>{m.direction==="request"?"Looking for":m.type==="sell"?"€"+m.price:m.type==="rent"?"€"+m.price+"/day":"Free"}</strong><button className="market-open" onClick={()=>m.demo?notify("This is illustrative demo data—not an active public request or offer."):notify("This draft exists only in this browser. Online messaging is not connected yet.")}><ArrowUpRight size={17}/></button></div></div>)}{marketplace.length===0&&<div className="empty-state"><h3>No matching results</h3><p>Try removing a filter or post an equipment request.</p><button className="secondary-button" onClick={()=>{setMarketType("all");setMarketCategory("all");setMarketLocation("");setMarketPrice("");setMarketAvailable(false);setMarketTab("all");}}>Clear filters</button></div>}</div></div>
          <div className="market-footnote"><ShieldCheck size={17}/> Lending, renting and selling use different terms. Insurance, payment processing and identity verification are not implemented in this prototype.</div>
        </div>}
      </main>
    </div>
    {!store.setupComplete&&<Onboarding state={store} onComplete={changes=>setStore(s=>({...s,...changes,setupComplete:true}))} onAdd={()=>openAdd()}/>}
    {modal?.type==="add"&&<Modal title="Add equipment" subtitle="Register what you physically own. Each copy gets its own record." onClose={()=>setModal(null)}><form className="form-grid" onSubmit={addItem}><label className="full">Equipment model / name<input required autoFocus value={itemForm.name} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} list="suggested-models" placeholder="e.g. Shure SM58"/><datalist id="suggested-models">{products.map(p=><option value={p.name} key={p.id}/>)}</datalist></label><label>Brand<input value={itemForm.brand} onChange={e=>setItemForm(f=>({...f,brand:e.target.value}))} placeholder="e.g. Shure"/></label><label>Category<select value={itemForm.category} onChange={e=>setItemForm(f=>({...f,category:e.target.value}))}>{["Microphones","Audio interfaces","Monitors","Controllers","Headphones","Instruments","Accessories","Other"].map(c=><option key={c}>{c}</option>)}</select></label><label>Physical location<select value={itemForm.location} onChange={e=>setItemForm(f=>({...f,location:e.target.value}))}>{store.locations.map(c=><option key={c}>{c}</option>)}</select></label><label>Condition<select value={itemForm.condition} onChange={e=>setItemForm(f=>({...f,condition:e.target.value}))}>{["New","Excellent","Good","Fair","Needs repair"].map(c=><option key={c}>{c}</option>)}</select></label><label>Quantity<input type="number" min="1" max="30" value={itemForm.quantity} onChange={e=>setItemForm(f=>({...f,quantity:e.target.value}))}/></label><label>Serial number <span>optional, for 1 item</span><input value={itemForm.serial} disabled={Number(itemForm.quantity)>1} onChange={e=>setItemForm(f=>({...f,serial:e.target.value}))} placeholder="Serial number"/></label><div className="form-note full"><Info size={16}/>{Number(itemForm.quantity)>1?"We'll create "+itemForm.quantity+" separate item records, not one combined item.":"This item stays private until you explicitly create a marketplace offer."}</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Save equipment</button></div></form></Modal>}
    {modal?.type==="offer"&&<Modal title="Offer equipment" subtitle="Select an item from My Studio. Its inventory record stays private." onClose={()=>setModal(null)}><form className="form-grid" onSubmit={createOffer}><label className="full">Equipment<select required value={offerForm.itemId} onChange={e=>setOfferForm(f=>({...f,itemId:e.target.value}))}>{activeItems.map(i=><option key={i.id} value={i.id}>{i.name} · {i.location} · {i.id.slice(-5)}</option>)}</select></label><label className="full">Transaction<select value={offerForm.type} onChange={e=>setOfferForm(f=>({...f,type:e.target.value}))}><option value="rent">Rent out (paid, return expected)</option><option value="lend">Lend (free, return expected)</option><option value="sell">Sell (ownership transfer)</option></select></label>{offerForm.type!=="lend"&&<label>Price (€) {offerForm.type==="rent"?"per day":""}<input required min="0" type="number" value={offerForm.price} onChange={e=>setOfferForm(f=>({...f,price:e.target.value}))} placeholder="0"/></label>}<label>Location<input value={offerForm.location} onChange={e=>setOfferForm(f=>({...f,location:e.target.value}))} placeholder="City or region"/></label><label className="full">Availability<select value={offerForm.availability} onChange={e=>setOfferForm(f=>({...f,availability:e.target.value}))}><option>Available</option><option>Flexible</option><option>By request</option></select></label><div className="form-note full"><Info size={16}/>This creates a local draft only. Online bookings, payments, deposits and insurance are not enabled.</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit">Save offer draft <ArrowRight size={16}/></button></div></form></Modal>}
    {modal?.type==="request"&&<Modal title="Post an equipment request" subtitle="Looking to borrow, buy or rent something? Start with a simple request." onClose={()=>setModal(null)}><form className="form-grid" onSubmit={createRequest}><label className="full">What equipment do you need?<input required autoFocus placeholder="e.g. Two condenser microphones" value={requestForm.title} onChange={e=>setRequestForm(f=>({...f,title:e.target.value}))}/></label><label>Category<select value={requestForm.category} onChange={e=>setRequestForm(f=>({...f,category:e.target.value}))}>{["Microphones","Audio interfaces","Monitors","Controllers","Headphones","Instruments","Accessories","Other"].map(c=><option key={c}>{c}</option>)}</select></label><label>Request type<select value={requestForm.type} onChange={e=>setRequestForm(f=>({...f,type:e.target.value}))}><option value="borrow">Borrow for free</option><option value="rent">Looking to rent</option><option value="sell">Looking to buy</option></select></label><label className="full">Location<input placeholder="City or region" value={requestForm.location} onChange={e=>setRequestForm(f=>({...f,location:e.target.value}))}/></label><div className="form-note full"><Info size={16}/>Saved in your browser only. Publishing to other people requires a backend.</div><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="primary-button">Save request draft <ArrowRight size={16}/></button></div></form></Modal>}
    {modal?.type==="location"&&<Modal title="New location" subtitle="A shelf, cupboard, rack or another storage space." onClose={()=>setModal(null)}><form onSubmit={e=>{e.preventDefault();const input=e.currentTarget.elements.namedItem("locationName");const value=input?.value?.trim();if(value&&!store.locations.includes(value)){setStore(s=>({...s,locations:[...s.locations,value]}));notify("Location added");}setModal(null);}} className="form-grid"><label className="full">Location name<input autoFocus name="locationName" required placeholder="e.g. Guitar wall, Flight cases, Living room"/></label><div className="form-actions full"><button type="button" className="secondary-button" onClick={()=>setModal(null)}>Cancel</button><button className="primary-button" type="submit">Add location</button></div></form></Modal>}
    {selectedItem&&<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedItem(null);}}><aside className="item-drawer"><div className="drawer-top"><span className="overline">PHYSICAL EQUIPMENT ITEM</span><button className="icon-button" onClick={()=>setSelectedItem(null)} aria-label="Close item"><X size={20}/></button></div><div className="drawer-art"><ProductArt kind={products.find(p=>p.name===selectedItem.name)?.icon||"mic"} accent="blue"/></div><h2>{selectedItem.name}</h2><p>{selectedItem.brand||selectedItem.category}</p><span className="id-tag">{selectedItem.id}</span><div className="drawer-fields"><label>Location<select value={store.items.find(i=>i.id===selectedItem.id)?.location||selectedItem.location} onChange={e=>updateItem(selectedItem.id,{location:e.target.value})}>{store.locations.map(l=><option key={l}>{l}</option>)}</select></label><label>Condition<select value={store.items.find(i=>i.id===selectedItem.id)?.condition||selectedItem.condition} onChange={e=>updateItem(selectedItem.id,{condition:e.target.value})}>{["New","Excellent","Good","Fair","Needs repair"].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={store.items.find(i=>i.id===selectedItem.id)?.status||selectedItem.status} onChange={e=>updateItem(selectedItem.id,{status:e.target.value})}>{["Available","In use","Lent out","Rented out","In repair","Sold"].map(x=><option key={x}>{x}</option>)}</select></label><label>Serial number<input placeholder="Optional" defaultValue={selectedItem.serial} onBlur={e=>updateItem(selectedItem.id,{serial:e.target.value})}/></label></div><div className="drawer-actions"><button className="primary-button wide" onClick={()=>{const id=selectedItem.id;setSelectedItem(null);openOffer(id);}}><ShoppingBag size={16}/> Sell, rent or lend this item</button><button className="secondary-button wide" onClick={()=>{if(window.confirm("Remove this physical item from My Studio?"))deleteItem(selectedItem.id);}}><Trash2 size={16}/> Remove item</button></div><p className="drawer-hint"><ShieldCheck size={15}/> Private inventory record. Listing it requires an explicit offer.</p></aside></div>}
    {toast&&<div className="toast" role="status"><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast("")} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>;
}
export default App;
