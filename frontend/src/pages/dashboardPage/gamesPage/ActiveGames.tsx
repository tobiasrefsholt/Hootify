import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Game, GameState} from "@/Types.ts";
import {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router";

export default function ActiveGames() {
    const activeGames = useFetch<Game[]>(ApiEndpoint.DashboardGetAllGames, []);
    const navigate = useNavigate();
    useEffect(() => {
        activeGames.doFetch("POST");
    }, []);
    return (
        <div className="mt-5">
            <h1 className="font-bold">ActiveGames</h1>
            <div className="grid grid-cols-4 gap-5 mt-5">
                {activeGames.data?.map((game: Game) =>
                    <Card key={game.id}>
                        <CardHeader className="font-bold">{game.title}</CardHeader>
                        <CardContent>
                            <p>ShareKey: {game.shareKey}</p>
                            <p>State: {GameState[game.state]}</p>
                        </CardContent>
                        <CardFooter className="space-x-2.5">
                            <Button variant="secondary" onClick={() => navigate(game.id)}>View</Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}