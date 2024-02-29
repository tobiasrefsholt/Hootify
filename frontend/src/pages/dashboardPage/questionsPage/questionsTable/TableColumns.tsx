"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Question} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";
import QuestionTitle from "@/pages/dashboardPage/questionsPage/questionsTable/TableCellQuestion.tsx";
import TableCellActions from "@/pages/dashboardPage/questionsPage/questionsTable/TableCellActions.tsx";

export const tableColumns: ColumnDef<Question>[] = [
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Title"}/>
        ),
        cell: ({row}) => (
            <QuestionTitle row={row}/>
        )
    },
    {
        accessorKey: "category",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Category"}/>
        )
    },
    {
        id: "actions",
        cell: ({row}) => (
            <TableCellActions row={row}/>
        )
    }
]
