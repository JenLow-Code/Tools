import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bell, Info, Languages, ShieldCheck } from "lucide-react";
import { newsEvents, newsReleases, newsReviews } from "./data.js";

const TABS = [
  {id: "all", name: "All"},
  {id: "reviews", name: "Reviews"},
  {id: "releases", name: "New releases"},
  {id: "events", name: "Events"}
];


/* Top carousel: one slide for each kind of news (latest review, release alert, upcoming event). */
function NewsCarousel({notify, goTo}) {
  const review = newsReviews[0], release = newsReleases[0], event = newsEvents[0];
  const slides = [
    {id: "review", tab: "reviews", label: "Latest review", cta: "Read the review", art: "t-review",
     title: review.title, text: review.excerpt, meta: [review.product, review.by]},
    {id: "release", tab: "releases", label: "New release alert", cta: "See new releases", art: "t-release",
     title: release.title, text: release.maker + " · " + release.category + " · " + release.when, meta: ["Alerts need an account"]},
    {id: "event", tab: "events", label: "Upcoming event", cta: "See events", art: "t-event",
     title: event.title, text: event.day + " " + event.month + " · " + event.place + " · " + event.kind, meta: ["Invented date"]}
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n) => setI((n + slides.length) % slides.length);
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI(x => (x + 1) % slides.length), 7000);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);

  return <section className="page-hero news-carousel" aria-roledescription="carousel" aria-label="Highlights"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="nc-top"><span className="hero-kicker">JENLOW TOOLS / NEWS</span><span className="nc-sample">SAMPLE CONTENT</span></div>
    <div className="nc-slides">{slides.map((sl, n) => <div key={sl.id} className={"nc-slide" + (n === i ? " on" : "")} aria-hidden={n !== i} role="group" aria-roledescription="slide" aria-label={(n + 1) + " of " + slides.length}>
      <div className={"page-hero-art nc-art " + sl.art} aria-hidden="true"/>
      <div className="page-hero-shade" aria-hidden="true"/>
      <div className="nc-copy">
        <span className="nc-label">{sl.label}</span>
        <h1>{sl.title}</h1>
        <p>{sl.text}</p>
        <div className="nc-meta">{sl.meta.map(m => <span key={m}>{m}</span>)}</div>
        <div className="hero-buttons"><button className="hero-primary" tabIndex={n === i ? 0 : -1} onClick={() => goTo(sl.tab)}>{sl.cta} <ArrowUpRight size={19}/></button></div>
      </div>
    </div>)}</div>
    <div className="nc-foot">
      <div className="nc-chapters" role="tablist" aria-label="Choose a highlight">{slides.map((sl, n) => <button key={sl.id} role="tab" aria-selected={n === i} className={n === i ? "on" : ""} onClick={() => setI(n)}>
        <span className="nc-bar"><i key={n === i ? "run" + i + paused : "idle"} className={n === i && !paused ? "run" : ""}/></span>
        <span className="nc-num">{String(n + 1).padStart(2, "0")}</span><span className="nc-name">{sl.label}</span>
      </button>)}</div>
      <div className="nc-arrows"><button aria-label="Previous highlight" onClick={() => go(i - 1)}><ArrowLeft size={18}/></button><button aria-label="Next highlight" onClick={() => go(i + 1)}><ArrowRight size={18}/></button></div>
    </div>
  </section>;
}

export default function NewsPage({notify}) {
  const [tab, setTab] = useState("all");
  const [showOriginal, setShowOriginal] = useState({});
  const [alerts, setAlerts] = useState({});
  const show = (k) => tab === "all" || tab === k;
  const toggle = (setter, id) => setter(s => ({...s, [id]: !s[id]}));

  return <div className="page-news">
    <NewsCarousel notify={notify} goTo={(t) => { setTab(t); const el = document.getElementById("news-tabs"); if (el) el.scrollIntoView({behavior: "smooth", block: "start"}); }}/>
    <div className="market-info news-note"><Info size={16}/><span>Prototype preview: everything on this page is placeholder content. No real reviews, releases or events are connected yet, and translation is only shown as an interface idea.</span></div>
    <div className="explore-tabs news-tabs" id="news-tabs">{TABS.map(t => <button key={t.id} className={tab === t.id ? "current" : ""} onClick={() => setTab(t.id)}>{t.name}</button>)}</div>

    {show("reviews") && <section className="news-section">
      <div className="news-section-head"><div><h2>Latest reviews</h2><p>Written by people who own the gear, with a verified-owner badge once My Studio is connected.</p></div></div>
      <div className="review-grid">{newsReviews.map(r => {
        const orig = !!showOriginal[r.id];
        return <article className="review-card" key={r.id}>
          <div className="review-meta"><span className="overline">{r.product.toUpperCase()}</span><span className="sample-tag">SAMPLE</span></div>
          <h3>{r.title}</h3>
          <p>{orig ? r.original : r.excerpt}</p>
          <div className="review-foot">
            <span className="review-by">{r.by === "Verified owner" && <ShieldCheck size={14}/>}{r.by}</span>
            {r.original && <button className="review-translate" onClick={() => toggle(setShowOriginal, r.id)}><Languages size={14}/>{orig ? "Show translation" : "Translated from " + r.lang + " · Show original"}</button>}
          </div>
        </article>;
      })}</div>
    </section>}

    {show("releases") && <section className="news-section">
      <div className="news-section-head"><div><h2>New release alerts</h2><p>Be told when something new appears in a category you care about. Firmware and safety notices will only come from verified sources.</p></div></div>
      <div className="release-list">{newsReleases.map(r => <div className="release-row" key={r.id}>
        <div><span className="overline">{r.category.toUpperCase()} · {r.when.toUpperCase()}</span><h3>{r.title}</h3><p>{r.maker} <span className="sample-tag">SAMPLE</span></p></div>
        <button className={"alert-toggle" + (alerts[r.id] ? " active" : "")} aria-pressed={!!alerts[r.id]} onClick={() => { toggle(setAlerts, r.id); notify("Alerts need a backend connection. This only changes the button for now."); }}><Bell size={14}/>{alerts[r.id] ? "Alert on" : "Alert me"}</button>
      </div>)}</div>
    </section>}

    {show("events") && <section className="news-section">
      <div className="news-section-head"><div><h2>Upcoming events</h2><p>Meetups, swap days and workshops. Sample entries with invented dates.</p></div></div>
      <div className="event-list">{newsEvents.map(e => <button className="event-row" key={e.id} onClick={() => notify("Sample event: illustrative only.")}>
        <div className="event-date"><strong>{e.day}</strong><span>{e.month}</span></div>
        <div className="event-main"><span className="overline">{e.kind.toUpperCase()}</span><h3>{e.title}</h3><p>{e.place} <span className="sample-tag">SAMPLE</span></p></div>
        <ArrowUpRight size={18}/>
      </button>)}</div>
    </section>}
  </div>;
}
