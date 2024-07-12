import { TeamsTableAPIResponse } from "./types";

// convert the ncalf club id to the clubs full name
export const clubIdToName: { [key: number]: string } = {
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

export const clubIdToShortName: { [key: number]: string } = {
  1: "BU",
  2: "BB1",
  3: "BB2",
  4: "BB3",
  5: "GKR",
  6: "JJ",
  7: "KP",
  8: "KC",
  9: "LH",
  10: "RR",
  11: "SS",
};

// converts the full name of an ncalf club to its club id
export const clubNameToID: { [key: string]: number } = {
  "Barnestoneworth United": 1,
  "Berwick Blankets": 2,
  "Bogong Bedouin": 3,
  "Bohemian Buffali": 4,
  "G. K. Rovers": 5,
  "Jancourt Jackrabbits": 6,
  "Kamarah Paddockbashers": 7,
  "Kennedy Celtics": 8,
  "Laughing Hyenas": 9,
  "Rostron Redbacks": 10,
  "Southern Squadron": 11,
};

// convert the shortened version of an AFL team to its full name
export const shortenedTeamIdToName = {
  Ade: "Adelaide Crows",
  Bri: "Brisbane Lions",
  Car: "Carlton Blues",
  Col: "Collingwood Magpies",
  Ess: "Essendon Bombers",
  Fre: "Fremantle Dockers",
  Gee: "Geelong Cats",
  GC: "Gold Coast Suns",
  GWS: "GWS Giants",
  Haw: "Hawthorn Hawks",
  Mel: "Melbourne Demons",
};

// convert the abbreviation for a position to its full name (in lowercase)
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

// convert the abbreviation for a position to its full name (in uppercase plural)
export const shortenedPositionToCapitalName = {
  C: "CENTRES",
  D: "DEFENDERS",
  F: "FORWARDS",
  OB: "ONBALLERS",
  RK: "RUCKS",
  ROOK: "ROOKIES",
  none: "NONE SELECTED",
};

// convert each player info key to a readable name for it
export const shortenedStatsToName = {
  PlayerSeasonID: "Player Season ID",
  gms: "Games Played",
  k: "Kicks",
  m: "Marks",
  hb: "Handballs",
  ff: "Frees For",
  fa: "Frees Against",
  g: "Goals",
  b: "Behinds",
  ho: "Hit Outs",
  t: "Tackles",
};

// an empty teams table object to ensure if no data exists, it will be 0 by default
export const template: TeamsTableAPIResponse = {
  1: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  2: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  3: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  4: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  5: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  6: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },

  7: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  8: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  9: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  10: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
  11: {
    summary: {
      C: 0,
      D: 0,
      F: 0,
      RK: 0,
      OB: 0,
      sum_price: 0,
    },
    players: [],
  },
};
// a function that takes in a number and returns it in currency format with two digits as a string
export function numbertoPrice(number: number) {
  const withZeros = number.toFixed(2);
  return `$${withZeros}`;
}

// defines the maximum amount of players allowed in each position
export const maxPlayersPerPosition = {
  C: 3,
  D: 8,
  F: 8,
  OB: 2,
  RK: 1,
};

// defines the parameters for the team in the current season
export const seasonParameters = {
  draftBudget: 20,
  draftBidIncrement: 0.1,
  numPlayersInNCALFTeam: 22,
};
