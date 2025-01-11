import { toast } from "sonner";
import { useDashboardStore } from "./store";
import { usePlayerInfoQuery, useUnsoldPlayersQuery } from "./queries";
import { useMarkPlayerNominatedMutation } from "./mutations";

export function useGenerateRandomPlayer() {
  const { isLoading: isUnsoldPlayersLoading, data } = useUnsoldPlayersQuery();
  const { isLoading: isPlayerInfoLoading } = usePlayerInfoQuery();
  const { position } = useDashboardStore.getState();
  const mutation = useMarkPlayerNominatedMutation();

  function generatePlayer() {
    if (
      isUnsoldPlayersLoading ||
      isPlayerInfoLoading ||
      position === undefined
    ) {
      return;
    }
    const unominatedPlayers = data?.filter((player) => !player.nominated);
    if (unominatedPlayers?.length === 0 || !unominatedPlayers) {
      toast.info("All players in the position have been nominated.");
      return;
    }
    const randomPlayer =
      unominatedPlayers[Math.floor(Math.random() * unominatedPlayers.length)];
    mutation.mutate(randomPlayer.playerSeasonID);
    useDashboardStore.setState({ currentPlayer: randomPlayer.playerSeasonID });
  }

  return generatePlayer;
}
