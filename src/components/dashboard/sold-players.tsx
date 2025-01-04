import { Card } from "@/components/ui/card";
import { useSoldPlayersQuery } from "@/lib/queries";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";

type Params = { data: { FirstName: string; Surname: string } };
const columnDefs: ColDef[] = [
  {
    field: "PlayerSeasonID",
    headerName: "ID",
    flex: 0.8,
  },
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 2,
  },
  {
    field: "Position",
    headerName: "Pos",
    flex: 0.8,
  },
  {
    field: "Club",
    flex: 0.9,
  },
  {
    field: "Price",
    valueFormatter: (params: { value: string }) => `$${params.value}`,
  },
];
export function SoldPlayerCard() {
  const { isLoading, data, error } = useSoldPlayersQuery();

  if (error) {
    toast.error("Failed to fetch sold players");
  }

  return (
    <Card className="col-start-6 col-end-9 row-start-1 row-end-9 space-y-1.5 overflow-hidden">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        loading={isLoading}
        suppressCellFocus={true}
        defaultColDef={{ sortable: false, filter: false, resizable: false, flex: 1 }}
      />
    </Card>
  );
}
