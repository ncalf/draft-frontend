import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { positions } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PayloadSchema = z.object({
  season: z.number().int().min(1000).max(9999),
  playerSeasonID: z.number().int().min(1).max(999),
  position: z.enum(positions),
});

const query = db
  .update(draftPlayers)
  .set({ nominated: true })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID")),
      eq(draftPlayers.position, sql.placeholder("position"))
    )
  )
  .prepare();

export async function PATCH(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsedBody = PayloadSchema.parse(rawBody);

    const playerSeasonID = parsedBody.playerSeasonID;
    const season = parsedBody.season;
    const position = parsedBody.position;

    await query.execute({
      season,
      playerSeasonID,
      position,
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
