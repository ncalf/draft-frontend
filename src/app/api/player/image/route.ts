import { db } from "@/db";
import { draftPlayers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { readFile, access } from "fs/promises";
import path from "path";

const pictureDirectory = process.env.PICTURE_DIRECTORY;

export const playerSeasonIDtoPlayerIDQuery = db
  .select({ playerID: draftPlayers.playerID })
  .from(draftPlayers)
  .where(
    and(
      eq(draftPlayers.season, sql.placeholder("season")),
      eq(draftPlayers.playerSeasonID, sql.placeholder("playerSeasonID"))
    )
  )
  .limit(1);

const SearchParamsSchema = z.object({
  season: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty(),
  playerSeasonID: z.number().int().positive(),
});

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

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

    const player = await playerSeasonIDtoPlayerIDQuery
      .execute({
        season,
        playerSeasonID,
      })
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

    let imagePath = path.join(
      pictureDirectory,
      season,
      `${player.playerID}.png`
    );

    if (!(await fileExists(imagePath))) {
      imagePath = path.join(pictureDirectory, "placeholder.png");
    }

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
