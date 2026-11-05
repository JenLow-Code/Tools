import React, { useState } from "react";
import { ArrowUpRight, Bell, Info, Languages, ShieldCheck } from "lucide-react";
import PageHero from "./PageHero.jsx";
import { newsEvents, newsReleases, newsReviews } from "./data.js";

const TABS = [
  {id: "all", name: "All"},
  {id: "reviews", name: "Reviews"},
  {id: "releases", name: "New releases"},
  {id: "events", name: "Events"}
];

export default function NewsPage({notify}) {
  const [tab, setTab] = useState("all");
  const [showOriginal, setShowOriginal] = useState({});
  const [alerts, setAlerts] = useState({});
  const show = (k) => tab === "all" || tab === k;
  const toggle = (setter, id) => setter(s => ({...s, [id]: !s[id]}));

  return <div className="page-news">
    <PageHero
      kicker="JENLOW TOOLS / NEWS" title="What's new." accent="What's worth it."
      text="Reviews, new releases and events, translated automatically when you need it."
      foot={["REVIEWS · RELEASES · EVENTS", "SAMPLE CONTENT"]}
      variant="news"
    />
    <div className="market-info news-note"><Info size={16}/><span>Prototype preview: everything on this page is placeholder content. No real reviews, releases or events are connected yet, and translation is only shown as an interface idea.</span></div>
    <div className="explore-tabs news-tabs">{TABS.map(t => <button key={t.id} className={tab === t.id ? "current" : ""} onClick={() => setTab(t.id)}>{t.name}</button>)}</div>

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
