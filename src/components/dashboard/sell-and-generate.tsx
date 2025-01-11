"use client";

import { Card } from "@/components/ui/card";
import { useTeamStatsQuery } from "@/lib/queries";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { create } from "zustand";
import { Button } from "../ui/button";
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
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { maxPlayersPerPosition, teamIDToName } from "@/lib/utils";
import { Input } from "../ui/input";
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
  const generatePlayer = useGenerateRandomPlayer();

  return (
    <Button
      className="h-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
      onClick={generatePlayer}
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

      <DialogContent className="max-h-[50vh] h-[50vh] w-[40vw] max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Sell Player</DialogTitle>

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
      price: 0,
    },
  });

  const mutation = useSellPlayerMutation();
  const generatePlayer = useGenerateRandomPlayer();

  const position = useDashboardStore((state) => state.position);
  const isRookie = position === "ROOK";
  const { data: teamStats } = useTeamStatsQuery();
  const watchedPrice = form.watch("price");

  async function onSubmit(values: FormValues) {
    mutation.mutate({
      playerSeasonID: useDashboardStore.getState().currentPlayer!,
      teamID: values.teamID,
      price: values.price,
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
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
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
            <Button type="submit">Sell Player</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface TeamRadioButtonProps {
  teamStats: TeamStats;
  position: Position;
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

  const maxPlayers = maxPlayersPerPosition[position];
  const teamPlayers = teamStats[position.toLowerCase() as keyof TeamStats];

  if (teamPlayers >= maxPlayers) {
    isDisabled = true;
  }

  const numberOfPlayers =
    teamStats.c + teamStats.d + teamStats.f + teamStats.ob + teamStats.rk;
  const maximumSpend =
    20 -
    parseFloat(
      (teamStats.total_price + (21 - numberOfPlayers) * 0.1).toFixed(2)
    );

  if (currentPrice > maximumSpend) {
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
        {`${teamIDToName(teamStats.teamID)} ($${maximumSpend})`}
      </FormLabel>
    </FormItem>
  );
}
