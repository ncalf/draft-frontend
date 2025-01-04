import { Position, TeamID } from "./types";

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

const teamIdToName: { [key: number]: string } = {
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

export const getTeamNameById = (id: keyof typeof teamIdToName): string => {
  return teamIdToName[id];
};

export const getTeamIdByName = (name: (typeof teamIdToName)[number]): TeamID => {
  const entry = Object.entries(teamIdToName).find(([, clubName]) => clubName === name);
  if (!entry) throw new Error(`Club name ${name} not found`);
  return Number(entry[0]) as TeamID;
};

export const shortenedClubIdToName = {
  Ade: "Adelaide Crows",
  Bris: "Brisbane Lions",
  Carl: "Carlton Blues",
  Coll: "Collingwood Magpies",
  Ess: "Essendon Bombers",
  Fre: "Fremantle Dockers",
  Geel: "Geelong Cats",
  GC: "Gold Coast Suns",
  GWS: "GWS Giants",
  Haw: "Hawthorn Hawks",
  Melb: "Melbourne Demons",
  NM: "North Melbourne Kangaroos",
  PA: "Port Adelaide",
  Rich: "Richmond Tigers",
  StK: "St Kilda Saints",
  Syd: "Sydney Swans",
  WC: "West Coast Eagles",
  WB: "Western Bulldogs",
} as const;

export const getClubNameByShortenedName = (id: keyof typeof shortenedClubIdToName): string => {
  return shortenedClubIdToName[id];
};

export function numberToPriceString(price: number | string): string {
  console.log(price);
  if (typeof price === "string") {
    return `$${Number(price).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
}

export const shortenedPositions: Position[] = ["C", "D", "F", "OB", "RK", "ROOK"];
export const shortenedPositionToName = {
  C: "Centre",
  D: "Defender",
  F: "Forward",
  OB: "Onballer",
  RK: "Ruck",
  ROOK: "Rookie",
  none: "None Selected",
  loading: "Loading",
} as const;

export function getPositionNameByShortenedName(position: keyof typeof shortenedPositionToName): string {
  return shortenedPositionToName[position];
}
export function getPositionCapitalNameByShortenedName(position: keyof typeof shortenedPositionToName): string {
  return shortenedPositionToName[position].toUpperCase();
}

export function getShortenedPositionName(position: keyof typeof shortenedPositionToName): string {
  return shortenedPositionToName[position];
}
