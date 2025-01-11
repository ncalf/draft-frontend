"use client";

import { Card } from "@/components/ui/card";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useEffect } from "react";
import { GaugeComponent } from "react-gauge-component";
import { toast } from "sonner";

export function RemainingPlayersCard() {
  const { isLoading, data, error } = useUnsoldPlayersQuery();

  useEffect(() => {
    let toastId: string | number;

    if (isLoading) {
      toastId = toast.loading("Fetching unsold players...");
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading]);

  const numberOfPlayers = data?.length || 1;
  const numberOfUnnominatedPlayers =
    data?.filter((player) => player.nominated === false).length || 1;

  const displayUnnominated = Math.min(
    numberOfUnnominatedPlayers,
    numberOfPlayers
  );

  if (error) {
    toast.error("Failed to fetch club stats");
  }

  return (
    <Card className="flex col-start-9 col-end-11 row-start-1 row-end-4 flex-col p-2 overflow-hidden">
      <GaugeComponent
        type="semicircle"
        value={displayUnnominated}
        maxValue={numberOfPlayers}
        arc={{
          nbSubArcs: isLoading ? 1 : 3,
          subArcs: isLoading
            ? [{ color: "#AFAFAF", length: 100 }]
            : [
                { color: "#EA4228", length: 10 },
                { color: "#F5CD19", length: 20 },
                { color: "#5BE12C", length: 70 },
              ],
        }}
        labels={{
          valueLabel: {
            hide: isLoading,
            formatTextValue: (value) => `${value}/${numberOfPlayers}`,
            style: {
              fill: "#000000",
              textShadow: "none",
              fontWeight: "normal",
              marginTop: "-20px",
            },
          },
          tickLabels: {
            defaultTickValueConfig: { hide: true },
            defaultTickLineConfig: { hide: true },
          },
        }}
        marginInPercent={{ left: 0.01, right: 0.01, top: 0.07, bottom: 0.0 }}
        pointer={{ animate: false }}
        key={`gauge-${numberOfPlayers}-${displayUnnominated}`}
      />
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        {isLoading ? "Loading..." : `Players Remaining`}
      </div>
    </Card>
  );
}
