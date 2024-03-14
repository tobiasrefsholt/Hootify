import TwoFactorCard from "@/pages/dashboardPage/account/securityTab/twoFactorCard.tsx";
import ChangePasswordCard from "@/pages/dashboardPage/account/securityTab/ChangePasswordCard.tsx";

export default function SecurityPage() {
    return (
        <div className="grid grid-cols-3 gap-5">
            <ChangePasswordCard/>
            <TwoFactorCard/>
        </div>
    )
}