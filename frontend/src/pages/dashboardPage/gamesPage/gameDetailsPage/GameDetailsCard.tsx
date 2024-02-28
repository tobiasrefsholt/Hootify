import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Game, GameOptions, GameState} from "@/Types.ts";
import GameOptionsDialog from "@/pages/dashboardPage/gamesPage/gameDetailsPage/GameOptionsDialog.tsx";

type GameDetailsCardProps = {
    gameState: GameState | null
    game: Game | null
    gameOptions: GameOptions | null
    onChange: (gameOptions: GameOptions) => void
}

export default function GameDetailsCard({gameState, game, gameOptions, onChange}: GameDetailsCardProps) {
    return (
        <Card>
            <CardHeader>Game Details</CardHeader>
            <CardContent className="space-y-5">
                <div>
                    <p>State:</p>
                    <p className="mb-5 font-bold">{GameState[gameState || 0]}</p>
                </div>
                {game?.shareKey &&
                    <div>
                        <p>ShareKey:</p>
                        <p className="text-5xl">{game.shareKey}</p>
                    </div>
                }
                <GameOptionsDialog gameOptions={gameOptions} onChange={onChange}/>
            </CardContent>
        </Card>
    )
}