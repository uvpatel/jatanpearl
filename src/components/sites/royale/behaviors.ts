// Royale - page behaviours, ported from the source's app.js, date-reveal.js,
// gallery.js, scroll.js, outro.js and scroll-cue.js. Each init* function
// returns a cleanup. They work on the DOM the components render, because the
// stylesheet drives the sequences from classes (html.is-open, .is-unrolled...).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

type Cleanup = () => void;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- gate -----------------------------------------------------------------

export function initGate(): Cleanup {
  const root = document.documentElement;
  const gate = document.getElementById("ryGate");
  if (!gate) return () => {};

  const FINAL = ["ry-flap-bottom", "ry-flap-right", "ry-gate-fade"];
  let finished = false;
  let timer = 0;

  const finish = () => {
    if (finished) return;
    finished = true;
    const hadFocus = document.activeElement === gate;
    gate.hidden = true;
    document.dispatchEvent(new CustomEvent("balcony:cover-open"));
    if (hadFocus) document.getElementById("ryCouple")?.focus({ preventScroll: true });
  };
  const onAnimEnd = (e: AnimationEvent) => {
    if (FINAL.includes(e.animationName)) finish();
  };
  const open = () => {
    if (root.classList.contains("is-open")) return;
    root.classList.add("is-open");
    gate.setAttribute("aria-disabled", "true");
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent("royale:gate-open"));
    gate.addEventListener("animationend", onAnimEnd);
    timer = window.setTimeout(finish, 4500);
  };
  const onWheel = (e: WheelEvent) => e.preventDefault();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  gate.addEventListener("wheel", onWheel, { passive: false });
  gate.addEventListener("click", open);
  gate.addEventListener("keydown", onKey);
  return () => {
    window.clearTimeout(timer);
    gate.removeEventListener("wheel", onWheel);
    gate.removeEventListener("click", open);
    gate.removeEventListener("keydown", onKey);
    gate.removeEventListener("animationend", onAnimEnd);
    root.classList.remove("is-open");
  };
}

// ---- hero video (phones only) --------------------------------------------

export function initHeroVideo(): Cleanup {
  const video = document.getElementById("ryHeroVideo") as HTMLVideoElement | null;
  if (!video) return () => {};
  const phone = window.matchMedia(video.dataset.from || "(max-width: 699px)");
  const reduced = reducedMotion();
  let started = false;
  let inView = true;

  const sync = () => {
    if (!reduced && started && inView && phone.matches && !document.hidden && video.getAttribute("src")) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };
  const source = () => {
    if (phone.matches && !video.getAttribute("src")) {
      video.poster = video.dataset.poster || "";
      video.src = video.dataset.src || "";
    }
    sync();
  };
  const onOpen = () => {
    started = true;
    try {
      video.currentTime = 0;
    } catch {
      /* not seekable yet */
    }
    sync();
  };

  source();
  phone.addEventListener("change", source);
  document.addEventListener("royale:gate-open", onOpen);
  document.addEventListener("visibilitychange", sync);
  const io = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    sync();
  });
  if (video.parentElement) io.observe(video.parentElement);
  return () => {
    phone.removeEventListener("change", source);
    document.removeEventListener("royale:gate-open", onOpen);
    document.removeEventListener("visibilitychange", sync);
    io.disconnect();
  };
}

// ---- scroll cards + ceremony cards ---------------------------------------

