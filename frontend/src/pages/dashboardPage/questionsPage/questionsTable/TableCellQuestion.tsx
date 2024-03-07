import {QuestionWithAnswer} from "@/Types.ts";
import EditQuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/editQuestionSheet.tsx";
import {useState} from "react";

type QuestionTitleProps = {
    row: { original: QuestionWithAnswer };
}

export default function TableCellQuestion({row}: QuestionTitleProps) {
    const [openEditSheet, setOpenEditSheet] = useState(false);
    return (
        <EditQuestionSheet question={row.original} open={openEditSheet} setOpen={setOpenEditSheet}>
            <span className="hover:underline cursor-pointer">
                    {row.original.title}
            </span>
        </EditQuestionSheet>
    )
}