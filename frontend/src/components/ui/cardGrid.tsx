import {cn} from "@/lib/utils.ts";
import {HTMLAttributes, ReactNode} from "react";

type CardGridProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
}

export default function CardGrid({className: className, children, ...props}: CardGridProps) {
    return (
        <div {...props} className={cn(className, "grid lg:grid-cols-2 2xl:grid-cols-3 gap-5")}>
            {children}
        </div>
    )
}