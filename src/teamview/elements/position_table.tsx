import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import { cn } from "@/components/lib/utils";
import { numbertoPrice, shortenedPositionToName } from "@/shelf";
import { Position, TeamData } from "@/types";

interface PositionCardProps {
  teamData: TeamData;
  className: string;
  position: Position;
}

export function PositionCard({ teamData, className, position }: PositionCardProps) {
  return (
    <Card className={cn("space-y-1 p-2", className)}>
      <p className="text-center font-bold text-foreground">
        {shortenedPositionToName[position]}
        {position != "RK" ? "s" : ""}
      </p>
      <PositionTable teamData={teamData} position={position} />
    </Card>
  );
}

function PositionTable({ teamData, position }: { teamData: TeamData; position: Position }) {
  const playerlist = teamData.players.filter((player) => player.posn === position);
  /* 
    map over the teams data, and for the chosen team, create a PlayerDataRow component
    pass the team data as props to the component
  */
  return (
    <Table className="h-full w-full">
      <TableHeader>
        <TableRow className="border">
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playerlist.map((player) => {
          return (
            <TableRow className="border">
              <TableCell>{player.PlayerSeasonID}</TableCell>
              <TableCell>
                {player.FirstName} {player.Surname}
              </TableCell>

              <TableCell>{player.club}</TableCell>
              <TableCell>{numbertoPrice(parseFloat(player.price))}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
