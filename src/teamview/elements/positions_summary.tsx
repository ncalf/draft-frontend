import { Card, Table, TableBody, TableCell, TableRow } from "@/components";
import { shortenedPositionToName } from "@/shelf";
import { Position, TeamData } from "@/types.tsx";

export function PositionSummaryCard({ teamData }: { teamData: TeamData }) {
  const positionList: Position[] = ["D", "C", "F", "OB", "RK"];

  return (
    <Card className="col-start-2 col-end-3 row-start-5 row-end-9">
        <Table className="h-full w-full">
          <TableBody>
            {positionList.map((position: Position) => {
              return (
                <TableRow className="font-bold text-lg">
                  <TableCell>{shortenedPositionToName[position] + "s"}</TableCell>
                  <TableCell>{teamData.summary[position]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    </Card>
  );
}
