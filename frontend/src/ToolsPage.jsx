import React, { useEffect, useState } from "react";
import { Info, Lock, Music, QrCode, Scissors, Smartphone } from "lucide-react";
import PageHero from "./PageHero.jsx";
import { tools as seedTools } from "./data.js";
import { fetchTools } from "./api.js";

const ICONS = {phone: Smartphone, split: Scissors, music: Music, qr: QrCode};

export default function ToolsPage({notify}) {
  const [labTools, setLabTools] = useState(seedTools);
  useEffect(() => { fetchTools().then((d) => { if (Array.isArray(d) && d.length) setLabTools(d); }); }, []);
  return <div className="page-tools">
    <PageHero
      kicker="MEMBERSHIP · PLANNED" title="One membership," accent="all the tools."
      text="The idea: instead of buying each tool separately, members get access to every tool as the set grows. Whether that is a subscription, a one-time fee or something else is still open."
      foot={["SMALL TOOLS FOR PRODUCTION", "NOT AVAILABLE YET"]}
      variant="lab" short
    >
      <div className="hero-buttons"><button className="hero-primary" onClick={() => notify("Membership is not available yet. This is a prototype.")}>Join the waiting list</button></div>
    </PageHero>
    <div className="market-info"><Info size={16}/><span>None of these tools exist yet. This page shows what each one would do and how it would work, so we can decide what to build first. Membership details and pricing are not decided.</span></div>
    <div className="tools-intro"><h2>Built to make production easier.</h2><p>A growing set of small tools for the way you work.</p></div>
    <div className="lab-grid">{labTools.map(t => {
      const Icon = ICONS[t.icon] || Music;
      return <article className="lab-card" key={t.id}>
        <div className="lab-card-head"><span className="lab-icon"><Icon size={22}/></span><span className={"lab-status " + t.status.toLowerCase()}>{t.status.toUpperCase()}</span></div>
        <h3>{t.name}</h3>
        <p>{t.text}</p>
        <div className="lab-how"><span className="overline">HOW IT WORKS</span><ol>{t.steps.map(s => <li key={s}>{s}</li>)}</ol></div>
        <p className="lab-note">{t.note}</p>
        <div className="lab-foot"><Lock size={14}/> Part of the planned membership</div>
      </article>;
    })}</div>
  </div>;
}
