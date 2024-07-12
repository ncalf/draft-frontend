import { Card } from "@/components";
import { numbertoPrice } from "../../shelf.tsx";
import { TeamData } from "@/types.tsx";

export function SpentCard({ teamData }: { teamData: TeamData }) {
  return (
    <Card className="col-start-2 col-end-3 row-start-2 row-end-5 flex flex-col justify-center bg-green-300 text-center">
      <div className="text-8xl font-bold">{numbertoPrice(teamData.summary.sum_price)}</div>
    </Card>
  );
}
