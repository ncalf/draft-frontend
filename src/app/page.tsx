"use client";

import { MVPsCard } from "@/components/mvps";
import { PlayerInfoCard } from "@/components/player-info";
import { PositionFilterCard } from "@/components/position-filter";
import { RemainingPlayersCard } from "@/components/remaining-players";
import { SellOrGenerateCard } from "@/components/sell-and-generate";
import { SoldPlayerCard } from "@/components/sold-players";
import { TeamTableCard } from "@/components/teams-table";
import { UnsoldPlayersCard } from "@/components/unsold-players";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// main component fed to the router, contains all the cards
export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-700 p-2">
      <div className="grid h-full w-full grid-cols-10 grid-rows-12 gap-2">
        <TeamTableCard />
        <SoldPlayerCard />
        <RemainingPlayersCard />

        <MVPsCard />
        <PositionFilterCard />
        <UnsoldPlayersCard />

        <PlayerInfoCard />
        <SellOrGenerateCard />
      </div>
    </div>
  );
}
