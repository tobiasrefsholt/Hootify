import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Player} from "@/Types.ts";

type LeaderBoardProps = {
    leaderBoard: Player[];
}

export default function ShowLeaderBoard({leaderBoard}: LeaderBoardProps) {
    return (
        <div className="container space-y-10">
            <h1 className="text-4xl md:text-6xl text-center font-bold">Leaderboard</h1>
            <Table className="max-w-screen-md mx-auto">
                <TableCaption>Wait for the nest question</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderBoard.map((player, index) => (
                        <TableRow key={player.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{player.name}</TableCell>
                            <TableCell className="text-right">{player.score} p</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}