import {Game, GameState} from "@/Types.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useNavigate} from "react-router";

type ArchivedGamesProps = {
    archivedGames: Game[];
}

export default function ArchivedGames({archivedGames}: ArchivedGamesProps) {
    const navigate = useNavigate();
    console.log(archivedGames)
    return (
        <div className="space-y-5">
            <h1 className="font-bold">Completed games</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>State</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {archivedGames?.map((game: Game) =>
                            <TableRow key={game.id} className="cursor-pointer" onClick={() => navigate(game.id)}>
                                <TableCell>{game.title}</TableCell>
                                <TableCell>{GameState[game.state]}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}