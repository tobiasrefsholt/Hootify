import TwoFactorCard from "@/pages/dashboardPage/account/securityTab/twoFactorCard.tsx";
import ChangePasswordCard from "@/pages/dashboardPage/account/securityTab/ChangePasswordCard.tsx";
import CardGrid from "@/components/ui/cardGrid.tsx";

export default function SecurityPage() {
    return (
        <CardGrid>
            <ChangePasswordCard/>
            <TwoFactorCard/>
        </CardGrid>
    )
}