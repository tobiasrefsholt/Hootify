import {Quiz} from "@/Types.ts";
import {useNavigate} from "react-router";

type QuestionTitleProps = {
    row: { original: Quiz };
}

export default function QuestionTitle({row}: QuestionTitleProps) {
    const navigate = useNavigate()

    return (
        <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate(row.original.id)}
        >
            {row.original.title}
        </span>
    )
}