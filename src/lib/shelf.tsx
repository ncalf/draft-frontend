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
