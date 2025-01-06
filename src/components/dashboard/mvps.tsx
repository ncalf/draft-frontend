import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";

const columnDefs: ColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 2,
  },
  {
    field: "price",
    valueFormatter: (params: { value: string }) => `$${params.value}`,
  },
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
    <Card className="col-start-9 col-end-11 row-start-5 row-end-9 overflow-hidden">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={topPlayers}
        loading={isLoading}
        suppressCellFocus={true}
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: false,
          flex: 1,
        }}
      />
    </Card>
  );
}
