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
  playerSeasonID: z.preprocess(
    (val) => parseInt(val as string),
    z.number().int().gt(0).max(999)
  ),
  years: z.preprocess((val) => parseInt(val as string), z.number().int().gt(0)),
});

const basicInfoQuery = db
  .select({
    name: sql`CONCAT(${draftPlayers.firstName}, ' ', ${draftPlayers.surname})`,
    club: draftPlayers.club,
  })
  .from(draftPlayers)
  .where(eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID")))
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
      eq(stats.playerSeasonID, sql.placeholder("playerSeasonID")),
      gte(stats.season, sql.placeholder("seasonThreshold")),
      sql`${stats.positionPlayed} > 0`
    )
  )
  .groupBy(stats.season, stats.club)
  .orderBy(desc(stats.season))
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerSeasonID = searchParams.get("playerSeasonID");
    const season = searchParams.get("season");
    const yearsParam = searchParams.get("years");

    const parsedParams = SearchParamsSchema.parse({
      playerSeasonID,
      season,
      years: yearsParam,
    });

    const parsedPlayerSeasonID = parsedParams.playerSeasonID;
    const parsedSeason = parseInt(parsedParams.season);
    const years = parsedParams.years;
    const seasonThreshold = parsedSeason - years;

    const [nameResult] = await basicInfoQuery.execute({
      playerSeasonID: parsedPlayerSeasonID,
    });

    const statsResult = await statsQuery.execute({
      playerSeasonID: parsedPlayerSeasonID,
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
