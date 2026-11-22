/* eslint-disable @next/next/no-img-element -- art is fixed-size decorative artwork driven by the source CSS */
import type { ReactNode } from "react";
import { A } from "./data";

function Rod({ extra = "" }: { extra?: string }) {
  return (
    <div className={`royale-scroll__rod ${extra}`.trim()}>
      <img className="royale-scroll__knob royale-scroll__knob--left" src={`${A}/knob-left-1.svg`} alt="" draggable={false} />
      <img className="royale-scroll__roll" src={`${A}/roll-top1.svg`} alt="" draggable={false} />
      <img className="royale-scroll__knob royale-scroll__knob--right" src={`${A}/knob-3.svg`} alt="" draggable={false} />
    </div>
  );
}

/** One unrolling scroll card: bloom behind, the sheet in its window, rods top and bottom. */
export function ScrollCard({ id, card, children }: { id: string; card: string; children: ReactNode }) {
  return (
    <article className="royale-scroll" id={id} data-card={card}>
      <img className="royale-scroll__bloom" src={`${A}/floral2.webp`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="royale-scroll__window">
        <div className="royale-scroll__sheet">
          {children}
          <img className="royale-scroll__divider" src={`${A}/divider.webp`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="royale-scroll__rod royale-scroll__rod--top" aria-hidden="true">
        <img className="royale-scroll__knob royale-scroll__knob--left" src={`${A}/knob-left-1.svg`} alt="" draggable={false} />
        <img className="royale-scroll__roll" src={`${A}/roll-top1.svg`} alt="" draggable={false} />
        <img className="royale-scroll__knob royale-scroll__knob--right" src={`${A}/knob-3.svg`} alt="" draggable={false} />
      </div>
      <div className="royale-scroll__roller" aria-hidden="true">
        <Rod extra="royale-scroll__rod--bottom" />
      </div>
    </article>
  );
}
