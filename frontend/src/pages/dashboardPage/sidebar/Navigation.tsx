import {NavLink} from "react-router-dom";
import {Home} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {cn} from "@/lib/utils.ts";
import {HTMLProps, ReactNode} from "react";

export default function Navigation() {
    return (
        <nav>
            <ul className="flex flex-col gap-1.5">
                <NavigationItem to={"/dashboard"}>Dashboard</NavigationItem>
                <NavigationItem to={"/dashboard/games"}>Games</NavigationItem>
                <NavigationItem to={"/dashboard/quizzes"}>Quizzes</NavigationItem>
                <NavigationItem to={"/dashboard/questions"}>Questions</NavigationItem>
                <NavigationItem to={"/dashboard/categories"}>Categories</NavigationItem>
                <Separator className="my-5"/>
                <NavigationItem to={"/"} icon={<Home className="h-4 w-4"/>}>Exit to frontpage</NavigationItem>
            </ul>
        </nav>
    )
}

type NavigationItemProps = {
    to: string;
    icon?: ReactNode;
    children: ReactNode;
};

function NavigationItem({to, icon, children}: NavigationItemProps) {
    const baseClasses: HTMLProps<HTMLElement>["className"] = "flex items-center gap-2.5 p-2.5 rounded-md border";
    return (
        <li>
            <NavLink
                to={to}
                end
                className={({isActive, isPending}) => (isActive || isPending)
                    ? cn(baseClasses, "text-primary-foreground bg-secondary")
                    : cn(baseClasses, "text-muted-foreground border-background hover:border-secondary")
                }
            >
                {icon}
                {children}
            </NavLink>
        </li>
    )
}