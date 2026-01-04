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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowUpDown, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { TransactionInterface } from "@/interfaces/Transactions";
import { expenseCategoryConfig } from "@/constants/expenseCategoryConfig";
import { incomeCategoryConfig } from "@/constants/incomeCategoryConfig";

const columnHelper = createColumnHelper<TransactionInterface>();

export function DataTable({
  data,
  dateFormat,
  onDelete,
  onEdit,
}: {
  data: TransactionInterface[];
  dateFormat: string;
  onDelete: (id: number[]) => void;
  onEdit: (data: TransactionInterface) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const formatDate = (date: string) => {;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    switch (dateFormat) {
      case "YYYY/MM/DD":
        return `${year}-${month}-${day}`;
      case "DD/MM/YYYY":
        return `${day}-${month}-${year}`;
      case "MM/DD/YYYY":
      default:
        return `${month}-${day}-${year}`;
    }
  };

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
        const { category, amount, type } = row.original;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return (
          <div className={`text-center font-medium ${type === "Expense" ? "text-red-500" : "text-green-500"}`}>
            {type === "Expense" ? `-${formatted}` : `+${formatted}`}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
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
      <div className="flex flex-row items-center pb-4">
        <Input
          placeholder="Filter by transaction name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-1/2"
        />
        {Object.keys(table.getState().rowSelection).length > 0 && (
          <div className="w-1/2 flex justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button               
                  className="w-2/3"
                  variant="destructive"
                >
                  Delete selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    selected transactions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(
                        table
                          .getSelectedRowModel()
                          .rows.map((row) => row.original.id)
                      );
                      table.resetRowSelection(); // Cleaner way to reset selection
                    }}                  
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                              const categoryName = cell.getValue() as string;
                              const type = row.original.type;
                              return (
                                <div className="flex flex-row gap-1 justify-center items-center">
                                  {type === "Expense" ? expenseCategoryConfig[categoryName].label : incomeCategoryConfig[categoryName].label}
                                  <span className="flex items-center justify-center w-6 h-6">
                                    {type === "Expense" ? expenseCategoryConfig[categoryName].icon : incomeCategoryConfig[categoryName].icon}
                                  </span>
                                </div>
                              )
                            })()
                      : cell.column.id === "date"
                        ? isFuture 
                          ? (() => {
                              return (
                                <div className="flex flex-col gap-y-1 justify-center items-center">
                                  {formatDate(cell.getValue() as string)}
                                  <span className="rounded-full px-2 text-xs bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                                    Upcoming
                                  </span>
                                </div>
                              )
                          })() 
                          : (() => {
                            return (
                              formatDate(cell.getValue() as string)
                            )
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