export function initScrolls(): Cleanup {
  const scrolls = Array.from(document.querySelectorAll<HTMLElement>(".royale-scroll"));
  if (!scrolls.length || reducedMotion()) return () => {};

  const pictures = (s: Element) =>
    Array.from(s.querySelectorAll<HTMLImageElement>(".royale-scroll__sheet img, .royale-scroll__bloom"));
  const wake = (s: Element) =>
    pictures(s).forEach((img) => {
      if (img.loading === "lazy") img.loading = "eager";
    });
  const ready = (s: Element) =>
    Promise.all(
      Array.from(s.querySelectorAll<HTMLImageElement>(".royale-scroll__sheet img")).map((img) =>
        img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
      ),
    );

  const early = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        wake(e.target);
        early.unobserve(e.target);
      }),
    { rootMargin: "200% 0px" },
  );
  const main = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const s = e.target;
        main.unobserve(s);
        wake(s);
        Promise.race([ready(s), new Promise((r) => window.setTimeout(r, 2500))]).then(() =>
          s.classList.add("is-unrolled"),
        );
      }),
    { threshold: 0.35 },
  );
  scrolls.forEach((s) => {
    s.classList.add("is-armed");
    early.observe(s);
    main.observe(s);
  });
  return () => {
    early.disconnect();
    main.disconnect();
    scrolls.forEach((s) => s.classList.remove("is-armed", "is-unrolled"));
  };
}

export function initCeremonyCards(): Cleanup {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".ryc-card"));
  if (!cards.length || reducedMotion()) return () => {};
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-shown");
        io.unobserve(e.target);
      }),
    { threshold: 0.25 },
  );
  cards.forEach((c, i) => {
    c.classList.add("is-armed");
    c.style.setProperty("--i", String(i % 3));
    io.observe(c);
  });
  return () => {
    io.disconnect();
    cards.forEach((c) => c.classList.remove("is-armed", "is-shown"));
  };
}

// ---- date reveal ----------------------------------------------------------

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const BEADS = [1, 2, 3].map((n) => `/sites/royale/media/confetti${n}.svg`);
const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

export interface WeddingDate {
  year: number;
  month: number;
  day: number;
}

