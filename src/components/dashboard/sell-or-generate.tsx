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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { positions, teamsIDs } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { teamIDToName } from "@/lib/utils";
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

      <DialogContent className="max-h-[50vh] h-[50vh] w-[60vw] max-w-[60vw]">
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

  const position = useDashboardStore((state) => state.position);
  const isRookie = position === "ROOK";

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full px-12 flex justify-center items-center"
      >
        <div className="flex space-x-8 w-full h-full">
          <div className="flex flex-col flex-1">
            <FormField
              control={form.control}
              name="teamID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Team</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                      className="flex flex-col space-y-1"
                    >
                      {teamsIDs.map((teamID) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={teamID}
                        >
                          <FormControl>
                            <RadioGroupItem value={teamID.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {teamIDToName(teamID)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
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
                      type="number"
                      {...field}
                      className="input-class"
                      onChange={field.onChange}
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

// radio button team select
// number input for a price
// if the player is a rookie, have a position selector
// button to sell and regenerate a new player
