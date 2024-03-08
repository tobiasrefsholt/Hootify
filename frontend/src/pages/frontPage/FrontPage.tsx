import JoinGameCard from "./JoinGameCard";
import {UserTabsCard} from "@/pages/frontPage/userTabs/userTabsCard.tsx";

export default function FrontPage() {
    return (
        <div className="min-h-screen text-white flex flex-col gap-16 items-center justify-center">
            <h1 className="text-6xl font-bold">Hootify</h1>
            <div className="flex gap-5">
                <JoinGameCard/>
                <UserTabsCard/>
            </div>
        </div>
    )
}