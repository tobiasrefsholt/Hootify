import JoinGameCard from "./JoinGameCard";
import {UserTabsCard} from "@/pages/frontPage/userTabs/userTabsCard.tsx";

export default function FrontPage() {
    return (
        <div className="container py-10 sm:h-screen flex flex-col justify-center items-center gap-16">
            <h1 className="text-6xl font-bold">Hootify</h1>
            <div className="w-full flex flex-col sm:flex-row justify-center gap-5">
                <JoinGameCard/>
                <UserTabsCard/>
            </div>
        </div>
    )
}