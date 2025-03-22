"use client";

import { Card } from "@/components/ui/card";
import { useTeamStatsQuery, useUnsoldPlayersQuery } from "@/lib/queries";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Position, positions, teamsIDs, TeamStats } from "@/lib/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  maxPlayersPerPosition,
  teamIDToName,
  numberToPriceString,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDashboardStore } from "@/lib/store";
import { useSellPlayerMutation } from "@/lib/mutations";
import { useEffect } from "react";
import { useGenerateRandomPlayer } from "@/lib/hooks";
import { toast } from "sonner";

interface SoldPlayerStore {
  open: boolean;
}
const useSoldPlayerStore = create<SoldPlayerStore>()(() => ({
  open: false,
}));

export function SellOrGenerateCard() {
  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 overflow-hidden">
      <SellButton />
      <GenerateButton />
    </Card>
  );
}

function GenerateButton() {
  const { isLoading } = useUnsoldPlayersQuery();
  const generatePlayer = useGenerateRandomPlayer();

  return (
    <Button
      className="h-full border bg-red-500 text-2xl hover:bg-red-400"
      onClick={generatePlayer}
      disabled={isLoading}
    >
      Generate New Player
    </Button>
  );
}

function SellButton() {
  const open = useSoldPlayerStore((state) => state.open);
  const currentPlayer = useDashboardStore((state) => state.currentPlayer);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => useSoldPlayerStore.setState({ open })}
    >
      <DialogTrigger asChild>
        <Button
          className="h-full w-full border bg-green-500 text-2xl hover:bg-green-400"
          disabled={!currentPlayer}
        >
          Sell Player
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[60vh] h-[60vh] w-[50vw] max-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="text-4xl">Sell Player</DialogTitle>

          <VisuallyHidden.Root>
            <DialogDescription>Sell a player</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <SellPlayerForm />
      </DialogContent>
    </Dialog>
  );
}

const FormSchema = z.object({
  teamID: z.number().min(1).max(11),
  price: z.number().positive(),
  position: z.enum(positions).optional(),
});
type FormValues = z.infer<typeof FormSchema>;

function SellPlayerForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teamID: 1,
      price: 0.1,
      position: undefined,
    },
  });

  const mutation = useSellPlayerMutation();
  const generatePlayer = useGenerateRandomPlayer();

  const positionFromStore = useDashboardStore((state) => state.position); // Get the position from the store
  const isRookie = positionFromStore === "ROOK"; // Check if the player is a rookie
  const position = isRookie ? form.watch("position") : positionFromStore; // Get the position from the form if the player is a rookie

  const { data: teamStats } = useTeamStatsQuery(); // Get the team stats
  const watchedPrice = form.watch("price"); // Get the price from the form

  async function onSubmit(values: FormValues) {
    if (position === undefined) {
      toast.error("No position selected");
      return;
    } // Check if a position is selected
    mutation.mutate({
      playerSeasonID: useDashboardStore.getState().currentPlayer!,
      teamID: values.teamID,
      price: values.price,
      sellPosition: position,
      isRookie: isRookie,
    });

    generatePlayer();
    useSoldPlayerStore.setState({ open: false });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full flex justify-center items-center"
      >
        <div className="flex space-x-8 w-full h-full">
          <div className="flex flex-col flex-1">
            <FormField
              control={form.control}
              name="teamID"
              render={({ field }) => (
                <div className="flex flex-col">
                  <RadioGroup
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormLabel className={"font-bold"}>Team</FormLabel>

                    {teamsIDs.map((teamID) => (
                      <TeamRadioButton
                        key={teamID}
                        teamStats={
                          teamStats?.find(
                            (team) => team.teamID === teamID
                          ) as TeamStats
                        }
                        position={position as Position}
                        currentPrice={watchedPrice}
                        form={form}
                        selected={field.value === teamID}
                      />
                    ))}
                  </RadioGroup>
                </div>
              )}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col flex-1 space-y-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="text-3xl h-16 font-semibold"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      step={0.1}
                      min={0}
                      style={{
                        fontSize: "2rem",
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Position</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} disabled={!isRookie}>
                      <SelectTrigger className="w-full">
                        {isRookie ? (
                          <SelectValue placeholder="Select position" />
                        ) : (
                          <SelectValue placeholder={position} />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {positions
                          .filter((pos) => pos !== "ROOK")
                          .map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="h-full text-xl font-semibold">
              Sell Player
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface TeamRadioButtonProps {
  teamStats: TeamStats;
  position: Position | undefined;
  currentPrice: number;
  form: UseFormReturn<FormValues>;
  selected: boolean;
}

function TeamRadioButton({
  teamStats,
  position,
  currentPrice,
  form,
  selected,
}: TeamRadioButtonProps) {
  let isDisabled = false;
  let maxPlayers: number | undefined;
  let teamPlayers: number | undefined;

  if (!position) {
    isDisabled = true;
  } else {
    maxPlayers = maxPlayersPerPosition[position];
    teamPlayers = teamStats[position.toLowerCase() as keyof TeamStats];
  }

  if (
    teamPlayers !== undefined &&
    maxPlayers !== undefined &&
    teamPlayers >= maxPlayers
  ) {
    isDisabled = true;
  }

  const numberOfPlayers =
    teamStats.c + teamStats.d + teamStats.f + teamStats.ob + teamStats.rk;
  const rawValue = teamStats.total_price + (21 - numberOfPlayers) * 0.1;
  const maximumSpendValue = Math.round((20 - rawValue) * 10) / 10;
  const maximumSpendString = numberToPriceString(maximumSpendValue);

  if (currentPrice > maximumSpendValue) {
    isDisabled = true;
  }

  useEffect(() => {
    if (selected && isDisabled) {
      form.setValue("teamID", 0);
    }
  }, [selected, isDisabled, form]);

  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem
          value={teamStats.teamID.toString()}
          disabled={isDisabled}
        />
      </FormControl>
      <FormLabel className={`font-normal ${isDisabled ? "text-gray-400" : ""}`}>
        {`${teamIDToName(teamStats.teamID)} (${maximumSpendString}) `}
      </FormLabel>
    </FormItem>
  );
}
