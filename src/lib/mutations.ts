import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/providers";
import { currentPlayerAtom, positionAtom } from "@/lib/store";
import { toast } from "sonner";
import { Position, SoldPlayer, TeamID, UnsoldPlayer } from "@/lib/types";
import { useAtom, useAtomValue } from "jotai";

const SEASON = process.env.NEXT_PUBLIC_SEASON!;

export function useMarkPlayerNominatedMutation() {
  return useMutation({
    mutationFn: async (playerSeasonID: number) => {
      const position = useAtomValue(positionAtom);
      if (!position) {
        toast.error("No position selected");
        return;
      }

      await fetch(`/api/player/mark-nominated`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          season: parseInt(SEASON),
          playerSeasonID,
          position,
        }),
      });
    },
    onMutate: async (playerSeasonID: number) => {
      const position = useAtomValue(positionAtom);
      await queryClient.cancelQueries({
        queryKey: ["unsoldPlayers", position],
      });

      const previousUnsoldPlayers = queryClient.getQueryData<UnsoldPlayer[]>([
        "unsoldPlayers",
        position,
      ]);

      const updatedUnsoldPlayers = previousUnsoldPlayers?.map((player) =>
        player.playerSeasonID === playerSeasonID
          ? { ...player, nominated: 1 }
          : player
      );

      queryClient.setQueryData(
        ["unsoldPlayers", position],
        updatedUnsoldPlayers
      );

      return { previousUnsoldPlayers };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to mark player as nominated");
      queryClient.setQueryData(
        ["unsoldPlayers", useAtomValue(positionAtom)],
        context?.previousUnsoldPlayers
      );
    },
  });
}

export function useSellPlayerMutation() {
  return useMutation({
    mutationFn: async ({
      playerSeasonID,
      teamID,
      price,
      sellPosition,
      isRookie,
    }: {
      playerSeasonID: number;
      teamID: TeamID;
      price: number;
      sellPosition: Position;
      isRookie: boolean;
    }) => {
      const position = useAtomValue(positionAtom);

      if (!position) {
        toast.error("No position selected");
        return;
      }

      // If the player is a rookie, store the playerSeasonID in the local storage as a wasRookiePlayer
      if (isRookie) {
        const stored = localStorage.getItem("wasRookiePlayers");
        let wasRookiePlayers: number[] = [];
        try {
          wasRookiePlayers = stored ? JSON.parse(stored) : [];
        } catch {
          wasRookiePlayers = [];
        }

        if (!wasRookiePlayers.includes(playerSeasonID)) {
          wasRookiePlayers.push(playerSeasonID);
          localStorage.setItem(
            "wasRookiePlayers",
            JSON.stringify(wasRookiePlayers)
          );
        }
      }

      await fetch(`/api/player/sell`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          season: parseInt(SEASON),
          playerSeasonID,
          position: sellPosition,
          isRookie,
          teamID,
          price,
        }),
      });
    },
    onMutate: async ({ playerSeasonID }) => {
      const position = useAtomValue(positionAtom);
      await queryClient.cancelQueries({
        queryKey: ["unsoldPlayers", position],
      });

      const previousUnsoldPlayers = queryClient.getQueryData<UnsoldPlayer[]>([
        "unsoldPlayers",
        position,
      ]);

      const updatedUnsoldPlayers = previousUnsoldPlayers?.filter(
        (player) => player.playerSeasonID !== playerSeasonID
      );

      queryClient.setQueryData(
        ["unsoldPlayers", position],
        updatedUnsoldPlayers
      );

      return { previousUnsoldPlayers };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to sell player");
      queryClient.setQueryData(
        ["unsoldPlayers", useAtomValue(positionAtom)],
        context?.previousUnsoldPlayers
      );
    },
    onSuccess: (data, variables) => {
      const position = useAtomValue(positionAtom);
      queryClient.invalidateQueries({ queryKey: ["unsoldPlayers", position] });
      queryClient.invalidateQueries({ queryKey: ["soldPlayers", SEASON] });
      queryClient.invalidateQueries({ queryKey: ["teamStats", SEASON] });
      queryClient.invalidateQueries({
        queryKey: ["teamPlayers", SEASON, variables.teamID],
      });
    },
  });
}

export function useUndoSaleMutation() {
  return useMutation({
    mutationFn: async ({
      playerSeasonID,
      position,
    }: {
      playerSeasonID: number;
      position: Position;
    }) => {
      void position; // to avoid unused variable warning (it is required in the onSuccess callback)

      const stored = localStorage.getItem("wasRookiePlayers");
      let wasRookie = false;
      if (stored) {
        const wasRookiePlayers = JSON.parse(stored);
        wasRookie = wasRookiePlayers.includes(playerSeasonID);
      }

      await fetch(`/api/player/undo-sale`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: parseInt(SEASON),
          playerSeasonID,
          ...(wasRookie ? { wasRookie: true } : {}),
        }),
      });
    },
    onSuccess: (data, variables) => {
      const [position, setPosition] = useAtom(positionAtom);
      const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);

      queryClient.invalidateQueries({ queryKey: ["soldPlayers", SEASON] });
      queryClient.invalidateQueries({ queryKey: ["teamStats", SEASON] });

      const soldPlayers = queryClient.getQueryData<SoldPlayer[]>([
        "soldPlayers",
        SEASON,
      ]);
      const player = soldPlayers?.find(
        (p) => p.playerSeasonID === variables.playerSeasonID
      );
      const teamID = player?.teamID;

      if (teamID) {
        queryClient.invalidateQueries({
          queryKey: ["teamPlayers", SEASON, teamID],
        });
      }

      setCurrentPlayer(variables.playerSeasonID);

      const stored = localStorage.getItem("wasRookiePlayers");
      const wasRookie = stored
        ? JSON.parse(stored).includes(variables.playerSeasonID)
        : false;

      if (wasRookie) {
        queryClient.invalidateQueries({ queryKey: ["unsoldPlayers", "ROOK"] });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["unsoldPlayers", position],
        });
      }

      setPosition(wasRookie ? "ROOK" : variables.position);
        
      if (wasRookie && stored) {
        const updated = JSON.parse(stored).filter(
          (id: number) => id !== variables.playerSeasonID
        );
        localStorage.setItem("wasRookiePlayers", JSON.stringify(updated));
      }
    },
  });
}
