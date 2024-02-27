import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Game, GameState} from "@/Types.ts";

type GameDetailsCardProps = {
    gameState: GameState | null
    game: Game | null
}

export default function GameDetailsCard({gameState, game}: GameDetailsCardProps) {
    return (
        <Card>
            <CardHeader>Game Details</CardHeader>
            <CardContent>
                <p>State:</p>
                <p className="mb-5 font-bold">{GameState[gameState || 0]}</p>
                <p>ShareKey:</p>
                <p className="text-5xl">{game?.shareKey || "N/A"}</p>
            </CardContent>
        </Card>
    )
}