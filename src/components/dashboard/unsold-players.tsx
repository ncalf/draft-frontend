"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { UnsoldPlayer } from "@/lib/types";
ModuleRegistry.registerModules([AllCommunityModule]);

interface UnsoldPlayerStore {
  open: boolean;
}
const useUnsoldPlayerStore = create<UnsoldPlayerStore>()(() => ({
  open: false,
}));

export function UnsoldPlayersCard() {
  const open = useUnsoldPlayerStore((state) => state.open);

  return (
    <Card className="col-start-9 col-end-11 row-start-4 row-end-5 p-2">
      <Dialog
        open={open}
        onOpenChange={(open) => useUnsoldPlayerStore.setState({ open })}
      >
        <DialogTrigger asChild>
          <Button
            className="h-full w-full bg-gray-300 text-2xl font-semibold hover:bg-gray-200"
            variant={"outline"}
          >
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

function numberSort(a: number, b: number) {
  return a - b;
}
type Params = { data: UnsoldPlayer[] };
const UnsoldPlayersModalContent = () => {
  const { isLoading, data, error } = useUnsoldPlayersQuery();
  const [searchText, setSearchText] = useState("");

  const columnDefs: ColDef[] = [
    {
      field: "playerSeasonID",
      headerName: "ID",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      sortable: false,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 0.7,
      sortable: false,
    },
    {
      field: "club",
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
      field: "k",
      headerName: "K",
    },
    {
      field: "m",
      headerName: "M",
    },
    {
      field: "hb",
      headerName: "HB",
    },
    {
      field: "ff",
      headerName: "FF",
    },
    {
      field: "fa",
      headerName: "FA",
    },
    {
      field: "g",
      headerName: "G",
    },
    {
      field: "b",
      headerName: "B",
    },
    {
      field: "ho",
      headerName: "HO",
    },
    {
      field: "t",
      headerName: "T",
    },
    {
      field: "actions",
      headerName: "-",
      flex: 0.5,
      cellRenderer: (params: Params) => (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            console.log(params.data);
          }}
        >
          <User className="h-4 w-4" />
        </Button>
      ),
    },
  ];

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
          comparator: numberSort,
          suppressMovable: true,
        }}
        suppressCellFocus={true}
      />
    </div>
  );
};
