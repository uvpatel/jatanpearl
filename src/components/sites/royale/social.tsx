"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CEREMONIES, mapLink } from "./data";

type View = null | "ig" | "loc" | "cal" | { day: number };

const PIN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);
const CAL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

const joinNames = (arr: string[]) =>
  arr.length <= 1 ? (arr[0] ?? "") : `${arr.slice(0, -1).join(", ")} & ${arr[arr.length - 1]}`;
const p2 = (n: number) => String(n).padStart(2, "0");
const ymd = (iso: string) => iso.replace(/-/g, "");

interface Day {
  date: string;
  label: string;
  list: { name: string; time: string; venue: string }[];
}

function endYmd(date: string) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}`;
}
const icsEsc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
const summary = (day: Day) => ({
  names: joinNames(day.list.map((c) => c.name)),
  desc: day.list.map((c) => `${c.name} - ${c.time} · ${c.venue}`).join("\n"),
  venue: day.list[0].venue,
});

function vevent(day: Day) {
  const s = summary(day);
  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
  return [
    "BEGIN:VEVENT", `UID:ry-day-${ymd(day.date)}@pearl-jatan-wedding`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(day.date)}`, `DTEND;VALUE=DATE:${endYmd(day.date)}`,
    `SUMMARY:${icsEsc(s.names)}`, `DESCRIPTION:${icsEsc(s.desc).replace(/\n/g, "\\n")}`,
    `LOCATION:${icsEsc(s.venue)}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(s.names)}`, "END:VALARM",
    "END:VEVENT",
  ];
}
const wrapIcs = (events: string[]) =>
  ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pearl & Jatan Wedding Invitation//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");

function downloadIcs(name: string, ics: string) {
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

const googleUrl = (day: Day) => {
  const s = summary(day);
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE", text: `Pearl & Jatan Wedding: ${s.names}`, dates: `${ymd(day.date)}/${endYmd(day.date)}`, details: s.desc, location: s.venue,
  })}`;
};
const outlookUrl = (day: Day) => {
  const s = summary(day);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
    path: "/calendar/action/compose", rru: "addevent", allday: "true", startdt: day.date, enddt: day.date,
    subject: `Pearl & Jatan Wedding: ${s.names}`, body: s.desc, location: s.venue,
  })}`;
};

const Divider = () => <span className="ry-modal__divider" aria-hidden="true" />;

/** The three icons under the note card, and the one popup they share. */
export function Social() {
  const [view, setView] = useState<View>(null);
  const close = useCallback(() => setView(null), []);

  const days = useMemo<Day[]>(() => {
    const out: Day[] = [];
    CEREMONIES.forEach((c) => {
      const date = c.isoDate;
      let day = out.find((x) => x.date === date);
      if (!day) out.push((day = { date, label: c.dateStr, list: [] }));
      day.list.push({ name: c.name, time: c.timingLine || c.time, venue: c.venue });
    });
    return out;
  }, []);

  const locations = useMemo(() => {
    const out: { venue: string; rest: string; address: string; names: string[] }[] = [];
    CEREMONIES.forEach((c) => {
      const addr = c.fullAddress || c.venue;
      let l = out.find((x) => x.address === addr);
      if (!l) {
        out.push((l = { venue: c.venue, rest: c.city || "", address: addr, names: [] }));
      }
      l.names.push(c.name);
    });
    return out;
  }, []);

  useEffect(() => {
    if (!view) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [view, close]);

  const day = typeof view === "object" && view ? days[view.day] : null;

  return (
    <>
      <section className="royale-social" aria-label="Ceremony locations and calendar">
        <div className="socials">
          <button className="social" type="button" aria-label="Ceremony locations" onClick={() => setView("loc")}>
            <span className="social__icon social__icon--location" aria-hidden="true" />
          </button>
          <button className="social" type="button" aria-label="Add ceremonies to calendar" onClick={() => setView("cal")}>
            <span className="social__icon social__icon--calendar" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div className="ry-modal" id="ryModal" hidden={!view}>
        <div className="ry-modal__overlay" onClick={close} />
        <div className="ry-modal__box" role="dialog" aria-modal="true" aria-labelledby="ryModalTitle">
          <button className="ry-modal__close" type="button" aria-label="Close" onClick={close}>
            &times;
          </button>
          <div className="ry-modal__content">
            {view === "ig" && (
              <>
                <h3 className="ry-modal__title" id="ryModalTitle">Follow the Couple</h3>
                <Divider />
                <p className="ry-modal__text">Would you like to open the couple’s Instagram page?</p>
                <div className="ry-modal__actions">
                  <a className="ry-modal__btn ry-modal__btn--primary" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    Open Instagram
                  </a>
                  <button className="ry-modal__btn" type="button" onClick={close}>Not now</button>
                </div>
              </>
            )}
            {view === "loc" && (
              <>
                <h3 className="ry-modal__title" id="ryModalTitle">Ceremony Locations</h3>
                <Divider />
                <div className="ry-loc-list">
                  {locations.map((l) => (
                    <a key={l.address} className="ry-loc" href={mapLink(l.address)} target="_blank" rel="noopener noreferrer">
                      <span className="ry-loc__pin" aria-hidden="true">{PIN}</span>
                      <span className="ry-loc__text">
                        <span className="ry-loc__ceremonies">{joinNames(l.names)}</span>
                        <span className="ry-loc__venue">{l.venue}</span>
                        {l.rest && <span className="ry-loc__addr">{l.rest}</span>}
                      </span>
                      <span className="ry-loc__go" aria-hidden="true">›</span>
                    </a>
                  ))}
                </div>
              </>
            )}
            {view === "cal" && (
              <>
                <h3 className="ry-modal__title" id="ryModalTitle">Add to Calendar</h3>
                <Divider />
                <div className="ry-loc-list">
                  {days.map((d, i) => (
                    <button key={d.date} className="ry-loc" type="button" onClick={() => setView({ day: i })}>
                      <span className="ry-loc__pin" aria-hidden="true">{CAL}</span>
                      <span className="ry-loc__text">
                        <span className="ry-loc__ceremonies">{d.label}</span>
                        <span className="ry-loc__venue">{joinNames(d.list.map((c) => c.name))}</span>
                      </span>
                      <span className="ry-loc__go" aria-hidden="true">+</span>
                    </button>
                  ))}
                </div>
                <div className="ry-modal__actions">
                  <button
                    className="ry-modal__btn ry-modal__btn--primary"
                    type="button"
                    onClick={() => downloadIcs("pearl-jatan-wedding.ics", wrapIcs(days.flatMap(vevent)))}
                  >
                    Add all dates
                  </button>
                </div>
              </>
            )}
            {day && (
              <>
                <h3 className="ry-modal__title" id="ryModalTitle">{day.label}</h3>
                <Divider />
                <p className="ry-modal__text">Which calendar would you like to add this to?</p>
                <div className="ry-modal__actions">
                  <a className="ry-modal__btn ry-modal__btn--primary" href={googleUrl(day)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
                  <a className="ry-modal__btn" href={outlookUrl(day)} target="_blank" rel="noopener noreferrer">Outlook</a>
                  <button className="ry-modal__btn" type="button" onClick={() => downloadIcs(`wedding-${day.date}.ics`, wrapIcs(vevent(day)))}>
                    Apple Calendar &amp; others
                  </button>
                </div>
                <p className="ry-modal__text">
                  <button className="ry-modal__link" type="button" onClick={() => setView("cal")}>&larr; Back to dates</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
