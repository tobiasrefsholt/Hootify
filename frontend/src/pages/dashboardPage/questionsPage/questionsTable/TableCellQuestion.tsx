import {QuestionWithAnswer} from "@/Types.ts";
import QuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/questionSheet.tsx";
import {useState} from "react";

type QuestionTitleProps = {
    row: { original: QuestionWithAnswer };
}

export default function TableCellQuestion({row}: QuestionTitleProps) {
    const [openEditSheet, setOpenEditSheet] = useState(false);
    return (
        <QuestionSheet question={row.original} open={openEditSheet} setOpen={setOpenEditSheet}>
            <span className="hover:underline cursor-pointer">
                    {row.original.title}
            </span>
        </QuestionSheet>
    )
}