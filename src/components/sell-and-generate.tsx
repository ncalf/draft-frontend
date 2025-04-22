"use client";

import { Card } from "@/components/ui/card";
import { useTeamStatsQuery, useUnsoldPlayersQuery } from "@/lib/queries";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { currentPlayerAtom, positionAtom } from "@/lib/store";
import { useSellPlayerMutation } from "@/lib/mutations";
import { useEffect } from "react";
import { useGenerateRandomPlayer } from "@/lib/hooks";
import { toast } from "sonner";
import { useState } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface SoldPlayerStore {
  open: boolean;
}
const useSoldPlayerStore = create<SoldPlayerStore>()(() => ({
  open: false,
}));

const sellingAtom = atom(false); // State to toggle between button and card
const salePriceAtom = atom(0.1); // Counter state
const popoverOpenAtom = atom(false); // State to control the popover

export function SellOrGenerateCard() {
  const open = useSoldPlayerStore((state) => state.open); // Get the open state from the store
  const [selling, setSelling] = useAtom(sellingAtom); // Use the selling state from the atom

  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 ">
      {!selling ? (
        // Render the green button initially
        <SellButton />
      ) : (
        <SellingCard /> // Show the card with the counter and tick button
      )}

      <GenerateButton />
    </Card>
  );
}

function GenerateButton() {
  const [selling, setSelling] = useAtom(sellingAtom); // Use the selling state from the atom
  const { isLoading } = useUnsoldPlayersQuery();
  const generatePlayer = useGenerateRandomPlayer();

  return (
    <Button
      className="h-full border bg-red-500 text-2xl hover:bg-red-400"
      onClick={() => {
        generatePlayer;
        setSelling(false); // Reset the selling state when generating a new player
      }}
      disabled={isLoading}
    >
      Generate New Player
    </Button>
  );
}

function PlusButton() {
  const [salePrice, setSalePrice] = useAtom(salePriceAtom); // Use the sale price state from the atom
  return (
    <Button
      className="bg-gray-400 hover:bg-gray-200 text-xl w-10 h-10"
      onClick={() => setSalePrice((prev) => prev + 0.1)} // Increment counter
    >
      +
    </Button>
  );
}

function MinusButton() {
  const [salePrice, setSalePrice] = useAtom(salePriceAtom); // Use the sale price state from the atom
  return (
    <Button
      className="bg-gray-400 hover:bg-gray-200 text-xl w-10 h-10"
      onClick={() => setSalePrice((prev) => prev - 0.1)} // Increment counter
    >
      -
    </Button>
  );
}

function SellPopover() {
  const [popoverOpen, setPopoverOpen] = useAtom(popoverOpenAtom); // Use the popover state from the atom

  const handleSellClick = () => {
    setPopoverOpen((prev) => !prev); // Toggle the popover state
  };

  return (
    // Popover for Sell Player
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-full w-full border bg-green-500 text-2xl hover:bg-green-400"
          onClick={handleSellClick} // Open the popover
        >
          Sell
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" sideOffset={40}>
        <div className="flex flex-col space-y-2">
          {/* Team Selection */}
          <div>
            <div className="font-bold">Team</div>
            <RadioGroup className="flex flex-col space-y-1">
              {teamsIDs.map((teamID) => {
                const teamName = teamIDToName(teamID);
                console.log("Team Name:", teamName);
                return (
                  <div>
                    <RadioGroupItem
                      id={teamID.toString()}
                      value={teamID.toString()}
                    />
                    <Label htmlFor={teamID.toString()}> {teamName}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Position Selection */}

          <div className="font-bold">Position</div>
          <div className="flex flex-row space-x-2">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
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
            <Button>Sell</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SellingCard() {
  const [salePrice, setSalePrice] = useAtom(salePriceAtom); // Counter state

  return (
    // Render the card with the counter and tick button
    <Card className="h-full w-full flex flex-row items-center p-2">
      <div className="text-4xl font-bold flex flex-col justify-center items-center w-1/3">
        ${salePrice.toFixed(2)}
      </div>
      <div className="flex flex-col justify-center items-center space-y-2 w-1/3">
        <PlusButton />
        <MinusButton />
      </div>
      <div className="flex flex-col justify-center items-center h-full w-1/3">
        <SellPopover /> {/* Popover for Sell Player */}
      </div>
    </Card>
  );
}

function SellButton() {
  const [selling, setSelling] = useAtom(sellingAtom); // Use the selling state from the atom
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom); // Use the current player state from the atom

  return (
    <Button
      className="h-full w-full border bg-green-500 text-2xl hover:bg-green-400"
      disabled={!currentPlayer}
      onClick={() => {
        if (selling) {
          setSelling(false); // Reset the selling state when generating a new player
        } else {
          setSelling(true); // Set the selling state to true to show the card
        }
      }} // Show the card when clicked
    >
      Sell Player
    </Button>
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

  const positionFromStore = useAtomValue(positionAtom); // Get the position from the store
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
      playerSeasonID: useAtomValue(currentPlayerAtom)!,
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
