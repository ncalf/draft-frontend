import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { positions } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PayloadSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
  playerSeasonID: z
    .string()
    .regex(/^\d{1,3}$/)
    .nonempty(),
  position: z.enum(positions).optional(),
  teamID: z
    .string()
    .regex(/^([1-9]|10|11)$/)
    .nonempty(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .nonempty(),
});

const positionQuery = db
  .update(draftPlayers)
  .set({ position: sql`${sql.placeholder("newPosition")}` })
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("seasonPosition")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonIDPosition"))
    )
  )
  .prepare();

const query = db
  .update(draftPlayers)
  .set({
    teamID: sql`${sql.placeholder("teamID")}`,
    price: sql`${sql.placeholder("price")}`,
    sold: true,
    availableForSale: false,
    sequence: sql`(
      (SELECT MAX(${draftPlayers.sequence}) FROM (
        SELECT ${draftPlayers.sequence} FROM ${draftPlayers}
        WHERE ${draftPlayers.season} = ${sql.placeholder("seasonForSequence")}
      ) AS temp) + 1
    )`,
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
    const { season, playerSeasonID, position, teamID, price } = parsed;

    if (parsed.position) {
      await positionQuery.execute({
        newPosition: parsed.position,
        seasonPosition: parsed.season,
        playerSeasonIDPosition: parsed.playerSeasonID,
      });
    }

    await query.execute({
      teamID,
      price,
      seasonForSequence: season,
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
