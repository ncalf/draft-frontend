export const shortPositionsToPosition = {
  C: "Centre",
  D: "Defender",
  F: "Forward",
  OB: "Onballer",
  RK: "Ruck",
  ROOK: "Rookie",
} as const;

export const positions = ["C", "D", "F", "OB", "RK", "ROOK"] as const;
export type Position = (typeof positions)[number];
export type PositionState = Position | undefined;

export const teamIDsToName: Record<number, string> = {
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

export const teamsIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type TeamID = keyof typeof teamIDsToName;

export const shortenedClubIdToName = {
  Ade: "Adelaide",
  Bris: "Brisbane",
  Carl: "Carlton",
  Coll: "Collingwood",
  Ess: "Essendon",
  Fre: "Fremantle",
  Geel: "Geelong",
  GC: "Gold Coast",
  GWS: "GWS",
  Haw: "Hawthorn",
  Melb: "Melbourne",
  NM: "North Melbourne",
  PA: "Port Adelaide",
  Rich: "Richmond",
  StK: "St Kilda",
  Syd: "Sydney",
  WC: "West Coast",
  WB: "Western Bulldogs",
};

export type AFLClub = keyof typeof shortenedClubIdToName;

export interface UnsoldPlayer {
  playerSeasonID: number;
  name: string;
  position: string;
  club: string;
  gms: number;
  k: number;
  m: number;
  hb: number;
  ff: number;
  fa: number;
  g: number;
  b: number;
  ho: number;
  t: number;
  nominated: boolean;
}

export interface TeamStats {
  teamID: number;
  c: number;
  d: number;
  f: number;
  ob: number;
  rk: number;
  rook: number;
  total_price: number;
}

export interface TeamPlayer {
  playerSeasonID: number;
  name: string;
  club: AFLClub;
  position: Position;
  price: string;
}

export interface SoldPlayer extends TeamPlayer {
  teamID: TeamID;
}

export interface PlayerInfo {
  name: string;
  club: string;
  stats: PlayerStats[];
}

interface PlayerStats {
  season: number;
  club: string;
  k: number;
  m: number;
  hb: number;
  ff: number;
  fa: number;
  g: number;
  b: number;
  ho: number;
  t: number;
}
