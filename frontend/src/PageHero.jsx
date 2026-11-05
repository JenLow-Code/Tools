import React from "react";

/* Shared hero used by Equipment, News, Gear Exchange and Lab.
   variant picks the background art (see .page-hero-art in premium.css).
   short = lower hero for the more functional pages. */
export default function PageHero({kicker, title, accent, text, foot = [], variant = "mic", short = false, children}) {
  return (
    <section className={"page-hero" + (short ? " is-short" : "")}>
      <div className={"page-hero-art art-" + variant} aria-hidden="true"/>
      <div className="page-hero-shade" aria-hidden="true"/>
      <div className="page-hero-copy">
        <span className="hero-kicker">{kicker}</span>
        <h1>{title}<br/><em>{accent}</em></h1>
        <p>{text}</p>
        {children}
      </div>
      <div className="premium-hero-foot">{foot.map(f => <span key={f}>{f}</span>)}</div>
    </section>
  );
}
