import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bell, Info, MapPin } from "lucide-react";
import PageHero from "./PageHero.jsx";
import { news as seedNews, releases as seedReleases, events as seedEvents } from "./data.js";
import { fetchNews } from "./api.js";

const TABS = [
  {id: "all", name: "All"},
  {id: "reviews", name: "Reviews"},
  {id: "articles", name: "News"},
  {id: "releases", name: "Releases"},
  {id: "events", name: "Events"},
];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.getDate() + " " + MONTHS[d.getMonth()].charAt(0) + MONTHS[d.getMonth()].slice(1).toLowerCase() + " " + d.getFullYear();
};
const dayPart = (iso) => { const d = new Date(iso); return isNaN(d) ? ["--",""] : [String(d.getDate()).padStart(2,"0"), MONTHS[d.getMonth()]]; };

function Carousel({slides, goTo}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n) => setI((n + slides.length) % slides.length);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearTimeout(t);
  }, [i, paused, slides.length]);
  if (!slides.length) return null;

  return <section className="page-hero news-carousel" aria-roledescription="carousel" aria-label="Highlights"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="nc-top"><span className="hero-kicker">JENLOW TOOLS / NEWS</span><span className="nc-sample">UPDATED {slides[0].checked || ""}</span></div>
    <div className="nc-slides">{slides.map((sl, n) => <div key={sl.id} className={"nc-slide" + (n === i ? " on" : "")} aria-hidden={n !== i} role="group" aria-roledescription="slide">
      <div className="page-hero-art nc-art" style={sl.image ? {backgroundImage: `linear-gradient(90deg,#07121eea,#0b1929b0 45%,#0b192955),url('${sl.image}')`} : undefined} aria-hidden="true"/>
      <div className="page-hero-shade" aria-hidden="true"/>
      <div className="nc-copy">
        <span className="nc-label">{sl.label}</span>
        <h1>{sl.title}</h1>
        <p>{sl.text}</p>
        <div className="nc-meta">{sl.meta.filter(Boolean).map((m) => <span key={m}>{m}</span>)}</div>
        <div className="hero-buttons"><button className="hero-primary" tabIndex={n === i ? 0 : -1} onClick={() => goTo(sl.tab)}>{sl.cta} <ArrowUpRight size={19}/></button></div>
      </div>
    </div>)}</div>
    <div className="nc-foot">
      <div className="nc-chapters" role="tablist" aria-label="Choose a highlight">{slides.map((sl, n) => <button key={sl.id} role="tab" aria-selected={n === i} className={n === i ? "on" : ""} onClick={() => setI(n)}>
        <span className="nc-bar"><i className={n === i && !paused ? "run" : ""}/></span>
        <span className="nc-num">{String(n + 1).padStart(2, "0")}</span><span className="nc-name">{sl.label}</span>
      </button>)}</div>
      <div className="nc-arrows"><button aria-label="Previous" onClick={() => go(i - 1)}><ArrowLeft size={18}/></button><button aria-label="Next" onClick={() => go(i + 1)}><ArrowRight size={18}/></button></div>
    </div>
  </section>;
}

