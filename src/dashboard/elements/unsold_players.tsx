// prettier-ignore
import { Button,Card,ContextMenu,ContextMenuContent,ContextMenuItem,ContextMenuTrigger,Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,ScrollArea,Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue,Skeleton,Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components";
import { SortFilter, useDashboardStore, useUnsoldPlayersStore } from "@/stores";
import { UnsoldPlayer } from "@/types";
import { shortenedPositionToName } from "../../shelf";

// exports the unsold players car component, that has a title and then a list of player that havent been sold yet
export function UnsoldPlayersCard() {
  const positionFilter = useDashboardStore((state) => state.positionFilter.position);
  const unsoldPlayersLoading = useDashboardStore((state) => state.unsoldPlayers.playersLoading);

  const dialogOpen = useUnsoldPlayersStore((state) => state.dialogOpen);
  const setDialogOpen = useUnsoldPlayersStore((state) => state.setDialogOpen);

  const setSortFilter = useUnsoldPlayersStore((state) => state.setSortFilter);
  const completingAction = useDashboardStore((state) => state.completingAction);
  /* 
    display a card with just a labelled button, when the button is clicked, open a dialog
    if the unsold player is still being fetched, display a skeleton and dont display the sort by dropdown
    else, display the unsold players table and the sort by dropdown
  */
  return (
    <Card className="col-start-9 col-end-11 row-start-4 row-end-5 p-2">
      {completingAction ? (
        <Button disabled className="h-full w-full bg-gray-100 text-2xl font-semibold" variant="outline">
          Unsold Players
        </Button>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              setSortFilter("PlayerSeasonID");
            }}
          >
            <Button className="h-full w-full bg-gray-300 text-2xl font-semibold hover:bg-gray-200" variant="outline">
              Unsold Players
            </Button>
          </DialogTrigger>
          <DialogContent className="h-fit w-fit">
            <DialogHeader>
              <DialogTitle>Unsold Players - {shortenedPositionToName[positionFilter]}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="scroll-area h-[34rem] w-[57rem]">
              {unsoldPlayersLoading ? <Skeleton className="h-[33.9rem] w-[57rem]" /> : <UnsoldPlayersTable />}
            </ScrollArea>
            {unsoldPlayersLoading || positionFilter === "none" ? null : <BaseRow />}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

// the table that contains the unsold players and all of their data
function UnsoldPlayersTable() {
  const sortFilter = useUnsoldPlayersStore((state) => state.sortFilter);

  const positionFilter = useDashboardStore((state) => state.positionFilter.position);
  const unsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.players);

  // returns a string that is bold if the sort filter is the same as the stat to put into classnames
  function boldIfNeeded(stat: string) {
    if (sortFilter === stat) {
      return "font-bold";
    } else {
      return "";
    }
  }

  /* 
    if the position filter is none, display a message saying that a position has not been selected
    else, display the unsold players table and render a table row component for each player
  */
  return (
    <>
      {positionFilter === "none" ? (
        <div className="flex h-[33.9rem] w-[57rem] items-center justify-center">A position has not been selected.</div>
      ) : (
        <>
          <ScrollArea className="scroll-area h-[33.9rem] w-[57rem]">
            <Table className="h-full w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead className={boldIfNeeded("gms")}>GMS</TableHead>
                  <TableHead className={boldIfNeeded("k")}>K</TableHead>
                  <TableHead className={boldIfNeeded("m")}>M</TableHead>
                  <TableHead className={boldIfNeeded("mb")}>HB</TableHead>
                  <TableHead className={boldIfNeeded("ff")}>FF</TableHead>
                  <TableHead className={boldIfNeeded("fa")}>FA</TableHead>
                  <TableHead className={boldIfNeeded("g")}>G</TableHead>
                  <TableHead className={boldIfNeeded("b")}>B</TableHead>
                  <TableHead className={boldIfNeeded("ho")}>HO</TableHead>
                  <TableHead className={boldIfNeeded("t")}>T</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsoldPlayersData
                  .filter((player) => player.availableforsale === 1)
                  .sort((a, b) => Number(b[sortFilter]) - Number(a[sortFilter]))
                  .map((player) => {
                    return <UnsoldPlayerRow key={player.PlayerSeasonID} player={player} />;
                  })}
              </TableBody>
            </Table>
          </ScrollArea>
        </>
      )}
    </>
  );
}

// a row representing a single unsold player, containing all of their stats
function UnsoldPlayerRow({ player }: { player: UnsoldPlayer }) {
  //const setDialogOpen = useUnsoldPlayersStore((state) => state.setDialogOpen);
  const sortFilter = useUnsoldPlayersStore((state) => state.sortFilter);

  // returns a string that is bold if the sort filter is the same as the stat to put into classnames
  function boldIfNeeded(stat: string) {
    if (sortFilter === stat) {
      return "font-bold";
    } else {
      return "";
    }
  }

  /* 
    display a table row containing all of the players data
    when the row is clicked, open a context menu
    when the select player action in the context menu is clicked, set the current player info to the player that was clicked on
  */
  return (
    <ContextMenu key={player.PlayerSeasonID} modal={false}>
      <ContextMenuTrigger asChild>
        <TableRow key={player.PlayerSeasonID} className="text-center">
          <TableCell>{player.PlayerSeasonID}</TableCell>
          <TableCell className="text-left">{player.FirstName + " " + player.Surname}</TableCell>
          <TableCell>{player.posn}</TableCell>
          <TableCell>{player.Club}</TableCell>
          <TableCell className={boldIfNeeded("gms")}>{player.gms}</TableCell>
          <TableCell className={boldIfNeeded("k")}>{player.k}</TableCell>
          <TableCell className={boldIfNeeded("m")}>{player.m}</TableCell>
          <TableCell className={boldIfNeeded("hb")}>{player.hb}</TableCell>
          <TableCell className={boldIfNeeded("ff")}>{player.ff}</TableCell>
          <TableCell className={boldIfNeeded("fa")}>{player.fa}</TableCell>
          <TableCell className={boldIfNeeded("g")}>{player.g}</TableCell>
          <TableCell className={boldIfNeeded("b")}>{player.b}</TableCell>
          <TableCell className={boldIfNeeded("ho")}>{player.ho}</TableCell>
          <TableCell className={boldIfNeeded("t")}>{player.t}</TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            useDashboardStore.getState().currentPlayerInfo.setID(player.PlayerSeasonID, true); // set the current player info to the player that was clicked on

            useDashboardStore.getState().currentPlayerInfo.markPlayerNominated(player.PlayerSeasonID);
            useUnsoldPlayersStore.getState().setDialogOpen(false); // close the dialog
          }}
        >
          Select Player
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function BaseRow() {
  return (
    <div className="flex flex-row items-center space-x-4 w-full justify-between">
      <TotalCount />
      <SortByDropdown />
    </div>
  );
}
// the dropdown that shows underneath the table, allowing the user to sort the table by a certain stat
function SortByDropdown() {
  const setSortFilter = useUnsoldPlayersStore((state) => state.setSortFilter);

  /* 
    renders a select menu with all of the stats that the user can sort by
    when the user selects a stat, set the sort filter to that stat
  */
  return (
    <div className="flex flex-row space-x-4 items-center">
      <div>Sort by:</div>
      <Select onValueChange={(newValue: SortFilter) => setSortFilter(newValue)}>
        <SelectTrigger className="w-[15rem]">
          <SelectValue placeholder="ID" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="PlayerSeasonID">ID</SelectItem>
            <SelectItem value="gms">Games</SelectItem>
            <SelectItem value="k">Kicks</SelectItem>
            <SelectItem value="m">Marks</SelectItem>
            <SelectItem value="hb">Handballs</SelectItem>
            <SelectItem value="ff">Frees For</SelectItem>
            <SelectItem value="fa">Frees Against</SelectItem>
            <SelectItem value="g">Goals</SelectItem>
            <SelectItem value="b">Behinds</SelectItem>
            <SelectItem value="ho">Hitouts</SelectItem>
            <SelectItem value="t">Tackles</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function TotalCount() {
  const unsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.players);

  const totalPlayers = unsoldPlayersData.length;

  return <div>Number of players: {totalPlayers}</div>;
}
