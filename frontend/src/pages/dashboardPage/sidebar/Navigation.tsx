import {NavLink} from "react-router-dom";
import {Home} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {cn} from "@/lib/utils.ts";
import {HTMLProps, ReactNode} from "react";

export default function Navigation() {
    return (
        <nav>
            <ul className="flex flex-col gap-2.5">
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
    const baseClasses: HTMLProps<HTMLElement>["className"] = "flex items-center gap-2.5 px-2.5 py-1 rounded-md";
    return (
        <li>
            <NavLink
                to={to}
                end
                className={({isActive}) => isActive
                    ? cn(baseClasses, "text-primary-foreground bg-secondary")
                    : cn(baseClasses, "text-muted-foreground")
                }
            >
                {icon}
                {children}
            </NavLink>
        </li>
    )
}