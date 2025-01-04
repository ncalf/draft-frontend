import { Card } from "@/components/ui/card";
import { GaugeComponent } from "react-gauge-component";

export function RemainingPlayersCard() {
  const playerremaningfillin = 800;

  return (
    <Card className="fex col-start-9 col-end-11 row-start-1 row-end-4 flex-col p-2 overflow-hidden">
      {/* TODO: Make the maxvalue the player remaining */}
      <GaugeComponent
        type="semicircle"
        minValue={0}
        maxValue={playerremaningfillin}
        arc={{
          subArcs: [
            { color: "#EA4228", length: 0.1 },
            { color: "#F5CD19", length: 0.2 },
            { color: "#5BE12C", length: 0.5 },
          ],
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => `${value}/${playerremaningfillin}`,
            style: { fill: "#000000", textShadow: "none", fontWeight: "normal", marginTop: "-20px" },
          },
          tickLabels: { defaultTickValueConfig: { hide: true }, defaultTickLineConfig: { hide: true } },
        }}
        marginInPercent={{ left: 0.01, right: 0.01, top: 0.07, bottom: 0.0 }}
      />
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">Players Remaining</div>
    </Card>
  );
}
