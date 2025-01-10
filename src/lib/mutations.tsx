import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./providers";
import { useDashboardStore } from "./store";
import { toast } from "sonner";
import { Position, SoldPlayer, TeamID, UnsoldPlayer } from "./types";

const SEASON = process.env.NEXT_PUBLIC_SEASON;

export function useMarkPlayerNominatedMutation() {
  return useMutation({
    mutationFn: async (playerSeasonID: number) => {
      const position = useDashboardStore.getState().position;
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
          season: SEASON,
          playerSeasonID,
          position,
        }),
      });
    },
    onMutate: async (playerSeasonID: number) => {
      const position = useDashboardStore.getState().position;
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
        ["unsoldPlayers", useDashboardStore.getState().position],
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
    }: {
      playerSeasonID: number;
      teamID: TeamID;
      price: number;
      sellPosition?: Position;
    }) => {
      const position = useDashboardStore.getState().position;
      if (!position) {
        toast.error("No position selected");
        return;
      }

      if (sellPosition) {
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
          season: SEASON,
          playerSeasonID: playerSeasonID,
          ...(sellPosition ? { position: sellPosition } : {}),
          teamID,
          price,
        }),
      });
    },
    onMutate: async ({ playerSeasonID }) => {
      const position = useDashboardStore.getState().position;
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
        ["unsoldPlayers", useDashboardStore.getState().position],
        context?.previousUnsoldPlayers
      );
    },
    onSuccess: (data, variables) => {
      const position = useDashboardStore.getState().position;
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
    mutationFn: async ({ playerSeasonID }: { playerSeasonID: number }) => {
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
          season: SEASON,
          playerSeasonID,
          ...(wasRookie ? { wasRookie: true } : {}),
        }),
      });

      if (wasRookie && stored) {
        const updated = JSON.parse(stored).filter(
          (id: number) => id !== playerSeasonID
        );
        localStorage.setItem("wasRookiePlayers", JSON.stringify(updated));
      }
    },
    onSuccess: (data, variables) => {
      const position = useDashboardStore.getState().position;

      queryClient.invalidateQueries({ queryKey: ["unsoldPlayers", position] });
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

      useDashboardStore.setState({ currentPlayer: variables.playerSeasonID });
    },
  });
}
