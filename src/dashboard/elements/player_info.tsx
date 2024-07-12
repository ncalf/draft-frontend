import { Loader2 } from "lucide-react";
// prettier-ignore
import placeholderImage from "@/assets/placeholder-image.jpeg";
import {
  Card,
  ScrollArea,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { useDashboardStore } from "@/stores";
import { useEffect } from "react";

// exports the player info card component, which contains all the information for the generated player
export function PlayerInfoCard() {
  const playerID = useDashboardStore((state) => state.currentPlayerInfo.id);

  const unsoldPlayersLoading = useDashboardStore((state) => state.unsoldPlayers.playersLoading);
  const teamsTableLoading = useDashboardStore((state) => state.teamsSummaryTable.teamsLoading);
  const soldPlayersLoading = useDashboardStore((state) => state.soldPlayers.loading);
  const mvpsLoading = useDashboardStore((state) => state.mvps.loading);

  const completingAction = useDashboardStore((state) => state.completingAction);

  // keep the completingAction state up to date by checking if any of its dependencies are loading
  useEffect(() => {
    const newCompletingAction = unsoldPlayersLoading || teamsTableLoading || soldPlayersLoading || mvpsLoading;

    useDashboardStore.setState({ completingAction: newCompletingAction });
  }, [unsoldPlayersLoading, teamsTableLoading, soldPlayersLoading, mvpsLoading]);

  /*
    if the player id is 0, aka not player is generated, display a skeleton in the image section, and a bordered div with a message across the name and stats sections
    else, display the player's image, name, and stats
  */
  return (
    <Card className="col-start-1 col-end-9 row-start-9 row-end-13 grid grid-cols-8 grid-rows-4 gap-2 p-2 overflow-hidden">
      {playerID === 0 ? (
        <>
          <Skeleton className="col-start-1 col-end-3 row-start-1 row-end-6" />
          <div className="col-start-3 col-end-9 row-start-1 row-end-6 flex items-center justify-center rounded-md border-2 border-dashed">
            {completingAction ? (
              <>
                <Loader2 className="mr-7 animate-spin" />
                Loading
              </>
            ) : (
              "Generate a player to see their stats"
            )}
          </div>
        </>
      ) : (
        <>
          <PlayerImage />
          <PlayerNameInfo />
          <PlayerTable />
        </>
      )}
    </Card>
  );
}

// component that displays the player's image
function PlayerImage() {
  const imageData = useDashboardStore((state) => state.currentPlayerInfo.image);
  const loading = useDashboardStore((state) => state.currentPlayerInfo.imageLoading);

  /*
    if the image data is still being fetched from the backend, display a skeleton
    else, if the image data is "no_image", display a placeholder image
    else, display the player's image
  */
  return (
    <div className="col-start-1 col-end-3 row-start-1 row-end-5">
      <Card className="h-full w-full">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img
            src={imageData == "no_image" ? placeholderImage : `data:image/jpeg;base64,${imageData}`}
            alt=""
            className="h-full w-full rounded object-cover"
          />
        )}
      </Card>
    </div>
  );
}

// component that displays the player's name and club across the top of the parent card
function PlayerNameInfo() {
  const playerName = useDashboardStore((state) => state.currentPlayerInfo.name);
  const loading = useDashboardStore((state) => state.currentPlayerInfo.nameLoading);

  /*
    if the player's name is still being fetched from the backend or something is wrong and the object doesn't have the needed values, display a skeleton
    else, render different headings equally spaced apart for the player's id, name, and club
  */
  return (
    <div className="col-start-3 col-end-9 row-start-1 row-end-2 pt-0">
      <Card className="flex h-full w-full flex-row items-center justify-center">
        {loading ||
        !(
          "PlayerSeasonID" in playerName &&
          "FirstName" in playerName &&
          "Surname" in playerName &&
          "club" in playerName
        ) ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <div className="flex flex-row space-x-16">
            <h2 className="font-bold">{`${playerName.PlayerSeasonID}`}</h2>
            <h2 className="font-bold">{`${playerName.FirstName} ${playerName.Surname}`}</h2>
            <h2 className="font-bold">{`${playerName.club}`}</h2>
          </div>
        )}
      </Card>
    </div>
  );
}

// component that displays the table which contains the players stats
function PlayerTable() {
  const playerStats = useDashboardStore((state) => state.currentPlayerInfo.pastStats);
  const loading = useDashboardStore((state) => state.currentPlayerInfo.pastStatsLoading);

  /*
    if the players stats are still being fetched from the backend, display a skeleton
    else, display a table that is created by mapping through the player stats state, rendering a row for each year
  */
  return (
    <div className="col-start-3 col-end-9 row-start-2 row-end-5">
      <Card className="h-full w-full justify-center p-2">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ScrollArea className="scroll-area h-full w-full">
            <Table className="w-full">
              <TableHeader className="py-0">
                <TableRow className="text-center">
                  <TableHead className="py-2 text-left">Season</TableHead>
                  <TableHead className="py-2">Club</TableHead>
                  <TableHead className="py-2">GMS</TableHead>
                  <TableHead className="py-2">K</TableHead>
                  <TableHead className="py-2">M</TableHead>
                  <TableHead className="py-2">H</TableHead>
                  <TableHead className="py-2">FF</TableHead>
                  <TableHead className="py-2">FA</TableHead>
                  <TableHead className="py-2">G</TableHead>
                  <TableHead className="py-2">B</TableHead>
                  <TableHead className="py-2">HO</TableHead>
                  <TableHead className="py-2">T</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerStats.map((stats, index) => {
                  const isBold = index === 0 ? "font-bold text-xl" : "";
                  return (
                    <TableRow key={stats.Season} className="text-center">
                      <TableCell className={`border-b p-1.5 text-left ${isBold}`}>{stats.Season}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.Club}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.gms}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.k}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.m}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.hb}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.ff}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.fa}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.g}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.b}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.ho}</TableCell>
                      <TableCell className={`border-b p-1.5 ${isBold}`}>{stats.t}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
