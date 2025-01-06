import { useQuery } from "@tanstack/react-query";
import { UnsoldPlayer, TeamStats, TeamPlayer, TeamID } from "./types";
import { useDashboardStore } from "./store";

const SEASON = process.env.NEXT_PUBLIC_SEASON;

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

      return await response.json();
    },
  });
}

export function useTeamStatsQuery() {
  return useQuery<TeamStats[]>({
    queryKey: ["teamStats", SEASON],
    queryFn: async () => {
      const response = await fetch(`/api/teams/stats/?season=${SEASON}`);
      return await response.json();
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
      return await response.json();
    },
  });
}

export function useSoldPlayersQuery() {
  return useQuery<TeamPlayer[]>({
    queryKey: ["soldPlayers", SEASON],
    queryFn: async () => {
      const response = await fetch(`/api/players/sold/?season=${SEASON}`);
      return await response.json();
    },
  });
}
