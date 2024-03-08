import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {useUser} from "@/context/userContext.tsx";

export default function LoggedInTab() {
    const user = useUser();
    const navigate = useNavigate();
    return (
        <>
            <h2>Welcome back, {user.userData?.email}</h2>
            <div className="space-x-2.5 mt-5">
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                    Open dashboard
                </Button>
                <Button variant="outline" onClick={user.logout}>Logout</Button>
            </div>
        </>
    )
}