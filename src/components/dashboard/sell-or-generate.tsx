"use client";

import { Card } from "@/components/ui/card";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { create } from "zustand";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SoldPlayerStore {
  open: boolean;
}
const useSoldPlayerStore = create<SoldPlayerStore>()(() => ({
  open: false,
}));

export function SellOrGenerateCard() {
  const { data } = useUnsoldPlayersQuery();

  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 overflow-hidden">
      <SellButton />
      <Button
        className="h-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
        disabled={!data}
      >
        Generate New Player
      </Button>
    </Card>
  );
}

function SellButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-full w-full border bg-green-500 text-2xl hover:bg-green-400">
          Sell Player
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] w-[90vw] max-w-[90vw] pt-10">
        <VisuallyHidden.Root>
          <DialogTitle>Unsold Players</DialogTitle>
          <DialogDescription>View all unsold players</DialogDescription>
        </VisuallyHidden.Root>
        <div className="w-full h-full text-center">Hi</div>
      </DialogContent>
    </Dialog>
  );
}
