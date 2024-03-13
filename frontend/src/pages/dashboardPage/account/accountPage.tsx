import ProfileTab from "@/pages/dashboardPage/account/profileTab/profilePage.tsx";
import SecurityTab from "@/pages/dashboardPage/account/securityTab/securityPage.tsx";
import SettingsTab from "@/pages/dashboardPage/account/settingsTab/settingsPage.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import PageHeader from "@/components/ui/pageHeader.tsx";

export default function AccountPage() {
    const currentTab = useLocation().pathname.split("/").pop();
    const navigate = useNavigate();
    return (
        <PageContainer>
            <PageHeader>Account</PageHeader>
            <Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
                <TabsList className="mb-5">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="profile"><ProfileTab/></TabsContent>
                <TabsContent value="security"><SecurityTab/></TabsContent>
                <TabsContent value="settings"><SettingsTab/></TabsContent>
            </Tabs>
        </PageContainer>
    )
}