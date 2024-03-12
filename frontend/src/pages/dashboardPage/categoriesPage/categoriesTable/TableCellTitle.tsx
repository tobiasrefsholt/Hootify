import {Category} from "@/Types.ts";
import {Link} from "react-router-dom";

type CategoryTitleProps = {
    row: { original: Category };
}

export default function TableCellTitle({row}: CategoryTitleProps) {
    return (
        <Link to={row.original.id} className="hover:underline cursor-pointer">
            {row.original.name}
        </Link>
    )
}