import { useQuery } from "@tanstack/react-query";
import {
  UnsoldPlayer,
  TeamStats,
  TeamPlayer,
  TeamID,
  PlayerInfo,
} from "@/lib/types";
import { useDashboardStore } from "@/lib/store";

const SEASON = process.env.NEXT_PUBLIC_SEASON;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors || "API request failed");
  }
  return await response.json();
}

export function useUnsoldPlayersQuery() {
  const position = useDashboardStore((state) => state.position);

  return useQuery<UnsoldPlayer[]>({
    queryKey: ["unsoldPlayers", position],
    queryFn: async () => {
      if (!position) {
        return [];
      }

      const response = await fetch(
        `/api/players/unsold/?position=${position}&season=${SEASON}&years=1`
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

export const useSoldPlayersQuery = () => {
  const season = SEASON;

  return useQuery({
    queryKey: ["soldPlayers", season],
    queryFn: async () => {
      const response = await fetch(`/api/players/sold?season=${season}`);
      return await handleResponse(response);
    },
    select: (data) => [...data], // to maintain correct order
  });
};

export function usePlayerInfoQuery() {
  const currentPlayer = useDashboardStore((state) => state.currentPlayer);

  return useQuery<PlayerInfo>({
    queryKey: ["playerInfo", currentPlayer],
    queryFn: async () => {
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
