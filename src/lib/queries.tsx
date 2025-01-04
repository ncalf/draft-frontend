import { useQuery } from "@tanstack/react-query";
import { PlayerStat, PositionState, SoldPlayer, TeamID, TeamStats, UnsoldPlayer } from "./types";

export const BACKEND_IP = `http://${import.meta.env.VITE_BACKEND_IP}/ncalf/draft`;
export const SEASON = "2025";

export function useUnsoldPlayersQuery(position: PositionState) {
  return useQuery({
    queryKey: ["unsoldPlayers", position],
    queryFn: async () => {
      let unsoldPlayers: UnsoldPlayer[] = []; // default value

      // if the position is none, then we don't need to fetch the data
      if (position === undefined) {
        return unsoldPlayers;
      }

      // fetch the unsold player data
      const response = await fetch(`${BACKEND_IP}/players/unsold/${SEASON}/${position}`);
      unsoldPlayers = await response.json();

      return unsoldPlayers;
    },
  });
}

export function useTeamStatsQuery() {
  return useQuery({
    queryKey: ["teamStats", SEASON],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_IP}/teams/stats/2024`);
      const teamStats: TeamStats[] = await response.json();

      return teamStats;
    },
  });
}

export function useTeamPlayersQuery(clubId: TeamID) {
  return useQuery({
    queryKey: ["teamPlayers", clubId, SEASON],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_IP}/players/sold/2024/${clubId}`);
      const players: SoldPlayer[] = await response.json();

      return players;
    },
  });
}

export function useSoldPlayersQuery() {
  return useQuery({
    queryKey: ["soldPlayers", SEASON],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_IP}/players/sold/2024`);
      const players: SoldPlayer[] = await response.json();

      return players;
    },
  });
}

export function usePlayerNameQuery(seasonID: number | undefined) {
  return useQuery({
    queryKey: ["playerName", seasonID],
    queryFn: async () => {
      if (seasonID === undefined) {
        return { FirstName: "", Surname: "" };
      }

      const response = await fetch(`${BACKEND_IP}/player/name/2024/${seasonID}`);
      const playerNames: { FirstName: string; Surname: string } = await response.json();

      return playerNames;
    },
  });
}

export function usePlayerStatsQuery(seasonID: number | undefined) {
  return useQuery({
    queryKey: ["playerStats", seasonID],
    queryFn: async () => {
      if (seasonID === undefined) {
        return [];
      }

      const response = await fetch(`${BACKEND_IP}/player/stats/2024/${seasonID}`);
      const playerStats: PlayerStat[] = await response.json();

      return playerStats;
    },
  });
}