export function initDateReveal(when: WeddingDate): Cleanup {
  const section = document.getElementById("ryDateReveal");
  const after = document.getElementById("ryRevealAfter");
  const said = document.getElementById("ryRevealSaid");
  if (!section) return () => {};
  const reduced = reducedMotion();
  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
  let spent = false;

  const cell = (v: string) => `<span class="royale-date__cell">${v}</span>`;
  const dial = (name: string) => section.querySelector<HTMLElement>(`[data-dial="${name}"]`);
  const cells = (name: "day" | "month" | "year") => {
    if (name === "day") {
      const all = Array.from({ length: 31 }, (_, i) => pad(i + 1));
      return { all, index: when.day - 1 };
    }
    if (name === "month") return { all: MONTHS.slice(), index: when.month - 1 };
    const all: string[] = [];
    for (let y = when.year - 4; y <= when.year + 3; y++) all.push(String(y));
    return { all, index: all.indexOf(String(when.year)) };
  };

  const roll = (name: "day" | "month" | "year", duration: number) => {
    const strip = dial(name)?.querySelector<HTMLElement>("[data-strip]");
    if (!strip) return;
    const c = cells(name);
    const seq = [""].concat(c.all, c.all, c.all.slice(0, c.index + 1));
    strip.innerHTML = seq.map(cell).join("");
    strip.style.transition = "none";
    strip.style.transform = "translateY(0)";
    void strip.offsetHeight;
    strip.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    strip.style.transform = `translateY(calc(${-(seq.length - 1)} * var(--cell-h)))`;
  };

  const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
  const flake = (layer: HTMLElement, x: number, y: number, dir: number, unit: number) => {
    const el = document.createElement("i");
    const arc = document.createElement("i");
    const bead = document.createElement("img");
    el.className = "ryd-flake";
    arc.className = "ryd-flake__arc";
    bead.className = "ryd-flake__bead";
    bead.src = BEADS[Math.floor(Math.random() * BEADS.length)];
    bead.alt = "";
    el.style.left = `${x.toFixed(1)}px`;
    el.style.top = `${y.toFixed(1)}px`;
    el.style.setProperty("--w", `${(rand(1.6, 3.1) * unit).toFixed(1)}px`);
    el.style.setProperty("--dx", `${((rand(6, 30) * dir + rand(-6, 6)) * unit).toFixed(1)}px`);
    el.style.setProperty("--rise", `${(-rand(12, 30) * unit).toFixed(1)}px`);
    el.style.setProperty("--fall", `${(rand(10, 30) * unit).toFixed(1)}px`);
    el.style.setProperty("--rot", `${Math.floor(rand(-540, 540))}deg`);
    el.style.setProperty("--dur", `${rand(2200, 3400).toFixed(0)}ms`);
    el.style.setProperty("--delay", `${rand(0, 420).toFixed(0)}ms`);
    arc.appendChild(bead);
    el.appendChild(arc);
    layer.appendChild(el);
  };
  const confetti = () => {
    const stage = section.querySelector<HTMLElement>(".royale-date__stage");
    const elephants = section.querySelectorAll<HTMLElement>(".royale-date__elephant");
    if (!stage || !elephants.length) return;
    const layer = document.createElement("div");
    layer.className = "royale-date__confetti";
    layer.setAttribute("aria-hidden", "true");
    stage.appendChild(layer);
    const box = stage.getBoundingClientRect();
    const unit = box.width / 100;
    elephants.forEach((el) => {
      const r = el.getBoundingClientRect();
      const left = el.classList.contains("royale-date__elephant--left");
      const x = r.left - box.left + r.width * (left ? 0.42 : 0.58);
      const y = r.top - box.top + r.height * 0.08;
      for (let i = 0; i < 26; i++) flake(layer, x, y, left ? 1 : -1, unit);
    });
    later(() => layer.remove(), 4200);
  };
  const knock = () =>
    (["day", "month", "year"] as const).forEach((name, i) =>
      later(() => {
        const p = dial(name);
        if (!p) return;
        p.classList.add("is-set");
        later(() => p.classList.remove("is-set"), 420);
      }, 90 + i * 90),
    );
  const settleAll = () =>
    (["day", "month", "year"] as const).forEach((name, i) => {
      const p = dial(name);
      const strip = p?.querySelector<HTMLElement>("[data-strip]");
      if (!p || !strip) return;
      const c = cells(name);
      strip.innerHTML = cell(c.all[c.index]);
      p.classList.add("is-fading");
      later(() => p.classList.add("is-shown"), 90 + i * 260);
    });
  const announce = () => {
    if (said) said.textContent = `${when.day} ${MONTHS_LONG[when.month - 1]} ${when.year}`;
  };
  const finish = () => {
    section.classList.remove("is-revealing");
    section.classList.add("is-revealed");
    if (after) after.hidden = false;
  };

  const run = () => {
    if (spent) return;
    spent = true;
    section.classList.add("is-revealing");
    if (reduced) {
      settleAll();
      announce();
      later(finish, 90 + 2 * 260 + 420);
      return;
    }
    roll("day", 1750);
    roll("month", 2250);
    roll("year", 2750);
    later(() => {
      confetti();
      knock();
    }, 2750);
    later(() => {
      finish();
      announce();
    }, 2750 + 420);
  };

  BEADS.forEach((src) => {
    new Image().src = src;
  });
  // No button: the dials roll by themselves once the section is mostly on screen.
  // (The reveal is once per visit, so a cleanup/re-run never replays it.)
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      later(run, 400);
    },
    { threshold: 0.6 },
  );
  io.observe(section);
  return () => {
    io.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
  };
}

// ---- gallery --------------------------------------------------------------

