import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { positions } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
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
  newPosition: z.enum(positions),
});

const query = db
  .update(draftPlayers)
  .set({ position: sql`${sql.placeholder("newPosition")}` })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID"))
    )
  )
  .prepare();

export async function PATCH(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = SearchParamsSchema.parse(rawBody);

    await query.execute({
      newPosition: parsed.newPosition,
      season: parsed.season,
      playerSeasonID: parsed.playerSeasonID,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: "Incorrect payload format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
