import { useQuery } from "@tanstack/react-query";
import {
  UnsoldPlayer,
  TeamStats,
  TeamPlayer,
  TeamID,
  PlayerInfo,
  SoldPlayer,
} from "./types";
import { useDashboardStore } from "./store";

const SEASON = process.env.NEXT_PUBLIC_SEASON;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors || "API request failed");
  }
  return response.json();
}

export function useUnsoldPlayersQuery() {
  return useQuery<UnsoldPlayer[]>({
    queryKey: ["unsoldPlayers", useDashboardStore.getState().position],
    queryFn: async () => {
      const position = useDashboardStore.getState().position;

      if (!position) {
        return [];
      }

      const response = await fetch(
        `/api/players/unsold/?position=${position}&season=${SEASON}&years=5`
      );

      return await handleResponse(response);
    },
  });
}

export function useTeamStatsQuery() {
  return useQuery<TeamStats[]>({
    queryKey: ["teamStats", SEASON],
    queryFn: async () => {
      const response = await fetch(`/api/teams/stats/?season=${SEASON}`);

      return await handleResponse(response);
    },
  });
}

export function useTeamPlayersQuery(teamID: TeamID) {
  return useQuery<TeamPlayer[]>({
    queryKey: ["teamPlayers", SEASON, teamID],
    queryFn: async () => {
      const response = await fetch(
        `/api/teams/players/?teamID=${teamID}&season=${SEASON}`
      );

      return await handleResponse(response);
    },
  });
}

export function useSoldPlayersQuery() {
  return useQuery<SoldPlayer[]>({
    queryKey: ["soldPlayers", SEASON],
    queryFn: async () => {
      const response = await fetch(`/api/players/sold/?season=${SEASON}`);

      return await handleResponse(response);
    },
  });
}

export function usePlayerInfoQuery() {
  return useQuery<PlayerInfo>({
    queryKey: ["playerInfo", useDashboardStore.getState().currentPlayer],
    queryFn: async () => {
      const currentPlayer = useDashboardStore.getState().currentPlayer;

      if (!currentPlayer) {
        return null;
      }

      const response = await fetch(
        `/api/player/info/?playerSeasonID=${currentPlayer}&season=${SEASON}&years=5`
      );

      return await handleResponse(response);
    },
  });
}
