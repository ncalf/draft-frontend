import { useEffect, useRef } from "react";

import { MVPsCard } from "./elements/mvps";
import { PlayerInfoCard } from "./elements/player_info";
import { RemainingPlayersCard } from "./elements/players_remaining";
import { PositionFilterCard } from "./elements/position_filter";
import { SellOrGenerateCard } from "./elements/sell_or_generate";
import { SoldPlayersCard } from "./elements/sold_players";
import { TeamsSummary } from "./elements/team_table";
import { UnsoldPlayersCard } from "./elements/unsold_players";

import { useDashboardStore } from "../stores";
import { io } from "socket.io-client";

// exports the dashboard component, the main component that fills up the whoe page and contains all dashboard card elements
export function Dashboard() {
  const getTeamsSummaryTableData = useDashboardStore((state) => state.teamsSummaryTable.getTeamsData);
  const getSoldPlayersData = useDashboardStore((state) => state.soldPlayers.getPlayers);
  const getMvpData = useDashboardStore((state) => state.mvps.getPlayers);
  const getPositionFilter = useDashboardStore((state) => state.positionFilter.getPosition);
  const getUnsoldPlayersData = useDashboardStore((state) => state.unsoldPlayers.getPlayers);
  const getInitialNumPlayers = useDashboardStore((state) => state.unsoldPlayers.getInitialNumPlayers);
  const getOriginalRookies = useDashboardStore((state) => state.rookies.getOriginalRookies);
  const getPlayerID = useDashboardStore((state) => state.currentPlayerInfo.getID);

  // this is so the server can then broadcast it to all other instances of the website
  // so all teamview instances can update their state with the new data
  const teamsData = useDashboardStore((state) => state.teamsSummaryTable.teamsData);
  useEffect(() => {
    const socket = io(useDashboardStore.getState().backendIP.replace("/ncalf/draft/", "")); // grab the socket stored in the state
    socket.emit("send-teams-data", JSON.stringify(teamsData)); // send a message to the backend containing the teamsData state as a string
    
    socket.on("request-teams-data", () => {
      socket.emit("send-teams-data", JSON.stringify(teamsData));
    });

    return () => {
      socket.disconnect();
    };
  }, [teamsData]);

  const positionFilter = useDashboardStore((state) => state.positionFilter.position);
  const availablePositions = useDashboardStore((state) => state.positionFilter.availablePositions);
  const originalRookies = useDashboardStore((state) => state.rookies.originalRookies);
  const playerId = useDashboardStore((state) => state.currentPlayerInfo.id);

  const renderCount = useRef(0);

  // make sure to save any state changes to local storage after the first render so they can be retrieved on page refresh
  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 3) {
      localStorage.setItem("position_filter", positionFilter);
      localStorage.setItem("available_positions", JSON.stringify(availablePositions));
      localStorage.setItem("original_rookies", JSON.stringify(originalRookies));
      localStorage.setItem("current_player_id", playerId.toString());
    }
  }, [positionFilter, availablePositions, originalRookies, playerId]);

  // the main useEffect, which on load, fetches all the startin data needed for the dashboard
  useEffect(() => {
    (async () => {
      getTeamsSummaryTableData(true);

      getOriginalRookies();

      getPositionFilter();
      getUnsoldPlayersData(true);
      getInitialNumPlayers();

      getPlayerID();

      await getSoldPlayersData();
      getMvpData();
    })();
  }, [getInitialNumPlayers, getMvpData, getOriginalRookies, getPlayerID, getPositionFilter, getSoldPlayersData, getTeamsSummaryTableData, getUnsoldPlayersData]);

  // returns the compoents to render
  return (
    <div className="h-screen bg-black p-2">
      <div className="grid h-full w-full grid-cols-10 grid-rows-12 gap-2">
        <TeamsSummary />
        <PositionFilterCard />
        <PlayerInfoCard />
        <SellOrGenerateCard />
        <SoldPlayersCard />
        <UnsoldPlayersCard />
        <RemainingPlayersCard />
        <MVPsCard />
      </div>
    </div>
  );
}
