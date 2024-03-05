"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Game, GameState} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import TableCellTitle from "@/pages/dashboardPage/gamesPage/arcivedGames/TableCellTitle.tsx";
import TableCellActions from "@/pages/dashboardPage/gamesPage/arcivedGames/TableCellActions.tsx";

export const tableColumns: ColumnDef<Game>[] = [
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
            <TableCellTitle row={row}/>
        )
    },
    {
        accessorKey: "state",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"State"}/>
        ),
        cell: ({row}) => GameState[row.original.state]
    },
    {
        id: "actions",
        cell: ({row}) => (
            <TableCellActions row={row}/>
        )
    }
]
