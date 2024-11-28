import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

import { columnsIdsToDisplayName } from "@/lib/shelf";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: {
    column: string;
    placeholder: string;
  };
  sortingDisplay?: boolean;
}

function DataTable<TData, TValue>({ columns, data, filter, sortingDisplay }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="h-full">
      <div className="flex justify-between items-center">
        {filter && (
          <div className="flex items-center py-4 w-4/5">
            <Input
              placeholder={filter.placeholder}
              value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filter.column)?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
        {sortingDisplay && (
          <div className="flex items-center gap-2">
            {sorting.length > 0 ? (
              sorting.map((sort) => (
                <Badge key={sort.id} variant="secondary" className="text-sm flex items-center gap-1 h-8">
                  {columnsIdsToDisplayName[sort.id]} {sort.desc ? "Descending" : "Ascending"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSorting([])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-sm h-8">
                No sorting
              </Badge>
            )}
          </div>
        )}
      </div>
      <div className="rounded-md border flex-1">
        <ScrollArea className="h-[500px]">
          <Table wrapperClassName="overflow-clip">
            <TableHeader className="sticky top-0 bg-secondary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.size,
                          maxWidth: cell.column.columnDef.size,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

export { DataTable };
