import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { UnsoldPlayer } from "@/lib/types";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { User } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

type Params = { data: UnsoldPlayer };
const columnDefs: ColDef[] = [
  {
    field: "fullName",
    headerName: "Name",
    sortable: true,
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 1,
  },
  {
    field: "posn",
    headerName: "Position",
    flex: 1,
  },
  {
    field: "Club",
    headerName: "Club",
    flex: 1,
  },
  {
    field: "gms",
    headerName: "GMS",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "k",
    headerName: "K",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "m",
    headerName: "M",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "hb",
    headerName: "HB",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "ff",
    headerName: "FF",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "fa",
    headerName: "FA",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "g",
    headerName: "G",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "b",
    headerName: "B",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "ho",
    headerName: "HO",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "t",
    headerName: "T",
    flex: 0.5,
    cellClass: "text-center",
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.5,
    cellRenderer: (params: Params) => (
      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => console.log(params.data)}>
        <User className="h-4 w-4" />
      </Button>
    ),
  },
];

export function UnsoldPlayersCard() {
  const position = useDashboardStore((state) => state.position);
  const { isLoading, data } = useUnsoldPlayersQuery(position);

  return (
    <Card className="col-start-9 col-end-11 row-start-4 row-end-5 p-2">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-full w-full bg-gray-300 text-2xl font-semibold hover:bg-gray-200" variant={"outline"}>
              Unsold Players
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-[80vw]">
            <DialogTitle>Unsold Players</DialogTitle>
            <DialogDescription>Description</DialogDescription>

            <div className="h-[600px]">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={data ?? []}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                }}
                suppressCellFocus={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
