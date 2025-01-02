import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClubPlayersQuery, useClubsStatsQuery } from "@/lib/queries";
import {
  getClubNameById,
  getPositionNameByShortenedName,
  getTeamNameByShortenedName,
  numberToPriceString,
} from "@/lib/shelf";
import { AFLTeamAbbreviations, NcalfClubID, Position } from "@/lib/types";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

const clubsColumnDefs: ColDef[] = [
  {
    field: "ncalfclubid",
    headerName: "Club",
    flex: 2.5,
    cellRenderer: (params: { value: NcalfClubID }) => <ClubDialog clubID={params.value} />,
  },
  { field: "C" },
  { field: "D" },
  { field: "F" },
  { field: "RK" },
  { field: "OB" },
  {
    field: "sum_price",
    headerName: "Price",
    flex: 1,
    valueFormatter: (params: { value: string }) => numberToPriceString(params.value),
  },
];

export function ClubTableCard() {
  const { isLoading, data, error } = useClubsStatsQuery();

  if (error) {
    toast.error("Failed to fetch club stats");
  }

  return (
    <Card className="col-start-1 col-end-6 row-start-1 row-end-8 overflow-hidden">
      <AgGridReact
        columnDefs={clubsColumnDefs}
        rowData={data}
        loading={isLoading}
        suppressCellFocus={true}
        defaultColDef={{ sortable: false, filter: false, resizable: false, flex: 1 }}
      />
    </Card>
  );
}

type Params = { data: { FirstName: string; Surname: string; price: string } };
const playersColumnDefs: ColDef[] = [
  {
    field: "PlayerSeasonID",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 1.5,
  },
  {
    field: "club",
    headerName: "Team",
    valueFormatter: (params: { value: string }) => getTeamNameByShortenedName(params.value as AFLTeamAbbreviations),
    flex: 1.5,
  },
  {
    field: "posn",
    headerName: "Position",
    valueFormatter: (params: { value: string }) => getPositionNameByShortenedName(params.value as Position),
  },
  {
    field: "price",
    headerName: "Price",
    valueFormatter: (params: { value: string }) => numberToPriceString(params.value),
    flex: 0.5,
  },
];
function ClubDialog({ clubID: clubID }: { clubID: NcalfClubID }) {
  const { isLoading, data, error } = useClubPlayersQuery(clubID);
  const [searchText, setSearchText] = useState("");

  console.log(clubID);

  if (error) {
    toast.error("Failed to fetch club players");
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer">{getClubNameById(clubID)}</span>
      </DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>{clubID}</DialogTitle>
        <DialogDescription>Club players</DialogDescription>
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
              flex: 1,
            }}
            suppressCellFocus={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
