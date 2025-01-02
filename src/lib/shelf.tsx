import { NcalfClubID } from "./types";

export const columnsIdsToDisplayName: { [key: string]: string } = {
  gms: "GMS",
  k: "K",
  m: "M",
  hb: "HB",
  ff: "FF",
  fa: "FA",
  g: "G",
  b: "B",
  ho: "HO",
  t: "T",
};

const clubIdToName: { [key: number]: string } = {
  1: "Barnestoneworth United",
  2: "Berwick Blankets",
  3: "Bogong Bedouin",
  4: "Bohemian Buffali",
  5: "G. K. Rovers",
  6: "Jancourt Jackrabbits",
  7: "Kamarah Paddockbashers",
  8: "Kennedy Celtics",
  9: "Laughing Hyenas",
  10: "Rostron Redbacks",
  11: "Southern Squadron",
};

export const getClubNameById = (id: keyof typeof clubIdToName): string => {
  return clubIdToName[id];
};

export const getClubIdByName = (name: (typeof clubIdToName)[number]): NcalfClubID => {
  const entry = Object.entries(clubIdToName).find(([, clubName]) => clubName === name);
  if (!entry) throw new Error(`Club name ${name} not found`);
  return Number(entry[0]) as NcalfClubID;
};

export const shortenedTeamIdToName = {
  Ade: "Adelaide Crows",
  Bris: "Brisbane Lions",
  Carl: "Carlton Blues",
  Coll: "Collingwood Magpies",
  Ess: "Essendon Bombers",
  WB: "Western Bulldogs",
  Fre: "Fremantle Dockers",
  Geel: "Geelong Cats",
  GC: "Gold Coast Suns",
  GWS: "Greater Western Sydney Giants",
  Haw: "Hawthorn Hawks",
  Melb: "Melbourne Demons",
  NM: "North Melbourne Kangaroos",
  PA: "Port Adelaide Power",
  Rich: "Richmond Tigers",
  StK: "St Kilda Saints",
  Syd: "Sydney Swans",
  WC: "West Coast Eagles",
} as const;

export const getTeamNameByShortenedName = (id: keyof typeof shortenedTeamIdToName): string => {
  return shortenedTeamIdToName[id];
};

export function numberToPriceString(price: number | string): string {
  if (typeof price === "string") {
    return `$${Number(price).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
}

export const shortenedPositionToName = {
  C: "Centre",
  D: "Defender",
  F: "Forward",
  OB: "Onballer",
  RK: "Ruck",
  ROOK: "Rookie",
  none: "None Selected",
  loading: "Loading",
};

export function getPositionNameByShortenedName(position: keyof typeof shortenedPositionToName): string {
  return shortenedPositionToName[position];
}

export function getShortenedPositionName(position: keyof typeof shortenedPositionToName): string {
  return shortenedPositionToName[position];
}
