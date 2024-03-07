import {QuestionWithAnswer} from "@/Types.ts";
import QuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/questionSheet.tsx";

type QuestionTitleProps = {
    row: { original: QuestionWithAnswer };
}

export default function TableCellQuestion({row}: QuestionTitleProps) {
    return (
        <QuestionSheet question={row.original}>
            <span className="hover:underline cursor-pointer">
                    {row.original.title}
            </span>
        </QuestionSheet>
    )
}