import { db } from "@/db";
import { draftPlayers, stats } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { positions } from "@/lib/types";
import { eq, and, sql, count, gte } from "drizzle-orm";

const SearchParamsSchema = z.object({
  position: z.enum(positions),
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
  years: z
    .string()
    .regex(/^[1-9]\d*$/)
    .nonempty(),
});

// Set up the query to get the unsold players from the draftPlayers table for the given position and season
const notsoldplayersquery = db
  .select({
    season: draftPlayers.season,
    playerSeasonID: draftPlayers.playerSeasonID,
    playerID: draftPlayers.playerID,
    firstName: draftPlayers.firstName,
    surname: draftPlayers.surname,
    club: draftPlayers.club,
    position: draftPlayers.position,
    nominated: draftPlayers.nominated,
    availableForSale: draftPlayers.availableForSale,
  })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.position, sql.placeholder("position")),
      eq(draftPlayers.sold, false)
    )
  )
  .prepare();

  // Set up the query to get the player season stats for the previous season and playerSeasonID
  const playerseasonstatsquery = db
  .select({
    season: stats.season,
    playerSeasonID: stats.playerSeasonID,
    playerID: stats.playerID,
    firstName: draftPlayers.firstName,
    surname: draftPlayers.surname,
    club: stats.club,
    gms: count(sql`IF(${stats.positionPlayed} > 0, 1, NULL)`),
    sk: sql`COALESCE(SUM(${stats.k}), 0)`,
    sm: sql`COALESCE(SUM(${stats.m}), 0)`,
    shb: sql`COALESCE(SUM(${stats.hb}), 0)`,
    sff: sql`COALESCE(SUM(${stats.ff}), 0)`,
    sfa: sql`COALESCE(SUM(${stats.fa}), 0)`,
    sg: sql`COALESCE(SUM(${stats.g}), 0)`,
    sb: sql`COALESCE(SUM(${stats.b}), 0)`,
    sho: sql`COALESCE(SUM(${stats.ho}), 0)`,
    st: sql`COALESCE(SUM(${stats.t}), 0)`,
  })
  .from(stats)
  .innerJoin(
    draftPlayers,
    eq(stats.playerID, draftPlayers.playerID)
  )
  .where(
    eq(stats.season, sql.placeholder("seasonThreshold"))
  )
  .groupBy(stats.season, draftPlayers.playerID)
  .orderBy(draftPlayers.playerID, stats.season)
  .prepare();

// Define the GET request handler
export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse(rawParams);

    const position = parsedParams.position;
    const season = parseInt(parsedParams.season);
    const years = parseInt(parsedParams.years);
    const seasonThreshold = season - years;

    const unsoldPlayers = await notsoldplayersquery.execute({
      position,
      season,
    });
    
    const playerSeasonStats = await playerseasonstatsquery.execute({
      seasonThreshold,
    });
    
    // Filter the playerSeasonStats by the PlayerIDs in the result
    const filteredPlayerStats = playerSeasonStats.filter((item) =>
      unsoldPlayers.some((player) => player.playerID === item.playerID)
    );

    // Merge the playerstats with the result
    const mergedResult = unsoldPlayers.map((player) => ({
      ...player,
      name: `${player.firstName} ${player.surname}`,
      ...filteredPlayerStats.find(
        (stat) => stat.playerID === player.playerID
      ),
      playerSeasonID: player.playerSeasonID,
    }));
 

    return NextResponse.json(mergedResult);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: "Incorrect parameter format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
