import { useQuery } from "@tanstack/react-query";
import { PositionState, UnsoldPlayer } from "./types";

export const BACKEND_IP = "http://192.168.1.23:8080/ncalf/draft/";
export const SEASON = "2024";

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
      const response = await fetch(BACKEND_IP + "/players/notsold/" + SEASON + "/" + position);
      unsoldPlayers = await response.json();

      return unsoldPlayers;
    },
  });
}
