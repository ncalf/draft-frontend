import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SearchParamsSchema = z.object({
  teamID: z.string().regex(/^\d+$/).nonempty(),
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
});

const query = db
  .select({
    playerSeasonID: draftPlayers.playerSeasonID,
    name: sql<string>`CONCAT(${draftPlayers.firstName}, ' ', ${draftPlayers.surname})`,
    club: draftPlayers.club,
    position: draftPlayers.position,
    price: draftPlayers.price,
  })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.teamID, sql.placeholder("teamID")),
      eq(draftPlayers.season, sql.placeholder("season"))
    )
  )
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse(rawParams);

    const teamID = parseInt(parsedParams.teamID, 10);
    const season = parseInt(parsedParams.season, 10);

    const players = await query.execute({
      teamID,
      season,
    });

    return NextResponse.json(players);
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
