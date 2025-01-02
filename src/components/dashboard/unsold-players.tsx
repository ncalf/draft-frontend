import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { UnsoldPlayer } from "@/lib/types";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UnsoldPlayersCard() {
  return (
    <Card className="col-start-9 col-end-11 row-start-4 row-end-5 p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-full w-full bg-gray-300 text-2xl font-semibold hover:bg-gray-200" variant={"outline"}>
            Unsold Players
          </Button>
        </DialogTrigger>
        <VisuallyHidden.Root>
          <DialogTitle>Unsold Players</DialogTitle>
          <DialogDescription>View all unsold players</DialogDescription>
        </VisuallyHidden.Root>
        <DialogContent className="h-[80vh] w-[90vw] max-w-[90vw] pt-10">
          <UnsoldPlayersModalContent />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

type Params = { data: UnsoldPlayer };
const columnDefs: ColDef[] = [
  {
    field: "PlayerSeasonID",
    headerName: "ID",
  },
  {
    field: "fullName",
    headerName: "Name",
    valueGetter: (params: Params) => `${params.data.FirstName} ${params.data.Surname}`,
    flex: 1,
    cellClass: "text-left",
    sortable: false,
    filter: true,
  },
  {
    field: "posn",
    headerName: "Position",
    flex: 0.7,
    sortable: false,
    filter: true,
  },
  {
    field: "Club",
    headerName: "Club",
    flex: 0.7,
    sortable: false,
    filter: true,
  },
  {
    field: "gms",
    headerName: "GMS",
  },
  {
    field: "sk",
    headerName: "K",
  },
  {
    field: "sm",
    headerName: "M",
  },
  {
    field: "shb",
    headerName: "HB",
  },
  {
    field: "sff",
    headerName: "FF",
  },
  {
    field: "sfa",
    headerName: "FA",
  },
  {
    field: "sg",
    headerName: "G",
  },
  {
    field: "sb",
    headerName: "B",
  },
  {
    field: "sho",
    headerName: "HO",
  },
  {
    field: "st",
    headerName: "T",
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
const UnsoldPlayersModalContent = () => {
  const position = useDashboardStore((state) => state.position);
  const { isLoading, data, error } = useUnsoldPlayersQuery(position);
  const [searchText, setSearchText] = useState("");

  if (error) {
    toast.error("Failed to fetch unsold players");
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Input
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />
      <AgGridReact
        quickFilterText={searchText}
        columnDefs={columnDefs}
        rowData={data ?? []}
        loading={isLoading}
        defaultColDef={{
          sortable: true,
          resizable: false,
          sortingOrder: ["desc", null],
          flex: 0.5,
        }}
        suppressCellFocus={true}
      />
    </div>
  );
};
