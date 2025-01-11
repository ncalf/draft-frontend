import {
  int,
  text,
  decimal,
  boolean,
  mysqlTable,
} from "drizzle-orm/mysql-core";

const sharedColumns = {
  season: int("Season"),
  playerID: text("PlayerID"),
  playerSeasonID: int("PlayerSeasonID"),
  club: text("Club").notNull(),
  teamID: int("TeamID").notNull(),
  position: text("Position"),
};

export const draftPlayers = mysqlTable("draft_players", {
  firstName: text("FirstName"),
  surname: text("Surname"),
  price: decimal("Price", { precision: 4, scale: 2 }),
  sold: boolean("Sold"),
  nominated: boolean("Nominated"),
  availableForSale: boolean("AvailableForSale"),
  sequence: int("Sequence"),
  ...sharedColumns,
});

export const stats = mysqlTable("stats", {
  round: int("Round"),
  positionPlayed: int("PositionPlayed"),
  k: int("k"),
  m: int("m"),
  hb: int("hb"),
  ff: int("ff"),
  fa: int("fa"),
  g: int("g"),
  b: int("b"),
  ho: int("ho"),
  t: int("t"),
  ...sharedColumns,
});
