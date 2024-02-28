import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Player} from "@/Types.ts";

type LeaderboardCardProps = {
    players: Player[];
}
export default function LeaderboardCard({players}: LeaderboardCardProps) {
    return (
        <Card>
            <CardHeader>Leaderboard</CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players?.map((player: Player, index: number) =>
                            <TableRow key={player.id}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell className="text-right">{player.score}p</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}