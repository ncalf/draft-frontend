"use client";

import { MVPsCard } from "@/components/dashboard/mvps";
import { PlayerInfoCard } from "@/components/dashboard/player-info";
import { PositionFilterCard } from "@/components/dashboard/position-filter";
import { RemainingPlayersCard } from "@/components/dashboard/remaining-players";
import { SellOrGenerateCard } from "@/components/dashboard/sell-or-generate";
import { SoldPlayerCard } from "@/components/dashboard/sold-players";
import { TeamTableCard } from "@/components/dashboard/teams-table";
import { UnsoldPlayersCard } from "@/components/dashboard/unsold-players";
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
