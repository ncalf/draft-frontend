import { AFLClub, shortenedClubIdToName, TeamID, teamIDs } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function teamIDToName(teamID: TeamID): string {
  return teamIDs[teamID];
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
