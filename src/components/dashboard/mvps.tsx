"use client";

import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { toast } from "sonner";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

const columnDefs: ColDef[] = [
  { headerName: "Name", field: "name" },
  { headerName: "Price", field: "price" },
];

export function MVPsCard() {
  const { isLoading, data, error } = useSoldPlayersQuery();

  if (error) {
    toast.error("Failed to fetch sold players");
  }

  const topPlayers = data
    ?.sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 5);

  return (
    <Card className="col-start-9 col-end-11 row-start-5 row-end-9 overflow-hidden p-2 flex flex-col">
      <div className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
        MVPs
      </div>
      <div className="h-full w-full flex flex-col">
        <AgGridReact
          rowData={topPlayers}
          columnDefs={columnDefs}
          pagination={false}
          defaultColDef={{
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            flex: 0.5,
          }}
          loading={isLoading}
          suppressCellFocus={true}
        />
      </div>
    </Card>
  );
}
