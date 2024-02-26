import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Game, GameState} from "@/Types.ts";
import {useEffect} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button";

export default function ActiveGames() {
    const activeGames = useFetch<Game[]>(ApiEndpoint.DashboardGetAllGames, []);
    useEffect(() => {
        activeGames.doFetch("POST");
    }, []);
    return (
        <div>
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
                            <Button variant="secondary">View</Button>
                            <Button variant="outline">Delete</Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}