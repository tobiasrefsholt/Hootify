import {Game} from "@/Types.ts";
import {Link} from "react-router-dom";

type QuestionTitleProps = {
    row: { original: Game };
}

export default function TableCellTitle({row}: QuestionTitleProps) {
    return (
        <Link to={row.original.id} className="hover:underline cursor-pointer">
            {row.original.title}
        </Link>
    )
}