"use client";

import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { toast } from "sonner";

export function MVPsCard() {
  const { isLoading, data, error } = useSoldPlayersQuery();

  if (error) {
    toast.error("Failed to fetch sold players");
  }

  const topPlayers = data
    ?.sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 5);

  return (
    <Card className="col-start-9 col-end-11 row-start-5 row-end-9 overflow-hidden p-2 flex flex-col">
      <div className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
        MVPs
      </div>
      <div className="h-full flex flex-col">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y flex-1 flex flex-col">
            {topPlayers?.map((player) => (
              <li
                key={player.name}
                className="flex justify-between w-full py-4 px-2 flex-1 items-center"
              >
                <span className="flex-1">{player.name}</span>
                <span className="flex-1 text-right">${player.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
