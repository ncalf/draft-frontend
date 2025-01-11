import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PayloadSchema = z.object({
  season: z.number().int().min(1000).max(9999),
  playerSeasonID: z.number().int().min(1).max(999),
  wasRookie: z.boolean().optional(),
});

const undoSaleQuery = db
  .update(draftPlayers)
  .set({
    sold: false,
    teamID: 0,
    price: "0",
    nominated: false,
    availableForSale: true,
    sequence: 0,
  })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID"))
    )
  )
  .prepare();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PayloadSchema.parse(body);

    await undoSaleQuery.execute({
      season: parsed.season,
      playerSeasonID: parsed.playerSeasonID,
    });

    if (parsed.wasRookie) {
      await db
        .update(draftPlayers)
        .set({ position: "ROOK" })
        .where(
          and(
            eq(draftPlayers.season, Number(parsed.season)),
            eq(draftPlayers.playerSeasonID, Number(parsed.playerSeasonID))
          )
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
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