export default function NewsPage({notify}) {
  const [tab, setTab] = useState("all");
  const [alerts, setAlerts] = useState({});
  const [data, setData] = useState({news: seedNews, releases: seedReleases, events: seedEvents});
  useEffect(() => { fetchNews().then((d) => { if (d && Array.isArray(d.news)) setData(d); }); }, []);

  const reviews = data.news.filter((n) => n.section === "Tests");
  const articles = data.news.filter((n) => n.section !== "Tests");
  const show = (k) => tab === "all" || tab === k;
  const jumpTo = (t) => { setTab(t); const el = document.getElementById("news-tabs"); if (el) el.scrollIntoView({behavior: "smooth", block: "start"}); };

  const slides = [
    reviews[0] && {id: "s-review", tab: "reviews", label: "Latest review", title: reviews[0].title, text: reviews[0].summary, image: reviews[0].image, cta: "Read the reviews", meta: [reviews[0].sourceName, fmtDate(reviews[0].date)]},
    data.releases[0] && {id: "s-release", tab: "releases", label: "New release", title: data.releases[0].title, text: data.releases[0].summary, image: data.releases[0].image, cta: "See new releases", meta: [data.releases[0].family, fmtDate(data.releases[0].date)]},
    data.events[0] && {id: "s-event", tab: "events", label: "Upcoming event", title: data.events[0].title, text: data.events[0].summary, image: data.events[0].image, cta: "See events", meta: [data.events[0].location, fmtDate(data.events[0].start)]},
  ].filter(Boolean);

  return <div className="page-news">
    <Carousel slides={slides} goTo={jumpTo}/>
    <div className="market-info news-note"><Info size={16}/><span>Editorial content compiled from manufacturer announcements and independent press. Source links open the original article; translation into your language is planned.</span></div>
    <div className="explore-tabs news-tabs" id="news-tabs">{TABS.map((t) => <button key={t.id} className={tab === t.id ? "current" : ""} onClick={() => setTab(t.id)}>{t.name}</button>)}</div>

    {show("reviews") && reviews.length > 0 && <section className="news-section">
      <div className="news-section-head"><div><h2>Latest reviews</h2><p>Independent tests of studio gear, with a link to the full article.</p></div></div>
      <div className="review-grid">{reviews.map((r) => <article className="review-card" key={r.id}>
        {r.image && <div className="review-photo"><img src={r.image} alt={r.imageAlt || ""} loading="lazy"/></div>}
        <div className="review-meta"><span className="overline">{r.category}</span><span className="review-date">{fmtDate(r.date)}</span></div>
        <h3>{r.title}</h3>
        <p>{r.summary}</p>
        <div className="review-foot">
          <span className="review-by">{r.sourceName}</span>
          {r.source && <a className="review-translate" href={r.source} target="_blank" rel="noreferrer">Read the review <ArrowUpRight size={14}/></a>}
        </div>
      </article>)}</div>
    </section>}

    {show("articles") && articles.length > 0 && <section className="news-section">
      <div className="news-section-head"><div><h2>News &amp; technique</h2><p>What is changing across the studio-gear world.</p></div></div>
      <div className="review-grid">{articles.map((r) => <article className="review-card" key={r.id}>
        {r.image && <div className="review-photo"><img src={r.image} alt={r.imageAlt || ""} loading="lazy"/></div>}
        <div className="review-meta"><span className="overline">{r.category}</span><span className="review-date">{fmtDate(r.date)}</span></div>
        <h3>{r.title}</h3>
        <p>{r.summary}</p>
        <div className="review-foot"><span className="review-by">{r.sourceName}</span>{r.source && <a className="review-translate" href={r.source} target="_blank" rel="noreferrer">Read more <ArrowUpRight size={14}/></a>}</div>
      </article>)}</div>
    </section>}

    {show("releases") && <section className="news-section">
      <div className="news-section-head"><div><h2>New releases</h2><p>Freshly announced gear. Turn on an alert for the categories you care about.</p></div></div>
      <div className="release-list">{data.releases.map((r) => <div className="release-row" key={r.id}>
        <div><span className="overline">{r.family} · {fmtDate(r.date)}</span><h3>{r.title}</h3><p>{r.summary} <span className="review-by">· {r.sourceName}</span></p></div>
        <button className={"alert-toggle" + (alerts[r.id] ? " active" : "")} aria-pressed={!!alerts[r.id]} onClick={() => { setAlerts((s) => ({...s, [r.id]: !s[r.id]})); notify("Alerts need an account. This only changes the button for now."); }}><Bell size={14}/>{alerts[r.id] ? "Alert on" : "Alert me"}</button>
      </div>)}</div>
    </section>}

    {show("events") && <section className="news-section">
      <div className="news-section-head"><div><h2>Upcoming events</h2><p>Trade shows, open days and meetups for studio and live-sound gear.</p></div></div>
      <div className="event-list">{data.events.map((e) => { const [day, month] = dayPart(e.start); return <a className="event-row" key={e.id} href={e.source || undefined} target={e.source ? "_blank" : undefined} rel="noreferrer">
        <div className="event-date"><strong>{day}</strong><span>{month}</span></div>
        <div className="event-main"><span className="overline">{e.kind}</span><h3>{e.title}</h3><p><MapPin size={12}/> {e.location}{e.venue ? " · " + e.venue : ""}</p><p className="event-summary">{e.summary}</p></div>
        <ArrowUpRight size={18}/>
      </a>; })}</div>
    </section>}
  </div>;
}