export function initGallery(): Cleanup {
  const scroller = document.getElementById("ryGalleryScroll");
  if (!scroller) return () => {};
  const reduce = reducedMotion();
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const MAX_ANGLE = 20;
  const MAX_YAW = 26;

  const frames = Array.from(scroller.querySelectorAll<HTMLElement>(".gframe")).map((el, i) => {
    const hang = parseFloat(el.style.getPropertyValue("--hang")) || 110;
    return {
      el,
      body: el.querySelector<HTMLElement>(".gframe__body"),
      angle: 0, vel: 0, yaw: 0, yawVel: 0,
      stiffness: 0.02 * (130 / (hang + 90)),
      damping: 0.93 + (i % 3) * 0.01,
      gain: 0.55 + ((i * 7) % 5) * 0.08,
      idleAmp: 0.5 + (i % 2) * 0.35,
      idleYawAmp: 6 + (i % 3) * 1.5,
      idleFreq: 0.4 + ((i * 3) % 4) * 0.1,
      idlePhase: i * 1.7,
      last: "",
      lastYaw: "",
    };
  });

  let lastScroll = scroller.scrollLeft;
  let vSmooth = 0;
  let raf: number | null = null;
  let inView = false;

  const frame = (now: number) => {
    const t = now / 1000;
    const sl = scroller.scrollLeft;
    vSmooth += (sl - lastScroll - vSmooth) * 0.35;
    lastScroll = sl;
    frames.forEach((f) => {
      const equil = clamp(vSmooth * 0.85 * f.gain, -MAX_ANGLE, MAX_ANGLE);
      f.vel += (equil - f.angle) * f.stiffness;
      f.vel *= f.damping;
      f.angle += f.vel;
      const yawEquil = clamp(-vSmooth * 1.1 * f.gain, -MAX_YAW, MAX_YAW);
      f.yawVel += (yawEquil - f.yaw) * f.stiffness * 1.4;
      f.yawVel *= f.damping;
      f.yaw += f.yawVel;
      const idle = Math.sin(t * f.idleFreq + f.idlePhase) * f.idleAmp;
      const idleYaw = Math.sin(t * f.idleFreq * 0.8 + f.idlePhase + 1.3) * f.idleYawAmp;
      const next = `rotate(${(f.angle + idle).toFixed(3)}deg)`;
      if (next !== f.last) {
        f.el.style.transform = next;
        f.last = next;
      }
      const nextYaw = `rotateY(${(f.yaw + idleYaw).toFixed(2)}deg)`;
      if (f.body && nextYaw !== f.lastYaw) {
        f.body.style.transform = nextYaw;
        f.lastYaw = nextYaw;
      }
    });
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (raf !== null || reduce) return;
    lastScroll = scroller.scrollLeft;
    vSmooth = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf === null) return;
    cancelAnimationFrame(raf);
    raf = null;
  };
  const sync = () => (inView && !document.hidden ? start() : stop());

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      sync();
    },
    { rootMargin: "300px 0px" },
  );
  io.observe(scroller);
  document.addEventListener("visibilitychange", sync);

  const hint = document.getElementById("ryGalleryHint");
  const hideHint = () => {
    if (scroller.scrollLeft > 8 && hint) {
      hint.classList.add("is-hidden");
      scroller.removeEventListener("scroll", hideHint);
    }
  };
  scroller.addEventListener("scroll", hideHint, { passive: true });

  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    dragging = true;
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
    scroller.classList.add("is-dragging");
    scroller.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (dragging) scroller.scrollLeft = startScroll - (e.clientX - startX);
  };
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove("is-dragging");
    try {
      scroller.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };
  scroller.addEventListener("pointerdown", down);
  scroller.addEventListener("pointermove", move);
  scroller.addEventListener("pointerup", end);
  scroller.addEventListener("pointercancel", end);

  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    scroller.removeEventListener("scroll", hideHint);
    scroller.removeEventListener("pointerdown", down);
    scroller.removeEventListener("pointermove", move);
    scroller.removeEventListener("pointerup", end);
    scroller.removeEventListener("pointercancel", end);
  };
}

// ---- smooth scroll + scroll-driven decoration -----------------------------

