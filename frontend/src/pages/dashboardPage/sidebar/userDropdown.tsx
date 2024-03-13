import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useUser} from "@/context/userContext.tsx";
import {LogOut, Settings, Shield, User} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {useNavigate} from "react-router";

export default function UserDropdown() {
    const {userData, logout} = useUser();
    const navigate = useNavigate();

    return (
        <div className="flex gap-2.5">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2.5 items-center w-full border rounded-md px-2.5 py-2.5">
                    <Avatar>
                        <AvatarFallback
                            className="font-bold text-sm">{userData?.email.substring(0, 2).toUpperCase() || ""}</AvatarFallback>
                    </Avatar>
                    {userData?.email}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-52">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/account/profile")}>
                        <User className="mr-2 h-4 w-4"/>
                        <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/account/security")}>
                        <Shield className="mr-2 h-4 w-4"/>
                        <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/account/settings")}>
                        <Settings className="mr-2 h-4 w-4"/>
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}