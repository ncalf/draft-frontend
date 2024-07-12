import { Card } from "@/components";
import { clubIdToName } from "../../shelf.tsx";

export function TeamTabsCard({ teamID, setTeamID }: { teamID: string; setTeamID: (newTeamId: string) => void }) {
  return (
    <Card className="col-start-1 col-end-4 row-start-1 row-end-2">
      <div className="flex h-full w-full flex-row">
        {Object.keys(clubIdToName).map((currentClubID) => {
          return (
            <div
              className={`h-full min-w-0 cursor-pointer text-wrap rounded-md text-center ${currentClubID == teamID ? "font text-lg font-black" : ""}`}
              key={currentClubID}
              onClick={() => {
                setTeamID(currentClubID);
              }}
            >
              {clubIdToName[parseInt(currentClubID)]}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
