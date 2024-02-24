import {Player} from "@/Types.ts";

type LeaderBoardProps = {
    leaderBoard: Player[];
}

export default function ShowLeaderBoard({leaderBoard}: LeaderBoardProps) {
    return (
        <div>
            ShowLeaderBoard
            {JSON.stringify(leaderBoard)}
        </div>
    )
}