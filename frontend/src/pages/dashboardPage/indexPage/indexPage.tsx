import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useUser} from "@/context/userContext.tsx";

export default function IndexPage() {
    const {userData} = useUser();
    return (
        <PageContainer>
            <PageHeader>Welcome back, {userData?.email || "user"}!</PageHeader>
        </PageContainer>
    )
}