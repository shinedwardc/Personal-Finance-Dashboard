import { useState } from "react";
import {
  createColumnHelper,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { expenseCategoryConfig } from "@/constants/expenseCategoryConfig";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { ExpenseInterface } from "@/interfaces/expenses";

const columnHelper = createColumnHelper<ExpenseInterface>();

export function DataTable({
  data,
  onDelete,
  onEdit,
}: {
  data: ExpenseInterface[];
  onDelete: (id: number[]) => void;
  onEdit: (data: ExpenseInterface) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    columnHelper.accessor("id", {
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => {
        return (
          <Button
            variant={!column.getIsSorted() ? "ghost" : "secondary"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" && <ArrowUpIcon />}
            {column.getIsSorted() === "desc" && <ArrowDownIcon />}
            {!column.getIsSorted() && <ArrowUpDown />}
          </Button>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => {
        return (
          <Button
            className="text-start"
            variant={!column.getIsSorted() ? "ghost" : "secondary"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" && <ArrowUpIcon />}
            {column.getIsSorted() === "desc" && <ArrowDownIcon />}
            {!column.getIsSorted() && <ArrowUpDown />}
          </Button>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: ({ column }) => {
        return (
          <Button
            variant={!column.getIsSorted() ? "ghost" : "secondary"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {column.getIsSorted() === "asc" && <ArrowUpIcon />}
            {column.getIsSorted() === "desc" && <ArrowDownIcon />}
            {!column.getIsSorted() && <ArrowUpDown />}
          </Button>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const { category, amount } = row.original;
        const rowAmount =
          category.toLowerCase() !== "income" ? amount * -1 : amount;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(rowAmount);

        return (
          <div
            className={`text-center font-medium ${rowAmount < 0 ? "text-red-500" : "text-green-500"}`}
          >
            {rowAmount > 0 ? `+${formatted}` : formatted}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
        //console.log(transaction);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(transaction.id.toString())
                }
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete([transaction.id])}>
                Delete transaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                Edit transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex flex-row gap-2 items-center py-4">
        <Input
          placeholder="Filter by transaction name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {Object.keys(table.getState().rowSelection).length > 0 && (
          <div className="w-full flex justify-center">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(
                  table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original.id),
                );
                setRowSelection({});
              }}
            >
              Delete selected
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border overflow-auto max-h-[420px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isFuture = new Date(row.original.date) > new Date();
                return (
                  <TableRow
                    key={row.id}
                    data-future={isFuture || undefined}
                    data-selected={row.getIsSelected() || undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === "category"
                          ? (() => {
                              const categoryValue = cell.getValue() as string;
                              const config = Object.values(expenseCategoryConfig).find(
                                (c) => c.label === categoryValue,
                              );
                              return config ? (
                                <div className="flex flex-row gap-1 justify-center items-center">
                                  {config.group}
                                  <span className="flex items-center justify-center w-6 h-6">
                                    {config.icon}
                                  </span>
                                </div>
                              ) : (
                                categoryValue
                              );
                            })()
                          : cell.column.id === "date" && isFuture
                            ? (() => {
                                return (
                                  <div className="flex flex-col gap-y-1 justify-center items-center">
                                    {cell.getValue() as string}
                                    <span
                                      className="
                                        rounded-full text-xs 
                                      bg-blue-200 text-blue-800 
                                      dark:bg-blue-900/40 dark:text-blue-200
                                      "
                                    >
                                      Upcoming
                                    </span>
                                  </div>
                                );
                              })()
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2 flex justify-center text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </>
  );
}
