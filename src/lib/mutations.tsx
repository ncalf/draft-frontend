import { queryClient } from "@/App";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BACKEND_IP, SEASON } from "./queries";
import { useDashboardStore } from "./store";

export function useMarkPlayerNominatedMutation() {
  return useMutation({
    mutationFn: async (playerID: number) => {
      const position = useDashboardStore.getState().position;
      if (!position) {
        toast.error("Position not set");
        return;
      }

      await fetch(`${BACKEND_IP}/player/marknominated`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id: playerID, season: SEASON, position: position }),
      });
    },
    onError: () => {
      toast.error("Failed to mark player nominated");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unsoldPlayers"] });
    },
  });
}
