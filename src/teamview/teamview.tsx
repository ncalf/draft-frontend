import { template } from "@/shelf";
import { useDashboardStore } from "@/stores";
import { NcalfClubID, TeamData, TeamsTableAPIResponse } from "@/types";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { PositionCard } from "./elements/position_table";
import { PositionSummaryCard } from "./elements/positions_summary";
import { SpentCard } from "./elements/spent";
import { TeamTabsCard } from "./elements/team_tabs";

export function Teamview() {
  const [teamID, setTeamID] = useState<string>("1"); // a state to store the teamID of the team to display e.g. "1", "7", "10"
  const [allTeamsData, setAllTeamsData] = useState<TeamsTableAPIResponse>(template); // a state to store all of the teams data
  const [teamData, setTeamData] = useState<TeamData>(template["1"]);

  // this will run when the teamview component is first loaded
  useEffect(() => {
    const socket = io(useDashboardStore.getState().backendIP.replace("/ncalf/draft/", "")); // establish a websocket connection to the backend

    // when a message containing the teams data is recieved, update the state with the new data
    socket.on("send-teams-data", (data: string) => {
      const teamsSummaryData = JSON.parse(data);
      setAllTeamsData(teamsSummaryData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // this function will run when either the allTeamsData or teamID state is changed
  useEffect(() => {
    setTeamData(allTeamsData[parseInt(teamID) as NcalfClubID]);
  }, [allTeamsData, teamID]);

  return (
    <div className="h-screen bg-black p-2">
      <div className="grid h-full w-full grid-cols-3 grid-rows-12 gap-2">
        <TeamTabsCard teamID={teamID} setTeamID={setTeamID} />
        <PositionCard teamData={teamData} position={"D"} className="col-start-1 col-end-2 row-start-2 row-end-9" />
        <PositionCard teamData={teamData} position={"F"} className="col-start-3 col-end-4 row-start-2 row-end-9" />
        <PositionCard teamData={teamData} position={"C"} className="col-start-1 col-end-2 row-start-9 row-end-13" />
        <PositionCard teamData={teamData} position={"OB"} className="col-start-2 col-end-3 row-start-9 row-end-13" />
        <PositionCard teamData={teamData} position={"RK"} className="col-start-3 col-end-4 row-start-9 row-end-13" />
        <SpentCard teamData={teamData} />
        <PositionSummaryCard teamData={teamData} />
      </div>
    </div>
  );
}
