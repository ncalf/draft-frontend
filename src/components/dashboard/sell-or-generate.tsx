import { Card } from "@/components/ui/card";
import { useMarkPlayerNominatedMutation } from "@/lib/mutations";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { create } from "zustand";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";

interface SoldPlayerStore {
  open: boolean;
}
const useSoldPlayerStore = create<SoldPlayerStore>()(() => ({
  open: false,
}));

export function SellOrGenerateCard() {
  const position = useDashboardStore((state) => state.position);
  const { data } = useUnsoldPlayersQuery(position);
  const mutation = useMarkPlayerNominatedMutation();

  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 overflow-hidden">
      <SellButton />
      <Button
        className="h-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
        disabled={!data}
        onClick={() => {
          if (data && data.length > 0) {
            const zeroNominatedPlayers = data.filter((player) => player.nominated === 0);
            if (zeroNominatedPlayers.length > 0) {
              const randomIndex = Math.floor(Math.random() * zeroNominatedPlayers.length);
              const randomPlayerID = zeroNominatedPlayers[randomIndex].PlayerSeasonID;
              useDashboardStore.setState({ currentPlayer: randomPlayerID });
              mutation.mutate(randomPlayerID);
            }
          }
        }}
      >
        Generate New Player
      </Button>
    </Card>
  );
}

function SellButton() {
  return (
    <Dialog open={useSoldPlayerStore.getState().open}>
      <DialogTrigger>
        <Button className="h-full w-full border bg-green-500 text-2xl hover:bg-green-400" onClick={() => {}}>
          Sell Player
        </Button>
      </DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>Unsold Players</DialogTitle>
        <DialogDescription>View all unsold players</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="h-[80vh] w-[90vw] max-w-[90vw] pt-10"></DialogContent>
    </Dialog>
  );
}
