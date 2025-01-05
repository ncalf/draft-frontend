import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";

type Params = { data: { FirstName: string; Surname: string } };
const columnDefs: ColDef[] = [
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 2,
  },
  {
    field: "Price",
    valueFormatter: (params: { value: string }) => `$${params.value}`,
  },
];
export function MVPsCard() {
  const { isLoading, data, error } = useSoldPlayersQuery();

  if (error) {
    toast.error("Failed to fetch sold players");
  }

  const topPlayers = data?.sort((a, b) => Number(b.Price) - Number(a.Price)).slice(0, 5); // sort by price and get top 5

  return (
    <Card className="col-start-9 col-end-11 row-start-5 row-end-9 overflow-hidden">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={topPlayers}
        loading={isLoading}
        suppressCellFocus={true}
        defaultColDef={{ sortable: false, filter: false, resizable: false, flex: 1 }}
      />
    </Card>
  );
}
