import JoinGameCard from "./JoinGameCard";
import LoginCard from "./LoginCard";

export default function FrontPage() {
    return (
        <div className="min-h-screen text-white flex flex-col gap-16 items-center justify-center">
            <h1 className="text-6xl font-bold">Hootify</h1>
            <div className="flex gap-5">
                <JoinGameCard/>
                <LoginCard/>
            </div>
        </div>
    )
}