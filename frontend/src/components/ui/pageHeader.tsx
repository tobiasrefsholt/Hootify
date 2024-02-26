import {ReactNode} from "react";

type PageHeaderProps = {
    children: ReactNode;
}

export default function PageHeader({children}: PageHeaderProps) {
    return (
        <h1 className="font-bold text-5xl mb-10">
            {children}
        </h1>
    )

}