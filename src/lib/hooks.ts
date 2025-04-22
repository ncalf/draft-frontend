import { toast } from "sonner";
import { currentPlayerAtom, positionAtom } from "@/lib/store";
import { usePlayerInfoQuery, useUnsoldPlayersQuery } from "@/lib/queries";
import { useMarkPlayerNominatedMutation } from "@/lib/mutations";
import { useAtom, useAtomValue } from "jotai";

export function useGenerateRandomPlayer() {
  const { isLoading: isUnsoldPlayersLoading, data } = useUnsoldPlayersQuery();
  const { isLoading: isPlayerInfoLoading } = usePlayerInfoQuery();
  const position = useAtomValue(positionAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
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
    setCurrentPlayer(randomPlayer.playerSeasonID);
  }

  return generatePlayer;
}
