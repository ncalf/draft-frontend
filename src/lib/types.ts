export type Position = "C" | "D" | "F" | "OB" | "RK"; // the possible positions
export type PositionState = Position | "ROOK" | "none"; // the possible value that the position filter could hold
export type NcalfClubID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // the possible club ids
export type AFLTeamAbbreviations =
  | "Ade"
  | "Bris"
  | "Carl"
  | "Coll"
  | "Ess"
  | "WB"
  | "Fre"
  | "Geel"
  | "GC"
  | "GWS"
  | "Haw"
  | "Melb"
  | "NM"
  | "PA"
  | "Rich"
  | "StK"
  | "Syd"
  | "WC"
  | "WB"; // the possible club abbreviations

export interface PlayerSeasonStats {
  gms: number;
  sk: string;
  sm: string;
  shb: string;
  sff: string;
  sfa: string;
  sg: string;
  sb: string;
  sho: string;
  st: string;
}

export type TeamsStatsAPIResponse = {
  ncalfclubid: NcalfClubID;
  C: number;
  D: number;
  F: number;
  RK: number;
  OB: number;
  sum_price: string;
}[];

export type TeamStats = {
  club: string;
  C: number;
  D: number;
  F: number;
  RK: number;
  OB: number;
  price: string;
};

export interface ClubPlayer {
  FirstName: string;
  PlayerSeasonID: number;
  Surname: string;
  club: AFLTeamAbbreviations;
  posn: Position;
  price: string;
}

export interface UnsoldPlayer extends PlayerSeasonStats {
  FirstName: string;
  PlayerSeasonID: number;
  Surname: string;
  club: AFLTeamAbbreviations;
  posn: Position;
  price: string;
}
