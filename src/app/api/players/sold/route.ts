import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
});

const query = db
  .select({
    position: draftPlayers.position,
    playerSeasonID: draftPlayers.playerSeasonID,
    name: sql`CONCAT(${draftPlayers.firstName}, ' ', ${draftPlayers.surname})`,
    club: draftPlayers.club,
    price: draftPlayers.price,
  })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.sold, true)
    )
  )
  .prepare();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get("season");

    const parsedParams = SearchParamsSchema.parse({
      season,
    });

    const parsedSeason = parseInt(parsedParams.season);

    const unsoldPlayers = await query.execute({
      season: parsedSeason,
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
