import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnsoldPlayersQuery } from "@/lib/queries";
import { useDashboardStore } from "@/lib/store";
import { UnsoldPlayer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import { DataTable } from "../ui/data-table";

const columns: ColumnDef<UnsoldPlayer>[] = [
  {
    id: "name",
    size: 100,
    header: "Name",
    accessorFn: (player: UnsoldPlayer) => player.FirstName + " " + player.Surname,
  },
  {
    id: "position",
    size: 40,
    header: "Position",
    accessorKey: "posn",
  },
  {
    id: "club",
    size: 40,
    header: "Club",
    accessorKey: "Club",
  },

  {
    id: "gms",
    accessorKey: "gms",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        GMS
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("gms")}</div>,
  },
  {
    id: "k",
    accessorKey: "k",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        K
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("k")}</div>,
  },
  {
    id: "m",
    accessorKey: "m",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        M
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("m")}</div>,
  },
  {
    id: "hb",
    accessorKey: "hb",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        HB
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("hb")}</div>,
  },
  {
    id: "ff",
    accessorKey: "ff",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        FF
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("ff")}</div>,
  },
  {
    id: "fa",
    accessorKey: "fa",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        FA
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("fa")}</div>,
  },
  {
    id: "g",
    accessorKey: "g",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        G
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("g")}</div>,
  },
  {
    id: "b",
    accessorKey: "b",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        B
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("b")}</div>,
  },
  {
    id: "ho",
    accessorKey: "ho",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        HO
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("ho")}</div>,
  },
  {
    id: "t",
    accessorKey: "t",
    size: 30,
    sortDescFirst: true,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()} className="p-0 w-full justify-center">
        T
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("t")}</div>,
  },
  {
    id: "actions",
    size: 30,
    cell: () => {
      //const test = row.original;
      // contains all of the original row content to be used for selecting the player
      // console.log("🚀 ~ test:", test);

      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <User className="h-4 w-4" />
        </Button>
      );
    },
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
            <div className="h-[600px]">
              <DataTable
                columns={columns}
                data={data ?? []}
                filter={{ column: "name", placeholder: "Filter by name..." }} // 'name' matches the column id
                sortingDisplay={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
