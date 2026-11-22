// Royale - the invitation's content for Pearl & Jatan's Destination Wedding.

export const A = "/sites/royale/media";

export interface Ceremony {
  name: string;
  sub?: string;
  art: string;
  dateStr: string; // e.g. "Fri, 15 Jan 2027"
  isoDate: string; // "2027-01-15"
  time: string; // "10:00"
  timeDisplay: string; // "Morning", "11:00 AM", "6:30 PM", etc.
  venue: string;
  city?: string;
  fullAddress: string;
}

export const CEREMONIES: Ceremony[] = [
  {
    name: "Kankotri Lekhan",
    sub: "Auspicious Invitation Writing",
    art: "ring_ceremony.webp",
    dateStr: "Fri, 15 Jan 2027",
    isoDate: "2027-01-15",
    time: "10:00",
    timeDisplay: "Morning",
    venue: "14 Mansi Heavens",
    city: "Bakrol, Anand",
    fullAddress: "14 Mansi Heavens, behind Recharge Café, Bakrol–Vadtal Road, Bakrol, Anand 388315",
  },
  {
    name: "Mehndi Ceremony",
    sub: "Family Lunch & Henna",
    art: "mehendi.webp",
    dateStr: "Fri, 29 Jan 2027",
    isoDate: "2027-01-29",
    time: "11:00",
    timeDisplay: "11:00 AM",
    venue: "14 Mansi Heavens",
    city: "Bakrol, Anand",
    fullAddress: "14 Mansi Heavens, behind Recharge Café, Bakrol–Vadtal Road, Bakrol, Anand 388315",
  },
  {
    name: "Grah Shanti",
    sub: "Reception Dinner",
    art: "reception.webp",
    dateStr: "Sat, 30 Jan 2027",
    isoDate: "2027-01-30",
    time: "18:30",
    timeDisplay: "6:30 PM",
    venue: "Umang Party Plot",
    city: "Near Chikhodra Circle, Anand",
    fullAddress: "Umang Party Plot, near Chikhodra Circle, Anand",
  },
  {
    name: "Travel to Mandavgarh",
    sub: "Departure by Bus & Car",
    art: "pavilion.webp",
    dateStr: "Sun, 31 Jan 2027",
    isoDate: "2027-01-31",
    time: "08:00",
    timeDisplay: "Morning Departure",
    venue: "Anand to Mandavgarh",
    city: "Mandu, Madhya Pradesh",
    fullAddress: "Anand to Mandavgarh (Mandu), Madhya Pradesh",
  },
  {
    name: "Haldi Celebration",
    sub: "Poolside Celebration",
    art: "haldi.webp",
    dateStr: "Mon, 1 Feb 2027",
    isoDate: "2027-02-01",
    time: "10:00",
    timeDisplay: "10:00 AM",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
  {
    name: "Sangeet Night",
    sub: "Musical Evening & Dinner",
    art: "sangeet.webp",
    dateStr: "Mon, 1 Feb 2027",
    isoDate: "2027-02-01",
    time: "19:00",
    timeDisplay: "7:00 PM",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
  {
    name: "Wedding Ceremony",
    sub: "Heritage Tour & Vivaah Muhurat",
    art: "vivaah.webp",
    dateStr: "Tue, 2 Feb 2027",
    isoDate: "2027-02-02",
    time: "11:00",
    timeDisplay: "11:00 AM onwards",
    venue: "Chinmay Resort",
    city: "Mandavgarh (Mandu), MP",
    fullAddress: "Chinmay Resort, Mandavgarh, Madhya Pradesh",
  },
  {
    name: "Departure for Anand",
    sub: "Farewell after Breakfast",
    art: "lotus_bunch.png",
    dateStr: "Wed, 3 Feb 2027",
    isoDate: "2027-02-03",
    time: "09:00",
    timeDisplay: "Morning",
    venue: "Chinmay Resort to Anand",
    city: "Return to Gujarat",
    fullAddress: "Chinmay Resort, Mandavgarh to Anand, Gujarat",
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

export interface FamilyCard {
  id: string;
  card: string;
  name: string;
  relLabel: string;
  parents: string[];
  note?: string;
}

export const FAMILIES: FamilyCard[] = [
  {
    id: "ryHostsCard",
    card: "hostsFamily",
    name: "Hosts",
    relLabel: "Cordially Invited by",
    parents: [
      "Vinubhai Dayabhai Patel",
      "Late Parsottambhai Dayabhai Patel",
      "Vimal and Kanisha Patel (Inside Solution)",
    ],
    note: "14 Mansi Twins, behind Recharge Café, Bakrol–Vadtal Road, Bakrol, Anand 388315",
  },
  {
    id: "ryGroomCard",
    card: "groomFamily",
    name: "Chi. Jatan",
    relLabel: "Son of",
    parents: ["Family Patel"],
  },
  {
    id: "ryBrideCard",
    card: "brideFamily",
    name: "Kum. Pearl",
    relLabel: "Daughter of",
    parents: ["Family Patel"],
  },
];

export const COMPLIMENTS = [
  "Vinubhai Dayabhai Patel & Family",
  "Late Parsottambhai Dayabhai Patel & Family",
  "Vimal and Kanisha Patel (Inside Solution)",
];

export const NOTE =
  "Your presence will make our celebration truly memorable. Kindly confirm your family's attendance in advance to help us arrange comfortable accommodation and hospitality for everyone.";

// ---- Website Texts & Config -----------------------------------------------

export const INVOCATION = "શ્રી ગણેશાય નમઃ";
export const INVOCATION_LANG = "gu";
export const GUEST_GREETING_DEFAULT = "Mr. Patidar and Family";
export const INTRO_NOTE =
  "Together with their families, we cordially invite you to celebrate the destination wedding of…";
export const HERO_TAGLINE = "Precious Life in the Right Hands.";
export const HERO_WELCOME = "Let's come together and celebrate this occasion.";
export const HERO_BANNER_TITLE = "Destination Wedding • 15 January – 2 February 2027";
export const HERO_BANNER_LOC = "Anand, Gujarat & Mandavgarh (Mandu), Madhya Pradesh";
export const OUTRO_MESSAGE = "Your Presence Means the World to Us";

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
