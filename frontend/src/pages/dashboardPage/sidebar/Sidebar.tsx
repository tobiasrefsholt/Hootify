import Navigation from "@/pages/dashboardPage/sidebar/Navigation.tsx";
import UserDropdown from "@/pages/dashboardPage/sidebar/userDropdown.tsx";

export default function Sidebar() {
    return (
        <div className="h-screen min-w-80 p-10 space-y-10 border-r">
            <UserDropdown/>
            <Navigation/>
        </div>
    )
}