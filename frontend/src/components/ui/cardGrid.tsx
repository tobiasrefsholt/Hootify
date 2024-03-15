import {cn} from "@/lib/utils.ts";
import {HTMLAttributes, ReactNode} from "react";

type CardGridProps = {
    className?: HTMLAttributes<HTMLDivElement>;
    children: ReactNode;
}

export default function CardGrid({className, children}:CardGridProps) {
    return (
        <div className={cn(className, "grid lg:grid-cols-2 2xl:grid-cols-3 gap-5")}>
            {children}
        </div>
    )
}