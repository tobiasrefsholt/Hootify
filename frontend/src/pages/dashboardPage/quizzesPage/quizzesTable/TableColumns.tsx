"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Quiz} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";
import TableCellActions from "@/pages/dashboardPage/quizzesPage/quizzesTable/TableCellActions.tsx";
import TableCellQuizTitle from "./TableCellQuizTitle";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export const tableColumns: ColumnDef<Quiz>[] = [
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
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Title"}/>
        ),
        cell: ({row}) => (
            <TableCellQuizTitle row={row}/>
        )
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Description"}/>
        )
    },
    {
        id: "actions",
        cell: ({row}) => (
            <TableCellActions row={row}/>
        )
    }
]
