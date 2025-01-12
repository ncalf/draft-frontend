import {
  AFLClub,
  Position,
  shortenedClubIdToName,
  shortPositionsToPosition,
  TeamID,
  teamIDsToName,
} from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function teamIDToName(teamID: TeamID): string {
  return teamIDsToName[teamID];
}

export function clubShortenedNameToFullName(shortName: string): string {
  return shortenedClubIdToName[shortName as AFLClub];
}

export function numberToPriceString(price: number | string): string {
  if (typeof price === "string") {
    price = parseFloat(price);
  }
  return `$${price.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
}

export function positionShortenedNameToFullName(
  shortName: string,
  capital?: boolean
): string {
  const position = shortPositionsToPosition[shortName as Position] || "None";
  if (capital) {
    return position.toUpperCase();
  }
  return position;
}

export const maxPlayersPerPosition: Record<Position, number> = {
  C: 3,
  D: 8,
  F: 8,
  OB: 2,
  RK: 1,
  ROOK: 0,
};