export function initSmoothScroll(): Cleanup {
  if (reducedMotion()) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement;
  const rail = document.getElementById("ryGalleryScroll");

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    virtualScroll: (e: { deltaX: number; deltaY: number; event: Event }) => {
      if (!rail || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return true;
      return !(e.event && rail.contains(e.event.target as Node));
    },
  });

  let watch: MutationObserver | null = null;
  if (!root.classList.contains("is-open")) {
    lenis.stop();
    watch = new MutationObserver(() => {
      if (!root.classList.contains("is-open")) return;
      lenis.start();
      watch?.disconnect();
      ScrollTrigger.refresh();
    });
    watch.observe(root, { attributes: true, attributeFilter: ["class"] });
  }

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const has = (sel: string) => !!document.querySelector(sel);
  const reveal = (sel: string, o: { y?: number; duration?: number; trigger?: string; start?: string } = {}) => {
    document.querySelectorAll(sel).forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: o.y ?? 44,
        duration: o.duration ?? 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: o.trigger ? (document.querySelector(o.trigger) as Element) : el,
          start: o.start ?? "top 85%",
          once: true,
        },
      });
    });
  };
  const drift = (sel: string, from: gsap.TweenVars, to: gsap.TweenVars, trigger: string) => {
    if (!has(sel)) return;
    gsap.fromTo(sel, from, {
      ...to,
      ease: "none",
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    });
  };

  const ctx = gsap.context(() => {
    reveal(".royale-date__stage", { trigger: ".royale-date", start: "top 80%", y: 40, duration: 1 });
    drift(".royale-date__crown", { yPercent: 6 }, { yPercent: -6 }, ".royale-date");
    drift(".royale-pavilion__image", { yPercent: 3 }, { yPercent: -3 }, ".royale-pavilion");
    drift(".royale-gallery", { backgroundPositionY: "42%" }, { backgroundPositionY: "58%" }, ".royale-gallery");
    if (has(".royale-gallery__divider")) {
      gsap.from(".royale-gallery__divider", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".royale-gallery", start: "top 95%", once: true },
      });
    }
    reveal(".ryc-title", { y: 32 });
    reveal(".royale-outro__easel", { trigger: ".royale-outro", start: "top 70%", y: 50, duration: 1 });
  });

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  return () => {
    window.removeEventListener("load", onLoad);
    watch?.disconnect();
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

// ---- closing garden follows the mouse -------------------------------------

export function initOutro(): Cleanup {
  if (reducedMotion()) return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const section = document.querySelector<HTMLElement>(".royale-outro");
  const bg = section?.querySelector<HTMLElement>(".royale-outro__image");
  if (!section || !bg) return () => {};

  const SHIFT = 12;
  const SCALE = 1.06;
  const pos = { x: 0, y: 0 };
  const apply = () => {
    bg.style.transform = `scale(${SCALE}) translate3d(${(-pos.x * SHIFT).toFixed(2)}px, ${(-pos.y * SHIFT).toFixed(2)}px, 0)`;
  };
  apply();
  const cfg = { duration: 0.9, ease: "power3.out", onUpdate: apply };
  const setX = gsap.quickTo(pos, "x", cfg);
  const setY = gsap.quickTo(pos, "y", cfg);

  const move = (e: MouseEvent) => {
    const r = section.getBoundingClientRect();
    setX(((e.clientX - r.left) / r.width - 0.5) * 2);
    setY(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const leave = () => {
    setX(0);
    setY(0);
  };
  section.addEventListener("mousemove", move);
  section.addEventListener("mouseleave", leave);
  return () => {
    section.removeEventListener("mousemove", move);
    section.removeEventListener("mouseleave", leave);
    bg.style.transform = "";
  };
}

// ---- "Scroll down" cue ----------------------------------------------------

export function initScrollCue(): Cleanup {
  const cues = Array.from(document.querySelectorAll<HTMLElement>(".scroll-cue"));
  if (!cues.length) return () => {};
  const timers: number[] = [];
  const gone = () => {
    if (window.scrollY <= 60) return false;
    cues.forEach((c) => c.classList.add("is-gone"));
    window.removeEventListener("scroll", gone);
    return true;
  };
  window.addEventListener("scroll", gone, { passive: true });
  const shows: Array<() => void> = [];
  cues.forEach((cue) => {
    const delay = parseInt(cue.dataset.delay || "0", 10) || 0;
    const show = () => {
      timers.push(
        window.setTimeout(() => {
          if (!gone()) cue.classList.add("is-shown");
        }, delay),
      );
    };
    shows.push(show);
    if (cue.hasAttribute("data-after-cover")) {
      document.addEventListener("balcony:cover-open", show, { once: true });
    } else {
      show();
    }
  });
  return () => {
    window.removeEventListener("scroll", gone);
    shows.forEach((s) => document.removeEventListener("balcony:cover-open", s));
    timers.forEach((t) => window.clearTimeout(t));
  };
}
