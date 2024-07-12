// prettier-ignore
import { Card,Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,ScrollArea,Skeleton,Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components";
import { useDashboardStore } from "@/stores";
import { clubIdToName, maxPlayersPerPosition, numbertoPrice } from "../../shelf";
import { NcalfClubID, Position, TeamData } from "../../types";

// exports the component that contains the teams summary table
export function TeamsSummary() {
  const teamsTableLoading = useDashboardStore((state) => state.teamsSummaryTable.teamsLoading);

  /* 
    if the team data is still being fetched, display a skeleton
    else, display the table
  */
  return (
    <Card className="col-start-1 col-end-6 row-start-1 row-end-8 overflow-hidden">
      {teamsTableLoading ? <Skeleton className="h-full w-full" /> : <TeamsDataTable />}
    </Card>
  );
}

// the component that contains the table
function TeamsDataTable() {
  const teamsTableData = useDashboardStore((state) => state.teamsSummaryTable.teamsData);

  /* 
    map over the teams table data, and for each team, create a TeamsDataRow component
    pass the team data as props to the component
  */
  return (
    <Table className="h-full w-full">
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="text-left">Club</TableHead>
          <TableHead>C</TableHead>
          <TableHead>D</TableHead>
          <TableHead>F</TableHead>
          <TableHead>R</TableHead>
          <TableHead>OB</TableHead>
          <TableHead>$</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(teamsTableData).map(([clubID, clubData]) => {
          return <TeamsDataRow key={clubID} id={parseInt(clubID) as NcalfClubID} club={clubData} />;
        })}
      </TableBody>
    </Table>
  );
}

// a row representing the data for a single team
function TeamsDataRow({ id, club }: { id: NcalfClubID; club: TeamData }) {
  const teamsLoading = useDashboardStore((state) => state.teamsSummaryTable.teamsLoading);

  // if the number of players in a position is equal to the max number of players in that position, return the classname to make the text bold
  function boldIfNeeded(position: Position) {
    if (club.summary[position] === maxPlayersPerPosition[position]) {
      return "font-bold";
    }
    return "";
  }

  /* 
    render a table row for the team, with its players in each position, being bolded if the team has the max number of players in that position
    also render the total price of the team
    the team name is a div, that when clicked on opens a dialog containing the team's players
    if the team data is still being fetched, display a skeleton, else render the team data
  */
  return (
    <TableRow key={id} className="text-center">
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer text-left">{clubIdToName[id]}</div>
          </DialogTrigger>
          <DialogContent className="h-[40rem] w-[60rem]">
            <DialogHeader>
              <DialogTitle>{clubIdToName[id]}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="scroll-area">
              {teamsLoading ? <Skeleton className="h-[34rem] w-[57rem]" /> : <TeamDataTable id={id} />}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className={`${boldIfNeeded("C")}`}>{club.summary.C}</TableCell>
      <TableCell className={`${boldIfNeeded("D")}`}>{club.summary.D}</TableCell>
      <TableCell className={`${boldIfNeeded("F")}`}>{club.summary.F}</TableCell>
      <TableCell className={`${boldIfNeeded("RK")}`}>{club.summary.RK}</TableCell>
      <TableCell className={`${boldIfNeeded("OB")}`}>{club.summary.OB}</TableCell>
      <TableCell>{numbertoPrice(club.summary.sum_price)}</TableCell>
    </TableRow>
  );
}

// the component that contains the table of players for a single team that is shown in the dialog
function TeamDataTable({ id }: { id: NcalfClubID }) {
  const teamTableData = useDashboardStore((state) => state.teamsSummaryTable.teamsData);

  /* 
    map over the players in the team, and create a table row for each player containing their information
  */
  return (
    <ScrollArea className="scroll-area h-[34rem] w-[57rem]">
      <Table className="h-full w-full">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Surname</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamTableData[id].players
            .sort((a, b) => a.posn.localeCompare(b.posn))
            .map((player) => {
              return (
                <TableRow key={player.PlayerSeasonID} className="text-center">
                  <TableCell className="border-b">{player.PlayerSeasonID}</TableCell>
                  <TableCell className="border-b">{player.FirstName}</TableCell>
                  <TableCell className="border-b">{player.Surname}</TableCell>
                  <TableCell className="border-b">{player.posn}</TableCell>
                  <TableCell className="border-b">{player.club}</TableCell>
                  <TableCell className="border-b">{numbertoPrice(parseFloat(player.price))}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
