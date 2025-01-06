import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql, and, gt } from "drizzle-orm";
import { TeamStats } from "@/lib/types";

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/, { message: "Season must be a valid year (e.g., 2023)." })
    .nonempty({ message: "Season is required." }),
});

const query = db
  .select({
    teamID: draftPlayers.teamID,
    c: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'C' THEN 1 ELSE 0 END)`,
    d: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'D' THEN 1 ELSE 0 END)`,
    f: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'F' THEN 1 ELSE 0 END)`,
    ob: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'OB' THEN 1 ELSE 0 END)`,
    rk: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'RK' THEN 1 ELSE 0 END)`,
    rook: sql<string>`SUM(CASE WHEN ${draftPlayers.position} = 'ROOK' THEN 1 ELSE 0 END)`,
    total_price: sql<string>`SUM(${draftPlayers.price})`,
  })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      gt(draftPlayers.teamID, 0)
    )
  )
  .groupBy(draftPlayers.teamID)
  .orderBy(draftPlayers.teamID)
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get("season");

    const parsedParams = SearchParamsSchema.parse({
      season,
    });

    const parsedSeason = parseInt(parsedParams.season, 10);

    const rawTeamStats = await query.execute({ season: parsedSeason });

    const teamStats: TeamStats[] = rawTeamStats.map((stat) => ({
      ...stat,
      c: Number(stat.c),
      d: Number(stat.d),
      f: Number(stat.f),
      ob: Number(stat.ob),
      rk: Number(stat.rk),
      rook: Number(stat.rook),
      total_price: Number(stat.total_price),
    }));

    return NextResponse.json(teamStats);
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
