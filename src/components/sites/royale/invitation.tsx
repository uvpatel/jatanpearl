"use client";
/* eslint-disable @next/next/no-img-element -- decorative assets sized and positioned by the Royale stylesheet */

import { useEffect, useState, type CSSProperties } from "react";
import {
  initCeremonyCards,
  initGallery,
  initHeroVideo,
  initOutro,
  initScrollCue,
  initScrolls,
  initSmoothScroll,
} from "./behaviors";
import {
  A,
  CELEBRATION_CARDS,
  CEREMONIES,
  COMPLIMENTS,
  FRAMES,
  HERO_BANNER_LOC,
  HERO_BANNER_TITLE,
  HERO_TAGLINE,
  HERO_WELCOME,
  NOTE_SECTIONS,
  OUTRO_MESSAGE,
  VENUE_DETAILS,
  type GalleryFrame,
} from "./data";
import { CEREMONY_PANEL } from "./paths";
import { RsvpForm } from "./rsvp-form";
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
                <figcaption className="gframe__caption">{f.caption || "Photo coming soon"}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "hero", label: "HOME" },
  { id: "celebration", label: "CELEBRATION" },
  { id: "venue", label: "VENUE" },
  { id: "gallery", label: "GALLERY" },
  { id: "ceremonies", label: "CEREMONIES" },
  { id: "location", label: "LOCATION" },
  { id: "rsvp", label: "RSVP" },
];

