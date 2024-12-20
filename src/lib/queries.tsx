import { useQuery } from "@tanstack/react-query";
import { PositionState, UnsoldPlayer } from "./types";

export const BACKEND_IP = `http://${import.meta.env.VITE_BACKEND_IP}/ncalf/draft`;
export const SEASON = "2024";

// console.log(process.env);

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
      const response = await fetch(BACKEND_IP + "/players/unsold/" + SEASON + "/" + position);
      unsoldPlayers = await response.json();
      console.log(unsoldPlayers);

      return unsoldPlayers;
    },
  });
}
