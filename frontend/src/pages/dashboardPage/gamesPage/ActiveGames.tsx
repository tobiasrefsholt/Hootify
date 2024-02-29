import {Game, GameState} from "@/Types.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router";

type ActiveGamesProps = {
    activeGames: Game[];
}

export default function ActiveGames({activeGames}: ActiveGamesProps) {
    const navigate = useNavigate();
    return (
        <div className="mt-10">
            <h1 className="font-bold">ActiveGames</h1>
            <div className="grid grid-cols-4 gap-5 mt-5">
                {
                    activeGames.length > 0
                        ? activeGames.map((game: Game) =>
                            <Card key={game.id}>
                                <CardHeader>
                                    <span className="font-bold truncate">{game.title}</span>
                                </CardHeader>
                                <CardContent>
                                    <p>ShareKey: {game.shareKey}</p>
                                    <p>State: {GameState[game.state]}</p>
                                </CardContent>
                                <CardFooter className="space-x-2.5">
                                    <Button variant="secondary" onClick={() => navigate(game.id)}>View</Button>
                                </CardFooter>
                            </Card>
                        )
                        :
                        <Card>
                            <CardHeader>
                                No active games
                            </CardHeader>
                        </Card>}
            </div>
        </div>
    )
}