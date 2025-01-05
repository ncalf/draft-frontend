import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { SEASON, usePlayerNameQuery, usePlayerStatsQuery, useUnsoldPlayersQuery } from "@/lib/queries"; // Import useUnsoldPlayersQuery
import { getClubNameByShortenedName } from "@/lib/shelf";
import { useDashboardStore } from "@/lib/store";
import { AFLClub } from "@/lib/types";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";

export function PlayerInfoCard() {
  const currentPlayer = useDashboardStore((state) => state.currentPlayer);
  const { data, error } = usePlayerNameQuery();
  const { data: unsoldPlayers } = useUnsoldPlayersQuery();
  if (error) {
    toast.error("Failed to fetch player name");
  }

  const playerClub: AFLClub = unsoldPlayers?.find((player) => player.PlayerSeasonID === currentPlayer)?.Club as AFLClub;

  const imageUrl = `http://${import.meta.env.VITE_BACKEND_IP}/ncalf/draft/player/image/${SEASON}/${currentPlayer}`;
  return (
    <Card className="col-start-1 col-end-9 row-start-9 row-end-13 p-2 flex flex-row">
      {currentPlayer ? (
        <>
          <img src={imageUrl} alt="Player Image" className="h-full object-cover rounded" />
          <div className="flex flex-col w-full ml-4">
            <span className="py-2 border-b text-4xl font-semibold tracking-tight mb-4">
              {data ? (
                <>
                  {currentPlayer} - {data.FirstName} {data.Surname} -{" "}
                  {getClubNameByShortenedName(playerClub) || "Unknown Club"}
                </>
              ) : (
                "Loading..."
              )}
            </span>

            <PlayerStatsTable />
          </div>
        </>
      ) : (
        <Skeleton className="col-span-2 row-span-4 w-full h-full rounded" />
      )}
    </Card>
  );
}

// Define column definitions for PlayerStatsTable
const columnDefs: ColDef[] = [
  { headerName: "Season", field: "Season" },
  { headerName: "Club", field: "Club" },
  { headerName: "GMS", field: "gms" },
  { headerName: "K", field: "sk" },
  { headerName: "M", field: "sm" },
  { headerName: "H", field: "shb" },
  { headerName: "FF", field: "sff" },
  { headerName: "FA", field: "sfa" },
  { headerName: "G", field: "sg" },
  { headerName: "B", field: "sb" },
  { headerName: "HO", field: "sho" },
  { headerName: "T", field: "st" },
];

function PlayerStatsTable() {
  const currentPlayer = useDashboardStore((state) => state.currentPlayer);
  const { isLoading, data, error } = usePlayerStatsQuery(currentPlayer);

  if (error) {
    toast.error("Failed to fetch player stats");
  }

  return (
    <div className="w-full h-full">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        loading={isLoading}
        suppressCellFocus={true}
        domLayout="autoHeight"
        defaultColDef={{ sortable: false, filter: false, resizable: false, flex: 1 }}
      />
    </div>
  );
}
