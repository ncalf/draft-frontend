import GaugeChart from "react-gauge-chart";

import { Card } from "@/components";

import { useDashboardStore, usePositionStore } from "@/stores";
import { useEffect } from "react";

// exports the remaining players card component, which contains a title and a gauge chart that shows the percentage of players that have not been sold yet
export function RemainingPlayersCard() {
  /* 
    contains a heading and a gauge chart
  */
  return (
    <Card className="fex col-start-9 col-end-11 row-start-1 row-end-4 flex-col p-2 overflow-hidden">
      <h3 className="text-center text-foreground">Players Remaining</h3>
      <Gauge />
    </Card>
  );
}

// the gauge chart component that shows the percentage of players that have not been sold yet, and turns grey if the chart is inactive
function Gauge() {
  const positionFilter = useDashboardStore((state) => state.positionFilter.position);
  const unsoldPlayers = useDashboardStore((state) => state.unsoldPlayers.players);
  const animationPlaying = usePositionStore((state) => state.animationPlaying);

  const initialNumPlayers = useDashboardStore((state) => state.unsoldPlayers.initialNumPlayers);

  const unsoldPlayerLoading = useDashboardStore((state) => state.unsoldPlayers.playersLoading);
  const totalPlayersLoading = useDashboardStore((state) => state.unsoldPlayers.initialNumPlayersLoading);

  const isChartInactive = useDashboardStore((state) => state.unsoldPlayers.isChartInactive);
  const unsoldPlayersCount = unsoldPlayers.filter((player) => player.nominated === 0).length;

  // keep the isChartInactive state up to date by checking if any of its dependencies are loading
  useEffect(() => {
    const newIsChartInactive =
      positionFilter === "none" ||
      initialNumPlayers === 0 ||
      animationPlaying ||
      unsoldPlayerLoading ||
      totalPlayersLoading;
    useDashboardStore.setState((state) => ({
      unsoldPlayers: { ...state.unsoldPlayers, isChartInactive: newIsChartInactive },
    }));
  }, [positionFilter, initialNumPlayers, animationPlaying, unsoldPlayerLoading, totalPlayersLoading]);

  /* 
    the number of unsold players is divided by the total number of players to get the percentage of players that have not been sold yet
    the gauge chart is greyed out and the needle points straight up if the chart is inactive
  */
  return (
    <GaugeChart
      className="h-0 pt-6"
      id="gauge-chart"
      nrOfLevels={isChartInactive ? 1 : 3}
      arcsLength={isChartInactive ? [1] : [0.1, 0.2, 0.5]}
      animate={false}
      colors={isChartInactive ? ["#AFAFAF"] : ["#EA4228", "#F5CD19", "#5BE12C"]}
      percent={isChartInactive ? 0.5 : unsoldPlayersCount / initialNumPlayers}
      textColor="#000000"
      formatTextValue={() => {
        if (isChartInactive) {
          return "";
        } else {
          return `${unsoldPlayersCount} / ${initialNumPlayers}`;
        }
      }}
    />
  );
}
