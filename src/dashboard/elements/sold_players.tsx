// prettier-ignore
import { Card,ContextMenu,ContextMenuContent,ContextMenuItem,ContextMenuTrigger,ScrollArea,Skeleton,Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components";
import { clubIdToShortName, numbertoPrice } from "@/shelf";
import { useDashboardStore } from "@/stores";
import { SoldPlayer } from "@/types";
import { toast } from "sonner";

// exports the sold players card component, that contains a title and then a scrollable list of the most recent sold players
export function SoldPlayersCard() {
  const soldPlayers = useDashboardStore((state) => state.soldPlayers.players);
  const loading = useDashboardStore((state) => state.soldPlayers.loading);

  /* 
    returns a card component with a sold players heading
    if the sold players are still loading, then a skeleton is shown
    else, if no players are sold yet, an empty bordered div with a messages is shown
    else, a scrollable table is shown, mapping over the list of sold players and displaying their info in a table row
  */
  return (
    <Card className="col-start-6 col-end-9 row-start-1 row-end-9 space-y-1.5 p-2 overflow-hidden">
      <h3 className="text-center text-foreground">Sold Players</h3>
      {loading ? (
        <Skeleton className="h-[90%] w-full" />
      ) : (
        <div className="h-[90%] grow">
          {soldPlayers.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed">
              No players have been sold
            </div>
          ) : (
            <SoldPlayersTable />
          )}
        </div>
      )}
    </Card>
  );
}

// the scrollable table component that includes the sold players
function SoldPlayersTable() {
  const soldPlayers = useDashboardStore((state) => state.soldPlayers.players);

  return (
    <ScrollArea className="scroll-area h-full w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Pos</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {soldPlayers.map((player) => (
            <SoldPlayerRow player={player} key={player.PlayerSeasonID} />
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

// a row representing a sold player
function SoldPlayerRow({ player }: { player: SoldPlayer }) {
  const getTeamsSummaryTableData = useDashboardStore((state) => state.teamsSummaryTable.getTeamsData);
  const getSoldPlayersData = useDashboardStore((state) => state.soldPlayers.getPlayers);
  const getMvpData = useDashboardStore((state) => state.mvps.getPlayers);
  const getUnsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.getPlayers);

  return (
    <ContextMenu key={player.PlayerSeasonID}>
      <ContextMenuTrigger asChild>
        <TableRow className="text-center">
          <TableCell>{player.PlayerSeasonID}</TableCell>
          <TableCell>
            {player.FirstName} {player.Surname}
          </TableCell>
          <TableCell>{player.posn}</TableCell>
          <TableCell>{clubIdToShortName[player.ncalfclub]}</TableCell>
          <TableCell>{numbertoPrice(parseFloat(player.price))}</TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-24">
        <ContextMenuItem
          onClick={async () => {
            try {
              // this function is triggered when a player is right clicked and the undo sale option is clicked
              const originalRookies = useDashboardStore.getState().rookies.originalRookies;
              const removeOriginalRookie = useDashboardStore.getState().rookies.removeOriginalRookie;

              // if the player's position does not match the current position filter, then a toast is shown and the function returns
              // if they were a rookie, allow undoing if the position filter is rookie
              if (originalRookies.includes(player.PlayerSeasonID)) {
                if (
                  player.posn != useDashboardStore.getState().positionFilter.position &&
                  useDashboardStore.getState().positionFilter.position != "ROOK"
                ) {
                  toast.error("Player position does not match current position filter.");
                  return;
                }
              } else {
                if (player.posn != useDashboardStore.getState().positionFilter.position) {
                  toast.error("Player position does not match current position filter.");
                  return;
                }
              }

              const backendIp = useDashboardStore.getState().backendIP;
              const season = useDashboardStore.getState().currentSeason;

              // send a put request to the backend to undo the sale of the player
              await fetch(backendIp + "/player/undosale", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ season: season, player_season_id: player.PlayerSeasonID }),
              });

              getTeamsSummaryTableData(true); // trigger a re-fetch of the teams summary table data

              await getSoldPlayersData(); // retrieve the sold players data
              getMvpData(); // trigger a re-fetch of the MVPs data

              getUnsoldPlayersData(); // retrieve the unsold players data

              const setPosition = useDashboardStore.getState().positionFilter.setPosition;
              const getPosition = useDashboardStore.getState().positionFilter.getPosition;

              // if the player is being reversed from a rookie, then update the players position back to rookie, and set the position filter back to rookie
              if (originalRookies.includes(player.PlayerSeasonID)) {
                setPosition("ROOK");
                getPosition();
                await fetch(backendIp + "/player/updaterookieposition", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    player_id: useDashboardStore.getState().currentPlayerInfo.id,
                    position: "ROOK",
                    season: season,
                  }),
                });
                removeOriginalRookie(player.PlayerSeasonID);
              }

              // update the player ID state to be player that was just sold, and then trigger a re-fetch of the name, image and stats
              useDashboardStore.getState().currentPlayerInfo.setID(player.PlayerSeasonID, true);
              useDashboardStore.getState().currentPlayerInfo.markPlayerNominated(player.PlayerSeasonID);
            } catch (error) {
              toast.error("Error undoing sale");
            }
          }}
        >
          Undo Sale
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