export function RoyaleInvitation() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // Open invitation gate class automatically
    document.documentElement.classList.add("is-open");
    const cleanups = [
      initHeroVideo(),
      initScrollCue(),
      initGallery(),
      initScrolls(),
      initCeremonyCards(),
      initOutro(),
      initSmoothScroll(),
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cleanups.forEach((c) => c());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* 1. Top Navbar */}
      <header className="ry-navbar">
        <div className="ry-navbar__inner">
          <a href="#hero" className="ry-navbar__brand">
            Pearl &amp; Jatan
          </a>
          <nav className="ry-navbar__nav" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`ry-navbar__link ${activeSection === item.id ? "is-active" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="royale-hero" id="hero" aria-label="Pearl & Jatan Wedding">
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
            <img
              className="royale-hero__image"
              src={`${A}/mandap_dusk.webp`}
              width={2322}
              height={1224}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </picture>

          <h1 className="royale-couple" id="ryCouple" tabIndex={-1}>
            <span className="royale-couple__name">PEARL</span>
            <span className="royale-couple__amp">&amp;</span>
            <span className="royale-couple__name">JATAN</span>
          </h1>
        </div>
        <Tear pos="bottom" lazy={false} />
        <div className="scroll-cue is-shown" aria-hidden="true" data-delay="0">
          <span className="scroll-cue__text">Scroll down</span>
          <svg className="scroll-cue__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Destination Announcement (Below Hero) */}
      <section className="ry-destination-banner" aria-label="Destination Wedding Announcement">
        <h2 className="ry-destination-banner__title">{HERO_TAGLINE}</h2>
        <p className="ry-destination-banner__welcome">{HERO_WELCOME}</p>
        <p className="ry-destination-banner__dates">{HERO_BANNER_TITLE}</p>
        <p className="ry-destination-banner__loc">{HERO_BANNER_LOC}</p>
      </section>

      {/* 3. A Celebration to Remember */}
      <section className="ry-celebration" id="celebration" aria-label="A Celebration to Remember">
        <div className="ry-celebration__header">
          <h2 className="ry-sec-title">A CELEBRATION TO REMEMBER</h2>
          <div className="ry-title-ornament" aria-hidden="true" />
          <p className="ry-sec-desc">
            A beautiful gathering of love, family, traditions and togetherness. Join us as we create unforgettable memories in the timeless surroundings of Mandavgarh.
          </p>
        </div>
        <div className="ry-celebration__grid">
          {CELEBRATION_CARDS.map((item) => (
            <div key={item.title} className="ry-feature-card">
              <div className="ry-feature-card__art">
                <img src={`${A}/${item.icon}`} alt={item.alt} />
              </div>
              <h3 className="ry-feature-card__title">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. A Royal Celebration in Mandavgarh / Venue Spotlight */}
      <section className="ry-venue" id="venue" aria-label="Wedding Venue">
        <div className="ry-venue__header">
          <p className="ry-sec-eyebrow">A ROYAL CELEBRATION IN MANDAVGARH</p>
          <div className="ry-title-ornament" aria-hidden="true" />
          <h2 className="ry-sec-title">{VENUE_DETAILS.name}</h2>
          <p className="ry-venue__location">
            <svg className="ry-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            {VENUE_DETAILS.location}
          </p>
          <p className="ry-sec-desc ry-venue__desc">
            {VENUE_DETAILS.description}
          </p>
        </div>
        <div className="royale-pavilion" aria-hidden="true">
          <img
            className="royale-pavilion__image"
            src={`${A}/pavilion.webp`}
            alt=""
            width={1500}
            height={927}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </section>

      {/* 5. Moments & Memories (Gallery) */}
      <section className="royale-gallery" id="gallery" aria-label="Our story in pictures">
        <img className="royale-gallery__divider" src={`${A}/divider3.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="ry-gallery-header">
          <h2 className="ry-sec-title">MOMENTS &amp; MEMORIES</h2>
          <div className="ry-title-ornament" aria-hidden="true" />
          <p className="ry-sec-desc">
            A glimpse into the celebrations, traditions and beautiful moments that make this journey special.
          </p>
        </div>
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
          <span className="ry-hint__text">&lt;&lt;&lt; Swipe &gt;&gt;&gt;</span>
          <span className="ry-hint__arrows"><i /><i /><i /></span>
        </div>
      </section>

      {/* 6. Our Wedding Ceremonies */}
      <svg className="ryc-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <clipPath id="ryCeremonyPanel" clipPathUnits="objectBoundingBox">
            <path d={CEREMONY_PANEL} />
          </clipPath>
        </defs>
      </svg>
      <section className="royale-ceremonies" id="ceremonies" aria-label="Ceremonies">
        <div className="ry-ceremonies-corner ry-ceremonies-corner--left" aria-hidden="true">
          <img src={`${A}/corner.png`} alt="" />
        </div>
        <div className="ry-ceremonies-corner ry-ceremonies-corner--right" aria-hidden="true">
          <img src={`${A}/corner.png`} alt="" />
        </div>
        <div className="ryc-header">
          <h2 className="ryc-title">OUR WEDDING CEREMONIES</h2>
          <p className="ryc-subtitle">
            From cherished traditions to joyful celebrations, every moment brings us closer together.
          </p>
        </div>
        <div className="ryc-grid">
          {CEREMONIES.map((c, i) => (
            <FragmentCard key={c.name} index={i} total={CEREMONIES.length}>
              <article className="ryc-card" data-date={c.isoDate} data-time={c.time}>
                <div className="ryc-card__inner">
                  <div className="ryc-card__artwell">
                    <img className="ryc-card__art" src={`${A}/${c.art}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  </div>
                  <div className="ryc-card__content">
                    <h3 className="ryc-card__title">
                      {c.name.split("\n").map((line, idx) => (
                        <span key={idx} style={{ display: "block" }}>{line}</span>
                      ))}
                    </h3>
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

      {/* 7. Compliments and the Note (Scrolls) */}
      <section className="royale-scrolls royale-closing" aria-label="Compliments and a note">
        <ScrollCard id="ryComplimentCard" card="compliments">
          <h2 className="royale-scroll__name">WITH BEST COMPLIMENTS FROM</h2>
          <div className="royale-scroll__lines">
            {COMPLIMENTS.map((l) => (
              <p key={l} className="royale-scroll__line">{l}</p>
            ))}
          </div>
        </ScrollCard>

        <ScrollCard id="ryNoteCard" card="note">
          <h2 className="royale-scroll__name">A NOTE FROM US</h2>
          <div className="royale-scroll__note-body">
            <p className="royale-scroll__note-salutation">{NOTE_SECTIONS.salutation}</p>
            <p className="royale-scroll__note-p">{NOTE_SECTIONS.intro}</p>
            <p className="royale-scroll__note-p">{NOTE_SECTIONS.body}</p>
            <p className="royale-scroll__note-p">{NOTE_SECTIONS.closing}</p>
            <p className="royale-scroll__note-signoff">{NOTE_SECTIONS.signOff}</p>
            <p className="royale-scroll__note-couple">{NOTE_SECTIONS.couple}</p>
          </div>
        </ScrollCard>
      </section>

      {/* 8. Location & Directions */}
      <section className="ry-location-section" id="location" aria-label="Find Your Way to the Celebration">
        <Social />
        <div className="ry-location-header">
          <h2 className="ry-sec-title">FIND YOUR WAY TO THE CELEBRATION</h2>
          <div className="ry-title-ornament" aria-hidden="true" />
          <h3 className="ry-venue-name">{VENUE_DETAILS.name}</h3>
          <p className="ry-venue-loc-line">
            <svg className="ry-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            {VENUE_DETAILS.location}
          </p>
        </div>

        <div className="ry-map-card">
          <a
            href={VENUE_DETAILS.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ry-map-preview-link"
            aria-label="Open Chinmay Resort on Google Maps"
          >
            <img src={`${A}/map_preview.png`} alt="Map location of Chinmay Resort" className="ry-map-image" />
          </a>
          <div className="ry-map-actions">
            <a href={VENUE_DETAILS.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ry-btn ry-btn--primary">
              OPEN IN GOOGLE MAPS
            </a>
            <a href={VENUE_DETAILS.directionsUrl} target="_blank" rel="noopener noreferrer" className="ry-btn ry-btn--outline">
              GET DIRECTIONS
            </a>
          </div>
        </div>
      </section>

      {/* 9. RSVP Section */}
      <RsvpForm />

      {/* 10. Outro Easel & Send-off */}
      <section className="royale-outro" aria-label="Thank you message">
        <Tear pos="top" />
        <picture>
          <source media="(min-width: 700px)" srcSet={`${A}/garden_close.webp`} width={1672} height={941} />
          <img
            className="royale-outro__image"
            src={`${A}/garden_close_tall.webp`}
            alt=""
            width={941}
            height={1672}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </picture>
        <div className="royale-outro__easel">
          <div className="royale-outro__board">
            <p className="royale-outro__line">{OUTRO_MESSAGE}</p>
          </div>
        </div>
        <Tear pos="bottom" />
      </section>

      {/* 11. Bottom Maroon Footer */}
      <footer className="ry-footer" role="contentinfo">
        <div className="ry-footer__inner">
          <img className="ry-footer__divider" src={`${A}/divider2.png`} alt="" aria-hidden="true" />
          <h2 className="ry-footer__couple">PEARL &amp; JATAN</h2>
          <p className="ry-footer__meta">
            15 JANUARY – 03 FEBRUARY 2027 &nbsp;|&nbsp; MANDAVGARH (MANDU), MADHYA PRADESH
          </p>
          <p className="ry-footer__blessing">
            Thank you for being part of our beautiful journey. Your presence and blessings make our celebration truly special.
          </p>
          <img className="ry-footer__divider" src={`${A}/divider2.png`} alt="" aria-hidden="true" />
        </div>
      </footer>
    </>
  );
}

function FragmentCard({ children, index, total }: { children: React.ReactNode; index: number; total: number }) {
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
