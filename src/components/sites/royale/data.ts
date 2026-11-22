// Royale - the invitation's content for Pearl & Jatan's Destination Wedding.

export const A = "/sites/royale/media";

export interface Ceremony {
  name: string;
  art: string;
  dateUpper: string; // e.g. "01 FEBRUARY 2027"
  timingLine: string; // e.g. "Timing to be announced"
  dateStr: string; // e.g. "Fri, 15 Jan 2027"
  isoDate: string; // "2027-01-15"
  time: string; // "10:00"
  venue: string;
  city?: string;
  fullAddress: string;
}

export const CEREMONIES: Ceremony[] = [
  {
    name: "KANKOTRI LEKHAN",
    art: "kankotri_art.png",
    dateUpper: "15 JANUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Fri, 15 Jan 2027",
    isoDate: "2027-01-15",
    time: "10:00",
    venue: "14 Mansi Heavens",
    city: "Bakrol, Anand",
    fullAddress: "14 Mansi Heavens, behind Recharge Café, Bakrol–Vadtal Road, Bakrol, Anand 388315",
  },
  {
    name: "MEHNDI &\nFAMILY LUNCH",
    art: "mehendi.webp",
    dateUpper: "29 JANUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Fri, 29 Jan 2027",
    isoDate: "2027-01-29",
    time: "11:00",
    venue: "14 Mansi Heavens",
    city: "Bakrol, Anand",
    fullAddress: "14 Mansi Heavens, behind Recharge Café, Bakrol–Vadtal Road, Bakrol, Anand 388315",
  },
  {
    name: "GRAH SHANTI\n& RECEPTION",
    art: "reception.webp",
    dateUpper: "30 JANUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Sat, 30 Jan 2027",
    isoDate: "2027-01-30",
    time: "18:30",
    venue: "Umang Party Plot",
    city: "Near Chikhodra Circle, Anand",
    fullAddress: "Umang Party Plot, near Chikhodra Circle, Anand",
  },
  {
    name: "TRAVEL TO\nMANDAVGARH",
    art: "travel_art.png",
    dateUpper: "31 JANUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Sun, 31 Jan 2027",
    isoDate: "2027-01-31",
    time: "08:00",
    venue: "Anand to Mandavgarh",
    city: "Mandu, Madhya Pradesh",
    fullAddress: "Anand to Mandavgarh (Mandu), Madhya Pradesh",
  },
  {
    name: "HALDI POOL\nCELEBRATION",
    art: "haldi.webp",
    dateUpper: "01 FEBRUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Mon, 1 Feb 2027",
    isoDate: "2027-02-01",
    time: "10:00",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
  {
    name: "SANGEET NIGHT",
    art: "sangeet.webp",
    dateUpper: "01 FEBRUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Mon, 1 Feb 2027",
    isoDate: "2027-02-01",
    time: "19:00",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
  {
    name: "HERITAGE TOUR",
    art: "heritage_art.png",
    dateUpper: "02 FEBRUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Tue, 2 Feb 2027",
    isoDate: "2027-02-02",
    time: "09:00",
    venue: "Chinmay Resort / Mandu",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Mandavgarh (Mandu), Madhya Pradesh",
  },
  {
    name: "GRAND WEDDING\nCELEBRATION",
    art: "vivaah.webp",
    dateUpper: "02 FEBRUARY 2027",
    timingLine: "Timing to be announced",
    dateStr: "Tue, 2 Feb 2027",
    isoDate: "2027-02-02",
    time: "11:00",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
];

export type FrameKind = "portrait" | "landscape" | "story";
export interface GalleryFrame {
  kind: FrameKind;
  hang: number;
  caption?: string;
  story?: string;
}
export const FRAMES: GalleryFrame[] = [
  { kind: "portrait", hang: 118, caption: "#howitstarted" },
  { kind: "landscape", hang: 150, caption: "#adventures" },
  { kind: "story", hang: 86, story: "Some stories begin with grand gestures. Ours started with a simple conversation." },
  { kind: "portrait", hang: 132, caption: "#thelittlethings" },
  { kind: "landscape", hang: 100, caption: "#everyday" },
  {
    kind: "story",
    hang: 120,
    story: "Friendship grew into something more, and we realized life's best moments were the ones we shared together.",
  },
  { kind: "portrait", hang: 150, caption: "#foreverbegins" },
  { kind: "landscape", hang: 92, caption: "#usforever" },
];

export const COMPLIMENTS = [
  "Vinubhai Dahyabhai Patel",
  "Late Parsottambhai Dayabhai Patel",
  "Vimal and Kanisha Patel (Inside Solution)",
];

export const NOTE_SECTIONS = {
  salutation: "Dear Family and Friends,",
  intro: "We are delighted to invite you to be part of our wedding celebrations.",
  body: "Your love, blessings and presence mean the world to us. We look forward to sharing beautiful traditions, joyful celebrations and unforgettable memories with everyone who has been part of our journey.",
  closing: "We cannot wait to celebrate these special moments together in the beautiful surroundings of Mandavgarh.",
  signOff: "With love,",
  couple: "PEARL & JATAN",
};

export const CELEBRATION_CARDS = [
  {
    icon: "floral1.png",
    title: "LOVE & TOGETHERNESS",
    alt: "Floral sprig motif",
  },
  {
    icon: "lotus_crest.png",
    title: "TRADITIONS & CULTURE",
    alt: "Lotus crest motif",
  },
  {
    icon: "elephant.png",
    title: "MEMORIES &\nCELEBRATIONS",
    alt: "Royal elephant motif",
  },
];

// ---- Website Texts & Config -----------------------------------------------

export const INVOCATION = "શ્રી ગણેશાય નમઃ";
export const INVOCATION_LANG = "gu";
export const GUEST_GREETING_DEFAULT = "Mr. Patidar and Family";
export const INTRO_NOTE =
  "Together with their families, we cordially invite you to celebrate the destination wedding of…";
export const HERO_TAGLINE = "DESTINATION WEDDING";
export const HERO_WELCOME = "Together with their families, we invite you to celebrate our special journey.";
export const HERO_BANNER_TITLE = "15 JANUARY – 03 FEBRUARY 2027";
export const HERO_BANNER_LOC = "MANDAVGARH (MANDU), MADHYA PRADESH";
export const OUTRO_MESSAGE = "Your Presence Means the World to Us";

export const VENUE_DETAILS = {
  name: "CHINMAY RESORT",
  location: "Mandavgarh (Mandu), Madhya Pradesh",
  description:
    "Surrounded by the timeless charm of Mandu, Chinmay Resort will be the setting for our wedding celebrations. We look forward to welcoming our loved ones to share these special moments with us.",
  googleMapsUrl: "https://maps.google.com/?q=Chinmay+Resort+Mandu+Madhya+Pradesh",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Chinmay+Resort+Mandu+Madhya+Pradesh",
};

// ---- dates ----------------------------------------------------------------

export interface Ymd {
  year: number;
  month: number;
  day: number;
}

/** Wedding Day: Tuesday, 2 February 2027 */
export const WEDDING_DATE: Ymd = {
  year: 2027,
  month: 2,
  day: 2,
};

export function defaultWeddingDate(): Ymd {
  return WEDDING_DATE;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** e.g. "Tue, 2 Feb 2027" */
export const fmtDate = (d: Date) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;

export const mapLink = (venue: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
