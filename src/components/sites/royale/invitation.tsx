"use client";
/* eslint-disable @next/next/no-img-element -- the source stylesheet sizes and layers these images itself */

import { useEffect, useSyncExternalStore, type CSSProperties } from "react";

const noopSubscribe = () => () => {};
import {
  initCeremonyCards,
  initDateReveal,
  initGallery,
  initGate,
  initHeroVideo,
  initOutro,
  initScrollCue,
  initScrolls,
  initSmoothScroll,
} from "./behaviors";
import {
  A,
  CEREMONIES,
  COMPLIMENTS,
  FAMILIES,
  FRAMES,
  GUEST_GREETING_DEFAULT,
  HERO_BANNER_LOC,
  HERO_BANNER_TITLE,
 
  HERO_WELCOME,
  INTRO_NOTE,
  INVOCATION,
  INVOCATION_LANG,
  NOTE,
  OUTRO_MESSAGE,
  WEDDING_DATE,
  type GalleryFrame,
} from "./data";
import { CEREMONY_PANEL } from "./paths";
import { PlaqueFrame } from "./plaque";
import { ScrollCard } from "./scroll-card";
import { Social } from "./social";

const Tear = ({ pos, lazy = true }: { pos: "top" | "bottom"; lazy?: boolean }) => (
  <img
    className={`ry-tear ry-tear--${pos}`}
    src={`${A}/section_divider.svg`}
    alt=""
    aria-hidden="true"
    loading={lazy ? "lazy" : undefined}
    decoding={lazy ? "async" : undefined}
  />
);

