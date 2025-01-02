import { ClubTableCard } from "./club-table";
import { MVPsCard } from "./mvps";
import { PlayerInfoCard } from "./player-info";
import { PositionFilterCard } from "./position-filter";
import { RemainingPlayersCard } from "./remaining-players";
import { SellOrGenerateCard } from "./sell-or-generate";
import { SoldPlayerCard } from "./sold-players";
import { UnsoldPlayersCard } from "./unsold-players";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-700 p-2">
      <div className="grid h-full w-full grid-cols-10 grid-rows-12 gap-2">
        <MVPsCard />
        <PlayerInfoCard />
        <PositionFilterCard />
        <RemainingPlayersCard />
        <SellOrGenerateCard />
        <SoldPlayerCard />
        <ClubTableCard />
        <UnsoldPlayersCard />
      </div>
    </div>
  );
}
