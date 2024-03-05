import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useUser} from "@/context/userContext.tsx";
import ActiveGames from "@/pages/dashboardPage/indexPage/ActiveGames.tsx";
import {useGames} from "@/context/gamesContext.tsx";
import {GameState} from "@/Types.ts";

export default function IndexPage() {
    const {userData} = useUser();
    const gameContext = useGames();
    const activeGames = gameContext.games.filter(game => game.state !== GameState.GameComplete);
    return (
        <PageContainer>
            <PageHeader>Welcome back, {userData?.email || "user"}!</PageHeader>
            <ActiveGames activeGames={activeGames}/>
        </PageContainer>
    )
}