function Frame({ f }: { f: GalleryFrame }) {
  return (
    <div className={`gframe gframe--${f.kind}`} style={{ "--hang": `${f.hang}px` } as CSSProperties}>
      <span className="gframe__hook" aria-hidden="true" />
      <svg className="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M50 0L0 100M50 0L100 100" />
        <path className="gframe__twist" d="M50 0L0 100M50 0L100 100" />
      </svg>
      <div className="gframe__body">
        <span className="gframe__side gframe__side--top" />
        <span className="gframe__side gframe__side--right" />
        <span className="gframe__side gframe__side--bottom" />
        <span className="gframe__side gframe__side--left" />
        <div className="gframe__face">
          <div className="gframe__lip">
            {f.kind === "story" ? (
              <div className="gframe__mat gframe__story">
                <p>{f.story}</p>
              </div>
            ) : (
              <figure className="gframe__mat">
                <div className="gframe__photo">
                  <span className="gframe__placeholder">Your photo here</span>
                </div>
                <figcaption className="gframe__caption">{f.caption}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoyaleInvitation() {
  const guest = useSyncExternalStore(
    noopSubscribe,
    () => {
      const params = new URLSearchParams(window.location.search);
      return params.get("to") || GUEST_GREETING_DEFAULT;
    },
    () => GUEST_GREETING_DEFAULT,
  );

  useEffect(() => {
    const cleanups = [initGate(), initHeroVideo(), initScrollCue(), initGallery()];
    return () => cleanups.forEach((c) => c());
  }, []);

  // Initialize the wedding date reveal and card behaviors
  useEffect(() => {
    const cleanups = [
      initDateReveal(WEDDING_DATE),
      initScrolls(),
      initCeremonyCards(),
      initOutro(),
      initSmoothScroll(),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <>
      {/* The gate: a fixed cover over the hero until it is tapped. */}
      <div className="royale-gate" id="ryGate" role="button" tabIndex={0} aria-label="Open the invitation">
        <div className="royale-gate__flap royale-gate__flap--start" aria-hidden="true">
          <span className="royale-gate__flap-pattern" />
        </div>
        <div className="royale-gate__flap royale-gate__flap--end" aria-hidden="true">
          <span className="royale-gate__flap-pattern" />
        </div>
        <div className="royale-gate__door royale-gate__door--start" aria-hidden="true" />
        <div className="royale-gate__door royale-gate__door--end" aria-hidden="true" />

        {(["sprig-left", "sprig-right"] as const).map((s) => (
          <div key={s} className={`royale-gate__decor royale-gate__decor--${s}`} aria-hidden="true">
            <img className="royale-gate__floral" src={`${A}/floral1.png`} alt="" draggable={false} />
          </div>
        ))}
        {(["elephant-left", "elephant-right"] as const).map((s) => (
          <div key={s} className={`royale-gate__decor royale-gate__decor--${s}`} aria-hidden="true">
            <img className="royale-gate__elephant" src={`${A}/elephant.png`} alt="" draggable={false} />
          </div>
        ))}

        <div className="royale-card">
          <span className="royale-card__motif" aria-hidden="true" />
          <span className="royale-card__symbol" aria-hidden="true" />
          <p className="royale-card__mantra" id="ryInvocation" lang={INVOCATION_LANG}>{INVOCATION}</p>
          <p className="royale-card__guest" id="ryGuestGreeting">{guest}</p>
          <p className="royale-card__note" id="ryIntroNote">
            {INTRO_NOTE}
          </p>
          <span className="royale-card__cue ry-plaque" aria-hidden="true">
            <PlaqueFrame idPrefix="ryCue" />
            <span className="ry-plaque__label">Tap to open</span>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="royale-hero" aria-label="The couple">
        <div className="royale-hero__frame">
          <video
            className="royale-hero__image royale-hero__video"
            id="ryHeroVideo"
            muted
            loop
            playsInline
            preload="auto"
            data-src={`${A}/garden_palace.mp4`}
            data-poster={`${A}/garden_palace_poster.webp`}
            data-from="(max-width: 699px)"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
          <picture className="royale-hero__still">
            <source media="(max-width: 699px)" srcSet={`${A}/garden_palace_poster.webp`} />
            <img className="royale-hero__image" src={`${A}/mandap_dusk.webp`} width={2322} height={1224} alt="" aria-hidden="true" draggable={false} />
          </picture>

          <h1 className="royale-couple" id="ryCouple" tabIndex={-1}>
            <span className="royale-couple__name" id="ryBrideName">Pearl</span>
            <span className="royale-couple__amp">&amp;</span>
            <span className="royale-couple__name" id="ryGroomName">Jatan</span>
          </h1>

          <div className="royale-hero__sub">


           
          </div>
        </div>
        <Tear pos="bottom" lazy={false} />
        <div className="scroll-cue" aria-hidden="true" data-after-cover data-delay="0">
          <span className="scroll-cue__text">Scroll down</span>
          <svg className="scroll-cue__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* The families */}
      <section className="royale-scrolls royale-families" aria-label="The families">
        {FAMILIES.map((f) => (
          <ScrollCard key={f.id} id={f.id} card={f.card}>
            <h2 className="royale-scroll__name">{f.name}</h2>
            <div className="royale-scroll__block">
              <span className="royale-scroll__rel">{f.relLabel}</span>
              {f.parents.map((p, idx) => (
                <span key={p} className="royale-scroll__elder" style={{ display: "block", marginTop: idx > 0 ? "4px" : "0" }}>
                  {p}
                </span>
              ))}
            </div>
            {f.note && (
              <p className="royale-scroll__block" style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: "10px", fontStyle: "italic", lineHeight: 1.4 }}>
                {f.note}
              </p>
            )}
          </ScrollCard>
        ))}
      </section>

      {/* The date reveal */}
      <section className="royale-date" id="ryDateReveal" aria-label="The date">
        <div className="royale-date__stage">
          <img className="royale-date__crown" src={`${A}/lotus_bunch.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="royale-date__plaques" role="group" aria-label="Wedding date">
            {(
              [
                ["day", "Date"],
                ["month", "Month"],
                ["year", "Year"],
              ] as const
            ).map(([dial, cap]) => (
              <div key={dial} className="royale-date__plaque" data-dial={dial}>
                <span className="royale-date__cap">{cap}</span>
                <div className="royale-date__window">
                  <div className="royale-date__strip" data-strip suppressHydrationWarning />
                </div>
              </div>
            ))}
          </div>
          <img className="royale-date__elephant royale-date__elephant--left" src={`${A}/elephant.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <img className="royale-date__elephant royale-date__elephant--right" src={`${A}/elephant.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="royale-date__action">
            <p className="royale-date__after" id="ryRevealAfter" hidden>Save the Date</p>
          </div>
          <p className="royale-date__said" id="ryRevealSaid" aria-live="polite" />
        </div>
      </section>

      {/* Pavilion */}
      <div className="royale-pavilion" aria-hidden="true">
        <img className="royale-pavilion__image" src={`${A}/pavilion.webp`} alt="" width={1500} height={927} loading="lazy" decoding="async" draggable={false} />
      </div>

      {/* Gallery */}
      <section className="royale-gallery" aria-label="Our story in pictures">
        <img className="royale-gallery__divider" src={`${A}/divider3.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="royale-gallery__scroll" id="ryGalleryScroll">
          <div className="royale-gallery__track">
            <div className="royale-gallery__rail" aria-hidden="true" />
            {FRAMES.map((f, i) => (
              <Frame key={i} f={f} />
            ))}
          </div>
        </div>
        <div className="ry-hint royale-gallery__hint" id="ryGalleryHint" aria-hidden="true">
          <span className="ry-hint__arrows"><i /><i /><i /></span>
          <span className="ry-hint__text">Swipe</span>
          <span className="ry-hint__arrows"><i /><i /><i /></span>
        </div>
      </section>

      {/* Ceremonies */}
      <svg className="ryc-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <clipPath id="ryCeremonyPanel" clipPathUnits="objectBoundingBox">
            <path d={CEREMONY_PANEL} />
          </clipPath>
        </defs>
      </svg>
      <section className="royale-ceremonies" aria-label="Ceremonies">
        <h2 className="ryc-title">Ceremonies</h2>
        <div className="ryc-grid">
          {CEREMONIES.map((c, i) => (
            <FragmentCard key={c.name} index={i} total={CEREMONIES.length}>
              <article className="ryc-card" data-date={c.isoDate} data-time={c.time}>
                <div className="ryc-card__inner">
                  <div className="ryc-card__artwell">
                    <img className="ryc-card__art" src={`${A}/${c.art}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  </div>
                  <div className="ryc-card__content">
                    <h3 className="ryc-card__title">{c.name}</h3>
                    <div className="ryc-card__separator" aria-hidden="true" />
                    <p className="ryc-card__date-line">{c.dateUpper}</p>
                    <p className="ryc-card__timing-line">{c.timingLine}</p>
                  </div>
                </div>
              </article>
            </FragmentCard>
          ))}
        </div>
        <Tear pos="bottom" />
      </section>

      {/* Compliments and the note */}
      <section className="royale-scrolls royale-closing" aria-label="Compliments and a note">
        <ScrollCard id="ryComplimentCard" card="compliments">
          <h2 className="royale-scroll__name">With Best Compliments From:</h2>
          <div className="royale-scroll__lines">
            {COMPLIMENTS.map((l) => (
              <p key={l} className="royale-scroll__line">{l}</p>
            ))}
          </div>
        </ScrollCard>
        <ScrollCard id="ryNoteCard" card="note">
          <h2 className="royale-scroll__name">A Note From Us</h2>
          <p className="royale-scroll__note">{NOTE}</p>
        </ScrollCard>
      </section>

      <Social />

      {/* Closing picture */}
      <section className="royale-outro">
        <Tear pos="top" />
        <picture>
          <source media="(min-width: 700px)" srcSet={`${A}/garden_close.webp`} width={1672} height={941} />
          <img className="royale-outro__image" src={`${A}/garden_close_tall.webp`} alt="" width={941} height={1672} loading="lazy" decoding="async" draggable={false} />
        </picture>
        <div className="royale-outro__easel">
          <div className="royale-outro__board">
            <p className="royale-outro__names">{guest}</p>
            <p className="royale-outro__line">{OUTRO_MESSAGE}</p>
          </div>
        </div>
        <Tear pos="bottom" />
      </section>
    </>
  );
}

/** A ceremony card followed by its divider, as the source's grid lays them out. */
function FragmentCard({ children, index, total }: { children: React.ReactNode; index: number; total: number }) {
  // Desktop grid is 3 columns.
  // Row breaks occur after card index 2 (between row 1 and row 2) and index 5 (between row 2 and row 3).
  // Don't put a divider after the last card (index === total - 1).
  const isLast = index === total - 1;
  const isRowBreak = index === 2 || index === 5;
  return (
    <>
      {children}
      {!isLast && (
        <img
          className={`ryc-divider${isRowBreak ? " ryc-divider--row" : ""}`}
          src={`${A}/divider2.png`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      )}
    </>
  );
}
