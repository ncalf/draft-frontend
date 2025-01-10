import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql, and, gt } from "drizzle-orm";
import { TeamStats } from "@/lib/types";

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
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
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse(rawParams);

    const season = parseInt(parsedParams.season);

    const rawTeamStats = await query.execute({ season: season });

    const allTeamIDs = Array.from({ length: 11 }, (_, i) => i + 1);

    const statsMap = new Map(rawTeamStats.map((stat) => [stat.teamID, stat]));

    const teamStats: TeamStats[] = allTeamIDs.map((id) => {
      const stat = statsMap.get(id);
      return {
        teamID: id,
        c: stat ? Number(stat.c) : 0,
        d: stat ? Number(stat.d) : 0,
        f: stat ? Number(stat.f) : 0,
        ob: stat ? Number(stat.ob) : 0,
        rk: stat ? Number(stat.rk) : 0,
        rook: stat ? Number(stat.rook) : 0,
        total_price: stat ? Number(stat.total_price) : 0,
      };
    });

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
