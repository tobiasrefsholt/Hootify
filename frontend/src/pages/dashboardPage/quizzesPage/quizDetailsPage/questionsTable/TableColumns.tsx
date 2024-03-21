import {ColumnDef} from "@tanstack/react-table"
import {QuestionWithAnswer} from "@/Types.ts";
import {DataTableColumnHeader} from "@/components/ui/dataTable/DataTableColumnHeader.tsx";

import {Checkbox} from "@/components/ui/checkbox.tsx";
import TableCellQuestion from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/questionsTable/TableCellQuestion.tsx";
import TableCellActions from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/questionsTable/TableCellActions.tsx";

export const tableColumns: ColumnDef<QuestionWithAnswer>[] = [
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
            <TableCellQuestion row={row}/>
        )
    },
    {
        accessorKey: "category",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Category"}/>
        )
    },
    {
        accessorKey: "updatedAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Updated At"}/>
        ),
        cell: ({row}) => (new Date(row.original.updatedAt).toLocaleDateString())
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Created At"}/>
        ),
        cell: ({row}) => (new Date(row.original.createdAt).toLocaleDateString())
    },
    {
        id: "actions",
        cell: ({row}) => (
            <TableCellActions row={row}/>
        )
    }
]
