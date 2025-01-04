export type Position = "C" | "D" | "F" | "OB" | "RK" | "ROOK"; // the possible positions
export type PositionFilterValues = "C" | "D" | "F" | "OB" | "RK";
export type PositionState = Position | undefined; // the possible value that the position filter could hold
export type TeamID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // the possible club ids
export type AFLClub =
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

export interface TeamStats {
  TeamID: TeamID;
  c: number;
  d: number;
  f: number;
  rk: number;
  ob: number;
  SumPrice: string;
}

export interface SoldPlayer {
  FirstName: string;
  PlayerSeasonID: number;
  Surname: string;
  Club: AFLClub;
  Position: Position;
  Price: string;
}

export interface UnsoldPlayer extends PlayerSeasonStats {
  FirstName: string;
  PlayerSeasonID: number;
  Surname: string;
  Club: AFLClub;
  Position: Position;
  Price: string;
}

export interface PlayerStat extends PlayerSeasonStats {
  Season: 2024;
}
