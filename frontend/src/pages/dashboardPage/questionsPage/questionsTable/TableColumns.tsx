"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Question} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";

export const tableColumns: ColumnDef<Question>[] = [
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Title"} />
        )
    },
    {
        accessorKey: "category",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Category"} />
        )
    },
]
