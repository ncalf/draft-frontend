import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { positions } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PayloadSchema = z.object({
  season: z.number().int().min(1000).max(9999),
  playerSeasonID: z.number().int().min(1).max(999),
  teamID: z.number().int().min(1).max(11),
  price: z.number().min(0).multipleOf(0.01),
  position: z.enum(positions).optional(),
  isRookie: z.boolean(),
});

// If the player is a rookie, update the position
const rookieSellQuery = db
  .update(draftPlayers)
  .set({ position: sql`${sql.placeholder("newRookiePosition")}` })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("seasonRookiePosition")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonIDRookiePosition"))
    )
  )
  .prepare();

// Update the player's teamID, price, sold status and sequence for a player sale
const sellQuery = db
  .update(draftPlayers)
  .set({
    teamID: sql`${sql.placeholder("teamID")}`,
    price: sql`${sql.placeholder("price")}`,
    sold: true,
    sequence: sql`(
      SELECT next_sequence FROM (
        SELECT COALESCE(MAX(${draftPlayers.sequence}), 0) + 1 as next_sequence
        FROM ${draftPlayers}
        WHERE ${draftPlayers.season} = ${sql.placeholder("seasonForSequence")}
      ) AS seq
    )`,
  })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID")),
      eq(draftPlayers.position, sql.placeholder("position"),)
    )
  )
  .prepare();

  // Update the player's availableForSale and nominated status
  const availableForSaleQuery = db
  .update(draftPlayers)
  .set({ availableForSale: false, nominated: true })
  .where(
    and(
      eq(draftPlayers.season, sql`${sql.placeholder("season")}`),
      eq(draftPlayers.playerSeasonID, sql`${sql.placeholder("playerSeasonID")}`)
    )
  )

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PayloadSchema.parse(body);
    const { season, playerSeasonID, position, teamID, price, isRookie } = parsed;

    if (isRookie) {
      await rookieSellQuery.execute({
        newRookiePosition: position,
        seasonRookiePosition: season,
        playerSeasonIDRookiePosition: playerSeasonID,
      });
    }

    await sellQuery.execute({
      teamID,
      price,
      seasonForSequence: season,
      season,
      playerSeasonID,
      position,
    });

    await availableForSaleQuery.execute({
      season,
      playerSeasonID, });

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
