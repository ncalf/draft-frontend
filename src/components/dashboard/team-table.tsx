import { Card } from "@/components/ui/card";
import { useTeamStatsQuery } from "@/lib/queries";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

export function TeamTableCard() {
  const { isLoading, data, error } = useTeamStatsQuery();

  return (
    <Card className="col-start-1 col-end-6 row-start-1 row-end-8 overflow-hidden">
      <TeamStatsTable rowData={data} isLoading={isLoading} />
    </Card>
  );
}

function TeamStatsTable({ rowData, isLoading }: { rowData: any[]; isLoading: boolean }) {
  const columnDefs: ColDef[] = [
    { field: "teamId", headerName: "Team" },
    { field: "C" },
    { field: "D" },
    { field: "F" },
    { field: "RK" },
    { field: "OB" },
    { field: "sum_price", headerName: "Price" },
  ];

  return <AgGridReact columnDefs={columnDefs} rowData={rowData} loading={isLoading} />;
}
