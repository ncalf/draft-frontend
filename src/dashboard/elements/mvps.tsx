// prettier-ignore
import { Card,ScrollArea,Skeleton,Table,TableBody,TableCell,TableRow } from "@/components";
import { useDashboardStore } from "@/stores";
import { clubIdToName, numbertoPrice } from "../../shelf";

// exports the mvps card component, which contains a title a then the highest-priced players that have been sold during the drafting
export function MVPsCard() {
  const mvps = useDashboardStore((state) => state.mvps.players);
  const loading = useDashboardStore((state) => state.soldPlayers.loading);

  /*
    returns a card component with a most valuable players heading
    if the sold players are still loading, then a skeleton is shown
    else, if no players are sold yet, an empty bordered div with a messages is shown
    else, a scrollable table is shown,
  */
  return (
    <Card className="col-start-9 col-end-11 row-start-5 row-end-9 p-2 overflow-hidden">
      <h3 className="text-foreground text-center">Most Valuable Players</h3>
      <div className="h-[12.3rem]">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : mvps.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed">
            No players have been sold
          </div>
        ) : (
          <MvpsTable />
        )}
      </div>
    </Card>
  );
}

// the scrollable table component that includes the top players
function MvpsTable() {
  const mvps = useDashboardStore((state) => state.mvps.players);

  /*
    returns a scroll area with a table inside
    the mvps player list is mapped over, and each player's info is displayed in a table row
  */
  return (
    <ScrollArea className="h-full w-full">
      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {mvps.map((player) => {
            return (
              <TableRow key={player.PlayerSeasonID}>
                <TableCell className="p-1">
                  {player.FirstName} {player.Surname} <br /> {clubIdToName[player.ncalfclub]}
                </TableCell>
                <TableCell className="text-center">{numbertoPrice(parseFloat(player.price))}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
