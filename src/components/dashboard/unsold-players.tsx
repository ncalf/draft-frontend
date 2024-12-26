import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { UnsoldPlayer } from "@/lib/types";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { User } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

type Params = { data: UnsoldPlayer };
const columnDefs: ColDef[] = [
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 1,
    cellClass: "text-left",
  },
  {
    field: "posn",
    headerName: "Position",
    flex: 0.7,
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
  },
  {
    field: "sk",
    headerName: "K",
    flex: 0.5,
  },
  {
    field: "sm",
    headerName: "M",
    flex: 0.5,
  },
  {
    field: "shb",
    headerName: "HB",
    flex: 0.5,
  },
  {
    field: "sff",
    headerName: "FF",
    flex: 0.5,
  },
  {
    field: "sfa",
    headerName: "FA",
    flex: 0.5,
  },
  {
    field: "sg",
    headerName: "G",
    flex: 0.5,
  },
  {
    field: "sb",
    headerName: "B",
    flex: 0.5,
  },
  {
    field: "sho",
    headerName: "HO",
    flex: 0.5,
  },
  {
    field: "st",
    headerName: "T",
    flex: 0.5,
  },
  {
    field: "actions",
    headerName: "-",
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
          <DialogContent className="max-h-[80vh] max-w-[80vw] pt-10">
            <div className="h-[600px]">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={data ?? []}
                defaultColDef={{
                  sortable: true,
                  resizable: false,
                  sortingOrder: ["desc", null],
                  cellClass: "text-center",
                  headerClass: "text-center",
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
