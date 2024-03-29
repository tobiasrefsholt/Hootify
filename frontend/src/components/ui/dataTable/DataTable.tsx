import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable, RowSelectionState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {Dispatch, SetStateAction, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {DataTablePagination} from "@/components/ui/dataTable/DataTablePagination.tsx";
import {DataTableViewOptions} from "@/components/ui/dataTable/DataTableViewOptions.tsx";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowSelection: RowSelectionState,
    setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
    filterByColumn?: string;
    filterText?: string;
}

export function DataTable<TData, TValue>(
    {
        columns,
        data,
        rowSelection,
        setRowSelection,
        filterByColumn,
        filterText
    }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div className="space-y-5">
            <div className="flex items-center">
                {filterByColumn && filterText &&
                    <Input
                        placeholder={"Filter " + filterText + "..."}
                        value={(table.getColumn(filterByColumn)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterByColumn)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />}
                <DataTableViewOptions table={table}/>
            </div>
            <div className="rounded-md border">
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>
    )
}
