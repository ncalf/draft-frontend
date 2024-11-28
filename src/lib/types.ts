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

// all of the keys in a player object that includes the stats
interface PlayerStats {
  gms: number;
  k: string;
  m: string;
  hb: string;
  ff: string;
  fa: string;
  g: string;
  b: string;
  ho: string;
  t: string;
}

// the default info that is returned in a player object
interface PlayerInfo {
  PlayerSeasonID: number;
  FirstName: string;
  Surname: string;
}

// set the TeamsTableRawAPIResponse to just a renamed verison of SoldPlayers
// the same object is used in both, this just helps readability of code
export type TeamsTableRawAPIResponse = SoldPlayer;

// the type of a teams summary information
export interface TeamData {
  summary: {
    C: number;
    D: number;
    F: number;
    RK: number;
    OB: number;
    sum_price: number;
  };
  players: TeamsTableRawAPIResponse[];
}

// this is the form of that the team data is stored in the store, after it is modified after fetching from the backend
/*
  this means this type will be something like this:
  {
    0: {
      summary: {
        C: 2,
        D: 4,
        F: 2,
        RK: 3,
        OB: 2,
        sum_price: 12.60,
      },
      players: [...list of players...],
    }
    ... continued for each ncalf team ...
  }
*/
export type TeamsTableAPIResponse = Record<NcalfClubID, TeamData>;

// the type of the data that is returned from the backend when fetching a players 5-year-stats
// the server returns a list of maximum-5 of these objects, with each one being one year
export interface PlayerStatsAPIResponse extends PlayerStats {
  Season: number;
  Club: AFLTeamAbbreviations;
}

// the type of data that is returned from the backend from the get player name endpoint, in a one index list
// extends the PlayerInfo interface to also include all the players default name info
export interface PlayerNameAPIResponse extends PlayerInfo {
  club: AFLTeamAbbreviations;
}

export type PlayerImageAPIResponse = string; // the server just responds with a base64 image in a string

// returned by the sold player endpoint, in a one index list
// extends the PlayerInfo interface to also include all the players default name info
export interface SoldPlayer extends PlayerInfo {
  posn: Position;
  club: AFLTeamAbbreviations;
  ncalfclub: NcalfClubID;
  price: string;
}

// returned by the unsold player endpoint, as a list with one object per player
export interface UnsoldPlayer extends PlayerStats, PlayerInfo {
  Club: string;
  posn: Position;
  nominated: 0 | 1;
  availableforsale: 0 | 1;
}

// the type of data returned by the position totals endpoint
// the backend returns a list of these objects, with one object per position
export interface TotalPlayersRawAPIResponse {
  posn: Position;
  num_position: number;
}

// the type of data after it is modified from the original TotalPlayersRawAPIResponse type
export interface TotalPlayersAPIResponse {
  OB: number;
  ROOK?: number;
  D: number;
  C: number;
  F: number;
  RK: number;
}

// the backend reponds with a 1-index list of this object, wtih valuestring simply being the current position
export interface CurrentPositionApiReponse {
  valuestring: Position;
}

export type OriginalRookies = number[];
