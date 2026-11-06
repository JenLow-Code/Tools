import React, { useEffect, useState } from "react";
import { Info, Lock, Music, QrCode, Scissors, Smartphone } from "lucide-react";
import PageHero from "./PageHero.jsx";
import { tools as seedTools } from "./data.js";
import { fetchTools } from "./api.js";
import { useT } from "./i18n.jsx";

const ICONS = {phone: Smartphone, split: Scissors, music: Music, qr: QrCode};

export default function ToolsPage({notify}) {
  const { t } = useT();
  const [labTools, setLabTools] = useState(seedTools);
  useEffect(() => { fetchTools().then((d) => { if (Array.isArray(d) && d.length) setLabTools(d); }); }, []);
  return <div className="page-tools">
    <PageHero
      kicker={t("MEMBERSHIP · PLANNED")} title={t("One membership,")} accent={t("all the tools.")}
      text={t("The idea: instead of buying each tool separately, members get access to every tool as the set grows. Whether that is a subscription, a one-time fee or something else is still open.")}
      foot={[t("SMALL TOOLS FOR PRODUCTION"), t("NOT AVAILABLE YET")]}
      variant="lab" short
    >
      <div className="hero-buttons"><button className="hero-primary" onClick={() => notify(t("Membership is not available yet. This is a prototype."))}>{t("Join the waiting list")}</button></div>
    </PageHero>
    <div className="market-info"><Info size={16}/><span>{t("None of these tools exist yet. This page shows what each one would do and how it would work, so we can decide what to build first. Membership details and pricing are not decided.")}</span></div>
    <div className="tools-intro"><h2>{t("Built to make production easier.")}</h2><p>{t("A growing set of small tools for the way you work.")}</p></div>
    <div className="lab-grid">{labTools.map(tool => {
      const Icon = ICONS[tool.icon] || Music;
      return <article className="lab-card" key={tool.id}>
        <div className="lab-card-head"><span className="lab-icon"><Icon size={22}/></span><span className={"lab-status " + tool.status.toLowerCase()}>{t(tool.status).toUpperCase()}</span></div>
        <h3>{t(tool.name)}</h3>
        <p>{t(tool.text)}</p>
        <div className="lab-how"><span className="overline">{t("HOW IT WORKS")}</span><ol>{tool.steps.map(s => <li key={s}>{t(s)}</li>)}</ol></div>
        <p className="lab-note">{t(tool.note)}</p>
        <div className="lab-foot"><Lock size={14}/> {t("Part of the planned membership")}</div>
      </article>;
    })}</div>
  </div>;
}
