import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClubPlayersQuery, useClubsStatsQuery } from "@/lib/queries";
import { getClubIdByName } from "@/lib/shelf";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

const teamsColumnDefs: ColDef[] = [
  {
    field: "club",
    headerName: "Club",
    flex: 1,
    cellRenderer: (params: { value: string }) => <TeamDialog teamName={params.value} />,
  },
  { field: "C" },
  { field: "D" },
  { field: "F" },
  { field: "RK" },
  { field: "OB" },
  { field: "price", headerName: "Price", flex: 0.4 },
];

export function TeamTableCard() {
  const { isLoading, data, error } = useClubsStatsQuery();

  if (error) {
    toast.error("Failed to fetch team stats");
  }

  return (
    <Card className="col-start-1 col-end-6 row-start-1 row-end-8 overflow-hidden">
      <AgGridReact
        columnDefs={teamsColumnDefs}
        rowData={data}
        loading={isLoading}
        suppressCellFocus={true}
        defaultColDef={{ sortable: false, filter: false, resizable: false, flex: 0.3 }}
      />
    </Card>
  );
}

type NameParams = { data: { FirstName: string; Surname: string; price: string } };
const playersColumnDefs: ColDef[] = [
  {
    field: "PlayerSeasonID",
    headerName: "ID",
  },
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: NameParams) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 1,
  },
  {
    field: "club",
    headerName: "Team",
  },
  {
    field: "posn",
    headerName: "Position",
  },
  {
    field: "price",
    headerName: "Price",
    valueFormatter: (params: { value: string }) => `$${params.value}`,
  },
];
function TeamDialog({ teamName }: { teamName: string }) {
  const { isLoading, data, error } = useClubPlayersQuery(getClubIdByName(teamName));
  const [searchText, setSearchText] = useState("");

  if (error) {
    toast.error("Failed to fetch team players");
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer">{teamName}</span>
      </DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>{teamName}</DialogTitle>
        <DialogDescription>Team players</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="h-[70vh] w-[70vw] max-w-[90vw] pt-10">
        <div className="w-full h-full flex flex-col">
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
          />
          <AgGridReact
            quickFilterText={searchText}
            columnDefs={playersColumnDefs}
            rowData={data ?? []}
            loading={isLoading}
            defaultColDef={{
              sortable: true,
              resizable: false,
              sortingOrder: ["desc", null],
              flex: 0.5,
            }}
            suppressCellFocus={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
