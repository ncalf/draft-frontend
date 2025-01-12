import { db } from "@/db";
import { draftPlayers, stats } from "@/db/schema";
import { and, eq, gte, sql, desc, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
  playerSeasonID: z
    .string()
    .regex(/^\d{1,3}$/)
    .nonempty(),
  years: z
    .string()
    .regex(/^[1-9]\d*$/)
    .nonempty(),
});

const playerSeasonIDtoPlayerIDQuery = db
  .select({ playerID: draftPlayers.playerID })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID"))
    )
  )
  .limit(1);

const basicInfoQuery = db
  .select({
    name: sql`CONCAT(${draftPlayers.firstName}, ' ', ${draftPlayers.surname})`,
    club: draftPlayers.club,
  })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID")),
      eq(draftPlayers.season, sql.placeholder("season"))
    )
  )
  .prepare();

const statsQuery = db
  .select({
    season: stats.season,
    club: stats.club,
    gms: count(sql`IF(${stats.positionPlayed} > 0, 1, NULL)`).as("gms"),
    k: sql`COALESCE(SUM(${stats.k}), 0)`.as("k"),
    m: sql`COALESCE(SUM(${stats.m}), 0)`.as("m"),
    hb: sql`COALESCE(SUM(${stats.hb}), 0)`.as("hb"),
    ff: sql`COALESCE(SUM(${stats.ff}), 0)`.as("ff"),
    fa: sql`COALESCE(SUM(${stats.fa}), 0)`.as("fa"),
    g: sql`COALESCE(SUM(${stats.g}), 0)`.as("g"),
    b: sql`COALESCE(SUM(${stats.b}), 0)`.as("b"),
    ho: sql`COALESCE(SUM(${stats.ho}), 0)`.as("ho"),
    t: sql`COALESCE(SUM(${stats.t}), 0)`.as("t"),
  })
  .from(stats)
  .where(
    and(
      eq(stats.playerID, sql.placeholder("playerID")),
      gte(stats.season, sql.placeholder("seasonThreshold")),
      sql`${stats.positionPlayed} > 0`
    )
  )
  .groupBy(stats.season, stats.club)
  .orderBy(desc(stats.season))
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse(rawParams);

    const playerSeasonID = parsedParams.playerSeasonID;
    const season = parseInt(parsedParams.season);
    const years = parseInt(parsedParams.years);
    const seasonThreshold = season - years;

    const [nameResult] = await basicInfoQuery.execute({
      playerSeasonID,
      season,
    });

    const playerIDResult = await playerSeasonIDtoPlayerIDQuery.execute({
      season,
      playerSeasonID,
    });

    const playerID = playerIDResult[0].playerID;

    const statsResult = await statsQuery.execute({
      playerID,
      seasonThreshold,
    });

    const playerInfo = {
      name: nameResult.name,
      club: nameResult.club,
      stats: statsResult,
    };

    return NextResponse.json(playerInfo);
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
