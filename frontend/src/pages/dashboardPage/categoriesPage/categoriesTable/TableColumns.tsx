"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Category} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import TableCellTitle from "@/pages/dashboardPage/categoriesPage/categoriesTable/TableCellTitle.tsx";
import TableCellActions from "@/pages/dashboardPage/categoriesPage/categoriesTable/TableCellActions.tsx";

export const tableColumns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Name"}/>
        ),
        cell: ({row}) => (
            <TableCellTitle row={row}/>
        )
    },
    {
        id: "actions",
        cell: ({row}) => (
            <TableCellActions row={row}/>
        )
    }
]
