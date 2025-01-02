import { useQuery } from "@tanstack/react-query";
import { getClubNameById } from "./shelf";
import { ClubPlayer, NcalfClubID, PositionState, TeamsStatsAPIResponse, TeamStats, UnsoldPlayer } from "./types";

export const BACKEND_IP = `http://${import.meta.env.VITE_BACKEND_IP}/ncalf/draft`;
export const SEASON = "2025";

export function useUnsoldPlayersQuery(position: PositionState) {
  return useQuery({
    queryKey: ["unsoldPlayers", position],
    queryFn: async () => {
      let unsoldPlayers: UnsoldPlayer[] = []; // default value

      // if the position is none, then we don't need to fetch the data
      if (position === "none") {
        return unsoldPlayers;
      }

      // fetch the unsold player data
      const response = await fetch(`${BACKEND_IP}/players/unsold/${SEASON}/${position}`);
      unsoldPlayers = await response.json();

      return unsoldPlayers;
    },
  });
}

export function useClubsStatsQuery() {
  return useQuery({
    queryKey: ["teamStats", SEASON],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_IP}/teams/stats/2024`);
      const rawTeamStats: TeamsStatsAPIResponse = await response.json();

      const teamStats: TeamStats[] = rawTeamStats.map((team) => ({
        club: getClubNameById(team.ncalfclubid),
        C: team.C,
        D: team.D,
        F: team.F,
        RK: team.RK,
        OB: team.OB,
        price: team.sum_price,
      }));

      return teamStats;
    },
  });
}

export function useClubPlayersQuery(clubId: NcalfClubID) {
  return useQuery({
    queryKey: ["teamPlayers", clubId],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_IP}/players/sold/2024/${clubId}`);
      const players: ClubPlayer[] = await response.json();

      return players;
    },
  });
}
