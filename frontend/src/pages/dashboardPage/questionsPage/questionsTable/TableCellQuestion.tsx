import {Question} from "@/Types.ts";
import QuestionSheet from "../questionSheet";

type QuestionTitleProps = {
    row: { original: Question };
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