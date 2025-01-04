import { Card } from "@/components/ui/card";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { Button } from "../ui/button";

export function SellOrGenerateCard() {
  const position = useDashboardStore((state) => state.position);
  const { data } = useUnsoldPlayersQuery(position);

  return (
    <Card className="col-start-9 col-end-11 row-start-9 row-end-13 flex flex-col space-y-2 p-2 overflow-hidden">
      <Button className="h-1/3 border bg-green-500 text-2xl hover:bg-green-400" onClick={() => {}}>
        Sell Player
      </Button>
      <Button
        className="h-full border bg-red-500 text-2xl font-semibold hover:bg-red-400"
        disabled={!data}
        onClick={() => {
          // Select a random PlayerSeasonID
          if (data && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomPlayerID = data[randomIndex].PlayerSeasonID;
            useDashboardStore.setState({ currentPlayer: randomPlayerID });
            console.log(randomPlayerID);
          }
        }}
      >
        Generate New Player
      </Button>
    </Card>
  );
}
