import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import ActiveGames from "@/pages/dashboardPage/gamesPage/ActiveGames.tsx";

export default function GamesPage() {
    return (
        <PageContainer>
            <PageHeader>Games</PageHeader>
            <ActiveGames/>
        </PageContainer>
    )
}