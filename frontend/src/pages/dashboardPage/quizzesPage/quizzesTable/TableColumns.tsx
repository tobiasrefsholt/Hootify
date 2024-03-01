"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Quiz} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";
import TableCellActions from "@/pages/dashboardPage/quizzesPage/TableCellActions.tsx";

export const tableColumns: ColumnDef<Quiz>[] = [
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Title"}/>
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
