import {ReactNode} from "react";

type DashboardPageProps = {
    children: ReactNode;
}

export default function PageContainer({children}: DashboardPageProps) {
    return (
        <div className="container p-10 xl:mt-16">
            {children}
        </div>
    )
}