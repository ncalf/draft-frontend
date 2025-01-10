import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { readFile } from "fs/promises";
import path from "path";

const pictureDirectory = process.env.PICTURE_DIRECTORY;

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
  playerSeasonID: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const rawParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    const parsedParams = SearchParamsSchema.parse({
      season: rawParams.season,
      playerSeasonID: Number(rawParams.playerSeasonID),
    });

    const { season, playerSeasonID } = parsedParams;

    const player = await db
      .select({
        playerID: draftPlayers.playerID,
      })
      .from(draftPlayers)
      .where(
        and(
          eq(draftPlayers.season, parseInt(season)),
          eq(draftPlayers.playerSeasonID, playerSeasonID)
        )
      )
      .limit(1)
      .execute()
      .then((res) => res[0]);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    if (!pictureDirectory) {
      return NextResponse.json(
        { error: "Picture directory not configured" },
        { status: 500 }
      );
    }

    const imagePath = path.join(
      pictureDirectory,
      season,
      `${player.playerID}.png`
    );

    const imageBuffer = await readFile(imagePath);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: "Invalid query parameters" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
