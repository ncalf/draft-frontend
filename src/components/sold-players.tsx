"use client";

import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Undo } from "lucide-react";
import { useUndoSaleMutation } from "@/lib/mutations";
import { Position } from "@/lib/types";

type Params = {
  data: { playerSeasonID: number; name: string; position: Position };
};
const columnDefs: ColDef[] = [
  {
    field: "playerSeasonID",
    headerName: "ID",
    flex: 0.8,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    cellRenderer: (params: Params) => <UndoSaleDropdown params={params} />,
  },
  {
    field: "position",
    headerName: "Pos",
    flex: 0.8,
  },
  {
    field: "club",
    flex: 0.9,
  },
  {
    field: "price",
    valueFormatter: (params: { value: string }) => `$${params.value}`,
  },
];
export function SoldPlayerCard() {
  const { isLoading, data, error } = useSoldPlayersQuery();

  if (error) {
    toast.error("Failed to fetch sold players");
  }

  return (
    <Card className="col-start-6 col-end-9 row-start-1 row-end-9 space-y-1.5 overflow-hidden p-2 flex flex-col">
      <div className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
        Sold Players
      </div>
      <AgGridReact
        columnDefs={columnDefs}
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

function UndoSaleDropdown({ params }: { params: Params }) {
  const mutation = useUndoSaleMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{params.data.name}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            mutation.mutate({
              playerSeasonID: params.data.playerSeasonID,
              position: params.data.position,
            });
          }}
        >
          <Undo />
          <span>Undo Sale</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
