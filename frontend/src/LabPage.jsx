import React from "react";
import { Info, Lock, Music, QrCode, Scissors, Smartphone } from "lucide-react";
import PageHero from "./PageHero.jsx";
import { labTools } from "./data.js";

const ICONS = {phone: Smartphone, split: Scissors, music: Music, qr: QrCode};

export default function LabPage({notify}) {
  return <div className="page-lab">
    <PageHero
      kicker="JENLOW TOOLS / LAB" title="Built to make" accent="production easier."
      text="A growing set of small tools for the way you work. Planned as one membership instead of paying per tool."
      foot={["TOOLS FOR PRODUCTION", "MEMBERSHIP PLANNED"]}
      variant="lab" short
    >
      <div className="hero-buttons"><button className="hero-primary" onClick={() => notify("Membership is not available yet. This is a prototype.")}>Join the waiting list</button></div>
    </PageHero>
    <div className="market-info"><Info size={16}/><span>None of these tools exist yet. This page shows what each one would do and how it would work, so we can decide what to build first. Membership details and pricing are not decided.</span></div>
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
    <section className="lab-membership">
      <span className="premium-small-caps">MEMBERSHIP · PLANNED</span>
      <h2>One membership, all the tools.</h2>
      <p>The idea: instead of buying each tool separately, members get access to the whole Lab as it grows. Whether that is a subscription, a one-time fee or something else is still open.</p>
    </section>
  </div>;
}
