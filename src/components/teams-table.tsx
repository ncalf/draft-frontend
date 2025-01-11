"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTeamPlayersQuery, useTeamStatsQuery } from "@/lib/queries";
import {
  clubShortenedNameToFullName,
  numberToPriceString,
  teamIDToName,
} from "@/lib/utils";
import { AFLClub, Position, TeamID } from "@/lib/types";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

const clubsColumnDefs: ColDef[] = [
  {
    field: "teamID",
    headerName: "Team",
    flex: 2.5,
    cellRenderer: (params: { value: TeamID }) => (
      <TeamDialog teamID={params.value} />
    ),
  },
  { field: "c", headerName: "C" },
  { field: "d", headerName: "D" },
  { field: "f", headerName: "F" },
  { field: "rk", headerName: "RK" },
  { field: "ob", headerName: "OB" },
  {
    field: "total_price",
    headerName: "Price",
    flex: 1,
    valueFormatter: (params: { value: string }) =>
      numberToPriceString(params.value),
  },
];

export function TeamTableCard() {
  const { isLoading, data, error } = useTeamStatsQuery();

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
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: false,
          flex: 1,
          suppressMovable: true,
        }}
      />
    </Card>
  );
}

const playersColumnDefs: ColDef[] = [
  {
    field: "playerSeasonID",
    headerName: "ID",
    flex: 0.5,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
  },
  {
    field: "club",
    headerName: "Club",
    valueFormatter: (params: { value: string }) =>
      clubShortenedNameToFullName(params.value as AFLClub),
    flex: 1.5,
  },
  {
    field: "position",
    valueFormatter: (params: { value: string }) =>
      clubShortenedNameToFullName(params.value as Position),
  },
  {
    field: "price",
    headerName: "Price",
    valueFormatter: (params: { value: string }) =>
      numberToPriceString(params.value),
    flex: 0.5,
  },
];
function TeamDialog({ teamID }: { teamID: TeamID }) {
  const { isLoading, data, error } = useTeamPlayersQuery(teamID);
  const [searchText, setSearchText] = useState("");

  if (error) {
    toast.error("Failed to fetch team players");
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer">{teamIDToName(teamID)}</span>
      </DialogTrigger>
      <DialogContent className="h-[70vh] min-w-[70vw] flex flex-col">
        <DialogHeader>
          <DialogTitle>{teamIDToName(teamID)}</DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>Team players</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
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
            suppressMovable: true,
          }}
          suppressCellFocus={true}
        />
      </DialogContent>
    </Dialog>
  );
}
