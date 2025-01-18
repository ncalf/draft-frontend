"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayerInfoQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { clubShortenedNameToFullName } from "@/lib/utils";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import { toast } from "sonner";

const season = process.env.NEXT_PUBLIC_SEASON;

export function PlayerInfoCard() {
  const currentPlayer = useDashboardStore((state) => state.currentPlayer);
  const { isLoading, data, error } = usePlayerInfoQuery();

  if (error) {
    toast.error("Failed to fetch player name");
  }

  return (
    <Card className="col-start-1 col-end-9 row-start-9 row-end-13 p-1 flex flex-row">
      {currentPlayer ? (
        <>
          {isLoading ? (
            <Skeleton className="w-[300px] h-[230px] rounded" />
          ) : (
            <Image
              src={`/api/player/image?season=${season}&playerSeasonID=${currentPlayer}`}
              alt="Player Image"
              className={`h-full object-cover rounded`}
              width={300}
              height={400}
              priority
            />
          )}
          <div className="flex flex-col w-full ml-4">
            <span className="text-4xl font-semibold tracking-tight mb-1">
              {data ? (
                <>
                  {currentPlayer}: {data.name} -{" "}
                  {clubShortenedNameToFullName(data.club)}
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

const columnDefs: ColDef[] = [
  { field: "season", headerName: "Season", flex: 1.3 },
  { field: "club", headerName: "Club", flex: 1.3 },
  { field: "gms", headerName: "Gms" },
  { field: "k", headerName: "K", flex: 1.1 },
  { field: "m", headerName: "M", flex: 1.1 },
  { field: "hb", headerName: "HB", flex: 1.1 },
  { field: "ff", headerName: "FF" },
  { field: "fa", headerName: "FA" },
  { field: "g", headerName: "G" },
  { field: "b", headerName: "B" },
  { field: "ho", headerName: "HO", flex: 1.1 },
  { field: "t", headerName: "T", flex: 1.1 },
];

function PlayerStatsTable() {
  const { isLoading, data, error } = usePlayerInfoQuery();

  if (error) {
    toast.error("Failed to fetch player stats");
  }

  return (
    <div className="w-full h-full">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data?.stats}
        loading={isLoading}
        suppressCellFocus={true}
        headerHeight={34}
        rowHeight={30.7}
        getRowClass={(params) =>
          params.rowIndex === 0 ? "font-bold text-xl" : ""
        }
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: false,
          flex: 1,
          suppressMovable: true,
        }}
      />
    </div>
  );
}
