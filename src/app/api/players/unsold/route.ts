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

const query = db
  .select({
    playerSeasonID: draftPlayers.playerSeasonID,
    name: sql`CONCAT(${draftPlayers.firstName}, ' ', ${draftPlayers.surname})`,
    position: draftPlayers.position,
    club: draftPlayers.club,
    gms: count(
      sql`IF(${stats.positionPlayed} > 0 AND ${
        stats.season
      } >= ${sql.placeholder("seasonThreshold")}, 1, NULL)`
    ),
    k: sql`COALESCE(SUM(${stats.k}), 0)`,
    m: sql`COALESCE(SUM(${stats.m}), 0)`,
    hb: sql`COALESCE(SUM(${stats.hb}), 0)`,
    ff: sql`COALESCE(SUM(${stats.ff}), 0)`,
    fa: sql`COALESCE(SUM(${stats.fa}), 0)`,
    g: sql`COALESCE(SUM(${stats.g}), 0)`,
    b: sql`COALESCE(SUM(${stats.b}), 0)`,
    ho: sql`COALESCE(SUM(${stats.ho}), 0)`,
    t: sql`COALESCE(SUM(${stats.t}), 0)`,
    nominated: draftPlayers.nominated,
  })
  .from(draftPlayers)
  .leftJoin(
    stats,
    and(
      eq(draftPlayers.playerSeasonID, stats.playerSeasonID),
      gte(stats.season, sql.placeholder("seasonThreshold")),
      sql`${stats.positionPlayed} > 0`
    )
  )
  .where(
    and(
      eq(draftPlayers.position, sql.placeholder("position")),
      eq(draftPlayers.sold, false),
      eq(draftPlayers.season, sql.placeholder("season"))
    )
  )
  .groupBy(draftPlayers.playerSeasonID)
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse(rawParams);

    const position = parsedParams.position;
    const season = parseInt(parsedParams.season);
    const years = parseInt(parsedParams.years);
    const seasonThreshold = season - (years - 1);

    const unsoldPlayers = await query.execute({
      position,
      season,
      seasonThreshold,
    });

    return NextResponse.json(unsoldPlayers);
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
